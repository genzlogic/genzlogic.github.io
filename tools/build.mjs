#!/usr/bin/env node
/*
 * GenzLogic static site builder (no dependencies, Node 18+).
 *
 *   node tools/build.mjs
 *
 * Reads assets/js/catalog.js and writes:
 *   index.html                       home page with pre-rendered app grid
 *   apps/<id>/index.html             one landing page per app
 *   apps/index.html                  redirect to the home page grid
 *   apps/birthday-reminder/index.html  redirect (old URL -> BdayBell)
 *   sitemap.xml
 *
 * Pages are fully rendered HTML, so they work without JavaScript and are
 * readable by search engines. assets/js/main.js only adds search/filtering.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const catalog = require(join(ROOT, "assets/js/catalog.js"));
const { studio, apps, categories, statuses } = catalog;
const SITE = studio.url.replace(/\/$/, "");
const TODAY = new Date().toISOString().slice(0, 10);

/* ---------- validation ---------- */
const ids = new Set();
for (const a of apps) {
  if (!/^[a-z0-9-]+$/.test(a.id)) throw new Error(`Bad id "${a.id}" (use a-z, 0-9, -)`);
  if (ids.has(a.id)) throw new Error(`Duplicate id "${a.id}"`);
  ids.add(a.id);
  if (!statuses.includes(a.status)) throw new Error(`${a.id}: status must be one of ${statuses.join(", ")}`);
  if (!categories.includes(a.category)) throw new Error(`${a.id}: category must be one of ${categories.join(", ")}`);
  for (const u of [a.officialSite, a.privacyUrl, a.store?.appStore, a.store?.googlePlay]) {
    if (u && !/^https:\/\//.test(u)) throw new Error(`${a.id}: URLs must start with https:// (${u})`);
  }
  for (const f of [`${a.id}-512.webp`, `${a.id}-192.webp`, `${a.id}-192.png`]) {
    if (!existsSync(join(ROOT, "assets/img/apps", f))) console.warn(`! ${a.id}: missing assets/img/apps/${f}`);
  }
}

/* ---------- helpers ---------- */
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const fill = (tpl, data) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => {
  if (!(k in data)) throw new Error(`Template key {{${k}}} has no value`);
  return data[k];
});
const read = (p) => readFileSync(join(ROOT, p), "utf8");
const write = (p, s) => { mkdirSync(dirname(join(ROOT, p)), { recursive: true }); writeFileSync(join(ROOT, p), s); console.log("  wrote", p); };
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const statusOrder = (s) => statuses.indexOf(s);
const sorted = [...apps].sort((a, b) => statusOrder(a.status) - statusOrder(b.status));

const PLATFORM_LABEL = { iOS: "iPhone", Android: "Android" };
const platformText = (a) => a.platforms.length ? a.platforms.map((p) => PLATFORM_LABEL[p] || p).join(" and ") : "Platforms to be announced";
const SCHEMA_CATEGORY = { Business: "BusinessApplication", Finance: "FinanceApplication", Lifestyle: "LifestyleApplication", Utilities: "UtilitiesApplication", Games: "GameApplication" };
const OS = { iOS: "iOS", Android: "Android" };

const badge = (status) => `<span class="badge badge--${slug(status)}"><span class="badge__dot" aria-hidden="true"></span>${esc(status)}</span>`;

const icon = (a, size, prefix, extra = "", loading = "lazy") =>
  `<picture><source srcset="${prefix}assets/img/apps/${a.id}-${size > 96 ? 512 : 192}.webp" type="image/webp"><img class="app-icon ${extra}" src="${prefix}assets/img/apps/${a.id}-192.png" width="${size}" height="${size}" alt="" loading="${loading}" decoding="async"></picture>`;

const storeButtons = (a, cls = "") => {
  const out = [];
  if (a.store?.appStore) out.push(`<a class="btn btn--store ${cls}" href="${esc(a.store.appStore)}" target="_blank" rel="noopener" aria-label="Download ${esc(a.name)} on the App Store (opens in a new tab)"><svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.5-1-2.5-3.9zM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z"/></svg><span><small>Download on the</small>App Store</span></a>`);
  if (a.store?.googlePlay) out.push(`<a class="btn btn--store ${cls}" href="${esc(a.store.googlePlay)}" target="_blank" rel="noopener" aria-label="Get ${esc(a.name)} on Google Play (opens in a new tab)"><svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M4 2.6c-.3.3-.4.7-.4 1.2v16.4c0 .5.1.9.4 1.2l9.3-9.4L4 2.6zm10.4 10.5 2.6 2.6-11.4 6.5 8.8-9.1zm0-2.2L5.6 1.8 17 8.3l-2.6 2.6zm3.9 4 2.8-1.6c.8-.5.8-1.9 0-2.4l-2.8-1.6-2.8 2.8 2.8 2.8z"/></svg><span><small>Get it on</small>Google Play</span></a>`);
  return out.join("");
};


