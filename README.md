# genzlogic.github.io

The GenzLogic studio portfolio at **https://genzlogic.github.io/**. Plain HTML, CSS and JavaScript for GitHub Pages: no framework, no build step needed to deploy.

## What's in here

```
index.html                 Home: hero, spotlight, app grid with search + filters, roadmap, about, contact
apps/<id>/index.html       One landing page per app (generated)
apps/birthday-reminder/    Redirect from the old URL to apps/bdaybell/
apps/index.html            Redirect to the home page grid
404.html                   Not-found page (generated)
assets/js/catalog.js       ★ Central app catalog: the only file you edit for app changes
assets/js/main.js          Search, category and status filters, footer year
assets/css/site.css        All styles
assets/img/apps/           App icons (512/192 WebP, 192 PNG) and 1200×630 social images
assets/img/                Studio favicon, touch icon and social image
tools/build.mjs            Generates index.html, apps/*, sitemap.xml from the catalog
tools/templates/           Home, app landing page, 404 and shared header (_header.html) templates
sitemap.xml, robots.txt, site.webmanifest, .nojekyll, app-ads.txt
```

The per-app product sites (`/myPgRent/`, `/Scanora/`, `/BDayBell/`, `/BillAlarm/`, `/genzcalc/`) live in their **own** repositories and are not touched by this repo. This site's app pages live under `/apps/` so the paths never collide. Each one links out to the official site.

## Deploy

1. Copy every file and folder from this package into the root of your local `genzlogic.github.io` clone, replacing the old files. Keep `app-ads.txt` (it's included unchanged).
2. Delete the files from the old version that are no longer used:
   ```bash
   git rm -r --ignore-unmatch assets/css/style.css assets/css/app-page.css \
     assets/js/apps.js assets/js/app-page.js assets/images apps/app-template.html \
     README-DEPLOYMENT.md
   ```
3. Commit and push:
   ```bash
   git add -A
   git commit -m "Rebuild GenzLogic portfolio"
   git push origin main
   ```
4. On GitHub, open **Settings → Pages** and check that **Source** is *Deploy from a branch* with branch `main` and folder `/ (root)`.
5. Wait for the *pages build and deployment* run under the **Actions** tab to finish (usually 1–2 minutes), then open https://genzlogic.github.io/.
6. Optional: in Google Search Console, add the property and submit `https://genzlogic.github.io/sitemap.xml`.

## Add or update an app

1. Edit `assets/js/catalog.js`. Each entry has:
   - `id`: URL slug (`apps/<id>/`), lowercase letters, numbers and hyphens
   - `name`, `aliases` (extra search words), `tagline`, `summary`, `description`
   - `category`: one of `Business`, `Finance`, `Lifestyle`, `Utilities`, `Games`
   - `status`: one of `Available`, `Coming Soon`, `In Development`
   - `platforms`: `["iOS"]`, `["Android"]`, both, or `[]` if not announced
   - `features`: list of `{ title, text }` (leave empty to hide the section)
   - `officialSite`, `privacyUrl`, `supportEmail`, `store.appStore`, `store.googlePlay`. Leave a field `""` if it's unknown and the site hides it.
2. Add icons to `assets/img/apps/`: `<id>-512.webp`, `<id>-192.webp`, `<id>-192.png` (square, corners rounded to about 22.5%) and `<id>-og.jpg` (1200×630). The square source should be at least 1024×1024 px.
3. Run the generator (needs Node 18 or newer):
   ```bash
   node tools/build.mjs
   ```
   It checks the catalog (status, category, https URLs, missing icons) and rewrites `index.html`, every `apps/<id>/index.html`, `404.html` and `sitemap.xml`. The home page spotlight shows every app with status `Available`, and the roadmap groups all apps by status, so both update automatically. It removes pages for apps you deleted from the catalog.
4. Commit and push the changed files.

For example, when GenzCalc launches, set `status: "Available"`, paste the App Store URL into `store.appStore`, run the build and push.

To change the design or wording of every app page at once, edit `tools/templates/app.html` (or `tools/templates/index.html` for the home page) and rebuild. Don't edit the generated HTML directly; the next build overwrites it.

## Notes

- Pages are fully rendered HTML, so they're readable without JavaScript and indexable by search engines. JavaScript only adds filtering. Filtered views can be shared: `/?category=Games&status=In%20Development`.
- SEO: unique title, description and canonical URL per page, plus Open Graph/Twitter cards with a 1200×630 image, JSON-LD (Organization, WebSite, ItemList, MobileApplication/VideoGame, BreadcrumbList), and a sitemap.
- Accessibility: skip link, landmarks, one `h1` per page, visible keyboard focus, `aria-pressed` filter buttons, live result count, status shown as text (not only colour), reduced-motion and forced-colours support.
- Fonts (Bricolage Grotesque, Instrument Sans) load from Google Fonts with system fallbacks.
- Store buttons are styled text links, not Apple/Google badge artwork. To use the official badges, download them from Apple's and Google's marketing sites and swap them into `storeButtons()` in `tools/build.mjs`.
