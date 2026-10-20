#!/usr/bin/env node
/**
 * CSS layer lint: a class rule written at the top level of index.css is
 * unlayered, and unlayered rules beat every Tailwind utility regardless of
 * specificity. That is how `text-right` and the tone colours on the pricing
 * table were silently ignored. Component classes belong in
 * `@layer components`; this fails the build on any top-level class rule.
 *
 *   node scripts/lint-css-layers.mjs
 */
import { readFileSync } from 'node:fs';

const FILE = new URL('../src/index.css', import.meta.url).pathname;
const css = readFileSync(FILE, 'utf8').replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));

// rules that are allowed to stay unlayered: progressive-enhancement motion
// hooks that no utility is ever expected to override
const ALLOWED = new Set(['.reveal', '.progress-hair', '.progress-hair::after']);

const findings = [];
let depth = 0;
let selector = '';
let line = 1;
for (const ch of css) {
    if (ch === '\n') line += 1;
    if (ch === '{') {
        const sel = selector.trim();
        if (depth === 0 && sel.startsWith('.') && !ALLOWED.has(sel)) findings.push({ line, sel });
        depth += 1;
        selector = '';
    } else if (ch === '}') {
        depth -= 1;
        selector = '';
    } else if (ch === ';') {
        selector = '';
    } else {
        selector += ch;
    }
}

if (findings.length) {
    for (const f of findings) console.error(`src/index.css:${f.line}  unlayered class rule ${f.sel}`);
    console.error(`\ncss layers: ${findings.length} finding(s). Move them into @layer components.`);
    process.exit(1);
}
console.log('css layers: clean');
