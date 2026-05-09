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

## Writing

Posts are pulled from `https://oliviahelens.substack.com/feed` at build time
(`src/lib/substack.ts`). To refresh after a new Substack post, push any commit
to `main` (or hit "Run workflow" on the deploy action) — that re-runs the
build and re-fetches the feed.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the
site and publishes it to GitHub Pages. The custom domain is set by
`public/CNAME`.

To enable: in repo **Settings → Pages**, set source to **GitHub Actions**,
and add `oliviahelens.com` as the custom domain.
