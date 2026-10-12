# GenzLogic Portfolio — deployment guide

A responsive, static HTML/CSS/JavaScript portfolio for `https://genzlogic.github.io/`.

## Files

- `index.html` — main portfolio and metadata.
- `assets/css/style.css` — responsive visual system and components.
- `assets/css/app-page.css` — reusable app detail page styling.
- `assets/js/apps.js` — central app catalog. Update app metadata here.
- `assets/js/main.js` — search, category filters and mobile navigation.
- `assets/js/app-page.js` — renders each app detail page from the central catalog.
- `apps/<app-id>/index.html` — individual app landing pages.
- `assets/images/favicon.svg` — simple studio favicon.
- `404.html`, `robots.txt`, `sitemap.xml` — supporting site files.

## Deploy to the existing repository

1. Download and extract this package.
2. Review `assets/js/apps.js`. The included app statuses are conservative placeholders (`In Development`) because store URLs and release states were not supplied. Update each status only after verifying it.
3. Add real app icon files and screenshots if desired. The current app tiles use CSS/text-based artwork rather than invented screenshots.
4. Do **not** delete your existing `app-ads.txt`. Keep it in the repository root and preserve its verified contents.
5. Commit these files to the branch and directory configured for GitHub Pages. The `index.html` must be at the root of the publishing source. This package includes `.nojekyll` for plain static files.
6. On GitHub, open **Settings → Pages** and confirm the source is the correct branch and root folder (or configure your existing Actions deployment to publish the root output).
7. Wait for the Pages deployment to finish, then visit `https://genzlogic.github.io/`. A deployment can take several minutes.

Official GitHub Pages documentation: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Updating the catalog

Each object in `assets/js/apps.js` supports:

- `id`: stable ID, matching `data-app-id` in its page.
- `name`, `category`, `status`, `description`.
- `platforms`: visible platform labels.
- `icon`, `iconBackground`, `glow`: fallback tile artwork.
- `page`: detail page URL, relative to the site root.
- `storeUrls.ios`, `storeUrls.android`: verified store URLs only; leave blank until available.
- `features`: feature bullets on the detail page.
- `availabilityNote`: note shown when there are no store links.

Allowed statuses are `Available`, `Coming Soon`, and `In Development`.

### Add a new app

1. Add a catalog object to `assets/js/apps.js`.
2. Copy `apps/app-template.html` to `apps/<new-id>/index.html`.
3. Replace both occurrences of `APP-ID` in that copy with the new ID.
4. Set `page` to `apps/<new-id>/` in the catalog.
5. Add the new URL to `sitemap.xml`.
6. Add verified store links and real screenshots only when you have them.

## Contact email

No support email was supplied, so this build links to the public GitHub profile rather than inventing an email address. Add an email only after deciding which public support address you want to publish.

## Notes

- This is a static site; no server or database is needed.
- Search and category filters run in the browser.
- Store buttons are only rendered when verified URLs are populated in the catalog.
- App availability badges currently default to `In Development` and should be reviewed before publishing.
- Review all descriptions and feature claims before launch.
