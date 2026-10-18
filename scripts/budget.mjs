#!/usr/bin/env node
/**
 * Performance budget. Fails the build when the shipped payloads grow past the
 * numbers we agreed on, so a regression is caught by CI rather than by feel.
 *
 *   npm run build && node scripts/budget.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = new URL('../dist/', import.meta.url).pathname;
const ASSETS = join(DIST, 'assets');

const BUDGET = {
    'initial JS (gzip)': 200 * 1024,
    'initial CSS (gzip)': 24 * 1024,
    'lazy chunks (gzip, all)': 200 * 1024,
    'og image': 300 * 1024,
};

const kb = (bytes) => (bytes / 1024).toFixed(1) + ' kB';

const indexHtml = readFileSync(join(DIST, 'index.html'), 'utf8');
const initialScripts = [...indexHtml.matchAll(/<script[^>]+src="\/assets\/([^"]+)"/g)].map((m) => m[1]);
const preloads = [...indexHtml.matchAll(/<link[^>]+href="\/assets\/([^"]+)"[^>]+rel="modulepreload"/g)].map((m) => m[1]);
const initialEntries = [...new Set([...initialScripts, ...preloads])];
const lazyEntries = readdirSync(ASSETS).filter(
    (f) => /\.(js|css)$/.test(f) && !initialEntries.includes(f),
);

const sizeOf = (file) => gzipSync(readFileSync(join(ASSETS, file))).length;

const initialJs = initialEntries.filter((f) => f.endsWith('.js')).reduce((sum, f) => sum + sizeOf(f), 0);
const initialCss = indexHtml.includes('stylesheet')
    ? indexEntriesCss()
    : 0;

function indexEntriesCss() {
    const css = [...indexHtml.matchAll(/<link[^>]+href="\/assets\/([^"]+\.css)"/g)].map((m) => m[1]);
    return css.reduce((sum, f) => sum + sizeOf(f), 0);
}

const lazy = lazyEntries.reduce((sum, f) => sum + sizeOf(f), 0);
let og = 0;
try {
    og = statSync(join(DIST, 'og-image.png')).size;
} catch {
    console.warn('note: dist/og-image.png missing');
}

const results = [
    ['initial JS (gzip)', initialJs],
    ['initial CSS (gzip)', initialCss],
    ['lazy chunks (gzip, all)', lazy],
    ['og image', og],
];

let failed = false;
console.log('bundle budget');
for (const [label, value] of results) {
    const limit = BUDGET[label];
    const ok = value <= limit;
    failed ||= !ok;
    console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${label.padEnd(28)} ${kb(value).padStart(10)}  / ${kb(limit)}`);
}

console.log(`  initial requests: ${initialEntries.length} assets, ${lazyEntries.length} lazy chunks`);
if (failed) {
    console.error('\nbudget failed');
    process.exit(1);
}
console.log('budget: within limits');