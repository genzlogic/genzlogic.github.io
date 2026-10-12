(() => {
  "use strict";
  const appId = document.body.dataset.appId;
  const apps = window.GENZLOGIC_APPS || [];
  const app = apps.find(item => item.id === appId);
  const root = document.querySelector("#app-detail");
  if (!root || !app) return;
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const statusClass = status => ({"Available":"status-available","Coming Soon":"status-coming-soon","In Development":"status-in-development"}[status] || "status-in-development");
  const storeLinks = [];
  if (app.storeUrls?.ios) storeLinks.push(`<a class="button button-primary" href="${esc(app.storeUrls.ios)}" target="_blank" rel="noopener noreferrer">Download on the App Store ↗</a>`);
  if (app.storeUrls?.android) storeLinks.push(`<a class="button button-primary" href="${esc(app.storeUrls.android)}" target="_blank" rel="noopener noreferrer">Get it on Google Play ↗</a>`);
  const platformText = (app.platforms || []).map(esc).join(" · ");
  root.innerHTML = `
    <section class="detail-hero">
      <div class="eyebrow"><a href="../../">GENZLOGIC</a><span aria-hidden="true">/</span><span>${esc(app.category.toUpperCase())}</span></div>
      <div class="detail-heading">
        <div class="app-icon detail-icon" style="--icon-bg:${esc(app.iconBackground)}" aria-hidden="true">${esc(app.icon)}</div>
        <div><span class="status-badge ${statusClass(app.status)}">${esc(app.status)}</span><h1>${esc(app.name)}</h1><p class="detail-platforms">${platformText}</p></div>
      </div>
      <p class="detail-description">${esc(app.description)}</p>
      <div class="detail-actions">${storeLinks.length ? storeLinks.join("") : `<span class="availability-note">${esc(app.availabilityNote || "Store links will be added when available.")}</span>`}<a class="button button-quiet" href="../../#apps">← All apps</a></div>
    </section>
    <section class="detail-section"><div class="eyebrow">WHAT IT'S ABOUT</div><h2>Designed around real needs.</h2><p class="detail-intro">${esc(app.description)}</p><div class="feature-grid">${(app.features || []).map((feature,index)=>`<article class="feature-card"><span class="feature-number">0${index+1}</span><h3>${esc(feature)}</h3><p>Thoughtfully planned as part of the ${esc(app.name)} experience.</p></article>`).join("")}</div></section>
    <section class="detail-footer"><h2>Part of the GenzLogic collection.</h2><p>Explore other apps and projects from our independent studio.</p><a class="button button-primary" href="../../#apps">Explore all apps ↗</a></section>`;
  document.title = `${app.name} | GenzLogic`;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = app.description;
})();