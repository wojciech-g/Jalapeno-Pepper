// ==UserScript==
// @name         Jalapeño for editors — Asystent Kategorii
// @namespace    https://raw.githubusercontent.com/wojciech-g/Jalapeno-Pepper/main/jalapeno-categories.user.js
// @version      1.0.3
// @description  Podpowiedzi kategorii przy dodawaniu okazji na Pepper.pl (skrypt dla edytorów)
// @author       Xcited (https://www.pepper.pl/profile/Xcited)
// @homepageURL  https://github.com/wojciech-g/Jalapeno-Pepper
// @supportURL   https://github.com/wojciech-g/Jalapeno-Pepper/issues
// @updateURL    https://raw.githubusercontent.com/wojciech-g/Jalapeno-Pepper/main/jalapeno-categories.user.js
// @downloadURL  https://raw.githubusercontent.com/wojciech-g/Jalapeno-Pepper/main/jalapeno-categories.user.js
// @match        *://*.pepper.pl/submission/*
// @match        *://www.pepper.pl/submission/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      raw.githubusercontent.com
// ==/UserScript==


(() => {
  // src/features/categoryCore.js
  var DB_URL = "https://raw.githubusercontent.com/wojciech-g/Jalapeno-Pepper/main/baza_kategorii_finalna.json";
  var STOP_WORDS = /* @__PURE__ */ new Set([
    "wszystkie",
    "wszystkich",
    "wszystko",
    "wszystkim",
    "dla",
    "przy",
    "przez",
    "jako",
    "oraz",
    "albo",
    "czy",
    "jest",
    "nie",
    "tak",
    "ten",
    "tej",
    "temu",
    "tego",
    "jak",
    "gdy",
    "ale",
    "lub",
    "nad",
    "pod",
    "bez",
    "the",
    "and",
    "for",
    "with",
    "from",
    // Częste fragmenty tytułów okazji — mało specyficzne kategorialnie
    "pro",
    "plus",
    "mini",
    "max",
    "ultra",
    "lite",
    "super",
    "mega",
    "prime",
    "premium",
    "black",
    "white",
    "edition",
    "rabat",
    "rabatowy",
    "okazja",
    "okazji",
    "taniej",
    "darmowa",
    "darmowy",
    "dostawa",
    "nowy",
    "nowa",
    "nowe",
    "smart",
    "original",
    "basic"
  ]);
  var POSITION_WEIGHTS = [4, 3, 2, 1];
  var _knowledgeBase = null;
  var _wordMeta = null;
  var _loadPromise = null;
  function buildWordMeta(kb) {
    const meta = {};
    for (const [word, entry] of Object.entries(kb)) {
      const cats = Object.entries(entry);
      const total = cats.reduce((s, [, d]) => s + d.count, 0);
      if (!total) continue;
      const sorted = cats.sort((a, b) => b[1].count - a[1].count);
      const topShare = sorted[0][1].count / total;
      const numCats = cats.length;
      const skip = numCats >= 6 && topShare < 0.35;
      let weight = 1;
      if (!skip) {
        if (topShare >= 0.65 && numCats <= 3) weight = 3;
        else if (topShare >= 0.45) weight = 2;
        else if (numCats >= 5) weight = 0.5;
        else weight = 1;
        if (numCats > 3) {
          weight *= Math.max(0.35, topShare);
        }
      }
      meta[word] = { total, numCats, topShare, weight, skip };
    }
    return meta;
  }
  function loadKnowledgeBase() {
    if (_knowledgeBase) return Promise.resolve(_knowledgeBase);
    if (_loadPromise) return _loadPromise;
    _loadPromise = new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: DB_URL,
        timeout: 15e3,
        onload(res) {
          try {
            _knowledgeBase = JSON.parse(res.responseText);
            _wordMeta = buildWordMeta(_knowledgeBase);
            resolve(_knowledgeBase);
          } catch (e) {
            reject(new Error("JSON parse error: " + e.message));
          }
        },
        onerror: () => reject(new Error("Network error loading category DB")),
        ontimeout: () => reject(new Error("Timeout loading category DB"))
      });
    });
    return _loadPromise;
  }
  function normalizeWord(word) {
    return word.toLowerCase().replace(/[^a-z0-9ąćęłńóśźż]/g, "");
  }
  function filterResults(results) {
    if (!results.length) return results;
    const filtered = [results[0]];
    const top = results[0].percent;
    for (let i = 1; i < results.length; i++) {
      const r = results[i];
      if (filtered.length >= 4) break;
      if (i === 1 && r.percent >= 5) {
        filtered.push(r);
        continue;
      }
      if (r.percent >= Math.max(10, top * 0.35)) {
        filtered.push(r);
      }
    }
    return filtered;
  }
  function getAutoSuggestions(title) {
    if (!_knowledgeBase || !_wordMeta || !title) return null;
    const words = title.split(/\s+/).map(normalizeWord).filter((w) => w.length > 2 && !STOP_WORDS.has(w)).slice(0, 4);
    if (!words.length) return null;
    const scores = {};
    const examples = {};
    words.forEach((word, idx) => {
      const entry = _knowledgeBase[word];
      const meta = _wordMeta[word];
      if (!entry || !meta || meta.skip) return;
      const posW = POSITION_WEIGHTS[idx] ?? 1;
      const wordW = meta.weight;
      for (const [cat, data] of Object.entries(entry)) {
        const contribution = data.count * posW * wordW;
        scores[cat] = (scores[cat] || 0) + contribution;
        if (!examples[cat]) examples[cat] = /* @__PURE__ */ new Set();
        data.examples.forEach((ex) => examples[cat].add(`${ex.title}|||${ex.date}`));
      }
    });
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    if (!total) return null;
    const results = Object.entries(scores).map(([cat, score]) => ({
      category: cat,
      percent: Math.round(score / total * 100),
      examples: [...examples[cat]].slice(0, 3).map((s) => {
        const [t, d] = s.split("|||");
        return { title: t, date: d };
      })
    })).sort((a, b) => b.percent - a.percent);
    return filterResults(results);
  }
  function searchManual(query) {
    if (!_knowledgeBase || query.length < 3) return null;
    const q = normalizeWord(query);
    if (STOP_WORDS.has(q)) return null;
    const keys = Object.keys(_knowledgeBase).filter((k) => k.startsWith(q)).slice(0, 3);
    if (!keys.length) return null;
    const out = {};
    keys.forEach((k) => {
      out[k] = _knowledgeBase[k];
    });
    return out;
  }
  function renderSuggestionList(suggestions, percentClass = "jp-cat-percent") {
    return suggestions.map((s) => {
      const ex = s.examples.map(
        (e) => `<li class="jp-cat-example"><em>${e.title}</em><span class="jp-cat-date"> ${e.date || ""}</span></li>`
      ).join("");
      return `<div class="jp-cat-result">
            <div class="jp-cat-result-header">
                <span class="${percentClass}">${s.percent}%</span>
                <span class="jp-cat-name">${s.category}</span>
            </div>
            ${ex ? `<ul class="jp-cat-examples">${ex}</ul>` : ""}
        </div>`;
    }).join("");
  }
  function renderManualResults(rawData) {
    return Object.entries(rawData).map(([word, cats]) => {
      const total = Object.values(cats).reduce((s, c) => s + c.count, 0);
      const sorted = Object.entries(cats).map(([cat, d]) => ({
        category: cat,
        percent: Math.round(d.count / total * 100),
        examples: d.examples.slice(0, 2)
      })).sort((a, b) => b.percent - a.percent);
      return `<div class="jp-cat-word-block">
            <div class="jp-cat-word-label">${word}</div>
            ${renderSuggestionList(filterResults(sorted))}
        </div>`;
    }).join("");
  }

  // src/categories-main.js
  var THEME_KEY = "jp-cat-theme";
  function detectPageTheme() {
    const html = document.documentElement;
    const body = document.body;
    if (html.classList.contains("dark") || html.classList.contains("theme-dark") || body.classList.contains("dark") || body.classList.contains("theme-dark") || html.getAttribute("data-theme") === "dark") {
      return "dark";
    }
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }
  function getTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return detectPageTheme();
  }
  function saveTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
  }
  var _stylesInjected = false;
  function injectStyles() {
    if (_stylesInjected) return;
    _stylesInjected = true;
    GM_addStyle(`
        #jp-cat-float {
            --jp-cat-bg: #ffffff;
            --jp-cat-border: #d0d0d0;
            --jp-cat-text: #222222;
            --jp-cat-text-muted: #888888;
            --jp-cat-input-bg: #ffffff;
            --jp-cat-input-text: #111111;
            --jp-cat-input-border: #bbbbbb;
            --jp-cat-result-bg: #f5f5f5;
            --jp-cat-result-border: #e0e0e0;
            --jp-cat-title-bg: #f9f9f9;
            --jp-cat-title-border: #dddddd;
            --jp-cat-word-bg: #e8f4fc;
            --jp-cat-word-border: #b3d4fc;
            --jp-cat-word-text: #005f9e;
            --jp-cat-divider: #dddddd;
            --jp-cat-shadow: rgba(0,0,0,0.18);

            position: fixed;
            right: 0;
            top: 80px;
            z-index: 99999;
            display: flex;
            flex-direction: row-reverse;
            align-items: flex-start;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: var(--jp-cat-text);
        }

        #jp-cat-float.jp-cat-theme-dark {
            --jp-cat-bg: #2b2d31;
            --jp-cat-border: #404249;
            --jp-cat-text: #dbdee1;
            --jp-cat-text-muted: #949ba4;
            --jp-cat-input-bg: #313338;
            --jp-cat-input-text: #dbdee1;
            --jp-cat-input-border: #5c5f66;
            --jp-cat-result-bg: #383a40;
            --jp-cat-result-border: #404249;
            --jp-cat-title-bg: #313338;
            --jp-cat-title-border: #404249;
            --jp-cat-word-bg: #1e2a35;
            --jp-cat-word-border: #2a4a60;
            --jp-cat-word-text: #4fc3f7;
            --jp-cat-divider: #404249;
            --jp-cat-shadow: rgba(0,0,0,0.45);
        }

        #jp-cat-float-tab {
            flex-shrink: 0;
            width: 34px;
            min-height: 120px;
            background: #ff5200;
            color: #fff;
            border: none;
            border-radius: 8px 0 0 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px 4px;
            font-size: 11px;
            font-weight: bold;
            writing-mode: vertical-rl;
            text-orientation: mixed;
            user-select: none;
            box-shadow: -2px 2px 8px var(--jp-cat-shadow);
            font-family: inherit;
        }

        #jp-cat-float-tab:hover { background: #e64a00; }

        #jp-cat-float-inner {
            width: 280px;
            background: var(--jp-cat-bg);
            border: 1px solid var(--jp-cat-border);
            border-right: none;
            border-radius: 8px 0 0 8px;
            box-shadow: -3px 3px 14px var(--jp-cat-shadow);
            overflow: hidden;
        }

        #jp-cat-float.jp-cat-collapsed #jp-cat-float-inner {
            display: none;
        }

        #jp-cat-float-header {
            background: #ff5200;
            color: #fff;
            padding: 8px 10px;
            font-weight: bold;
            font-size: 13px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
        }

        #jp-cat-float-header-title {
            flex: 1;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        #jp-cat-float-header-actions {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-shrink: 0;
        }

        .jp-cat-header-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            color: #fff;
            border-radius: 4px;
            width: 24px;
            height: 24px;
            cursor: pointer;
            font-size: 13px;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            font-family: inherit;
        }

        .jp-cat-header-btn:hover { background: rgba(255,255,255,0.35); }

        #jp-cat-float-body {
            padding: 10px;
            max-height: calc(100vh - 130px);
            overflow-y: auto;
        }

        .jp-cats-section-label {
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            color: var(--jp-cat-text-muted);
            margin-bottom: 6px;
            letter-spacing: 0.04em;
        }

        .jp-cats-title-live {
            font-size: 11px;
            color: var(--jp-cat-text-muted);
            margin-bottom: 8px;
            padding: 5px 7px;
            background: var(--jp-cat-title-bg);
            border: 1px dashed var(--jp-cat-title-border);
            border-radius: 4px;
            word-break: break-word;
        }

        .jp-cats-title-live strong {
            color: var(--jp-cat-text);
            font-weight: 600;
        }

        .jp-cats-title-live em {
            color: var(--jp-cat-text-muted);
            font-style: italic;
        }

        .jp-cats-results {
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-bottom: 10px;
        }

        .jp-cat-result {
            padding: 5px 7px;
            border-radius: 4px;
            background: var(--jp-cat-result-bg);
            border: 1px solid var(--jp-cat-result-border);
        }

        .jp-cat-result-header {
            display: flex;
            align-items: baseline;
            gap: 5px;
        }

        .jp-cat-percent {
            font-weight: bold;
            color: #ff5200;
            font-size: 13px;
            min-width: 30px;
            text-align: right;
            flex-shrink: 0;
        }

        .jp-cat-name {
            font-weight: bold;
            color: var(--jp-cat-text);
        }

        .jp-cat-examples {
            margin: 3px 0 0 30px;
            padding: 0;
            list-style: circle;
        }

        .jp-cat-example {
            font-size: 10px;
            color: var(--jp-cat-text-muted);
        }

        .jp-cat-date { color: var(--jp-cat-text-muted); opacity: 0.75; }

        .jp-cat-word-block { margin-bottom: 6px; }

        .jp-cat-word-label {
            font-weight: bold;
            font-size: 10px;
            color: var(--jp-cat-word-text);
            background: var(--jp-cat-word-bg);
            border: 1px solid var(--jp-cat-word-border);
            border-radius: 3px;
            padding: 1px 6px;
            display: inline-block;
            margin-bottom: 4px;
        }

        #jp-cats-search-section {
            border-top: 1px dashed var(--jp-cat-divider);
            padding-top: 8px;
            margin-top: 4px;
        }

        #jp-cats-search-input {
            width: 100%;
            padding: 6px 8px;
            font-size: 11px;
            border: 1px solid var(--jp-cat-input-border);
            border-radius: 4px;
            box-sizing: border-box;
            margin-bottom: 6px;
            font-family: inherit;
            outline: none;
            background-color: var(--jp-cat-input-bg) !important;
            color: var(--jp-cat-input-text) !important;
            -webkit-text-fill-color: var(--jp-cat-input-text) !important;
            caret-color: var(--jp-cat-input-text);
        }

        #jp-cats-search-input::placeholder {
            color: var(--jp-cat-text-muted) !important;
            opacity: 0.85;
        }

        #jp-cats-search-input:focus {
            border-color: #ff5200;
            box-shadow: 0 0 0 2px rgba(255,82,0,0.2);
        }

        .jp-cats-empty {
            color: var(--jp-cat-text-muted);
            font-size: 11px;
            font-style: italic;
        }
    `);
  }
  function isSubmissionPage() {
    return /\/submission\//i.test(location.pathname);
  }
  function findTitleInput() {
    return document.querySelector(
      'input[name="title"][type="text"], input[name="title"]'
    );
  }
  function getTitleFromPage() {
    if (isSubmissionPage()) {
      const input = findTitleInput();
      return input?.value?.trim() || "";
    }
    const dealTitle = document.querySelector(
      'h1.thread-title, [data-test="thread-title"], .thread-title'
    );
    if (dealTitle) return dealTitle.textContent.trim();
    const h1 = document.querySelector("h1");
    if (h1 && !/niezbędne|informacje|dodaj|edytuj/i.test(h1.textContent)) {
      return h1.textContent.trim();
    }
    return document.title.replace(/ [-–|].*$/, "").trim();
  }
  function watchTitleInput(onChange) {
    let lastTitle = null;
    let boundInput = null;
    const tick = () => {
      const input = findTitleInput();
      if (input && input !== boundInput) {
        boundInput = input;
        ["input", "change", "keyup", "paste", "cut"].forEach((ev) => {
          input.addEventListener(ev, tick, { passive: true });
        });
      }
      const title = getTitleFromPage();
      if (title !== lastTitle) {
        lastTitle = title;
        onChange();
      }
    };
    tick();
    const observer = new MutationObserver(tick);
    observer.observe(document.body, { childList: true, subtree: true });
    const pollId = setInterval(tick, 350);
    return () => {
      clearInterval(pollId);
      observer.disconnect();
    };
  }
  function applyTheme(wrapper, theme) {
    wrapper.classList.remove("jp-cat-theme-light", "jp-cat-theme-dark");
    wrapper.classList.add(theme === "dark" ? "jp-cat-theme-dark" : "jp-cat-theme-light");
  }
  function buildWidget() {
    const wrapper = document.createElement("div");
    wrapper.id = "jp-cat-float";
    const theme = getTheme();
    applyTheme(wrapper, theme);
    wrapper.innerHTML = `
        <button type="button" id="jp-cat-float-tab" title="Rozwiń panel">🤖 Kategorie</button>
        <div id="jp-cat-float-inner">
            <div id="jp-cat-float-header">
                <span id="jp-cat-float-header-title">🤖 Asystent Kategorii</span>
                <div id="jp-cat-float-header-actions">
                    <button type="button" class="jp-cat-header-btn" id="jp-cat-theme-btn" title="Zmień motyw">${theme === "dark" ? "☀️" : "🌙"}</button>
                    <button type="button" class="jp-cat-header-btn" id="jp-cat-float-toggle" title="Zwiń">◀</button>
                </div>
            </div>
            <div id="jp-cat-float-body">
                <div class="jp-cats-section-label">Podpowiedzi dla tytułu</div>
                <div id="jp-cats-title-live" class="jp-cats-title-live"><em>Wpisz tytuł okazji…</em></div>
                <div id="jp-cats-auto-results" class="jp-cats-results">
                    <span class="jp-cats-empty">Ładowanie bazy…</span>
                </div>
                <div id="jp-cats-search-section">
                    <div class="jp-cats-section-label">Szukaj w bazie</div>
                    <input id="jp-cats-search-input" type="text"
                           placeholder="Wpisz słowo kluczowe (min. 3 znaki)…"
                           autocomplete="off" spellcheck="false">
                    <div id="jp-cats-search-results" class="jp-cats-results"></div>
                </div>
            </div>
        </div>`;
    document.body.appendChild(wrapper);
    const tab = wrapper.querySelector("#jp-cat-float-tab");
    const toggle = wrapper.querySelector("#jp-cat-float-toggle");
    const themeBtn = wrapper.querySelector("#jp-cat-theme-btn");
    const setCollapsed = (collapsed) => {
      wrapper.classList.toggle("jp-cat-collapsed", collapsed);
      tab.title = collapsed ? "Rozwiń panel" : "Zwiń panel";
      toggle.title = collapsed ? "Rozwiń" : "Zwiń";
      toggle.textContent = collapsed ? "▶" : "◀";
    };
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      setCollapsed(!wrapper.classList.contains("jp-cat-collapsed"));
    });
    tab.addEventListener("click", () => {
      setCollapsed(false);
    });
    themeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const next = wrapper.classList.contains("jp-cat-theme-dark") ? "light" : "dark";
      saveTheme(next);
      applyTheme(wrapper, next);
      themeBtn.textContent = next === "dark" ? "☀️" : "🌙";
      themeBtn.title = next === "dark" ? "Motyw jasny" : "Motyw ciemny";
    });
    return {
      wrapper,
      autoResults: wrapper.querySelector("#jp-cats-auto-results"),
      titleLive: wrapper.querySelector("#jp-cats-title-live"),
      searchInput: wrapper.querySelector("#jp-cats-search-input"),
      searchResults: wrapper.querySelector("#jp-cats-search-results")
    };
  }
  function updateTitleLive(titleLive, title) {
    if (!titleLive) return;
    if (title) {
      titleLive.replaceChildren();
      titleLive.append("Tytuł: ");
      const strong = document.createElement("strong");
      strong.textContent = title;
      titleLive.appendChild(strong);
    } else {
      titleLive.innerHTML = "<em>Wpisz tytuł okazji…</em>";
    }
  }
  function initWidget() {
    if (document.getElementById("jp-cat-float")) return;
    injectStyles();
    const { autoResults, titleLive, searchInput, searchResults } = buildWidget();
    function updateAuto() {
      const title = getTitleFromPage();
      updateTitleLive(titleLive, title);
      const suggestions = getAutoSuggestions(title);
      if (!suggestions || !suggestions.length) {
        autoResults.innerHTML = `<span class="jp-cats-empty">${title.length > 2 ? "Brak danych dla tego tytułu" : "Wpisz tytuł okazji…"}</span>`;
        return;
      }
      autoResults.innerHTML = renderSuggestionList(suggestions);
    }
    loadKnowledgeBase().then(() => {
      updateAuto();
      watchTitleInput(updateAuto);
    }).catch((err) => {
      autoResults.innerHTML = `<span class="jp-cats-empty">Błąd ładowania bazy: ${err.message}</span>`;
      watchTitleInput(() => updateTitleLive(titleLive, getTitleFromPage()));
    });
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim();
      if (query.length < 3) {
        searchResults.innerHTML = "";
        return;
      }
      const data = searchManual(query);
      if (!data) {
        searchResults.innerHTML = `<span class="jp-cats-empty">Nic nie znaleziono</span>`;
        return;
      }
      searchResults.innerHTML = renderManualResults(data);
    });
  }
  function boot() {
    initWidget();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  var lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      const existing = document.getElementById("jp-cat-float");
      if (existing) existing.remove();
      boot();
    }
  }, 500);
})();
