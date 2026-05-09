# oliviahelens.com

Personal site, built with [Astro](https://astro.build) and deployed to GitHub
Pages with a custom domain (`oliviahelens.com`).

## Run locally

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in ./dist
npm run preview  # preview the production build
```

## Adding a post

Drop a Markdown file into `src/content/writing/`:

```md
---
title: "On the long now"
date: 2026-05-09
description: "A short note."
draft: false
---

Body in Markdown…
```

The `writing` index page reads the collection and lists posts sorted by date.
Set `draft: true` to hide a post from production.

## Adding a project

Same idea, in `src/content/projects/`:

```md
---
title: "pySCEv"
date: 2026-04-01
description: "Stochastic chemical evolution in Python."
url: "https://github.com/oliviahelens/pyscev"
---
```

## Content schema

Defined in `src/content/config.ts`. Both collections share `title`, `date`,
`description`, and `draft`. Projects also accept an optional `url`.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the site
and publishes it to GitHub Pages. The custom domain is set by `public/CNAME`.

To enable: in the repo settings, under **Pages**, set the source to **GitHub
Actions**. Add `oliviahelens.com` as the custom domain (the workflow will keep
it via the `CNAME` file).