/* ---------- shared header ---------- */
const headerTpl = read("tools/templates/_header.html");
const header = (root) => fill(headerTpl, { ROOT: root, BRAND_HREF: root || "./" });

/* ---------- spotlight: released apps as tabs ---------- */
const released = sorted.filter((a) => a.status === "Available");
const check = `<svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const spotlight = released.length ? `<div class="spotlight" data-spotlight>
          <ul class="spotlight__tabs">${released.map((a, i) => `
            <li><a class="spotlight__tab" id="spot-tab-${a.id}" href="#spot-${a.id}"${i === 0 ? ' aria-current="true"' : ""}>${icon(a, 48, "", "spotlight__tab-icon")}<span><strong>${esc(a.name)}</strong><span>${esc(a.category)}</span></span></a></li>`).join("")}
          </ul>
          <div class="spotlight__panels">${released.map((a) => `
            <article class="spotlight__panel" id="spot-${a.id}" aria-labelledby="spot-title-${a.id}">
              <div class="spotlight__top">
                ${icon(a, 112, "", "spotlight__icon")}
                <div>
                  ${badge(a.status)}
                  <h3 id="spot-title-${a.id}">${esc(a.name)}</h3>
                  <p class="spotlight__tagline">${esc(a.tagline)}</p>
                </div>
              </div>
              <p class="spotlight__desc">${esc(a.description)}</p>
              ${a.features?.length ? `<ul class="spotlight__features">${a.features.slice(0, 3).map((f) => `<li>${check}<span><strong>${esc(f.title)}.</strong> ${esc(f.text)}</span></li>`).join("")}</ul>` : ""}
              <div class="actions">${storeButtons(a)}<a class="btn btn--ghost" href="apps/${a.id}/">${esc(a.name)} details</a></div>
              <p class="spotlight__platforms">${esc(platformText(a))}</p>
            </article>`).join("")}
          </div>
        </div>` : "";

/* ---------- roadmap: apps grouped by status, in order of progress ---------- */
const STAGE_TEXT = {
  "In Development": "Being designed and built.",
  "Coming Soon": "Nearly ready. Store links arrive at launch.",
  "Available": "Live and ready to download."
};
const roadmap = [...statuses].reverse().map((s) => {
  const list = sorted.filter((a) => a.status === s);
  return `
          <li class="roadmap__stage roadmap__stage--${slug(s)}">
            <div class="roadmap__head">
              <h3>${badge(s)}</h3>
              <span class="roadmap__count">${list.length} ${list.length === 1 ? "app" : "apps"}</span>
            </div>
            <p>${esc(STAGE_TEXT[s] || "")}</p>
            <ul class="roadmap__apps">${list.map((a) => `
              <li><a href="apps/${a.id}/">${icon(a, 40, "", "roadmap__icon")}<span><strong>${esc(a.name)}</strong><span>${esc(a.platforms.length ? platformText(a) : a.category)}</span></span></a></li>`).join("") || `<li class="roadmap__empty">Nothing here right now.</li>`}
            </ul>
          </li>`;
}).join("");

/* ---------- home page ---------- */
const appCard = (a) => {
  const search = [a.name, ...(a.aliases || []), a.category, a.tagline, a.summary, a.status, ...a.platforms].join(" ").toLowerCase();
  return `
          <li class="app-card" data-category="${esc(a.category)}" data-status="${esc(a.status)}" data-search="${esc(search)}">
            <div class="app-card__head">
              ${icon(a, 72, "", "app-card__icon")}
              ${badge(a.status)}
            </div>
            <h3 class="app-card__name"><a href="apps/${a.id}/" class="stretched">${esc(a.name)}</a></h3>
            <p class="app-card__tagline">${esc(a.tagline)}</p>
            <p class="app-card__summary">${esc(a.summary)}</p>
            <p class="app-card__meta"><span>${esc(a.category)}</span><span>${esc(platformText(a))}</span></p>
          </li>`;
};

const springboard = sorted.map((a, i) => `
            <li style="--i:${i}"><a href="apps/${a.id}/" class="spring__app">${icon(a, 76, "", "spring__icon", "eager")}<span class="spring__name">${esc(a.name)}</span><span class="spring__dot spring__dot--${slug(a.status)}" title="${esc(a.status)}"><span class="visually-hidden">${esc(a.status)}</span></span></a></li>`).join("");

const count = (s) => apps.filter((a) => a.status === s).length;
const statusSummary = statuses.filter(count).map((s) => `<li>${badge(s)}<span class="tally">${count(s)}</span></li>`).join("");

const chip = (group, value, label, pressed = false) => `<button type="button" class="chip" data-${group}="${esc(value)}" aria-pressed="${pressed}">${esc(label)}</button>`;
const usedCats = categories.filter((c) => apps.some((a) => a.category === c));
const categoryChips = [chip("category", "all", "All", true), ...usedCats.map((c) => chip("category", c, c))].join("");
const statusChips = [chip("status", "all", "Any status", true), ...statuses.filter(count).map((s) => chip("status", s, s))].join("");

const orgLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${SITE}/#org`, name: studio.name, url: studio.url, logo: `${SITE}/assets/img/genzlogic-512.png`, email: studio.supportEmail, sameAs: [studio.github] },
    { "@type": "WebSite", "@id": `${SITE}/#website`, url: studio.url, name: studio.name, publisher: { "@id": `${SITE}/#org` } },
    { "@type": "ItemList", name: "GenzLogic apps", itemListElement: sorted.map((a, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/apps/${a.id}/`, name: a.name })) }
  ]
};
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;

write("index.html", fill(read("tools/templates/index.html"), {
  APP_COUNT: String(apps.length),
  APP_CARDS: sorted.map(appCard).join(""),
  SPRINGBOARD: springboard,
  STATUS_SUMMARY: statusSummary,
  CATEGORY_CHIPS: categoryChips,
  STATUS_CHIPS: statusChips,
  SUPPORT_EMAIL: esc(studio.supportEmail),
  GITHUB_URL: esc(studio.github),
  GITHUB_HANDLE: esc(studio.github.replace(/^https:\/\/github.com\//, "")),
  HEADER: header(""),
  SPOTLIGHT: spotlight,
  ROADMAP: roadmap,
  SUPPORT_NOTE: (() => {
    const own = apps.filter((a) => a.supportEmail && a.supportEmail !== studio.supportEmail);
    if (!own.length) return "";
    return `<p class="fineprint">${own.map((a) => `For ${esc(a.name)}, email <a href="mailto:${esc(a.supportEmail)}">${esc(a.supportEmail)}</a>.`).join(" ")}</p>`;
  })(),
  JSONLD: ld(orgLd)
}));

/* ---------- app pages ---------- */
const appTpl = read("tools/templates/app.html");
for (const a of apps) {
  const pageUrl = `${SITE}/apps/${a.id}/`;
  const hasStore = a.store?.appStore || a.store?.googlePlay;
  let actions = storeButtons(a);
  if (a.officialSite) actions += `<a class="btn btn--ghost" href="${esc(a.officialSite)}" target="_blank" rel="noopener">Visit the ${esc(a.name)} website<span class="visually-hidden"> (opens in a new tab)</span></a>`;
  let notice = "";
  if (!hasStore) {
    notice = a.status === "Coming Soon"
      ? `<p class="notice">${esc(a.name)} is coming soon${a.platforms.length ? ` to ${esc(platformText(a))}` : ""}. The store link will be added here at launch.</p>`
      : a.status === "In Development"
        ? `<p class="notice">${esc(a.name)} is in development and not in any app store yet. Follow <a href="${esc(studio.github)}">GenzLogic on GitHub</a> for updates.</p>`
        : "";
  }

  const features = a.features?.length ? `
    <section class="section features" aria-labelledby="features-title">
      <div class="wrap">
        <h2 id="features-title" class="section__title">What ${esc(a.name)} does</h2>
        <ul class="feature-list">${a.features.map((f) => `
          <li><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></li>`).join("")}
        </ul>
      </div>
    </section>` : "";

  const facts = [
    ["Category", esc(a.category)],
    ["Platforms", esc(a.platforms.length ? platformText(a) : "To be announced")]
  ];
  const help = [];
  if (a.officialSite) help.push(`<li><a href="${esc(a.officialSite)}">Official website</a></li>`);
  if (a.privacyUrl) help.push(`<li><a href="${esc(a.privacyUrl)}">Privacy policy</a></li>`);
  const email = a.supportEmail || studio.supportEmail;
  help.push(`<li><a href="mailto:${esc(email)}?subject=${encodeURIComponent(a.name + " support")}">${esc(email)}</a></li>`);
  help.push(`<li><a href="${esc(studio.github)}">GenzLogic on GitHub</a></li>`);

  const related = apps.filter((b) => b.id !== a.id)
    .sort((x, y) => (y.category === a.category) - (x.category === a.category) || statusOrder(x.status) - statusOrder(y.status))
    .slice(0, 3)
    .map((b) => `
          <li class="mini-card">${icon(b, 56, "../../", "mini-card__icon")}<div><h3><a class="stretched" href="../${b.id}/">${esc(b.name)}</a></h3><p>${esc(b.tagline)}</p>${badge(b.status)}</div></li>`).join("");

  const appLd = {
    "@context": "https://schema.org",
    "@graph": [
      Object.assign({
        "@type": a.category === "Games" ? "VideoGame" : "MobileApplication",
        name: a.name,
        description: a.summary,
        url: pageUrl,
        image: `${SITE}/assets/img/apps/${a.id}-512.webp`,
        applicationCategory: SCHEMA_CATEGORY[a.category],
        publisher: { "@type": "Organization", name: studio.name, url: studio.url }
      },
      a.platforms.length ? { operatingSystem: a.platforms.map((p) => OS[p] || p).join(", ") } : {},
      a.store?.appStore || a.store?.googlePlay ? { downloadUrl: [a.store.appStore, a.store.googlePlay].filter(Boolean) } : {},
      a.officialSite ? { sameAs: [a.officialSite] } : {}),
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "GenzLogic", item: studio.url },
        { "@type": "ListItem", position: 2, name: "Apps", item: `${SITE}/#apps` },
        { "@type": "ListItem", position: 3, name: a.name, item: pageUrl }
      ] }
    ]
  };

  const desc = `${a.name}: ${a.summary}`.slice(0, 160);
  write(`apps/${a.id}/index.html`, fill(appTpl, {
    TITLE: esc(`${a.name}, ${a.tagline.replace(/\.$/, "")} | GenzLogic`),
    DESCRIPTION: esc(desc),
    CANONICAL: pageUrl,
    OG_IMAGE: `${SITE}/assets/img/apps/${a.id}-og.jpg`,
    NAME: esc(a.name),
    ID: a.id,
    ICON: icon(a, 168, "../../", "hero-icon", "eager"),
    BADGE: badge(a.status),
    TAGLINE: esc(a.tagline),
    DESCRIPTION_LONG: esc(a.description),
    ACTIONS: actions ? `<div class="actions">${actions}</div>` : "",
    NOTICE: notice,
    FACTS: facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join(""),
    FEATURES: features,
    HELP: help.join(""),
    RELATED: related,
    HEADER: header("../../"),
    JSONLD: ld(appLd),
    SUPPORT_EMAIL: esc(studio.supportEmail),
    GITHUB_URL: esc(studio.github)
  }));
}

