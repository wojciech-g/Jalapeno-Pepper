// ==UserScript==
// @name         Jalapeño for editors — Asystent Kategorii
// @namespace    https://raw.githubusercontent.com/wojciech-g/Jalapeno-Pepper/main/jalapeno-categories.user.js
// @version      1.0.10
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
// @connect      www.pepper.pl
// ==/UserScript==


(() => {
  // src/features/categoryCore.js
  var DB_URL = "https://raw.githubusercontent.com/wojciech-g/Jalapeno-Pepper/main/baza_kategorii_finalna.json";
  var IGNORE_WORDS_URL = "https://raw.githubusercontent.com/wojciech-g/Jalapeno-Pepper/main/baza_ignorowanych_slow.json";
  var EXAMPLE_TITLE_MAX_LEN = 52;
  var FALLBACK_SHARED_IGNORES = [
    "lcd",
    "oled",
    "led",
    "usb",
    "wifi",
    "bluetooth",
    "hdmi",
    "nvme",
    "ssd",
    "gb",
    "tb",
    "mhz",
    "ghz",
    "rgb",
    "ips",
    "fhd",
    "qhd",
    "uhd",
    "4k",
    "8k",
    "wifi6",
    "ax",
    "ac",
    "gen",
    "v2",
    "v3"
  ];
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
    "basic",
    // "All in One", "ALL INCLUSIVE" — myli z kategorią Podróże
    "all",
    "one",
    "inclusive"
  ]);
  var _sharedIgnoreWords = /* @__PURE__ */ new Set();
  function getSharedIgnoreWords() {
    return [..._sharedIgnoreWords];
  }
  function getEffectiveStopWords() {
    return /* @__PURE__ */ new Set([...STOP_WORDS, ..._sharedIgnoreWords]);
  }
  function getTitleKeywords(title) {
    if (!title) return [];
    const stops = getEffectiveStopWords();
    return title.split(/\s+/).map(normalizeWord).filter((w) => w.length > 2 && !stops.has(w)).slice(0, 4);
  }
  var POSITION_WEIGHTS = [4, 3, 2, 1];
  var _knowledgeBase = null;
  var _wordMeta = null;
  var _loadPromise = null;
  var _ignoreLoadPromise = null;
  function applySharedIgnoreData(data) {
    const words = Array.isArray(data) ? data : data?.words || [];
    _sharedIgnoreWords = new Set(
      words.map((w) => normalizeWord(String(w))).filter((w) => w.length > 0)
    );
    if (!_sharedIgnoreWords.size) {
      _sharedIgnoreWords = new Set(FALLBACK_SHARED_IGNORES);
    }
  }
  function loadSharedIgnoreWords() {
    if (_sharedIgnoreWords.size) return Promise.resolve(_sharedIgnoreWords);
    if (_ignoreLoadPromise) return _ignoreLoadPromise;
    _ignoreLoadPromise = new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: IGNORE_WORDS_URL,
        timeout: 12e3,
        onload(res) {
          try {
            applySharedIgnoreData(JSON.parse(res.responseText));
          } catch (_) {
            _sharedIgnoreWords = new Set(FALLBACK_SHARED_IGNORES);
          }
          resolve(_sharedIgnoreWords);
        },
        onerror: () => {
          _sharedIgnoreWords = new Set(FALLBACK_SHARED_IGNORES);
          resolve(_sharedIgnoreWords);
        },
        ontimeout: () => {
          _sharedIgnoreWords = new Set(FALLBACK_SHARED_IGNORES);
          resolve(_sharedIgnoreWords);
        }
      });
    });
    return _ignoreLoadPromise;
  }
  function fetchKnowledgeBase() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: DB_URL,
        timeout: 15e3,
        onload(res) {
          try {
            resolve(JSON.parse(res.responseText));
          } catch (e) {
            reject(new Error("JSON parse error: " + e.message));
          }
        },
        onerror: () => reject(new Error("Network error loading category DB")),
        ontimeout: () => reject(new Error("Timeout loading category DB"))
      });
    });
  }
  function loadKnowledgeBase() {
    if (_knowledgeBase) return Promise.resolve(_knowledgeBase);
    if (_loadPromise) return _loadPromise;
    _loadPromise = Promise.all([fetchKnowledgeBase(), loadSharedIgnoreWords()]).then(([kb]) => {
      _knowledgeBase = kb;
      _wordMeta = buildWordMeta(_knowledgeBase);
      return _knowledgeBase;
    }).catch((err) => {
      _loadPromise = null;
      throw err;
    });
    return _loadPromise;
  }
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
    const stops = getEffectiveStopWords();
    const words = title.split(/\s+/).map(normalizeWord).filter((w) => w.length > 2 && !stops.has(w)).slice(0, 4);
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
        data.examples.forEach((ex) => {
          examples[cat].add(`${ex.title}|||${ex.date || ""}|||${ex.url || ""}`);
        });
      }
    });
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    if (!total) return null;
    const results = Object.entries(scores).map(([cat, score]) => ({
      category: cat,
      percent: Math.round(score / total * 100),
      examples: [...examples[cat]].slice(0, 3).map(parseStoredExample)
    })).sort((a, b) => b.percent - a.percent);
    return filterResults(results);
  }
  function mergeCategorySuggestions(rewardsResults, pepperData) {
    const pepperResults = pepperData?.suggestions || null;
    const dealCount = pepperData?.dealCount || 0;
    const emptyWeights = { rewards: 1, pepper: 0 };
    if (!rewardsResults?.length && !pepperResults?.length) {
      return { merged: null, weights: emptyWeights };
    }
    const tagRewards = (list) => list.map((r) => ({
      ...r,
      sources: ["rewards"],
      examples: r.examples.map((e) => ({ ...e, source: "rewards" }))
    }));
    const tagPepper = (list) => list.map((r) => ({
      ...r,
      sources: ["pepper"],
      examples: (r.examples || []).map((e) => ({ ...e, source: "pepper" }))
    }));
    if (!pepperResults?.length) {
      return { merged: tagRewards(rewardsResults), weights: { rewards: 1, pepper: 0 } };
    }
    if (!rewardsResults?.length) {
      return { merged: tagPepper(pepperResults), weights: { rewards: 0, pepper: 1 } };
    }
    let rewardsW = 0.65;
    let pepperW = 0.35;
    if (dealCount < 3) {
      rewardsW = 0.78;
      pepperW = 0.22;
    } else if (dealCount >= 10) {
      rewardsW = 0.55;
      pepperW = 0.45;
    }
    const rewardsTop = rewardsResults[0];
    const pepperTop = pepperResults[0];
    if (rewardsTop.category !== pepperTop.category && pepperTop.percent >= 50 && dealCount >= 6 && rewardsTop.percent < 30) {
      rewardsW = 0.45;
      pepperW = 0.55;
    }
    const weights = { rewards: rewardsW, pepper: pepperW };
    const rewardsPct = Object.fromEntries(rewardsResults.map((r) => [r.category, r.percent]));
    const pepperPct = Object.fromEntries(pepperResults.map((r) => [r.category, r.percent]));
    const scores = {};
    const exampleMap = {};
    for (const r of rewardsResults) {
      scores[r.category] = (scores[r.category] || 0) + r.percent * rewardsW;
      if (!exampleMap[r.category]) exampleMap[r.category] = [];
      for (const ex of r.examples) {
        if (exampleMap[r.category].length < 4) {
          exampleMap[r.category].push({ ...ex, source: "rewards" });
        }
      }
    }
    for (const r of pepperResults) {
      scores[r.category] = (scores[r.category] || 0) + r.percent * pepperW;
      if (!exampleMap[r.category]) exampleMap[r.category] = [];
      for (const ex of r.examples || []) {
        if (exampleMap[r.category].length < 4 && !exampleMap[r.category].some((e) => e.title === ex.title)) {
          exampleMap[r.category].push({ ...ex, source: "pepper" });
        }
      }
    }
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    if (!total) return { merged: null, weights };
    const merged = Object.entries(scores).map(([category, score]) => {
      const hasRewards = category in rewardsPct;
      const hasPepper = category in pepperPct;
      const sources = [];
      if (hasRewards) sources.push("rewards");
      if (hasPepper) sources.push("pepper");
      return {
        category,
        percent: Math.round(score / total * 100),
        rewardsPercent: hasRewards ? rewardsPct[category] : null,
        pepperPercent: hasPepper ? pepperPct[category] : null,
        examples: (exampleMap[category] || []).slice(0, 3),
        sources
      };
    }).sort((a, b) => b.percent - a.percent);
    return { merged: filterResults(merged), weights };
  }
  function buildCategorySuggestionView(rewardsResults, pepperData, opts = {}) {
    const pepperList = pepperData?.suggestions || [];
    const rewards = (rewardsResults || []).map((r) => ({
      ...r,
      examples: r.examples.map((e) => ({ ...e, source: "rewards" }))
    }));
    const pepper = pepperList.map((r) => ({
      ...r,
      examples: (r.examples || []).map((e) => ({ ...e, source: "pepper" }))
    }));
    const { merged, weights } = mergeCategorySuggestions(rewardsResults, pepperData);
    return {
      rewards,
      pepper,
      merged,
      loadingPepper: !!opts.loadingPepper,
      meta: {
        rewardsCount: rewards.length,
        pepperDealCount: pepperData?.dealCount || 0,
        pepperQuery: pepperData?.query || null,
        pepperFallback: !!pepperData?.isFallback,
        weights,
        hasRewards: rewards.length > 0,
        hasPepper: pepper.length > 0
      }
    };
  }
  var CATEGORY_VIEW_LABELS_PL = {
    combinedTitle: "Łączny ranking",
    rewardsTitle: "Nagrody (baza Slack / GitHub)",
    pepperTitle: "Poprzednie wstawki (Pepper)",
    rewardsShort: "Nagrody",
    pepperShort: "Wstawki",
    rewardsNone: "Brak dopasowania w bazie nagród",
    pepperNone: "Brak podobnych okazji",
    pepperLoading: "Szukam podobnych wstawek…",
    statsRewards: "kat. z nagród",
    statsPepperDeals: "podobnych okazji",
    statsWeight: "Waga",
    statsSearch: "szukano",
    pepperFallback: " (fallback)",
    keywordsLabel: "Słowa kluczowe",
    ignoredLabel: "Twoje ignorowane",
    sharedIgnoreLabel: "Baza ignorowanych"
  };
  function renderCategorySuggestionView(view, labels = {}, percentClass = "jp-cat-percent") {
    const L = { ...CATEGORY_VIEW_LABELS_PL, ...labels };
    const { rewards, pepper, merged, meta, loadingPepper } = view;
    if (!merged?.length && !rewards.length && !pepper.length && !loadingPepper) {
      return "";
    }
    let html = '<div class="jp-cat-advisor-view">';
    html += '<div class="jp-cat-stats-bar">';
    const statParts = [];
    if (meta.hasRewards) {
      statParts.push(`🏆 <b>${meta.rewardsCount}</b> ${L.statsRewards}`);
    }
    if (loadingPepper) {
      statParts.push(`<span class="jp-cat-merge-loading">${L.pepperLoading}</span>`);
    } else if (meta.hasPepper) {
      statParts.push(`📊 <b>${meta.pepperDealCount}</b> ${L.statsPepperDeals}`);
      if (meta.pepperQuery) {
        const fb = meta.pepperFallback ? L.pepperFallback : "";
        statParts.push(`${L.statsSearch}: <em>${meta.pepperQuery}</em>${fb}`);
      }
    }
    if (meta.hasRewards && meta.hasPepper && !loadingPepper) {
      const rW = Math.round(meta.weights.rewards * 100);
      const pW = Math.round(meta.weights.pepper * 100);
      statParts.push(`${L.statsWeight}: 🏆 ${rW}% · 📊 ${pW}%`);
    }
    if (meta.keywords?.length) {
      statParts.push(`${L.keywordsLabel}: <em>${meta.keywords.join(", ")}</em>`);
    }
    if (meta.sharedIgnores?.length) {
      statParts.push(`${L.sharedIgnoreLabel}: ${meta.sharedIgnores.length}`);
    }
    html += statParts.join(" · ") || "—";
    html += "</div>";
    if (merged?.length) {
      html += `<div class="jp-cat-block jp-cat-block-combined">`;
      html += `<div class="jp-cat-block-title">${L.combinedTitle}</div>`;
      html += merged.map((s) => renderCombinedRow(s, percentClass)).join("");
      html += "</div>";
    }
    html += '<div class="jp-cat-sources-split">';
    html += '<div class="jp-cat-block jp-cat-block-rewards">';
    html += `<div class="jp-cat-block-title jp-cat-block-title-rewards">🏆 ${L.rewardsTitle}</div>`;
    html += rewards.length ? renderSourceList(rewards, "rewards", percentClass) : `<div class="jp-cat-empty-src">${L.rewardsNone}</div>`;
    html += "</div>";
    html += '<div class="jp-cat-block jp-cat-block-pepper">';
    html += `<div class="jp-cat-block-title jp-cat-block-title-pepper">📊 ${L.pepperTitle}</div>`;
    if (loadingPepper) {
      html += `<div class="jp-cat-empty-src jp-cat-merge-loading">${L.pepperLoading}</div>`;
    } else {
      html += pepper.length ? renderSourceList(pepper, "pepper", percentClass) : `<div class="jp-cat-empty-src">${L.pepperNone}</div>`;
    }
    html += "</div>";
    html += "</div></div>";
    return html;
  }
  function parseStoredExample(raw) {
    const parts = String(raw).split("|||");
    return {
      title: parts[0] || "",
      date: parts[1] || "",
      url: parts[2] || null
    };
  }
  function escapeHtml(text) {
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function truncateTitle(title, maxLen = EXAMPLE_TITLE_MAX_LEN) {
    if (!title || title.length <= maxLen) return title;
    return `${title.slice(0, maxLen - 1)}…`;
  }
  function renderExampleItem(example) {
    const full = example.title || "";
    if (!full) return "";
    const short = truncateTitle(full);
    const titleAttr = escapeHtml(full);
    const inner = escapeHtml(short);
    const datePart = example.date ? `<span class="jp-cat-date">${escapeHtml(example.date)}</span>` : "";
    const titleEl = example.url ? `<a class="jp-cat-ex-link" href="${escapeHtml(example.url)}" target="_blank" rel="noopener noreferrer" title="${titleAttr}">${inner}</a>` : `<span class="jp-cat-ex-text" title="${titleAttr}">${inner}</span>`;
    return `<li class="jp-cat-example">${titleEl}${datePart ? ` ${datePart}` : ""}</li>`;
  }
  function renderCombinedRow(s, percentClass) {
    const pills = [];
    if (s.rewardsPercent != null) {
      pills.push(`<span class="jp-cat-src-pill jp-cat-src-rewards" title="Nagrody"><span class="jp-cat-src-icon">🏆</span><span class="jp-cat-src-val">${s.rewardsPercent}%</span></span>`);
    }
    if (s.pepperPercent != null) {
      pills.push(`<span class="jp-cat-src-pill jp-cat-src-pepper" title="Wstawki"><span class="jp-cat-src-icon">📊</span><span class="jp-cat-src-val">${s.pepperPercent}%</span></span>`);
    }
    const ledBy = s.rewardsPercent != null && (s.pepperPercent == null || s.rewardsPercent >= s.pepperPercent) ? "rewards-led" : s.pepperPercent != null ? "pepper-led" : "";
    const ex = (s.examples || []).map((e) => renderExampleItem(e)).join("");
    return `<div class="jp-cat-result jp-cat-result-combined ${ledBy}">
        <div class="jp-cat-result-header">
            <span class="${percentClass}">${s.percent}%</span>
            <span class="jp-cat-name">${escapeHtml(s.category)}</span>
        </div>
        ${pills.length ? `<div class="jp-cat-src-pills">${pills.join("")}</div>` : ""}
        ${ex ? `<ul class="jp-cat-examples">${ex}</ul>` : ""}
    </div>`;
  }
  function renderSourceList(items, source, percentClass) {
    return items.map((s) => {
      const ex = (s.examples || []).map((e) => renderExampleItem(e)).join("");
      return `<div class="jp-cat-result jp-cat-result-${source}">
            <div class="jp-cat-result-header">
                <span class="${percentClass}">${s.percent}%</span>
                <span class="jp-cat-name">${escapeHtml(s.category)}</span>
            </div>
            ${ex ? `<ul class="jp-cat-examples">${ex}</ul>` : ""}
        </div>`;
    }).join("");
  }
  function searchManual(query) {
    if (!_knowledgeBase || query.length < 3) return null;
    const q = normalizeWord(query);
    if (getEffectiveStopWords().has(q)) return null;
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
      const ex = s.examples.map((e) => renderExampleItem(e)).join("");
      return `<div class="jp-cat-result">
            <div class="jp-cat-result-header">
                <span class="${percentClass}">${s.percent}%</span>
                <span class="jp-cat-name">${escapeHtml(s.category)}</span>
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

  // src/utils/text.js
  var settings = {};
  function generateSmartQuery(title, optSettings) {
    const s = optSettings ?? settings;
    let clean = title.replace(/\[.*?\]|\(.*?\)|\{.*?\}/g, " ");
    let custom = (s.customStopWords || "").split(",").map((x) => x.trim()).filter((x) => x.length > 0);
    const stopWords = [
      ...custom,
      "okazja",
      "promocja",
      "kod",
      "rabat",
      "zł",
      "pln",
      "darmowa",
      "dostawa",
      "błąd",
      "cenowy",
      "taniej",
      "w",
      "na",
      "do",
      "z",
      "od",
      "tylko",
      "wyprzedaż",
      "outlet",
      "tani",
      "tania",
      "możliwe",
      "nawet",
      "monetami",
      "newsletter",
      "szt",
      "sztuki",
      "sztuk",
      "sztuka",
      "opakowanie",
      "aplikacji",
      "aplikacja",
      "sklep",
      "sklepie",
      "ceneo",
      "allegro",
      "amazon",
      "aliexpress",
      "gen",
      "generacja",
      "generacji",
      "telewizor",
      "tv",
      "smartfon",
      "telefon",
      "laptop",
      "komputer",
      "pc",
      "monitor",
      "myszka",
      "mysz",
      "klawiatura",
      "słuchawki",
      "głośnik",
      "soundbar",
      "zegarek",
      "smartwatch",
      "konsola",
      "gra",
      "pad",
      "kontroler",
      "dysk",
      "karta",
      "pamięć",
      "odkurzacz",
      "pralka",
      "lodówka",
      "zmywarka",
      "piekarnik",
      "mikrofala",
      "ekspres",
      "blender",
      "robot",
      "sprzątający",
      "mop",
      "buty",
      "sneakersy",
      "trampki",
      "kurtka",
      "bluza",
      "spodnie",
      "koszulka",
      "t-shirt",
      "rower",
      "hulajnoga",
      "kask",
      "wiertarka",
      "wkrętarka",
      "szlifierka",
      "zestaw",
      "klucze",
      "opony",
      "olej",
      "płyn",
      "prania",
      "tabletki",
      "zmywarki",
      "woda",
      "toaletowa",
      "perfumowana",
      "edp",
      "edt",
      "ml",
      "flakon",
      "steam",
      "epic",
      "gog",
      "edycja",
      "edition",
      "pc",
      "ps4",
      "ps5",
      "xbox",
      "nintendo",
      "switch",
      "książka",
      "ksiazka",
      "tom",
      "wydanie",
      "oprawa",
      "twarda",
      "miękka",
      "miekka",
      "ebook",
      "audiobook",
      "czytnik",
      "kindle",
      "klocki",
      "figurka",
      "polybag",
      "sztuk",
      "elementów",
      "elektryczna",
      "elektryczne"
    ];
    let regex = new RegExp("\\b(" + stopWords.join("|") + ")\\b", "gi");
    clean = clean.replace(regex, " ");
    let words = clean.trim().split(/\s+/).filter((w) => w.length > 1);
    let query = words.slice(0, 4).join(" ");
    return query;
  }
  function getFallbackWord(title, optSettings) {
    const s = optSettings ?? settings;
    let custom = (s.customStopWords || "").split(",").map((x) => x.trim().toLowerCase()).filter((x) => x.length > 0);
    const categories = [
      ...custom,
      "telewizor",
      "tv",
      "smartfon",
      "telefon",
      "laptop",
      "komputer",
      "monitor",
      "myszka",
      "mysz",
      "klawiatura",
      "słuchawki",
      "głośnik",
      "soundbar",
      "zegarek",
      "smartwatch",
      "konsola",
      "gra",
      "pad",
      "kontroler",
      "dysk",
      "karta",
      "pamięć",
      "odkurzacz",
      "pralka",
      "lodówka",
      "zmywarka",
      "piekarnik",
      "mikrofala",
      "ekspres",
      "blender",
      "robot",
      "mop",
      "frytkownica",
      "buty",
      "sneakersy",
      "trampki",
      "kurtka",
      "bluza",
      "spodnie",
      "koszulka",
      "t-shirt",
      "rower",
      "hulajnoga",
      "kask",
      "wiertarka",
      "wkrętarka",
      "szlifierka",
      "opony",
      "olej",
      "perfumy",
      "woda",
      "książka",
      "ebook",
      "audiobook",
      "czytnik",
      "kindle",
      "klocki",
      "figurka",
      "karma"
    ];
    let lowerTitle = title.toLowerCase();
    for (let word of categories) {
      if (new RegExp("\\b" + word + "\\b").test(lowerTitle)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
    }
    let firstWord = title.split(" ").find((w) => w.length > 2);
    return firstWord || null;
  }

  // src/features/categoryPepperHistory.js
  var DEFAULT_OPTS = {
    maxDeals: 20,
    enableFallback: true,
    customStopWords: "",
    excludeDeal: null
  };
  function urlDealFingerprint(url) {
    if (!url) return "";
    try {
      const u = new URL(url.trim());
      const dp = u.pathname.match(/\/dp\/([A-Z0-9]{10})/i);
      if (dp) return `dp:${dp[1].toUpperCase()}`;
      const host = u.hostname.replace(/^www\./i, "").toLowerCase();
      return `${host}${u.pathname.split("?")[0].replace(/\/$/, "")}`;
    } catch (_) {
      return url.trim().toLowerCase();
    }
  }
  function normalizeTitle(title) {
    return (title || "").toLowerCase().replace(/\s+/g, " ").trim();
  }
  function buildDealExclusionFromPage(getTitle) {
    const titleInput = document.querySelector(
      'input[placeholder="Thread title"], input[name="title"]'
    );
    const titleRaw = getTitle?.() || titleInput?.value?.trim() || "";
    const mainUrl = document.querySelector('textarea[name="mainUrl"]')?.value?.trim() || "";
    const canonicalUrl = document.querySelector('textarea[name="canonicalUrl"]')?.value?.trim() || "";
    let threadId = null;
    const idMatch = window.location.href.match(/(?:-|\/deals\/edit\/)(\d+)(?:\/|$|\?)/);
    if (idMatch) threadId = parseInt(idMatch[1], 10);
    const urlFps = new Set(
      [mainUrl, canonicalUrl].filter(Boolean).map(urlDealFingerprint)
    );
    return {
      title: normalizeTitle(titleRaw),
      mainUrl,
      canonicalUrl,
      threadId,
      urlFps
    };
  }
  function isCurrentDealThread(threadInfo, ctx) {
    if (!threadInfo || !ctx) return false;
    if (ctx.threadId && threadInfo.threadId === ctx.threadId) return true;
    const link = (threadInfo.link || "").trim();
    if (link) {
      if (ctx.mainUrl && link === ctx.mainUrl) return true;
      if (ctx.canonicalUrl && link === ctx.canonicalUrl) return true;
      if (ctx.urlFps?.size && ctx.urlFps.has(urlDealFingerprint(link))) return true;
    }
    const dealUrl = (threadInfo.url || "").trim();
    if (ctx.threadId && dealUrl) {
      if (dealUrl.includes(`/deals/${ctx.threadId}`) || dealUrl.includes(`-${ctx.threadId}`)) {
        return true;
      }
    }
    if (ctx.title && threadInfo.title) {
      if (normalizeTitle(threadInfo.title) === ctx.title) return true;
    }
    return false;
  }
  function parseSearchHtml(html, query, isFallback, excludeDeal) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const deals = doc.querySelectorAll("article.thread, div.thread");
    const queryWords = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    const validDeals = [];
    deals.forEach((deal) => {
      const vueDataEl = deal.querySelector("[data-vue3]");
      if (!vueDataEl) return;
      try {
        const vueJson = JSON.parse(vueDataEl.getAttribute("data-vue3"));
        const threadInfo = vueJson.props?.thread;
        if (!threadInfo) return;
        if (isCurrentDealThread(threadInfo, excludeDeal)) return;
        const titleLower = threadInfo.title.toLowerCase();
        const isMatch = queryWords.length === 0 || queryWords.some((word) => titleLower.includes(word));
        if (isMatch || isFallback) {
          validDeals.push(threadInfo);
        }
      } catch (_) {
      }
    });
    return validDeals;
  }
  function buildCategoryStats(deals) {
    const categoryCount = {};
    const examples = {};
    let totalCategorized = 0;
    deals.forEach((threadInfo) => {
      const cat = threadInfo.mainGroup?.threadGroupName;
      if (!cat) return;
      totalCategorized++;
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      if (!examples[cat]) examples[cat] = [];
      if (examples[cat].length < 3) {
        let dateStr = "";
        if (threadInfo.publishedAt) {
          const d = new Date(threadInfo.publishedAt * 1e3);
          dateStr = `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
        }
        examples[cat].push({
          title: threadInfo.title,
          date: dateStr,
          source: "pepper",
          url: threadInfo.url || null
        });
      }
    });
    if (totalCategorized === 0) return null;
    const suggestions = Object.entries(categoryCount).map(([category, count]) => ({
      category,
      percent: Math.round(count / totalCategorized * 100),
      examples: examples[category],
      source: "pepper"
    })).sort((a, b) => b.percent - a.percent);
    return {
      suggestions: filterResults(suggestions),
      dealCount: totalCategorized
    };
  }
  function fetchQuery(query, originalTitle, textSettings, opts, isFallback) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://www.pepper.pl/search?q=${encodeURIComponent(query)}`,
        timeout: 12e3,
        onload(res) {
          const deals = parseSearchHtml(
            res.responseText,
            query,
            isFallback,
            opts.excludeDeal
          ).slice(0, opts.maxDeals);
          const stats = buildCategoryStats(deals);
          if (!stats && opts.enableFallback && !isFallback) {
            let fallbackQuery = getFallbackWord(originalTitle, textSettings);
            if (!fallbackQuery) {
              const words = query.split(" ").filter((w) => w.length > 2);
              fallbackQuery = words[0] || null;
            }
            if (fallbackQuery && fallbackQuery.toLowerCase() !== query.toLowerCase()) {
              fetchQuery(fallbackQuery, originalTitle, textSettings, opts, true).then((result) => {
                if (result) {
                  resolve({ ...result, query: fallbackQuery, isFallback: true });
                } else {
                  resolve(null);
                }
              });
              return;
            }
          }
          if (!stats) {
            resolve(null);
            return;
          }
          resolve({
            ...stats,
            query,
            isFallback
          });
        },
        onerror: () => resolve(null),
        ontimeout: () => resolve(null)
      });
    });
  }
  function fetchPepperCategorySuggestions(title, options = {}) {
    const opts = { ...DEFAULT_OPTS, ...options };
    const textSettings = { customStopWords: opts.customStopWords || "" };
    if (!title || title.trim().length < 3) {
      return Promise.resolve(null);
    }
    const query = generateSmartQuery(title, textSettings);
    if (!query) {
      return Promise.resolve(null);
    }
    return fetchQuery(query, title, textSettings, opts, false);
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
            width: 320px;
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
            padding: 3px 6px;
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
            margin: 2px 0 0 0;
            padding: 0;
            list-style: none;
        }

        .jp-cat-example {
            font-size: 9px;
            color: var(--jp-cat-text-muted);
            line-height: 1.35;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .jp-cat-ex-link {
            color: #ff5200;
            text-decoration: underline;
            text-underline-offset: 2px;
        }

        .jp-cat-ex-link:hover { opacity: 0.85; }

        .jp-cat-ex-text { cursor: help; }

        .jp-cat-date { color: var(--jp-cat-text-muted); opacity: 0.65; margin-left: 4px; }

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

        .jp-cat-source-badge {
            font-size: 9px;
            margin-left: auto;
            opacity: 0.75;
        }

        .jp-cat-merge-note {
            font-size: 10px;
            color: var(--jp-cat-text-muted);
            margin-top: 6px;
            padding-top: 5px;
            border-top: 1px dashed var(--jp-cat-divider);
            line-height: 1.35;
        }

        .jp-cat-merge-note em {
            font-style: normal;
            color: var(--jp-cat-text);
            font-weight: 500;
        }

        .jp-cat-merge-loading { font-style: italic; opacity: 0.85; }

        .jp-cat-advisor-view { display: flex; flex-direction: column; gap: 8px; }

        .jp-cat-stats-bar {
            font-size: 10px;
            color: var(--jp-cat-text-muted);
            background: var(--jp-cat-title-bg);
            border: 1px solid var(--jp-cat-title-border);
            border-radius: 4px;
            padding: 6px 8px;
            line-height: 1.5;
        }

        .jp-cat-stats-bar b { color: var(--jp-cat-text); }
        .jp-cat-stats-bar em { font-style: normal; color: var(--jp-cat-text); font-weight: 500; }

        .jp-cat-block-title {
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: var(--jp-cat-text-muted);
            margin-bottom: 5px;
        }

        .jp-cat-block-title-rewards { color: #c77800; }
        .jp-cat-block-title-pepper { color: #3d8fd1; }

        .jp-cat-sources-split {
            display: flex;
            flex-direction: column;
            gap: 8px;
            border-top: 1px dashed var(--jp-cat-divider);
            padding-top: 8px;
        }

        .jp-cat-block { min-width: 0; max-width: 100%; }
        .jp-cat-advisor-view { max-width: 100%; overflow: hidden; }

        .jp-cat-block-rewards .jp-cat-result-rewards {
            border-left: 3px solid #ff9800;
        }

        .jp-cat-block-pepper .jp-cat-result-pepper {
            border-left: 3px solid #42a5f5;
        }

        .jp-cat-result-combined.rewards-led { border-left: 3px solid #ff9800; }
        .jp-cat-result-combined.pepper-led { border-left: 3px solid #42a5f5; }

        .jp-cat-src-pills {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin: 3px 0 2px 0;
        }

        .jp-cat-src-pill {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 7px;
            border-radius: 4px;
            line-height: 1.3;
            border: 1px solid transparent;
        }

        .jp-cat-src-icon { font-size: 10px; line-height: 1; }
        .jp-cat-src-val { font-size: 11px; font-weight: 800; letter-spacing: 0.02em; }
        .jp-cat-src-rewards { background: #ff9800; color: #1a1200; border-color: #e65100; }
        .jp-cat-src-pepper { background: #42a5f5; color: #061a2e; border-color: #1565c0; }

        .jp-cat-ex-badge {
            flex-shrink: 0;
            font-size: 9px;
            line-height: 1.3;
        }

        .jp-cat-empty-src {
            font-size: 10px;
            color: var(--jp-cat-text-muted);
            font-style: italic;
            padding: 4px 2px;
        }

        #jp-cat-float.jp-cat-theme-dark .jp-cat-src-rewards { color: #ffb74d; }
        #jp-cat-float.jp-cat-theme-dark .jp-cat-src-pepper { color: #64b5f6; }
        #jp-cat-float.jp-cat-theme-dark .jp-cat-block-title-rewards { color: #ffb74d; }
        #jp-cat-float.jp-cat-theme-dark .jp-cat-block-title-pepper { color: #64b5f6; }
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
    function enrichView(view, title) {
      view.meta.keywords = getTitleKeywords(title);
      view.meta.sharedIgnores = getSharedIgnoreWords();
      return view;
    }
    function renderAuto(rewardsSuggestions, pepperData, loadingPepper) {
      const title = getTitleFromPage();
      updateTitleLive(titleLive, title);
      if (!rewardsSuggestions?.length && !pepperData && !loadingPepper) {
        autoResults.innerHTML = `<span class="jp-cats-empty">${title.length > 2 ? "Brak danych dla tego tytułu" : "Wpisz tytuł okazji…"}</span>`;
        return;
      }
      const view = enrichView(
        buildCategorySuggestionView(rewardsSuggestions, pepperData, { loadingPepper }),
        title
      );
      if (!view.merged?.length && !view.rewards.length && !view.pepper.length && !loadingPepper) {
        autoResults.innerHTML = `<span class="jp-cats-empty">${title.length > 2 ? "Brak danych dla tego tytułu" : "Wpisz tytuł okazji…"}</span>`;
        return;
      }
      autoResults.innerHTML = renderCategorySuggestionView(view);
    }
    let pepperTimer = null;
    let pepperReqId = 0;
    function updateAuto() {
      const title = getTitleFromPage();
      const rewardsSuggestions = getAutoSuggestions(title);
      const excludeDeal = buildDealExclusionFromPage(getTitleFromPage);
      clearTimeout(pepperTimer);
      const reqId = ++pepperReqId;
      if (!title || title.trim().length < 3) {
        renderAuto(rewardsSuggestions, null, false);
        return;
      }
      renderAuto(rewardsSuggestions, null, true);
      pepperTimer = setTimeout(() => {
        fetchPepperCategorySuggestions(title, { excludeDeal }).then((pepperData) => {
          if (reqId !== pepperReqId) return;
          renderAuto(getAutoSuggestions(title), pepperData, false);
        });
      }, 450);
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
