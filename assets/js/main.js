/* GenzLogic site behaviour: footer year + app search and filters.
 * The app grid is pre-rendered HTML, so the page works without JavaScript;
 * this script only adds filtering on top of it. */
(function () {
  "use strict";

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () { setOpen(toggle.getAttribute("aria-expanded") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setOpen(false); toggle.focus(); }
    });
  }

  /* ---------- spotlight tabs ---------- */
  var spot = document.querySelector("[data-spotlight]");
  if (spot) {
    var list = spot.querySelector(".spotlight__tabs");
    var tabs = Array.prototype.slice.call(spot.querySelectorAll(".spotlight__tab"));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute("href").slice(1)); });
    list.setAttribute("role", "tablist");
    list.setAttribute("aria-label", "Released apps");
    list.setAttribute("aria-orientation", window.matchMedia("(min-width: 900px)").matches ? "vertical" : "horizontal");

    var select = function (i, focus, initial) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        t.removeAttribute("aria-current");
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
      if (!initial && !window.matchMedia("(min-width: 900px)").matches) tabs[i].scrollIntoView({ block: "nearest", inline: "nearest" });
    };

    tabs.forEach(function (t, i) {
      t.parentElement.setAttribute("role", "presentation");
      t.setAttribute("role", "tab");
      t.setAttribute("aria-controls", panels[i].id);
      panels[i].setAttribute("role", "tabpanel");
      panels[i].setAttribute("aria-labelledby", t.id);
      panels[i].tabIndex = 0;
      t.addEventListener("click", function (e) { e.preventDefault(); select(i, false); });
      t.addEventListener("keydown", function (e) {
        var n = tabs.length, k = e.key, next = null;
        if (k === "ArrowDown" || k === "ArrowRight") next = (i + 1) % n;
        else if (k === "ArrowUp" || k === "ArrowLeft") next = (i - 1 + n) % n;
        else if (k === "Home") next = 0;
        else if (k === "End") next = n - 1;
        if (next !== null) { e.preventDefault(); select(next, true); }
      });
    });
    select(0, false, true);
  }

  var grid = document.getElementById("app-grid");
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll(".app-card"));
  var search = document.getElementById("app-search");
  var results = document.getElementById("results");
  var empty = document.getElementById("empty");
  var clear = document.getElementById("clear-filters");
  var form = document.querySelector("form.toolbar");
  var catButtons = Array.prototype.slice.call(document.querySelectorAll("[data-category]")).filter(isChip);
  var statusButtons = Array.prototype.slice.call(document.querySelectorAll("[data-status]")).filter(isChip);

  function isChip(el) { return el.classList.contains("chip"); }

  var state = { q: "", category: "all", status: "all" };

  // Restore from URL (?q=&category=&status=) so filtered views can be shared.
  try {
    var params = new URLSearchParams(window.location.search);
    state.q = (params.get("q") || "").slice(0, 80);
    state.category = valid(params.get("category"), catButtons, "category");
    state.status = valid(params.get("status"), statusButtons, "status");
  } catch (e) { /* older browsers: start unfiltered */ }

  function valid(value, buttons, key) {
    if (!value) return "all";
    return buttons.some(function (b) { return b.dataset[key] === value; }) ? value : "all";
  }

  document.querySelectorAll("[data-enhanced]").forEach(function (el) { el.hidden = false; });
  search.value = state.q;

  function normalise(s) {
    return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").trim();
  }

  function apply(updateUrl) {
    var terms = normalise(state.q).split(/\s+/).filter(Boolean);
    var shown = 0;

    cards.forEach(function (card) {
      var haystack = card.dataset.search;
      var match =
        (state.category === "all" || card.dataset.category === state.category) &&
        (state.status === "all" || card.dataset.status === state.status) &&
        terms.every(function (t) { return haystack.indexOf(t) !== -1; });
      card.hidden = !match;
      if (match) shown++;
    });

    catButtons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.category === state.category)); });
    statusButtons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.status === state.status)); });

    var filtered = terms.length || state.category !== "all" || state.status !== "all";
    results.textContent = filtered
      ? "Showing " + shown + " of " + cards.length + " apps"
      : "Showing all " + cards.length + " apps";
    empty.hidden = shown !== 0;

    if (updateUrl && window.history && window.history.replaceState) {
      var p = new URLSearchParams();
      if (state.q) p.set("q", state.q);
      if (state.category !== "all") p.set("category", state.category);
      if (state.status !== "all") p.set("status", state.status);
      var qs = p.toString();
      window.history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : "") + window.location.hash);
    }
  }

  var timer;
  search.addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(function () { state.q = search.value; apply(true); }, 120);
  });

  form.addEventListener("submit", function (e) { e.preventDefault(); state.q = search.value; apply(true); });

  catButtons.forEach(function (b) {
    b.addEventListener("click", function () { state.category = b.dataset.category; apply(true); });
  });
  statusButtons.forEach(function (b) {
    b.addEventListener("click", function () { state.status = b.dataset.status; apply(true); });
  });

  clear.addEventListener("click", function () {
    state = { q: "", category: "all", status: "all" };
    search.value = "";
    apply(true);
    search.focus();
  });

  apply(false);
})();
