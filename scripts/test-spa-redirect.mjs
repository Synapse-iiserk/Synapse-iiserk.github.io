#!/usr/bin/env node
/**
 * Regression test for the GitHub Pages SPA redirect.
 *
 * public/404.html sends visitors to "/?p=<encoded path>" and index.html
 * restores it. The restore must consume ONLY that exact parameter: a real
 * query string such as ?utm_source=... has to survive untouched, otherwise
 * a shared tracking link silently navigates the visitor to a garbage route.
 */
import { readFileSync } from 'node:fs';

const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = indexHtml.match(/<script>([\s\S]*?)<\/script>/g)?.find((s) => s.includes('replaceState'));

if (!script) {
    console.error('FAIL: no SPA restore script found in index.html');
    process.exit(1);
}

// run the real script body against a fake location
const body = script.replace(/<\/?script>/g, '');
const run = (search) => {
    const fake = { pathname: '/', search, replaceState(_a, _b, url) { this.result = url; } };
    new Function('window', body)({ location: fake, history: fake });
    return fake.result ?? null;
};

const cases = [
    ['?p=%2Fpricing', '/pricing', 'encodes the stashed path'],
    ['?p=%2Fteam%2Fshuvam-banerji-seal', '/team/shuvam-banerji-seal', 'handles a nested path'],
    ['?p=%2F', '/', 'handles the root path'],
    ['?utm_source=twitter', null, 'leaves a tracking parameter alone'],
    ['?ref=blog', null, 'leaves a referrer parameter alone'],
    ['?px=1', null, 'does not treat a similar prefix as ours'],
    ['?p=/pricing&extra=1', '/pricing&extra=1', 'keeps params the stashed path carried'],
    ['', null, 'does nothing without a query string'],
];

let failed = 0;
console.log('spa redirect');
for (const [search, expected, why] of cases) {
    const got = run(search);
    const ok = got === expected;
    failed += ok ? 0 : 1;
    console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${(search || '(no query)').padEnd(26)} -> ${String(got).padEnd(26)} ${why}`);
}

if (failed) {
    console.error(`\n${failed} case(s) failed`);
    process.exit(1);
}
console.log('spa redirect: all cases pass');
