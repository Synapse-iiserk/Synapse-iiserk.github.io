#!/usr/bin/env node
/**
 * Deployment integrity check.
 *
 * The site was once published from the repository root instead of the build
 * output: Pages ran Jekyll over the source tree and served an index.html that
 * loaded /src/main.tsx, so every visitor got a blank page while the build and
 * every CI step reported success. This asserts the two things that would have
 * caught it, against a running server:
 *
 *   1. the deployed HTML references built assets under /assets/
 *   2. those assets actually resolve
 *
 *   node scripts/check-deployment.mjs [baseUrl]
 *
 * Defaults to https://ifinn.org. Exits non-zero when the site is serving
 * something other than a built bundle.
 */
import { statSync } from 'node:fs';

// Flags and the base URL can appear in any order, so filter argv rather than
// indexing it: `--local https://site` must not treat the flag as the URL.
const ARGS = process.argv.slice(2);
const LOCAL_ONLY = ARGS.includes('--local');
const BUILD_ONLY = ARGS.includes('--build-only');
const URL_ARG = ARGS.find((a) => !a.startsWith('--'));

// CI passes the freshly deployed page_url; locally this defaults to production
const BASE = (URL_ARG || process.env.DEPLOY_URL || 'https://ifinn.org').replace(/\/$/, '');
const TIMEOUT = 20_000;

const get = async (path) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);
    try {
        // no-store: right after a deploy the CDN may still hold the previous
        // document, and a cached copy would turn a real check into a false pass
        return await fetch(BASE + path, { signal: controller.signal, cache: 'no-store' });
    } finally {
        clearTimeout(timer);
    }
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Pages propagates a deployment over several seconds and some edges lag.
 * Retry the assertion rather than failing the build on a stale copy.
 */
const withRetry = async (fn, attempts = 5, delayMs = 10_000) => {
    let last;
    for (let i = 0; i < attempts; i++) {
        try {
            last = await fn();
            if (last === true) return true;
        } catch (err) {
            last = err;
        }
        if (i < attempts - 1) await wait(delayMs);
    }
    return last;
};

let failed = 0;
const check = (ok, label, detail) => {
    if (!ok) failed++;
    console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${label}${detail ? `  ${detail}` : ''}`);
};

console.log(`deployment check: ${BASE}`);

// 1. the marker that stops Jekyll from republishing the source tree.
//    It has to exist in two places, and each is checked where it is built:
//    public/.nojekyll is the input Vite copies, dist/.nojekyll is the output
//    that actually gets published. The deploy job checks out the repository
//    but never builds, so it has no dist/ to inspect; those assertions run
//    with --local in the build job instead, where both files exist.
if (LOCAL_ONLY) {
    check(
        statSync(new URL('../public/.nojekyll', import.meta.url), { throwIfNoEntry: false }) !== undefined,
        'public/.nojekyll exists in the build input',
    );
    check(
        statSync(new URL('../dist/.nojekyll', import.meta.url), { throwIfNoEntry: false }) !== undefined,
        'dist/.nojekyll present in the build output',
    );
} else {
    console.log('  skip  local .nojekyll assertions (pass --local in the build job)');
}

// --build-only checks what was produced and stops: used by the build job,
// before anything is published.
if (BUILD_ONLY) {
    if (failed) {
        console.error(`\n${failed} build check(s) failed`);
        process.exit(1);
    }
    console.log('build output check: all assertions pass');
    process.exit(0);
}

// 2. the deployed document must load built assets, never source files.
//    Retried, because a just-deployed site can still be serving the previous
//    build from a lagging edge for a few seconds.
let html = '';
let assets = [];
const served = await withRetry(async () => {
    const res = await get('/');
    if (!res.ok) return false;
    const body = await res.text();
    const found = [...body.matchAll(/\/assets\/[A-Za-z0-9_.-]+\.(?:js|css)/g)].map((m) => m[0]);
    if (found.length === 0 || /src\/main\.tsx/.test(body)) return false;
    html = body;
    assets = found;
    return true;
});

check(served, 'deployed HTML serves a built bundle');
check(assets.length > 0, 'deployed HTML references /assets/', `found ${assets.length}`);

if (/src\/main\.tsx/.test(html)) {
    check(false, 'deployed HTML does not load source files', 'found /src/main.tsx');
} else {
    check(true, 'deployed HTML does not load source files');
}

// 3. every referenced asset must resolve
for (const asset of assets) {
    const r = await get(asset);
    check(r.ok, `asset ${asset}`, `status ${r.status}`);
}

// 4. the SPA redirect must survive the deploy intact
const withParam = await get('/?p=%2Fpricing');
const paramHtml = await withParam.text();
check(
    paramHtml.includes("charAt(1) === 'p'") || paramHtml.includes('charAt(1)==="p"'),
    'deployed HTML carries the guarded SPA restore',
);

if (failed) {
    console.error(`\n${failed} deployment check(s) failed`);
    process.exit(1);
}
console.log('deployment check: all assertions pass');
