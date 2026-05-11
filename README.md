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

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the
site and publishes it to GitHub Pages. The custom domain is set by
`public/CNAME`.
