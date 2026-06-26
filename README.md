# oliviahelens.com

Personal site, built with [Astro](https://astro.build) and deployed to GitHub
Pages with a custom domain (`oliviahelens.com`).

Single page: bio, a list of posts pulled from Substack at build time, and
contact links.

## Run locally

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in ./dist
npm run preview  # preview the production build
```

## Updating the bio

Edit `src/pages/index.astro`.

## Analytics

Visitor and link-click tracking uses [GoatCounter](https://www.goatcounter.com)
(cookie-less and privacy-friendly, so no consent banner is needed). The snippet
lives in `src/components/Analytics.astro` and is included from the layout.

To turn it on:

1. Create a free account at <https://www.goatcounter.com> and pick a site code
   (the subdomain). The code is currently set to `oliviahelens`, i.e.
   `https://oliviahelens.goatcounter.com`.
2. If you choose a different code, update it in `src/components/Analytics.astro`
   (or set the `PUBLIC_GOATCOUNTER` env var at build time).
3. View visits and link clicks in your GoatCounter dashboard. Link clicks show
   up under **Events** — outbound links are prefixed `out:` and internal links
   `link:`.

When the code is empty, no tracking script is emitted.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the
site and publishes it to GitHub Pages. The custom domain is set by
`public/CNAME`.