/* ---------- redirects ---------- */
const redirect = (to, title) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title><meta name="robots" content="noindex"><link rel="canonical" href="${to}"><meta http-equiv="refresh" content="0; url=${to}"></head>
<body><p><a href="${to}">${esc(title)}</a></p></body></html>
`;
write("apps/index.html", redirect(`${SITE}/#apps`, "All GenzLogic apps"));
if (!ids.has("birthday-reminder")) write("apps/birthday-reminder/index.html", redirect(`${SITE}/apps/bdaybell/`, "Birthday Reminder is now BdayBell"));

/* remove pages for apps that were deleted from the catalog */
for (const d of readdirSync(join(ROOT, "apps"))) {
  const p = join(ROOT, "apps", d);
  if (statSync(p).isDirectory() && !ids.has(d) && d !== "birthday-reminder") { rmSync(p, { recursive: true }); console.log("  removed apps/" + d); }
}

/* ---------- 404 ---------- */
write("404.html", fill(read("tools/templates/404.html"), { HEADER: header("/") }));

/* ---------- sitemap ---------- */
const urls = [`${SITE}/`, ...sorted.map((a) => `${SITE}/apps/${a.id}/`)];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${TODAY}</lastmod></url>`).join("\n")}
</urlset>
`);

console.log(`Built ${apps.length} apps.`);
