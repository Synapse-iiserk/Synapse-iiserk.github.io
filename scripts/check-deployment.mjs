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

// CI passes the freshly deployed page_url; locally this defaults to production
const BASE = (process.argv[2] || process.env.DEPLOY_URL || 'https://ifinn.org').replace(/\/$/, '');
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

// 1. the marker that stops Jekyll from republishing the source tree
const localMarker = statSync(new URL('../public/.nojekyll', import.meta.url), { throwIfNoEntry: false });
check(localMarker !== undefined, 'public/.nojekyll exists in the build input');
try {
    statSync(new URL('../dist/.nojekyll', import.meta.url));
    check(true, 'dist/.nojekyll present (run npm run build first)');
} catch {
    check(false, 'dist/.nojekyll present (run npm run build first)');
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
