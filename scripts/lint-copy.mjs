#!/usr/bin/env node
/**
 * Copy lint: keeps the writing rules in the codebase instead of in someone's
 * head. Fails on the slop signatures this site deliberately does not use.
 *
 *   node scripts/lint-copy.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const SRC = new URL('../src/', import.meta.url).pathname;

const RULES = [
    { id: 'em-dash', re: /\u2014/, why: 'the em dash is the most recognisable AI-writing tell' },
    { id: 'en-dash', re: /\u2013(?=\s?\d)/, why: 'en dash between numbers; write "to" instead' },
    { id: 'emoji', re: /[\u{1F300}-\u{1FAFF}\u{2700}-\u{27BF}]/u, why: 'emoji used as UI icons' },
    { id: 'slop-word', re: /\b(unlock(?:s|ed|ing)?|seamlessly|supercharge|revolutioniz\w*|best-in-class|world-class|game-chang\w*|cutting-edge|next-generation|effortless(?:ly)?|leverage your)\b/i, why: 'SaaS filler vocabulary' },
    { id: 'gradient-text', re: /gradient-text/, why: 'gradient headline text' },
    { id: 'pill-radius', re: /\brounded-(full|3xl)\b/, why: 'pill radii reintroduce the badge look' },
    { id: 'shadow-utility', re: /\bshadow-(sm|md|lg|xl|2xl)\b/, why: 'shadows are not part of the elevation system' },
    {
        id: 'default-palette',
        re: /\b(?:bg|text|border|stroke|from|to|via)-(?:yellow|red|green|blue|gray|grey|slate|zinc|neutral|stone|orange|amber|emerald|lime|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3}\b/,
        why: 'Tailwind default palette bypasses the five-value colour system',
    },
    {
        id: 'raw-hex',
        re: /(?:color|background|backgroundColor|stroke|fill|borderColor)\s*[:=]\s*['"]#[0-9a-fA-F]{3,8}['"]/,
        why: 'raw hex in a style value; use a design token instead',
    },
];

const EXTENSIONS = new Set(['.ts', '.tsx', '.css']);

function walk(dir) {
    const out = [];
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) out.push(...walk(full));
        else if (EXTENSIONS.has(extname(full))) out.push(full);
    }
    return out;
}

const findings = [];
for (const file of walk(SRC)) {
    const text = readFileSync(file, 'utf8');
    let inBlockComment = false;
    text.split('\n').forEach((line, index) => {
        const trimmed = line.trim();
        // comments are developer-facing, not reader-facing copy
        if (inBlockComment) {
            if (trimmed.includes('*/') || trimmed.includes('-->')) inBlockComment = false;
            return;
        }
        if (trimmed.startsWith('/*') || trimmed.startsWith('<!--')) {
            if (!trimmed.includes('*/') && !trimmed.includes('-->')) inBlockComment = true;
            return;
        }
        if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;

        // CSS files hold no reader-facing copy at all
        if (file.endsWith('.css')) return;

        for (const rule of RULES) {
            if (rule.re.test(line)) {
                findings.push({ file: file.replace(SRC, 'src/'), line: index + 1, id: rule.id, why: rule.why, text: line.trim().slice(0, 90) });
            }
        }
    });
}

if (findings.length) {
    for (const f of findings) {
        console.error(`${f.file}:${f.line}  [${f.id}] ${f.why}\n    ${f.text}`);
    }
    console.error(`\ncopy lint failed: ${findings.length} finding(s)`);
    process.exit(1);
}

console.log('copy lint: clean');