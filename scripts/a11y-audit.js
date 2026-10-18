/**
 * Browser-side accessibility and semantics audit.
 *
 * Paste-able into any page (DevTools console, or injected by a browser tool)
 * and it returns a JSON report of concrete defects. No dependencies.
 *
 *   const report = (0, eval)(a11yScriptText);
 */
(() => {
    const findings = [];
    const add = (rule, detail, node) =>
        findings.push({ rule, detail, node: node ? describe(node) : undefined });

    const describe = (el) => {
        const id = el.id ? `#${el.id}` : '';
        const cls = el.className && typeof el.className === 'string'
            ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}`
            : '';
        return `${el.tagName.toLowerCase()}${id}${cls}`.slice(0, 90);
    };

    const text = (el) => (el.innerText || el.textContent || '').trim();
    const accessibleName = (el) =>
        el.getAttribute('aria-label') ||
        (el.getAttribute('aria-labelledby') &&
            document.getElementById(el.getAttribute('aria-labelledby'))?.textContent) ||
        text(el) ||
        el.getAttribute('title') ||
        (el.querySelector('img[alt]')?.alt ?? '');

    // --- colour contrast -------------------------------------------------
    const parse = (color) => {
        const m = color.match(/rgba?\\(([^)]+)\\)/);
        if (!m) return null;
        const [r, g, b, a = '1'] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
        return { r, g, b, a };
    };
    const lum = ({ r, g, b }) => {
        const f = (v) => {
            const s = v / 255;
            return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    // walk up compositing every translucent layer: a 13% badge background is
    // not the backdrop a contrast check should measure against
    const effectiveBg = (el) => {
        const layers = [];
        let node = el;
        while (node && node !== document.documentElement) {
            const bg = parse(getComputedStyle(node).backgroundColor);
            if (bg && bg.a > 0) {
                layers.push(bg);
                if (bg.a >= 0.999) break;
            }
            node = node.parentElement;
        }
        let out = { r: 10, g: 14, b: 12 };
        for (const layer of layers.reverse()) {
            out = {
                r: Math.round(layer.r * layer.a + out.r * (1 - layer.a)),
                g: Math.round(layer.g * layer.a + out.g * (1 - layer.a)),
                b: Math.round(layer.b * layer.a + out.b * (1 - layer.a)),
            };
        }
        return out;
    };

    // --- run the checks --------------------------------------------------
    document.querySelectorAll('img').forEach((img) => {
        if (!img.hasAttribute('alt')) add('img-missing-alt', 'image without alt text', img);
    });

    document.querySelectorAll('a, button').forEach((el) => {
        const href = el.getAttribute('href');
        if (el.tagName === 'A' && (!href || href === '#')) add('empty-link', 'link with no destination', el);
        if (!accessibleName(el)) add('unnamed-control', 'control without an accessible name', el);
        if (el.getAttribute('target') === '_blank' && !/noopener/.test(el.getAttribute('rel') || '')) {
            add('target-blank', 'new tab without rel=noopener', el);
        }
    });

    document.querySelectorAll('input, select, textarea').forEach((el) => {
        if (el.type === 'hidden' || el.closest('[aria-hidden="true"]')) return;
        const labelled =
            el.getAttribute('aria-label') ||
            (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) ||
            el.closest('label') ||
            el.getAttribute('title');
        if (!labelled) add('unlabelled-field', 'form control without a label', el);
    });

    document.querySelectorAll('svg[role="img"]').forEach((el) => {
        if (!el.getAttribute('aria-label') && !el.querySelector('title')) {
            add('svg-missing-name', 'role=img svg without a name', el);
        }
    });

    // heading order
    let lastLevel = 0;
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
        const level = Number(h.tagName[1]);
        if (lastLevel && level > lastLevel + 1) {
            add('heading-order', `heading jumps h${lastLevel} to h${level}`, h);
        }
        lastLevel = level;
    });

    // landmarks and document metadata
    if (!document.documentElement.lang) add('html-lang', 'html element has no lang');
    if (!document.title) add('no-title', 'document has no title');
    if (!document.querySelector('main')) add('no-main', 'no <main> landmark');
    const h1s = document.querySelectorAll('h1').length;
    if (h1s !== 1) add('h1-count', `expected exactly one h1, found ${h1s}`, document.body);

    // duplicate ids and dangling aria references
    const ids = [...document.querySelectorAll('[id]')].map((el) => el.id);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    [...new Set(dupes)].forEach((id) => add('duplicate-id', `id used more than once: ${id}`));

    document.querySelectorAll('[aria-controls], [aria-labelledby], [aria-describedby]').forEach((el) => {
        ['aria-controls', 'aria-labelledby', 'aria-describedby'].forEach((attr) => {
            const ref = el.getAttribute(attr);
            if (ref && !document.getElementById(ref)) {
                add('dangling-aria', `${attr} points at a missing id: ${ref}`, el);
            }
        });
    });

    // tab order sanity
    document.querySelectorAll('[tabindex]').forEach((el) => {
        const value = Number(el.getAttribute('tabindex'));
        if (value > 0 && !el.hasAttribute('aria-label') && !text(el)) {
            add('positive-tabindex', `tabindex=${value} on an unlabelled element`, el);
        }
    });

    // contrast on real text nodes
    const seen = new Set();
    document.querySelectorAll('p, span, a, li, h1, h2, h3, h4, td, th, dt, dd, button, label').forEach((el) => {
        if (!text(el) || el.children.length > 0 && !el.matches('button, a')) return;
        const style = getComputedStyle(el);
        if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) < 0.1) return;
        const fg = parse(style.color);
        if (!fg) return;
        const bg = effectiveBg(el);
        const l1 = lum(fg);
        const l2 = lum(bg);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        const size = parseFloat(style.fontSize);
        const bold = Number(style.fontWeight) >= 700;
        const large = size >= 24 || (size >= 18.66 && bold);
        const min = large ? 3 : 4.5;
        if (ratio < min) {
            const key = `${style.color}|${el.className}`;
            if (seen.has(key)) return;
            seen.add(key);
            add('contrast', `text ${style.color} on rgb(${bg.r},${bg.g},${bg.b}) is ${ratio.toFixed(2)}:1 (needs ${min}:1)`, el);
        }
    });

    return { url: location.pathname, findings };
})();