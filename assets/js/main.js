(() => {
  "use strict";
  const apps = Array.isArray(window.GENZLOGIC_APPS) ? window.GENZLOGIC_APPS : [];
  const grid = document.querySelector("#app-grid");
  if (!grid) return;
  const search = document.querySelector("#app-search");
  const filters = document.querySelector("#category-filters");
  const count = document.querySelector("#app-count");
  const label = document.querySelector("#results-label");
  const empty = document.querySelector("#empty-state");
  let activeCategory = "All";

  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]));
  const statusClass = status => ({
    "Available":"status-available",
    "Coming Soon":"status-coming-soon",
    "In Development":"status-in-development"
  }[status] || "status-in-development");
  const platformLabel = platform => platform === "Web" ? "Web" : platform;

  function card(app) {
    const platforms = (app.platforms || []).map(platform =>
      `<span class="platform-pill">${escapeHTML(platformLabel(platform))}</span>`).join("");
    const href = app.page || "#";
    return `<article class="app-card" style="--app-glow:${escapeHTML(app.glow || "rgba(67,123,240,.13)")};--icon-bg:${escapeHTML(app.iconBackground || "linear-gradient(145deg,#1b4387,#102443)")}" data-app-id="${escapeHTML(app.id)}">
      <div class="app-card-top">
        <div class="app-identity"><div class="app-icon" aria-hidden="true">${escapeHTML(app.icon || "✦")}</div>
          <div><h3>${escapeHTML(app.name)}</h3><span class="app-category">${escapeHTML(app.category)}</span></div>
        </div>
        <span class="status-badge ${statusClass(app.status)}">${escapeHTML(app.status)}</span>
      </div>
      <p class="app-description">${escapeHTML(app.description)}</p>
      <div class="app-card-bottom"><div class="platforms" aria-label="Platforms">${platforms}</div>
        <a class="card-link" href="${escapeHTML(href)}">Explore app <span aria-hidden="true">↗</span></a>
      </div>
    </article>`;
  }

  function render() {
    const query = (search.value || "").trim().toLocaleLowerCase();
    const filtered = apps.filter(app => {
      const categoryMatches = activeCategory === "All" || app.category === activeCategory;
      const searchText = [app.name, app.category, app.status, app.description, ...(app.platforms || [])].join(" ").toLocaleLowerCase();
      return categoryMatches && searchText.includes(query);
    });
    grid.innerHTML = filtered.map(card).join("");
    count.textContent = String(filtered.length).padStart(2, "0");
    label.textContent = `Showing ${filtered.length} of ${apps.length} ${apps.length === 1 ? "project" : "projects"}`;
    empty.hidden = filtered.length !== 0;
    grid.hidden = filtered.length === 0;
  }

  filters.addEventListener("click", event => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    filters.querySelectorAll("button[data-category]").forEach(item => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    render();
  });
  search.addEventListener("input", render);
  document.querySelector("#reset-filters")?.addEventListener("click", () => {
    search.value = "";
    activeCategory = "All";
    filters.querySelectorAll("button[data-category]").forEach(item => {
      const selected = item.dataset.category === "All";
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    render();
    search.focus();
  });

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    nav?.classList.toggle("open", open);
  });
  nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
  }));
  document.querySelector("#current-year").textContent = new Date().getFullYear();
  render();
})();