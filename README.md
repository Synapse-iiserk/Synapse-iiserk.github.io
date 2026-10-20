# ifinn.org

The public site for iFINN, the quantitative research platform built at IISER
Kolkata. Static SPA, deployed to GitHub Pages on every push
to `main`.

Live: <https://ifinn.org>

## What this site is

A marketing and product site whose central claim is that every number on
screen can be traced back to an algorithm or a tool call. That claim sets the
bar for everything else here: the figures in the copy are checked against the
platform repository, and anything that cannot be evidenced is not printed.

Three live components fetch real public data in the browser (Binance klines
and the 24h ticker). They show their source, their last update time, and
their own failure states. There is no mock data pretending to be live.

## Commands

```bash
npm install            # install dependencies
npm run dev            # dev server
npm run build          # typecheck + production build to dist/
npm run preview        # serve the production build locally

npm run verify         # the full gate, run before every push:
                       #   eslint -> copy lint -> redirect test
                       #   -> build -> bundle budget
```

Individual gates:

| Command | What it protects |
|---|---|
| `npm run lint` | TypeScript and React correctness through ESLint |
| `npm run lint:copy` | The writing rules and the five-value colour system (see below) |
| `npm run test:redirect` | The GitHub Pages SPA redirect, which once hijacked real query strings |
| `npm run audit:budget` | Shipped payload sizes against hard limits |

`scripts/a11y-audit.js` is a dependency-free browser script: paste it into any
page and it returns a JSON report of concrete accessibility defects (missing
alt text, unnamed controls, dangling `aria-*` targets, heading order, and text
contrast composited through translucent ancestors).

## Design system

Defined once in `src/index.css` and treated as constraints, not preferences.
The rules exist so a later edit cannot quietly drift back to a default look.

- **Ground and one accent.** Flat `#0a0e0c`, one step up for surfaces, one
  accent green, one warm value for disclosures, one red for negatives. No
  gradient washes, no glow, no frosted glass.
- **Hairlines are the only structural device.** Borders, never shadows. The
  radius and shadow scales are deleted from the theme, so `rounded-xl` and
  `shadow-lg` generate nothing at all.
- **Three fonts with distinct jobs.** Space Grotesk for display, Archivo for
  body, IBM Plex Mono for anything numeric. Type scale on a 1.333 ratio.
- **One easing curve.** `cubic-bezier(0.22, 1, 0.36, 1)`. Entrances run on
  headings only, once, and are skipped entirely under
  `prefers-reduced-motion`.
- **Colour comes from tokens.** `npm run lint:copy` fails the build on raw
  hex values in style attributes and on Tailwind's default palette, which is
  how two analytics widgets drifted off-system before.

## Architecture notes

**Charts** (`src/components/charts/`) are hand-built SVG. d3 supplies only
scales, shapes and array maths; anime.js drives the entrances. The equity
curve computes a MACD crossover strategy in the browser from public klines,
applied from the following bar so there is no look-ahead, charged 10 bps per
position change.

**One polling loop** (`src/lib/useVisibleInterval.ts`) backs every chart and
widget on the site. It pauses while the tab is hidden, refreshes on return,
backs off when the upstream keeps failing, and always tears down its timer.

**Feeds degrade honestly.** The last good series is cached in
`sessionStorage`. When a feed dies the chart keeps drawing those bars, clearly
labelled as cached with the time they were fetched. When nothing was ever
cached, the frame says so and offers a retry instead of sitting blank.

**Routing** is React Router with `public/404.html` handing unknown paths back
to `index.html` as `?p=<path>`. `scripts/test-spa-redirect.mjs` runs the real
script body over eight cases, because the naive version of that redirect
consumed any query string and broke every `?utm_source=` link.

## Deployment

`.github/workflows/deploy.yml` runs `npm run verify` and publishes `dist/` to
GitHub Pages on push to `main`. The gate is the same one you can run locally,
so a red build cannot reach production.

## Before you change copy

`npm run lint:copy` is the arbiter of the writing rules: no em dashes, no
emoji as UI icons, no SaaS filler vocabulary, no default palette classes, no
raw hex values. These are enforced because they were the specific failure
mode of the previous design, and they are cheaper to enforce than to
rediscover.

## License

Proprietary. All rights reserved.
