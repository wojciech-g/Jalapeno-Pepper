// ==UserScript==
// @name         Jalapeño - PepperModPL add-on
// @namespace    https://raw.githubusercontent.com/wojciech-g/Jalapeno-Pepper/main/jalapeno.user.js
// @version      4.6.2
// @description  Baza Fake Promo + Przelicznik + Historia + Auto Kategorie + Light/Dark Mode + PL/EN + Poprawki moderacyjne
// @author       Xcited (https://www.pepper.pl/profile/Xcited)
// @homepageURL  https://github.com/wojciech-g/Jalapeno-Pepper
// @supportURL   https://github.com/wojciech-g/Jalapeno-Pepper/issues
// @updateURL    https://raw.githubusercontent.com/wojciech-g/Jalapeno-Pepper/main/jalapeno.user.js
// @downloadURL  https://raw.githubusercontent.com/wojciech-g/Jalapeno-Pepper/main/jalapeno.user.js
// @match        *://*.pepper.pl/admin-v2/moderation/*
// @match        *://*.pepper.pl/admin/inspector/users/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @connect      www.pepper.pl
// @connect      open.er-api.com
// ==/UserScript==

(function() {
    'use strict';

    const API_URL = "https://script.google.com/macros/s/AKfycbxPY1KVfIZ-MdhBG_QPYhE-H8QsDCqIp2OkD9nBKU8-tGh8mF5OReV0KRVFMecUX0xUcQ/exec";
    let fakePromoDB = {};
    let exchangeRates = null;

    const DEFAULT_SETTINGS = {
        theme: 'light', // 'light' | 'dark'
        language: 'pl', // 'pl' | 'en'
        defaultCurrency: 'EUR',
        historyCount: 3,
        customStopWords: '',
        hiddenButtons: ['DekuDeals'],
        enableFakePromo: true,
        enableCalculator: true,
        enableHistory: true,
        enableMetaInfo: true,
        enableKeywordFallback: true,
        enableAutoAmazonShipping: true,
        enableAutoLocalStore: true,
        histShowStatus: true,
        histShowPrice: true,
        histShowTemp: true,
        histShowCopy: true,
        histShowCategory: true,
        histShowDate: true,
        histShowAuthor: true,
        histShowMerchant: true,
        enableAutoHoldNote: true,
        enableMessageTemplates: true,
        enableFloatingButton: true,
        customFloatingText: ' - Spersonalizuj mnie!',
        floatingButtonAutoFreeDelivery: false
        //enableAutoInfractionNote: true
    };

    let settings = Object.assign({}, DEFAULT_SETTINGS, GM_getValue('jalapenoSettings', {}));

    // --- Słownik (i18n) ---
    const i18n = {
        pl: {
            titleSettings: "⚙️ Ustawienia Jalapeño",
            activeModules: "Aktywne moduły:",
            histPers: "Personalizacja 'Podobnych okazji' (Historia):",
            livePreview: "Podgląd na żywo:",
            defCurrency: "Domyślna waluta:",
            histCount: "Ilość wyników w historii (1-10):",
            stopWords: "Własne 'Stop Words' (oddzielone przecinkiem):",
            hideBtns: "Ukryj przyciski:",
            btnCancel: "Anuluj",
            btnSave: "Zapisz ustawienia",
            optTheme: "Motyw interfejsu (Theme):",
            optLang: "Język (Language):",
            mFakePromo: "Fake Promo",
            mCalc: "Kalkulator",
            mHist: "Historia",
            mMeta: "Sklep i Temp",
            mFall: "Fallback słów kluczowych",
            mAutoAmz: "Podp. wysyłki (Amazon, Allegro, Zalando Lounge)",
            mAutoLoc: "Auto markety",
            mHoldNote: "Auto Notatka (Hold)",
            mTemplates: "Szablony wiad. (Hold)",
            mInfracNote: "Auto Notatka (Kary/Usunięcia)",
            mFloatingBtn: "Latający przycisk (Szybki dopisek)",
            lblFloatingText: "Personalizacja - Latający przycisk. Podaj tekst do doklejenia w tytule:",
            lblFloatingFreeDel: "Włącz też darmową dostawę",
            hStatus: "Status (Aktywna/Wygasła/Skasowana)",
            hPrice: "Cena",
            hTemp: "Temperatura",
            hMerch: "Sklep (Merchant)",
            hCat: "Kategoria",
            hDate: "Data dodania",
            hAuth: "Autor (Bany na czerwono)",
            hCopy: "Przycisk Kopiuj (📋)",
            lblAdded: "Dodano:",
            lblBy: "przez",
            lblIn: "w",
            lblCat: "📁",
            statActive: "✅ AKTYWNA",
            statExpired: "⏳ WYGASŁA",
            statDeleted: "🗑️ SKASOWANA",
            lblFetching: "Pobieranie danych dla:",
            lblFallback: "Szukanie kategorii (fallback)...",
            lblNoResults: "Brak wyników dla tego zapytania.",
            lblHistDisabled: "Historia wyników została wyłączona w ustawieniach.",
            lblSimilar: "Ostatnie podobne na Pepperze:",
            lblCatStats: "Kategorie",
            btnFakePromoMark: "🚩 Oznacz ten produkt jako Fake Promo",
            btnAdding: "⏳ Dodawanie...",
            btnAdded: "✅ Dodano pomyślnie",
            promptFakePromo: "Dodać to Fake Promo?\n\nWzorzec:",
            promptPrice: "Cena alarmowa:",
            alertFakePromo: "⚠️ UWAGA! Prawdopodobieństwo cyklicznej okazji (Fake Promo).",
            lblNotFoundLookingForSimilar: "⚠️ Nie znaleziono identycznych produktów. Kategorie oparte na haśle: ",
            alertStdPrice: "Standardowa cena to ok.",
            alertCurrent: "obecna:",
            alertEntry: "Wpis:",
            alertPattern: "Wzorzec:",
            calcPastePln: "Wklej PLN",
            calcTitleCur: "Tytuł + waluta",
            calcPasted: "✅ Wklejono",
            calcAdded: "✅ Dodano",
            lblStore: "🏪 Sklep:",
            lblTemp: "🌡️ Temp:",
            lblCom: "💬 Kom:"
        },
        en: {
            titleSettings: "⚙️ Jalapeño Settings",
            activeModules: "Active modules:",
            histPers: "'Similar deals' Customization (History):",
            livePreview: "Live preview:",
            defCurrency: "Default currency:",
            histCount: "History results count (1-10):",
            stopWords: "Custom 'Stop Words' (comma separated):",
            hideBtns: "Hide buttons:",
            btnCancel: "Cancel",
            btnSave: "Save settings",
            optTheme: "Interface Theme:",
            optLang: "Language (Język):",
            mFakePromo: "Fake Promo",
            mCalc: "Calculator",
            mHist: "History",
            mMeta: "Store & Temp info",
            mFall: "Keyword fallback",
            mAutoAmz: "Shipping helper (Amazon, Allegro, Zalando Lounge)",
            mAutoLoc: "Auto local stores",
            mHoldNote: "Auto Hold Note",
            mTemplates: "Hold Msg Templates",
            mInfracNote: "Auto Infraction Note",
            mFloatingBtn: "Floating Button (Quick append)",
            lblFloatingText: "Personalization - Floating button. Enter text to append to title:",
            lblFloatingFreeDel: "Also enable Free Delivery",
            hStatus: "Status (Active/Expired/Deleted)",
            hPrice: "Price",
            hTemp: "Temperature",
            hMerch: "Store (Merchant)",
            hCat: "Category",
            hDate: "Date added",
            hAuth: "Author (Bans in red)",
            hCopy: "Copy Button (📋)",
            lblAdded: "Added:",
            lblBy: "by",
            lblIn: "in",
            lblCat: "📁",
            statActive: "✅ ACTIVE",
            statExpired: "⏳ EXPIRED",
            statDeleted: "🗑️ DELETED",
            lblFetching: "Fetching data for:",
            lblFallback: "Searching categories (fallback)...",
            lblNoResults: "No results for this query.",
            lblHistDisabled: "History features are disabled in settings.",
            lblSimilar: "Recent similar deals on Pepper:",
            lblCatStats: "Categories",
            btnFakePromoMark: "🚩 Mark this deal as Fake Promo",
            btnAdding: "⏳ Adding...",
            btnAdded: "✅ Added successfully",
            promptFakePromo: "Add to Fake Promo DB?\n\nPattern:",
            promptPrice: "Alert price:",
            alertFakePromo: "⚠️ WARNING! Likely a cyclic deal (Fake Promo).",
            lblNotFoundLookingForSimilar: "⚠️ No identical products found. Categories based on keyword: ",
            alertStdPrice: "Standard price is approx.",
            alertCurrent: "current:",
            alertEntry: "Entry:",
            alertPattern: "Pattern:",
            calcPastePln: "Paste PLN",
            calcTitleCur: "Title + currency",
            calcPasted: "✅ Pasted",
            calcAdded: "✅ Added",
            lblStore: "🏪 Store:",
            lblTemp: "🌡️ Temp:",
            lblCom: "💬 Com:"
        }
    };

    const t = (key) => i18n[settings.language][key] || key;

    function saveSettings(newSettings) {
        settings = newSettings;
        GM_setValue('jalapenoSettings', settings);
        location.reload();
    }

    function injectThemeCSS() {
        const isDark = settings.theme === 'dark';
        const cssVars = `
            :root {
                --jp-bg: ${isDark ? '#262626' : '#f9f9f9'};
                --jp-border: ${isDark ? '#444' : '#e0e0e0'};
                --jp-text: ${isDark ? '#ddd' : '#333'};
                --jp-text-muted: ${isDark ? '#aaa' : '#777'};
                --jp-btn-bg: ${isDark ? '#333' : '#fff'};
                --jp-btn-border: ${isDark ? '#555' : '#ccc'};
                --jp-btn-hover: ${isDark ? '#444' : '#e6e6e6'};
                --jp-modal-bg: ${isDark ? '#2a2a2a' : '#fff'};
                --jp-modal-overlay: ${isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)'};
                --jp-row-bg: ${isDark ? '#1f2a33' : '#f0f8ff'};
                --jp-row-border: ${isDark ? '#2e4354' : '#b3d4ff'};
                --jp-preview-bg: ${isDark ? '#222' : '#fff'};
                --jp-input-bg: ${isDark ? '#333' : '#fff'};
                --jp-input-text: ${isDark ? '#fff' : '#000'};
                --jp-link: ${isDark ? '#4fc3f7' : '#03a9f4'};
                --jp-fake-btn-bg: ${isDark ? '#e65100' : '#ff9800'};
                --jp-fake-btn-hover: ${isDark ? '#ef6c00' : '#e68a00'};
                --jp-fake-alert-bg: ${isDark ? '#d32f2f' : '#ff4d4d'};
                --jp-temp-hot: ${isDark ? '#ef5350' : '#ff5252'};
                --jp-temp-cold: ${isDark ? '#4fc3f7' : '#03a9f4'};

                --jp-stat-act-bg: ${isDark ? '#1b3320' : '#e8f5e9'};
                --jp-stat-act-co: ${isDark ? '#81c784' : '#2e7d32'};
                --jp-stat-act-bo: ${isDark ? '#2e5c36' : '#a5d6a7'};

                --jp-stat-exp-bg: ${isDark ? '#333' : '#eeeeee'};
                --jp-stat-exp-co: ${isDark ? '#bbb' : '#616161'};
                --jp-stat-exp-bo: ${isDark ? '#555' : '#e0e0e0'};

                --jp-stat-del-bg: ${isDark ? '#4a1c1c' : '#ffebee'};
                --jp-stat-del-co: ${isDark ? '#e57373' : '#c62828'};
                --jp-stat-del-bo: ${isDark ? '#732a2a' : '#ef9a9a'};

                /* Zmienne dla Asystenta Wysyłki */
                --jp-alert-field-bg: ${isDark ? '#423600' : '#fff9c4'};
                --jp-alert-field-co: ${isDark ? '#ffeb3b' : '#333'};

                /* Przyciski szablonów wiadomości */
                --jp-template-btn-bg: ${isDark ? '#1a233a' : '#e3f2fd'};
                --jp-template-btn-hover: ${isDark ? '#23304c' : '#bbdefb'};
                --jp-template-btn-border: ${isDark ? '#2a3b5c' : '#90caf9'};
            }

            .jp-shipping-alert {
                border: 2px dashed #ff5252 !important;
                box-shadow: 0 0 5px rgba(255, 82, 82, 0.3) !important;
                transition: all 0.3s ease;
            }

            .jp-shipping-alert::placeholder {
                ccolor: #ff5252 !important;
                opacity: 0.8 !important;
                font-weight: 500 !important;
            }

            .jp-template-btn {
                background-color: var(--jp-template-btn-bg);
                color: var(--jp-text);
                border: 1px solid var(--jp-template-btn-border);
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 11px;
                cursor: pointer;
                font-weight: 500;
                transition: background-color 0.2s;
                white-space: nowrap;
            }
            .jp-template-btn:hover {
                background-color: var(--jp-template-btn-hover);
            }
            .jp-templates-container {
                display: flex;
                gap: 8px;
                margin-top: 10px;
                flex-wrap: wrap;
            }

            .mod-floating-btn {
                position: absolute;
                top: 50%;
                right: -18px;
                transform: translateY(-50%);
                background-color: var(--jp-btn-bg);
                color: var(--jp-link);
                border: 2px solid var(--jp-border);
                border-radius: 50%;
                width: 36px;
                height: 36px;
                font-size: 16px;
                cursor: pointer;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                z-index: 100;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .mod-floating-btn:hover {
                background-color: var(--jp-link);
                color: white;
                border-color: var(--jp-link);
                transform: translateY(-50%) scale(1.1);
            }
        `;
        GM_addStyle(cssVars);
    }
    injectThemeCSS();

    function openSettings() {
        const modalHtml = `
            <div class="modal-overlay" id="modal-overlay"></div>
            <div id="jalapeno-settings-modal">
                <h3 style="margin-top:0">${t('titleSettings')}</h3>

                <div class="settings-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <label>${t('optTheme')}</label>
                        <select id="set-theme" style="width:100%">
                            <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Light (Jasny)</option>
                            <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Dark (Ciemny)</option>
                        </select>
                    </div>
                    <div>
                        <label>${t('optLang')}</label>
                        <select id="set-lang" style="width:100%">
                            <option value="pl" ${settings.language === 'pl' ? 'selected' : ''}>Polski (PL)</option>
                            <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English (EN)</option>
                        </select>
                    </div>
                </div>
                <hr style="border: 1px solid var(--jp-border); margin: 15px 0;">

                <div class="settings-row">
                    <label>${t('activeModules')}</label>
                    <div style="font-size: 12px; display: flex; gap: 15px; flex-wrap: wrap;">
                        <label style="font-weight:normal"><input type="checkbox" id="set-fakepromo" ${settings.enableFakePromo ? 'checked' : ''}> ${t('mFakePromo')}</label>
                        <label style="font-weight:normal"><input type="checkbox" id="set-calc" ${settings.enableCalculator ? 'checked' : ''}> ${t('mCalc')}</label>
                        <label style="font-weight:normal"><input type="checkbox" id="set-hist" ${settings.enableHistory ? 'checked' : ''}> ${t('mHist')}</label>
                        <label style="font-weight:normal"><input type="checkbox" id="set-meta" ${settings.enableMetaInfo ? 'checked' : ''}> ${t('mMeta')}</label>
                        <label style="font-weight:normal"><input type="checkbox" id="set-fallback" ${settings.enableKeywordFallback ? 'checked' : ''}> ${t('mFall')}</label>
                        <label style="font-weight:normal"><input type="checkbox" id="set-auto-amazon" ${settings.enableAutoAmazonShipping ? 'checked' : ''}> ${t('mAutoAmz')}</label>
                        <label style="font-weight:normal"><input type="checkbox" id="set-auto-local" ${settings.enableAutoLocalStore ? 'checked' : ''}> ${t('mAutoLoc')}</label>
                        <label style="font-weight:normal"><input type="checkbox" id="set-hold-note" ${settings.enableAutoHoldNote ? 'checked' : ''}> ${t('mHoldNote')}</label>
                        <label style="font-weight:normal"><input type="checkbox" id="set-templates" ${settings.enableMessageTemplates ? 'checked' : ''}> ${t('mTemplates')}</label>
                        <label style="font-weight:normal"><input type="checkbox" id="set-floating-btn" ${settings.enableFloatingButton ? 'checked' : ''}> ${t('mFloatingBtn')}</label>
                    </div>
                </div>

                <div class="settings-row" style="display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: end;">
                    <div>
                        <label>${t('lblFloatingText')}</label>
                        <input type="text" id="set-floating-text" value="${settings.customFloatingText}" placeholder="np.  | Smart! Okazja" style="width:100%">
                    </div>
                    <div>
                        <label style="font-weight:normal; display:flex; align-items:center; gap:5px; height: 35px; margin-bottom: 2px;">
                            <input type="checkbox" id="set-floating-freedel" ${settings.floatingButtonAutoFreeDelivery ? 'checked' : ''}> ${t('lblFloatingFreeDel')}
                        </label>
                    </div>
                </div>

                <div class="settings-row settings-row-special">
                    <label>${t('histPers')}</label>
                    <div style="font-size: 11px; display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 10px;">
                        <label><input type="checkbox" class="hist-toggle" id="set-h-status" ${settings.histShowStatus ? 'checked' : ''}> ${t('hStatus')}</label>
                        <label><input type="checkbox" class="hist-toggle" id="set-h-price" ${settings.histShowPrice ? 'checked' : ''}> ${t('hPrice')}</label>
                        <label><input type="checkbox" class="hist-toggle" id="set-h-temp" ${settings.histShowTemp ? 'checked' : ''}> ${t('hTemp')}</label>
                        <label><input type="checkbox" class="hist-toggle" id="set-h-merchant" ${settings.histShowMerchant ? 'checked' : ''}> ${t('hMerch')}</label>
                        <label><input type="checkbox" class="hist-toggle" id="set-h-category" ${settings.histShowCategory ? 'checked' : ''}> ${t('hCat')}</label>
                        <label><input type="checkbox" class="hist-toggle" id="set-h-date" ${settings.histShowDate ? 'checked' : ''}> ${t('hDate')}</label>
                        <label><input type="checkbox" class="hist-toggle" id="set-h-author" ${settings.histShowAuthor ? 'checked' : ''}> ${t('hAuth')}</label>
                        <label><input type="checkbox" class="hist-toggle" id="set-h-copy" ${settings.histShowCopy ? 'checked' : ''}> ${t('hCopy')}</label>
                    </div>
                    <div class="preview-box">
                        <strong>${t('livePreview')}</strong>
                        <ul style="margin: 5px 0 0 15px; padding: 0; list-style: none;">
                            <li id="history-preview-item" style="line-height: 1.6;"></li>
                        </ul>
                    </div>
                </div>

                <div class="settings-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <label>${t('defCurrency')}</label>
                        <select id="set-currency" style="width:100%">
                            <option value="EUR" ${settings.defaultCurrency === 'EUR' ? 'selected' : ''}>EUR</option>
                            <option value="USD" ${settings.defaultCurrency === 'USD' ? 'selected' : ''}>USD</option>
                            <option value="GBP" ${settings.defaultCurrency === 'GBP' ? 'selected' : ''}>GBP</option>
                        </select>
                    </div>
                    <div>
                        <label>${t('histCount')}</label>
                        <input type="number" id="set-history-count" value="${settings.historyCount}" min="1" max="10" style="width:100%">
                    </div>
                </div>

                <div class="settings-row">
                    <label>${t('stopWords')}</label>
                    <textarea id="set-stopwords" placeholder="e.g. fryer, cheap, now">${settings.customStopWords}</textarea>
                </div>

                <div class="settings-row">
                    <label>${t('hideBtns')}</label>
                    <div style="font-size: 11px; display: grid; grid-template-columns: repeat(4, 1fr);">
                        ${['Ceneo', 'Keepa', 'GG.deals', 'PerfumeHub', 'LubimyCzytać', 'UpolujEbooka', 'Promoklocki', 'DekuDeals'].map(btn => `
                            <label style="font-weight:normal">
                                <input type="checkbox" class="hide-btn-check" value="${btn}" ${settings.hiddenButtons.includes(btn) ? 'checked' : ''}> ${btn}
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div class="settings-actions">
                    <button class="btn-cancel" id="btn-close-settings">${t('btnCancel')}</button>
                    <button class="btn-save" id="btn-save-settings">${t('btnSave')}</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const updatePreview = () => {
            let pStatus = document.getElementById('set-h-status').checked ? `<span style="background: var(--jp-stat-exp-bg); color: var(--jp-stat-exp-co); padding: 2px 5px; border-radius: 3px; font-size: 10px; font-weight: bold; margin-right: 5px; border: 1px solid var(--jp-stat-exp-bo);">${t('statExpired')}</span>` : '';
            let pTitle = `<a href="#" onclick="return false;" style="color: var(--jp-link); text-decoration:none; font-weight: 500;">Najlepsze Jalapeño ever...</a>`;
            let pPrice = document.getElementById('set-h-price').checked ? `<b style="margin-left:5px; color:var(--jp-input-text);">2137,00 zł</b>` : '';
            let pTemp = document.getElementById('set-h-temp').checked ? `<span style="color: var(--jp-temp-hot); font-weight:bold; margin-left:5px;">[576°]</span>` : '';
            let pCopy = document.getElementById('set-h-copy').checked ? `<span style="cursor:pointer; font-size:12px; margin-left:8px;">📋</span>` : '';

            let pCat = document.getElementById('set-h-category').checked ? `${t('lblCat')} Elektronika` : '';
            let pDate = document.getElementById('set-h-date').checked ? `${t('lblAdded')} 20.04.2026` : '';
            let pAuthor = document.getElementById('set-h-author').checked ? `${t('lblBy')} <span style="color: #e57373; font-weight: bold;" title="Banned">Xcited</span>` : '';
            let pMerch = document.getElementById('set-h-merchant').checked ? `${t('lblIn')} 🏪 Pepper.pl` : '';

            let metaParts = [pDate, pAuthor, pMerch].filter(Boolean).join(' ');
            let pMeta = (pCat || metaParts) ? `<br><span style="color: var(--jp-text-muted); font-size: 11px; margin-left:5px;">${pCat} ${metaParts ? `(${metaParts.trim()})` : ''}</span>` : '';

            document.getElementById('history-preview-item').innerHTML = `${pStatus}${pTitle}${pPrice}${pTemp}${pCopy}${pMeta}`;
        };

        document.querySelectorAll('.hist-toggle').forEach(el => el.addEventListener('change', updatePreview));
        updatePreview();

        document.getElementById('btn-save-settings').onclick = () => {
            const hidden = Array.from(document.querySelectorAll('.hide-btn-check:checked')).map(el => el.value);
            saveSettings({
                theme: document.getElementById('set-theme').value,
                language: document.getElementById('set-lang').value,
                defaultCurrency: document.getElementById('set-currency').value,
                historyCount: parseInt(document.getElementById('set-history-count').value),
                customStopWords: document.getElementById('set-stopwords').value,
                hiddenButtons: hidden,
                enableFakePromo: document.getElementById('set-fakepromo').checked,
                enableCalculator: document.getElementById('set-calc').checked,
                enableHistory: document.getElementById('set-hist').checked,
                enableMetaInfo: document.getElementById('set-meta').checked,
                enableKeywordFallback: document.getElementById('set-fallback').checked,
                enableAutoAmazonShipping: document.getElementById('set-auto-amazon').checked,
                enableAutoLocalStore: document.getElementById('set-auto-local').checked,
                histShowStatus: document.getElementById('set-h-status').checked,
                histShowPrice: document.getElementById('set-h-price').checked,
                histShowTemp: document.getElementById('set-h-temp').checked,
                histShowCopy: document.getElementById('set-h-copy').checked,
                histShowCategory: document.getElementById('set-h-category').checked,
                histShowDate: document.getElementById('set-h-date').checked,
                histShowAuthor: document.getElementById('set-h-author').checked,
                histShowMerchant: document.getElementById('set-h-merchant').checked,
                enableAutoHoldNote: document.getElementById('set-hold-note').checked,
                enableMessageTemplates: document.getElementById('set-templates').checked,
                enableFloatingButton: document.getElementById('set-floating-btn').checked,
                customFloatingText: document.getElementById('set-floating-text').value,
                floatingButtonAutoFreeDelivery: document.getElementById('set-floating-freedel').checked
                //enableAutoInfractionNote: document.getElementById('set-infrac-note').checked
            });
        };

        document.getElementById('btn-close-settings').onclick = () => {
            document.getElementById('modal-overlay').remove();
            document.getElementById('jalapeno-settings-modal').remove();
        };
    }

    GM_addStyle(`
        .fake-promo-alert {
            background-color: var(--jp-fake-alert-bg); color: white; padding: 15px; text-align: center;
            font-size: 18px; font-weight: bold; border-radius: 5px; margin-bottom: 15px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3); z-index: 9999;
        }
        .mod-tools-container {
            margin: 10px 0; background: var(--jp-bg); padding: 15px; border-radius: 6px; border: 1px solid var(--jp-border);
            display: flex; justify-content: space-between; gap: 20px; align-items: stretch; color: var(--jp-text);
        }
        .fake-promo-btn {
            background-color: var(--jp-fake-btn-bg); color: white; border: none; padding: 6px 12px;
            cursor: pointer; font-size: 12px; border-radius: 4px; font-weight: bold;
        }
        .fake-promo-btn:hover { background-color: var(--jp-fake-btn-hover); }
        .mod-left-col { display: flex; flex-direction: column; gap: 10px; flex-shrink: 0; width: 280px; }
        .mod-right-col { flex-grow: 1; border-left: 1px dashed var(--jp-border); padding-left: 20px; }
        .mod-links-wrapper { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        .mod-quick-btn {
            background-color: var(--jp-btn-bg); color: var(--jp-text); border: 1px solid var(--jp-btn-border); padding: 6px;
            cursor: pointer; font-size: 11px; border-radius: 3px; text-decoration: none; text-align: center; font-weight: bold;
        }
        .mod-quick-btn:last-child:nth-child(odd) { grid-column: span 2; }
        .mod-quick-btn:hover { background-color: var(--jp-btn-hover); }
        .pepper-history-box { margin-top: 10px; padding-top: 8px; border-top: 1px dashed var(--jp-border); font-size: 12px; }
        .pepper-history-box ul { margin: 5px 0 0 15px; padding: 0; }
        .pepper-history-box li { margin-bottom: 4px; }
        .temp-hot { color: var(--jp-temp-hot); font-weight:bold; }
        .temp-cold { color: var(--jp-temp-cold); font-weight:bold; }
        .mod-conv-btn-v2 {
            background-color: var(--jp-btn-bg); color: var(--jp-text); border: 1px solid var(--jp-btn-border); padding: 3px 6px;
            cursor: pointer; font-size: 11px; border-radius: 4px; font-weight: bold; transition: 0.2s; white-space: nowrap; width: 100%; text-align: center;
        }
        .mod-conv-btn-v2:hover { background-color: var(--jp-btn-hover); }
        .mod-settings-btn { background: none; border: none; cursor: pointer; font-size: 18px; padding: 5px; line-height: 1; transition: transform 0.2s; }
        .mod-settings-btn:hover { transform: rotate(45deg); }
        #jalapeno-settings-modal {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); box-sizing: border-box;
            background: var(--jp-modal-bg); border-radius: 8px; box-shadow: 0 0 20px rgba(0,0,0,0.8);
            z-index: 10000; width: 1000px; padding: 20px; font-family: sans-serif; color: var(--jp-text);
        }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--jp-modal-overlay); z-index: 9999; }
        .settings-row { margin-bottom: 15px; display: flex; flex-direction: column; gap: 5px; }
        .settings-row-special { background: var(--jp-row-bg); padding: 10px; border-radius: 5px; border: 1px solid var(--jp-row-border); }
        .preview-box { background: var(--jp-preview-bg); padding: 8px; border-radius: 4px; border: 1px solid var(--jp-border); font-size: 12px; }
        .settings-row label { font-weight: bold; font-size: 13px; color: var(--jp-text); }
        .settings-row input[type="text"], .settings-row input[type="number"], .settings-row select, .settings-row textarea {
            padding: 8px; border: 1px solid var(--jp-border); border-radius: 4px; background: var(--jp-input-bg); color: var(--jp-input-text); box-sizing: border-box;
        }
        .settings-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
        .btn-save { background: #2e7d32; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight:bold;}
        .btn-cancel { background: #777; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; color: white; font-weight:bold;}
    `);

    function fetchExchangeRates(callback) {
        if (exchangeRates) return callback(exchangeRates);

        let cachedRates = sessionStorage.getItem('pepperExchangeRates');
        if (cachedRates) {
            exchangeRates = JSON.parse(cachedRates);
            return callback(exchangeRates);
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://open.er-api.com/v6/latest/PLN",
            onload: function(res) {
                try {
                    exchangeRates = JSON.parse(res.responseText).rates;
                    sessionStorage.setItem('pepperExchangeRates', JSON.stringify(exchangeRates));
                    callback(exchangeRates);
                } catch(e) {}
            }
        });
    }

    function getCorePattern(url) {
        if (!url) return "";
        let u = decodeURIComponent(url).toLowerCase().trim();
        u = u.replace(/^https?:\/\//, '').replace(/^(www\.|m\.|mobile\.)/, '');
        return u.split('?')[0].replace(/\/$/, '');
    }

    function generateSmartQuery(title) {
        let clean = title.replace(/\[.*?\]|\(.*?\)|\{.*?\}/g, ' ');
        let custom = settings.customStopWords.split(',').map(s => s.trim()).filter(s => s.length > 0);
        const stopWords = [
            ...custom, 'okazja', 'promocja', 'kod', 'rabat', 'zł', 'pln', 'darmowa', 'dostawa', 'błąd', 'cenowy', 'taniej', 'w', 'na', 'do', 'z', 'od', 'tylko', 'wyprzedaż', 'outlet', 'tani', 'tania', 'możliwe', 'nawet', 'monetami', 'newsletter',
            'szt', 'sztuki', 'sztuk', 'sztuka', 'opakowanie', 'aplikacji', 'aplikacja', 'sklep', 'sklepie', 'ceneo', 'allegro', 'amazon', 'aliexpress', 'gen', 'generacja', 'generacji',
            'telewizor', 'tv', 'smartfon', 'telefon', 'laptop', 'komputer', 'pc', 'monitor', 'myszka', 'mysz', 'klawiatura', 'słuchawki', 'głośnik', 'soundbar', 'zegarek', 'smartwatch', 'konsola', 'gra', 'pad', 'kontroler', 'dysk', 'karta', 'pamięć',
            'odkurzacz', 'pralka', 'lodówka', 'zmywarka', 'piekarnik', 'mikrofala', 'ekspres', 'blender', 'robot', 'sprzątający', 'mop',
            'buty', 'sneakersy', 'trampki', 'kurtka', 'bluza', 'spodnie', 'koszulka', 't-shirt', 'rower', 'hulajnoga', 'kask',
            'wiertarka', 'wkrętarka', 'szlifierka', 'zestaw', 'klucze', 'opony', 'olej',
            'płyn', 'prania', 'tabletki', 'zmywarki',
            'woda', 'toaletowa', 'perfumowana', 'edp', 'edt', 'ml', 'flakon',
            'steam', 'epic', 'gog', 'edycja', 'edition', 'pc', 'ps4', 'ps5', 'xbox', 'nintendo', 'switch',
            'książka', 'ksiazka', 'tom', 'wydanie', 'oprawa', 'twarda', 'miękka', 'miekka', 'ebook', 'audiobook', 'czytnik', 'kindle',
            'klocki', 'figurka', 'polybag', 'sztuk', 'elementów', 'elektryczna', 'elektryczne'
        ];
        let regex = new RegExp('\\b(' + stopWords.join('|') + ')\\b', 'gi');
        clean = clean.replace(regex, ' ');
        let words = clean.trim().split(/\s+/).filter(w => w.length > 1);
        let query = words.slice(0, 4).join(' ');
        return query;
    }

    function getFallbackWord(title) {
        let custom = settings.customStopWords.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
        const categories = [
            ...custom,
            'telewizor', 'tv', 'smartfon', 'telefon', 'laptop', 'komputer', 'monitor', 'myszka', 'mysz', 'klawiatura', 'słuchawki', 'głośnik', 'soundbar', 'zegarek', 'smartwatch', 'konsola', 'gra', 'pad', 'kontroler', 'dysk', 'karta', 'pamięć',
            'odkurzacz', 'pralka', 'lodówka', 'zmywarka', 'piekarnik', 'mikrofala', 'ekspres', 'blender', 'robot', 'mop', 'frytkownica',
            'buty', 'sneakersy', 'trampki', 'kurtka', 'bluza', 'spodnie', 'koszulka', 't-shirt', 'rower', 'hulajnoga', 'kask',
            'wiertarka', 'wkrętarka', 'szlifierka', 'opony', 'olej',
            'perfumy', 'woda', 'książka', 'ebook', 'audiobook', 'czytnik', 'kindle',
            'klocki', 'figurka', 'karma'
        ];

        let lowerTitle = title.toLowerCase();
        for (let word of categories) {
            if (new RegExp('\\b' + word + '\\b').test(lowerTitle)) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
        }
        let firstWord = title.split(' ').find(w => w.length > 2);
        return firstWord || null;
    }

    function getCurrentPrice() {
        let priceInput = document.querySelector('input[placeholder="Price"]');
        if (!priceInput || !priceInput.value) return null;
        return parseFloat(priceInput.value.replace(/[^\d,.-]/g, '').replace(',', '.'));
    }

    function getCurrentTitle() {
        let titleInput = document.querySelector('input[placeholder="Thread title"]');
        return (titleInput && titleInput.value) ? titleInput.value.trim() : "";
    }

    function loadDatabase(callback) {
        let cachedDB = sessionStorage.getItem('pepperFakePromoDB');
        if (cachedDB) {
            fakePromoDB = JSON.parse(cachedDB);
            if(callback) callback();
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: API_URL,
            onload: function(response) {
                if (response.status === 200) {
                    fakePromoDB = JSON.parse(response.responseText);
                    sessionStorage.setItem('pepperFakePromoDB', response.responseText);
                    if (callback) callback();
                }
            }
        });
    }

    function addToDatabase(pattern, price, note, btnElement) {
        btnElement.innerText = t('btnAdding');
        btnElement.disabled = true;

        GM_xmlhttpRequest({
            method: "POST",
            url: API_URL,
            data: JSON.stringify({ url: pattern, price: price, note: note }),
            headers: { "Content-Type": "application/json" },
            onload: function() {
                btnElement.innerText = t('btnAdded');
            }
        });
    }

    function showWarning(note, dbPrice, currentPrice, matchedBy) {
        let container = document.querySelector('.v-card.rounded-medium.border-grey--dark') || document.body;
        if(document.querySelector('.fake-promo-alert')) return;

        let alertBox = document.createElement('div');
        alertBox.className = 'fake-promo-alert';
        alertBox.innerHTML = `⚠️ ${t('alertFakePromo')}<br>
                              <strong>${t('alertStdPrice')} ${dbPrice} zł </strong> (${t('alertCurrent')} ${currentPrice} zł)<br>
                              <strong>${t('alertEntry')}</strong> ${note} <br>
                              <span style="font-size: 11px; opacity: 0.8;">${t('alertPattern')} ${matchedBy}</span>`;
        container.prepend(alertBox);
    }

    function checkFakePromoWarning() {
        let urlTextarea = document.querySelector('textarea[name="mainUrl"]');
        let currentTitle = getCurrentTitle();

        if (!urlTextarea || !urlTextarea.value.trim() || !currentTitle) return;
        if (Object.keys(fakePromoDB).length === 0) return;

        let rawLink = urlTextarea.value;
        let currentCore = getCorePattern(rawLink);
        let currentPrice = getCurrentPrice();
        let currentTitleLower = currentTitle.toLowerCase();

        let matchedEntry = null;
        let matchedPatternName = "";

        for (let savedPattern in fakePromoDB) {
            let dbCore = getCorePattern(savedPattern);
            let rawDbPatternLower = savedPattern.toLowerCase().trim();
            let currentIsJustDomain = !currentCore.includes('/');
            let isMatch = false;

            if (currentCore === dbCore) {
                isMatch = true;
            }
            else if (!currentIsJustDomain && dbCore !== "") {
                if (currentCore.includes('/') && dbCore.includes('/')) {
                    if (currentCore.includes(dbCore) || dbCore.includes(currentCore)) {
                        isMatch = true;
                    }
                }
            }

            if (isMatch || currentTitleLower.includes(rawDbPatternLower)) {
                matchedEntry = fakePromoDB[savedPattern];
                matchedPatternName = savedPattern;
                break;
            }
        }
        if (matchedEntry) {
            let dbPrice = typeof matchedEntry === 'object' && matchedEntry.price !== undefined ? matchedEntry.price : 0;
            let dbNote = typeof matchedEntry === 'object' && matchedEntry.note !== undefined ? matchedEntry.note : String(matchedEntry);

            if (currentPrice === null || currentPrice >= dbPrice || dbPrice === 0) {
                showWarning(dbNote, dbPrice, currentPrice || "???", matchedPatternName);
            }
        }
    }

    function fetchPepperHistory(query, containerNode, isFallback = false, originalTitle = "") {
        let encodedQuery = encodeURIComponent(query);
        containerNode.innerHTML = `<span style="color:var(--jp-text-muted);">🔄 ${isFallback ? t('lblFallback') : t('lblFetching') + ' <b>' + query + '</b>...'}</span>`;

        let urlTextarea = document.querySelector('textarea[name="mainUrl"]');
        let currentMainUrl = urlTextarea ? urlTextarea.value.trim() : "";

        let getMerchantFromForm = () => {
            let merchantInput = document.querySelector('input[placeholder="Merchant name"], input[placeholder="No merchant"]');
            if (merchantInput && merchantInput.value && merchantInput.value.trim() !== "") {
                return merchantInput.value.trim();
            }
            if (currentMainUrl) {
                try {
                    return new URL(currentMainUrl).hostname.replace(/^www\./, '');
                } catch(e) {}
            }
            return '---';
        };

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://www.pepper.pl/search?q=${encodedQuery}`,
            onload: function(res) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(res.responseText, "text/html");

                let deals = doc.querySelectorAll('article.thread, div.thread');
                let queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
                let validDeals = [];
                let currentTitleLower = getCurrentTitle().toLowerCase();
                let currentThreadIdMatch = window.location.href.match(/(?:-|\/deals\/edit\/)(\d+)(?:\/|$|\?)/);
                let currentThreadId = currentThreadIdMatch ? parseInt(currentThreadIdMatch[1]) : null;

                let fallbackMerchant = getMerchantFromForm();
                let metaInfoHtml = settings.enableMetaInfo ? `<span style="margin-right: 15px; border-right: 1px solid var(--jp-border); padding-right: 15px;">${t('lblStore')} <b style="color:var(--jp-input-text);">${fallbackMerchant}</b> | ${t('lblTemp')} <span style="color:var(--jp-text-muted)">---°</span></span>` : "";

                let currentDealFound = false;

                deals.forEach(deal => {
                    let vueDataEl = deal.querySelector('[data-vue3]');
                    if (!vueDataEl) return;
                    try {
                        let vueJson = JSON.parse(vueDataEl.getAttribute('data-vue3'));
                        let threadInfo = vueJson.props.thread;
                        if (!threadInfo) return;

                        let isCurrentDealMatch = false;
                        if (currentThreadId && threadInfo.threadId === currentThreadId) {
                            isCurrentDealMatch = true;
                        } else if (currentMainUrl && threadInfo.link && threadInfo.link === currentMainUrl) {
                            isCurrentDealMatch = true;
                        } else if (threadInfo.title.toLowerCase() === currentTitleLower) {
                            isCurrentDealMatch = true;
                        }

                        if (isCurrentDealMatch && !currentDealFound) {
                            currentDealFound = true;
                            if (settings.enableMetaInfo) {
                                let fallbackDomain = '---';
                                try {
                                    if (currentMainUrl) {
                                        fallbackDomain = new URL(currentMainUrl).hostname.replace(/^www\./, '');
                                    } else if (threadInfo.linkHost) {
                                        fallbackDomain = threadInfo.linkHost.replace(/^www\./, '');
                                    }
                                } catch(e) {}

                                let m = (threadInfo.merchant && threadInfo.merchant.merchantName) ? threadInfo.merchant.merchantName : fallbackDomain;
                                let temp = threadInfo.temperature !== null ? Math.round(threadInfo.temperature) : '---';

                                let pubDateStr = "---";
                                if (threadInfo.publishedAt) {
                                    let d = new Date(threadInfo.publishedAt * 1000);
                                    let day = String(d.getDate()).padStart(2, '0');
                                    let month = String(d.getMonth() + 1).padStart(2, '0');
                                    let year = d.getFullYear();
                                    let hours = String(d.getHours()).padStart(2, '0');
                                    let minutes = String(d.getMinutes()).padStart(2, '0');
                                    pubDateStr = `${day}.${month}.${year}, ${hours}:${minutes}`;
                                }
                                let comments = threadInfo.commentCount !== undefined ? threadInfo.commentCount : 0;

                                metaInfoHtml = `<span style="margin-right: 15px; border-right: 1px solid var(--jp-border); padding-right: 15px; color:var(--jp-text-muted);">
                                                    ${t('lblStore')} <b style="color:var(--jp-input-text);">${m}</b> |
                                                    ${t('lblTemp')} <b style="color:var(--jp-input-text);">${temp}°</b> |
                                                    🕒 ${t('lblAdded')} <b style="color:var(--jp-input-text);">${pubDateStr}</b> |
                                                    ${t('lblCom')} <b style="color:var(--jp-input-text);">${comments}</b>
                                                </span>`;
                            }
                            return;
                        }

                        let titleLower = threadInfo.title.toLowerCase();
                        let isMatch = queryWords.length === 0 || queryWords.some(word => titleLower.includes(word));

                        if (isMatch || isFallback) {
                            validDeals.push(threadInfo);
                        }
                    } catch(e) {}
                });

                if (validDeals.length === 0 && settings.enableKeywordFallback && !isFallback) {
                    let fallbackQuery = "";
                    if (originalTitle) fallbackQuery = getFallbackWord(originalTitle);

                    if (!fallbackQuery) {
                        let words = query.split(' ').filter(w => w.length > 2);
                        if (words.length > 0) fallbackQuery = words[0];
                    }

                    if (fallbackQuery) {
                        fetchPepperHistory(fallbackQuery, containerNode, true, originalTitle);
                        return;
                    }
                }

                let categoryCount = {};
                let totalCategorized = 0;

                validDeals.forEach(threadInfo => {
                    if (threadInfo.mainGroup && threadInfo.mainGroup.threadGroupName) {
                        let cat = threadInfo.mainGroup.threadGroupName;
                        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
                        totalCategorized++;
                    }
                });

                let statsHtml = "";
                let catHtml = "";

                if (totalCategorized > 0) {
                    let statsArray = [];
                    for (let cat in categoryCount) {
                        let percent = Math.round((categoryCount[cat] / totalCategorized) * 100);
                        statsArray.push({ cat: cat, percent: percent });
                    }
                    statsArray.sort((a, b) => b.percent - a.percent);
                    let formattedStats = statsArray.map(item => `<b style="color:var(--jp-input-text);">${item.percent}%</b> ${item.cat}`).join(' | ');

                    catHtml = `<span title="Analyzed ${totalCategorized} items" style="color:var(--jp-text-muted);">📊 <b style="color:var(--jp-input-text);">${t('lblCatStats')} ${isFallback ? '(fallback)' : ''}:</b> ${formattedStats}</span>`;
                }

                if (metaInfoHtml !== "" || catHtml !== "") {
                    statsHtml = `<div style="margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dotted var(--jp-border); font-size: 11px; display: flex; align-items: center;">
                                    ${metaInfoHtml}
                                    ${catHtml}
                                 </div>`;
                }

                let html = statsHtml;

                if (settings.enableHistory && !isFallback) {
                    html += `<strong>${t('lblSimilar')}</strong><ul style="margin: 5px 0 0 15px; padding: 0;">`;
                    let count = 0;

                    validDeals.forEach(threadInfo => {
                        if(count >= settings.historyCount) return;

                        let tThread = threadInfo.title;
                        let link = threadInfo.url;
                        let mName = (threadInfo.merchant && threadInfo.merchant.merchantName) ? threadInfo.merchant.merchantName : null;

                        let p = (threadInfo.price !== null && threadInfo.price !== undefined && threadInfo.price > 0)
                                ? threadInfo.price.toFixed(2).replace('.', ',') + ' zł' : '---';

                        let tempNum = threadInfo.temperature !== null ? threadInfo.temperature : 0;
                        let temp = Math.round(tempNum) + '°';
                        let tempClass = tempNum < 0 ? 'temp-cold' : 'temp-hot';

                        let isBanned = false;
                        if (threadInfo.user) {
                            if (threadInfo.user.isBanned || threadInfo.user.isDeleted || threadInfo.user.status === 'deleted' || threadInfo.user.status === 'banned') isBanned = true;
                        }
                        let authorName = threadInfo.user && threadInfo.user.username ? threadInfo.user.username : '---';
                        let authorHtml = isBanned ? `<span style="color: #e57373; font-weight: bold;">${authorName}</span>` : authorName;
                        let category = threadInfo.mainGroup && threadInfo.mainGroup.threadGroupName ? threadInfo.mainGroup.threadGroupName : 'Inne';

                        let dateStr = "";
                        if (threadInfo.publishedAt) {
                            let d = new Date(threadInfo.publishedAt * 1000);
                            let day = String(d.getDate()).padStart(2, '0');
                            let month = String(d.getMonth() + 1).padStart(2, '0');
                            let year = d.getFullYear();
                            dateStr = `${day}.${month}.${year}`;
                        }

                        let statusBadge = "";
                        if (threadInfo.deletedAt !== null || threadInfo.status === 'Deleted') {
                            statusBadge = `<span style="background: var(--jp-stat-del-bg); color: var(--jp-stat-del-co); padding: 2px 5px; border-radius: 3px; font-size: 10px; font-weight: bold; margin-right: 5px; border: 1px solid var(--jp-stat-del-bo);">${t('statDeleted')}</span>`;
                        } else if (threadInfo.isExpired === true) {
                            statusBadge = `<span style="background: var(--jp-stat-exp-bg); color: var(--jp-stat-exp-co); padding: 2px 5px; border-radius: 3px; font-size: 10px; font-weight: bold; margin-right: 5px; border: 1px solid var(--jp-stat-exp-bo);">${t('statExpired')}</span>`;
                        } else {
                            statusBadge = `<span style="background: var(--jp-stat-act-bg); color: var(--jp-stat-act-co); padding: 2px 5px; border-radius: 3px; font-size: 10px; font-weight: bold; margin-right: 5px; border: 1px solid var(--jp-stat-act-bo);">${t('statActive')}</span>`;
                        }

                        let sStatus = settings.histShowStatus ? statusBadge : '';
                        let sPrice = settings.histShowPrice ? `<b style="margin-left:5px; color:var(--jp-input-text);">${p}</b>` : '';
                        let sTemp = settings.histShowTemp ? `<span class="${tempClass}" style="margin-left:5px;">[${temp}]</span>` : '';
                        let sCopy = settings.histShowCopy ? `<span style="cursor:pointer; font-size:12px; margin-left:8px;" onclick="navigator.clipboard.writeText('${link}'); this.innerText='✔️'; setTimeout(()=>this.innerText='📋', 1500);">📋</span>` : '';

                        let sCat = settings.histShowCategory ? `${t('lblCat')} ${category}` : '';
                        let sDate = settings.histShowDate ? `${t('lblAdded')} ${dateStr}` : '';
                        let sAuth = settings.histShowAuthor ? `${t('lblBy')} ${authorHtml}` : '';
                        let sMerch = (settings.histShowMerchant && mName) ? `${t('lblIn')} 🏪 <b style="color:var(--jp-input-text);">${mName}</b>` : '';

                        let metaParts = [sDate, sAuth, sMerch].filter(Boolean).join(' ');
                        let metaRow = (sCat || metaParts) ? `<br><span style="color: var(--jp-text-muted); font-size: 11px; margin-left:5px;">${sCat} ${metaParts ? `(${metaParts.trim()})` : ''}</span>` : '';

                        html += `<li style="margin-bottom: 6px; line-height: 1.6;">
                                    ${sStatus}
                                    <a href="${link}" target="_blank" style="color: var(--jp-link); text-decoration:none; font-weight: 500;">${tThread}</a>
                                    ${sPrice}
                                    ${sTemp}
                                    ${sCopy}
                                    ${metaRow}
                                 </li>`;
                        count++;
                    });

                    if(validDeals.length === 0) html += `<li style="color: var(--jp-text-muted); margin-top: 5px;">${t('lblNoResults')}</li>`;
                    html += `</ul>`;
                } else if (isFallback) {
                     html += `<div style="color:var(--jp-text-muted); font-size:11px; margin-top: 5px;">${t('lblNotFoundLookingForSimilar')} <b style="color:var(--jp-input-text);">${query}</b></div>`;
                } else {
                    html += `<div style="color:var(--jp-text-muted); font-size:11px; margin-top: 5px;">${t('lblHistDisabled')}</div>`;
                }
                containerNode.innerHTML = html;
            }
        });
    }

    function checkMessageTemplates() {
        if (!settings.enableMessageTemplates) return;

        let userMsgTa = document.querySelector('textarea[placeholder="Message for the user"]');
        if (!userMsgTa) return;

        if (document.getElementById('jp-hold-templates-wrapper')) return;

        let parentContainer = userMsgTa.closest('.v-input') || userMsgTa.parentElement;

        // Szablony - tytuł przycisku (label) oraz treść (text), która wpadnie po dwukropku
        const templates = [
            { label: "Termin", text: "podaj proszę w tytule / opisie okazji termin przydatności do spożycia produktu, którego dotyczy okazja." },
            { label: "Cena", text: "jak uzyskać taką cenę? Jakiego kodu należy użyć / jaki produkt należy dobrać w celu uzyskania podanej ceny?" },
            { label: "Monety", text: "cena podana w okazji musi być ceną możliwą do uzyskania bez wykorzystania monet. Popraw to proszę dodając prawidłową cenę w tytule / opisie okazji (cena w obcej walucie) oraz polu cena (cena w PLN)." },
            { label: "Waluta", text: "dodaj proszę cenę w EURO / USD / GBP w tytule i/lub opisie okazji." },
            { label: "Dostępność", text: "podaj proszę w opisie / tytule okazji ilość produktów dostępnych w promocji." },
            { label: "Link nie działa", text: "link nie działa / nie prowadzi bezpośrednio do produktu. Popraw proszę link w swojej okazji." },
            { label: "Kod nie działa", text: "kod rabatowy podany w publikacji nie działa. Być może wygasł, zużyto pulę dostępnych kodów lub produkt nie spełnia wymagań. Podaj proszę alternatywny kod / powiedz co zrobić, aby kod zadziałał." },
            { label: "Kod - źródło", text: "podaj proszę źródło kodu wraz z jego potwierdzeniem (np. link do strony informującej o kodzie, screenshot maila / wiadomości SMS etc.)."},
        ];

        let templatesWrapper = document.createElement('div');
        templatesWrapper.id = 'jp-hold-templates-wrapper';
        templatesWrapper.className = 'jp-templates-container';

        const insertTextToVue = (element, newText) => {
            element.focus();
            let valueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
            valueSetter.call(element, newText);
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));

            element.blur();
            element.focus();
        };

        templates.forEach(tpl => {
            let btn = document.createElement('button');
            btn.className = 'jp-template-btn';
            btn.innerText = tpl.label;

            btn.onclick = (e) => {
                e.preventDefault();
                let currentText = userMsgTa.value;

                let anchor = "następujące informacje:";
                let tailAnchor = "Nie możemy się doczekać";

                let newToInsert = "- " + tpl.text;
                let newText = currentText;

                if (currentText.includes(anchor) && currentText.includes(tailAnchor)) {
                    let parts = currentText.split(anchor);
                    let beforeText = parts[0] + anchor;
                    let afterText = parts[1];

                    let tailIndex = afterText.indexOf(tailAnchor);
                    let tailText = afterText.substring(tailIndex);

                    newText = beforeText + "\n\n" + newToInsert + "\n\n" + tailText;
                } else {
                    let lastInserted = userMsgTa.dataset.jpLastInsertedTemplate;
                    if (lastInserted && currentText.includes(lastInserted)) {
                        newText = currentText.replace(lastInserted, newToInsert);
                    } else {
                        newText = currentText + (currentText.endsWith("\n") ? "" : "\n") + newToInsert;
                    }
                }

                userMsgTa.dataset.jpLastInsertedTemplate = newToInsert;
                insertTextToVue(userMsgTa, newText);
            };

            templatesWrapper.appendChild(btn);
        });

        if (parentContainer.nextSibling) {
            parentContainer.parentNode.insertBefore(templatesWrapper, parentContainer.nextSibling);
        } else {
            parentContainer.parentNode.appendChild(templatesWrapper);
        }
    }

    function checkHoldNoteAutomator() {
        if (!settings.enableAutoHoldNote) return;

        let userMsgTa = document.querySelector('textarea[placeholder="Message for the user"]');
        let modNoteTa = document.querySelector('textarea[aria-label="Note for moderators"]');

        if (!userMsgTa || !modNoteTa) return;

        let text = userMsgTa.value;
        if (!text) return;

        let extractedNote = "";

        if (text.includes("musimy potwierdzić rabat")) {
            extractedNote = "Potwierdzenie";
        } else if (text.includes("Gdzie go widziałeś lub podać link do źródła")) {
            extractedNote = "Źródło";
        } else if (text.includes("potrzebujemy przykładów okazyjnych produktów")) {
            extractedNote = "Przykłady";
        } else if (text.includes("lokalizację sklepu")) {
            extractedNote = "Lokalizacja";
        } else if (text.includes("specyfikacje pojazdu")) {
            extractedNote = "Pojazdy";
        }
        else if (text.includes("następujące informacje:")) {
            let parts = text.split("następujące informacje:");
            if (parts.length > 1) {
                let customText = parts[1].split("Nie możemy się doczekać")[0];
                customText = customText.split("Możesz dodać informacje")[0];
                customText = customText.split("Uzupełnij okazję samodzielnie")[0];
                customText = customText.trim();

                if (customText.length > 0) {
                    extractedNote = customText.length > 270 ? customText.substring(0, 270) + "..." : customText;
                }
            }
        }

        if (extractedNote && modNoteTa.dataset.jpLastAutoNote !== extractedNote) {

            let setNativeValue = (element, value) => {
                let valueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                valueSetter.call(element, value);
                element.dispatchEvent(new Event('input', { bubbles: true }));
            };

            if (modNoteTa.value === "" || modNoteTa.value === (modNoteTa.dataset.jpLastAutoNote || "")) {
                setNativeValue(modNoteTa, extractedNote);
                modNoteTa.dataset.jpLastAutoNote = extractedNote;
            }
        }
    }

/*
    function getCleanNoteFromReason(reason) {
        if (!reason) return "";
        let r = reason.toLowerCase();

        if (r.includes("potraktowane jako spam")) return "Spam";
        if (r.includes("potraktowane jako autopromocja")) return "Autopromocja";
        if (r.includes("potraktowane jako obraźliwe zachowanie")) return "Obraźliwe zachowanie";
        if (r.includes("zdublowałeś istniejącą okazję")) return "Dubel";
        if (r.includes("zawiera niekompletne informacje")) return "Uzupełnienie informacji";
        if (r.includes("oferty polecające/reflinki")) return "Oferty polecające / reflinki";
        if (r.includes("treści powiązane z polityką")) return "Polityka";
        if (r.includes("wyłącznie z Twoim kontem")) return "Decyzje moderacji";
        if (r.includes("propozycję sprzedaży"))return "Sprzedaż / Wspólne zakupy / Wymiany / Rodzinka";
        if (r.includes("Dotyczy to punktów mówiących")) return "Naruszenie regulaminu";
        if (r.includes("niestandardowy")) return "Niestandardowe naruszenie:";
*/
//      let cleaned = reason.replace(/^(Okazja|Komentarz)\s*[-–]\s*/i, '').trim();
/*
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }

    function checkInfractionNoteAutomator() {
        if (!settings.enableInfractionNote) return;

        let reasonText = "";
        let noteInput = null;
        let messageText = ""

        if (window.location.href.includes('/inspector/')) {
            let angularSelect = document.querySelector('select#type, select[name="type"]');
            if (angularSelect && angularSelect.selectedIndex > 0) {
                reasonText = angularSelect.options[angularSelect.selectedIndex].textContent.trim();
            }
            noteInput = document.querySelector('textarea#notes, textarea[name="notes"]');

            let textareas = Array.from(document.querySelectorAll('textarea'));
            let msgTa = textareas.find(t => t.value.includes("Poprzez tę wiadomość"));
            if (msgTa) messageText = msgTa.value;
        }
        else {
            let activeModal = document.querySelector('.v-dialog--active') || document.querySelector('[role="dialog"]');
            if (activeModal) {
                let vuetifySelect = activeModal.querySelector('.v-select__selection');
                if (vuetifySelect) reasonText = vuetifySelect.textContent.trim();

                noteInput = document.querySelector('input[placeholder="Leave a note for moderators"]');
                let msgTa = activeModal.querySelector('textarea[aria-label="Message for the user"]');
                if (msgTa) messageText = msgTa.value;
            }
        }

        if (reasonText && noteInput) {
            let cleanNote = getCleanNoteFromReason(reasonText);

            if (cleanNote === "Niestandardowe naruszenie" && messageText) {
                let urlAnchor = "code-of-conduct";
                let botAnchor = "Poprzez tę wiadomość";

                if (messageText.includes(urlAnchor) && messageText.includes(botAnchor)) {
                    let extracted = messageText.split(urlAnchor)[1].split(botAnchor)[0].trim();
*/
//                    extracted = extracted.replace(/\*\*\*Niestandardowy opis\*\*\*/g, '').trim();
/*
                    if (extracted.length > 0) {
                        cleanNote = extracted.length > 150 ? extracted.substring(0, 150) + "..." : extracted;
                    }
                }
            }

            if (cleanNote && noteInput.dataset.jpLastReason !== cleanNote) {

                let setNativeValue = (element, value) => {
                    let proto = Object.getPrototypeOf(element);
                    let valueSetter = Object.getOwnPropertyDescriptor(proto, 'value').set;
                    valueSetter.call(element, value);
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                };

                if (noteInput.value === "" || noteInput.value === (noteInput.dataset.jpLastReason || "")) {
                    setNativeValue(noteInput, cleanNote);
                    noteInput.dataset.jpLastReason = cleanNote;
                }
            }
        }
    }
*/

    function checkInfractionModal() {
        if (window.location.href.includes('/inspector/')) return;

        let ta = document.querySelector('textarea[aria-label="Message for the user"]');
        if (!ta) return;

        let val = ta.value;
        let modal = ta.closest('.v-dialog') || ta.closest('[role="dialog"]') || document.body;

        let warningCheckbox = modal.querySelector('input[aria-label="Warning only"]');
        let pointsInput = modal.querySelector('input[type="number"]');

        let isWarning = warningCheckbox ? (warningCheckbox.checked || warningCheckbox.getAttribute('aria-checked') === 'true') : false;
        let points = pointsInput ? (parseInt(pointsInput.value) || 0) : 0;

        let desiredLine = "Poprzez tę wiadomość otrzymujesz ";
        if (isWarning) {
            desiredLine += "ostrzeżenie.";
        } else if (points > 0) {
            desiredLine += `punkty karne (${points}).`;
        } else {
            desiredLine += "***ostrzeżenie / punkty karne:";
        }

        // BEZPIECZNIK EDYCJI
        if (ta.dataset.jpLastDesiredLine === desiredLine) return;

        let currentLineMatch = val.match(/Poprzez tę wiadomość otrzymujesz .*/);

        if (currentLineMatch) {
            let currentLine = currentLineMatch[0];

            if (!isWarning && points === 0 && val.includes("Zależy nam, aby zapewnić bezpieczeństwo")) {
                ta.value = val.replace(currentLine + "\n\n", "").replace(currentLine, "");
                ta.dispatchEvent(new Event('input', { bubbles: true }));
                ta.dataset.jpLastDesiredLine = desiredLine;
            }
            else if (currentLine !== desiredLine) {
                 ta.value = val.replace(currentLine, desiredLine);
                 ta.dispatchEvent(new Event('input', { bubbles: true }));
                 ta.dataset.jpLastDesiredLine = desiredLine;
            }
        } else if (val.includes("Zależy nam, aby zapewnić bezpieczeństwo")) {
            if (isWarning || points > 0) {
                ta.value = val.replace("Zależy nam, aby zapewnić bezpieczeństwo", desiredLine + "\n\nZależy nam, aby zapewnić bezpieczeństwo");
                ta.dispatchEvent(new Event('input', { bubbles: true }));
                ta.dataset.jpLastDesiredLine = desiredLine;
            }
        } else {
            ta.dataset.jpLastDesiredLine = desiredLine;
        }
    }

    function checkInspectorModal() {
        if (!window.location.href.includes('/inspector/')) return;

        let textareas = Array.from(document.querySelectorAll('textarea'));
        let ta = textareas.find(t => t.value.includes("Poprzez tę wiadomość otrzymujesz"));
        if (!ta) return;

        let val = ta.value;
        let container = ta.closest('.card') || document.body;

        let pointsInput = container.querySelector('input[type="number"], input#points, input[name="points"]');
        let points = pointsInput ? parseInt(pointsInput.value) : 0;
        if (isNaN(points)) points = 0;

        let isWarning = (points === 0);
        let desiredLine = "Poprzez tę wiadomość otrzymujesz ";
        if (isWarning) {
            desiredLine += "ostrzeżenie.";
        } else {
            desiredLine += `punkty karne (${points}).`;
        }

        // BEZPIECZNIK EDYCJI
        if (ta.dataset.jpLastDesiredLine === desiredLine) return;

        let currentLineMatch = val.match(/Poprzez tę wiadomość otrzymujesz.*/);
        if (currentLineMatch) {
            let currentLine = currentLineMatch[0];

            if (currentLine !== desiredLine) {
                ta.value = val.replace(currentLine, desiredLine);
                ta.dispatchEvent(new Event('input', { bubbles: true }));
                ta.dataset.jpLastDesiredLine = desiredLine;
            }
        } else {
            ta.dataset.jpLastDesiredLine = desiredLine;
        }
    }

    let setVuetifyCheckbox = (labelText, desiredState) => {
        let elements = Array.from(document.querySelectorAll('div, span, p'));
        let targetEl = elements.find(el => {
            return Array.from(el.childNodes).some(node =>
                node.nodeType === Node.TEXT_NODE && node.textContent.trim().includes(labelText)
            );
        });

        if (!targetEl) return;

        let parentRow = targetEl.closest('.layout.align-center') || targetEl.parentElement;
        let wrapper = parentRow ? parentRow.querySelector('.v-input--selection-controls') : null;

        if (!wrapper) {
            parentRow = parentRow.parentElement;
            wrapper = parentRow ? parentRow.querySelector('.v-input--selection-controls') : null;
            if (!wrapper) return;
        }

        let input = wrapper.querySelector('input[type="checkbox"]');
        let isChecked = false;

        if (input) {
            isChecked = input.checked || input.getAttribute('aria-checked') === 'true';
        } else {
            isChecked = wrapper.classList.contains('v-input--is-label-active') || wrapper.classList.contains('v-input--is-dirty');
        }

        if (isChecked !== desiredState) {
            let clickTarget = wrapper.querySelector('.v-input--selection-controls__ripple') || input;
            if (clickTarget) clickTarget.click();
        }
    };

    function checkDeal() {
        let urlTextarea = document.querySelector('textarea[name="mainUrl"]');
        let currentTitle = getCurrentTitle();

        if (!urlTextarea || !currentTitle) return false;

        if (settings.enableFakePromo) checkFakePromoWarning();

        if (!document.querySelector('.mod-tools-container')) {

            const triggerVueInput = async (element, value) => {
                if (!element) return;
                element.focus();
                element.value = '';
                element.dispatchEvent(new Event('input', { bubbles: true }));

                for (let char of value) {
                    element.value += char;
                    element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                    await new Promise(r => setTimeout(r, 10));
                }

                element.dispatchEvent(new Event('change', { bubbles: true }));
                element.blur();
            };

            let toolsBox = document.createElement('div');
            toolsBox.className = "mod-tools-container";
            toolsBox.style.position = 'relative';

            let settingsBtn = document.createElement('button');
            settingsBtn.innerHTML = "⚙️";
            settingsBtn.className = "mod-settings-btn";
            settingsBtn.style.cssText = "position: absolute; top: 5px; right: 5px; z-index: 10;";
            settingsBtn.onclick = (e) => { e.preventDefault(); openSettings(); };
            toolsBox.appendChild(settingsBtn);

            // --- LATAJĄCY PRZYCISK (Dopisywanie do tytułu) ---
            if (settings.enableFloatingButton) {
                let floatBtn = document.createElement('button');
                floatBtn.innerHTML = "✨";
                floatBtn.className = "mod-floating-btn";
                floatBtn.title = "Dodaj tekst: " + settings.customFloatingText;

                floatBtn.onclick = async (e) => {
                    e.preventDefault();
                    let titleInput = document.querySelector('input[placeholder="Thread title"]');
                    if (titleInput && settings.customFloatingText) {
                        let currentVal = titleInput.value;
                        if (!currentVal.includes(settings.customFloatingText.trim())) {
                            await triggerVueInput(titleInput, currentVal + settings.customFloatingText);
                        }
                    }
                    if (settings.floatingButtonAutoFreeDelivery) {
                        setVuetifyCheckbox("Free Delivery", true, true);
                    }

                    floatBtn.innerHTML = "✅";
                    setTimeout(() => { floatBtn.innerHTML = "✨"; }, 1500);
                };
                toolsBox.appendChild(floatBtn);
            }

            let leftCol = document.createElement('div');
            leftCol.className = "mod-left-col";

            const debounce = (func, delay) => {
                let timeoutId;
                return (...args) => {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => { func.apply(null, args); }, delay);
                };
            };

            if (settings.enableFakePromo) {
                let addBtn = document.createElement('button');
                addBtn.innerText = t('btnFakePromoMark');
                addBtn.className = "fake-promo-btn";
                addBtn.onclick = (e) => {
                    e.preventDefault();
                    let autoPrice = getCurrentPrice() || 0;
                    let corePat = getCorePattern(urlTextarea.value);
                    if (confirm(`${t('promptFakePromo')} ${corePat}\n${t('promptPrice')} ${autoPrice} zł`)) {
                        addToDatabase(corePat, autoPrice, currentTitle, addBtn);
                    }
                };
                leftCol.appendChild(addBtn);
            }

            let smartQuery = generateSmartQuery(currentTitle);
            let linksWrapper = document.createElement('div');
            linksWrapper.className = 'mod-links-wrapper';
            leftCol.appendChild(linksWrapper);

            let renderQuickLinks = (titleToUse) => {
                let sQuery = generateSmartQuery(titleToUse);
                let pQuery = sQuery;

                if (titleToUse.toLowerCase().includes('lego')) {
                    let numbers = titleToUse.match(/\b\d{4,7}\b/g);
                    if (numbers) {
                        let setId = numbers.find(num => !(num.length === 4 && (num.startsWith('201') || num.startsWith('202'))));
                        if (setId) { sQuery = `LEGO ${setId}`; pQuery = setId; }
                    }
                }

                let encodedPerfumeQuery = encodeURIComponent(sQuery).replace(/%20/g, '+');
                let encodedEbookQuery = encodeURIComponent(sQuery).replace(/%20/g, '+');
                let encodedQuery = encodeURIComponent(sQuery);
                let encodedPromoQuery = encodeURIComponent(pQuery);

                let buttonsHtml = '';
                const allButtons = [
                    { id: 'Ceneo', icon: '🔍', url: `https://www.ceneo.pl/;szukaj-${encodedQuery}` },
                    { id: 'Keepa', icon: '📈', url: `https://keepa.com/#!search/3-${encodedQuery}` },
                    { id: 'GG.deals', icon: '🎮', url: `https://gg.deals/games/?title=${encodedQuery}` },
                    { id: 'PerfumeHub', icon: '💨', url: `https://perfumehub.pl/search?q=${encodedPerfumeQuery}` },
                    { id: 'LubimyCzytać', icon: '📖', url: `https://lubimyczytac.pl/szukaj/ksiazki?phrase=${encodedQuery}` },
                    { id: 'UpolujEbooka', icon: '📚', url: `https://upolujebooka.pl/szukaj,${encodedEbookQuery}.html#search` },
                    { id: 'Promoklocki', icon: '🧱', url: `https://promoklocki.pl/?s=${encodedPromoQuery}` },
                    { id: 'DekuDeals', icon: '🍄', url: `https://www.dekudeals.com/search?q=${encodedQuery}` },
                    { id: 'Google', icon: '🌐', url: `https://www.google.com/search?q=${encodedQuery}` }
                ];

                allButtons.forEach(btn => {
                    if (!settings.hiddenButtons.includes(btn.id)) {
                        buttonsHtml += `<a href="${btn.url}" target="_blank" class="mod-quick-btn">${btn.icon} ${btn.id}</a>`;
                    }
                });
                linksWrapper.innerHTML = buttonsHtml;
            };
            renderQuickLinks(currentTitle);

            if (typeof window.jpUserEditedShipping === 'undefined') {
                window.jpUserEditedShipping = false;

                document.body.addEventListener('input', (e) => {
                    if (e.isTrusted && e.target && e.target.tagName === 'INPUT' && e.target.placeholder === 'Shipping costs') {
                        window.jpUserEditedShipping = true;
                        e.target.style.backgroundColor = "";
                        e.target.style.color = "";
                        e.target.title = "";
                    }
                }, true);

                document.body.addEventListener('click', (e) => {
                    if (e.isTrusted) {
                        let wrapper = e.target.closest('.v-input--selection-controls');
                        if (wrapper && wrapper.innerText.includes("Free Delivery")) {
                            window.jpUserEditedShipping = true;
                            let coloredElements = Array.from(wrapper.querySelectorAll('*')).filter(x => x.style && x.style.backgroundColor);
                            coloredElements.forEach(el => {
                                el.style.backgroundColor = "";
                                el.style.color = "";
                                el.style.padding = "";
                            });
                        }
                    }
                }, true);
            }

            let setVuetifyCheckbox = (labelText, desiredState, applyStyle = false) => {
                let elements = Array.from(document.querySelectorAll('div, span, p, label'));
                let targetEl = elements.find(el => {
                    return Array.from(el.childNodes).some(node =>
                        node.nodeType === Node.TEXT_NODE && node.textContent.trim().includes(labelText)
                    );
                });

                if (!targetEl) return null;

                let parentRow = targetEl.closest('.layout.align-center') || targetEl.parentElement;
                let wrapper = parentRow ? parentRow.querySelector('.v-input--selection-controls') : null;

                if (!wrapper) {
                    parentRow = parentRow.parentElement;
                    wrapper = parentRow ? parentRow.querySelector('.v-input--selection-controls') : null;
                    if (!wrapper) return null;
                }

                let input = wrapper.querySelector('input[type="checkbox"]');
                let isChecked = input ? (input.checked || input.getAttribute('aria-checked') === 'true') : (wrapper.classList.contains('v-input--is-label-active') || wrapper.classList.contains('v-input--is-dirty'));

                if (isChecked !== desiredState) {
                    let clickTarget = wrapper.querySelector('input[type="checkbox"]') || wrapper.querySelector('.v-input--selection-controls__ripple');
                    if (clickTarget) clickTarget.click();
                }

                if (applyStyle) {
                    if (desiredState) {
                        targetEl.style.backgroundColor = "var(--jp-stat-act-bg)";
                        targetEl.style.color = "var(--jp-stat-act-co)";
                        targetEl.style.padding = "2px 6px";
                        targetEl.style.borderRadius = "4px";
                        targetEl.title = "Zaznaczone automatycznie przez Jalapeño";
                    } else {
                        targetEl.style.backgroundColor = "";
                        targetEl.style.color = "";
                        targetEl.style.padding = "";
                        targetEl.style.borderRadius = "";
                        targetEl.title = "";
                    }
                }
                return targetEl;
            };
//Test
            const setShippingCost = async (value) => {
                let input =
                    document.querySelector('input[placeholder="Shipping costs"]') ||
                    document.querySelector('input[data-jp-shipping="true"]');

                if (!input) {
                    console.warn("❌ Shipping input not found");
                    return;
                }

                console.log("🚚 Auto shipping:", value);

                input.focus();

                input.value = '';
                input.dispatchEvent(new Event('input', { bubbles: true }));

                for (let char of value) {
                    input.value += char;

                    input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));

                    await new Promise(r => setTimeout(r, 10));
                }

                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.blur();

                input.classList.remove('jp-shipping-alert');
                input.style.color = "";
                input.style.backgroundColor = "";

                console.log("✅ Shipping set:", input.value);
            };
            //test

            let checkAutomations = () => {
                let urlTextarea = document.querySelector('textarea[name="mainUrl"]');
                if (!urlTextarea) return;

                let highlightShippingField = (expectedValue) => {
                    let attempts = 0;
                    let interval = setInterval(() => {
                        let inputNode = document.querySelector('input[placeholder="Shipping costs"]') || document.querySelector('input[data-jp-shipping="true"]');

                        if (inputNode && !inputNode.disabled) {
                            clearInterval(interval);
                            inputNode.dataset.jpShipping = "true";

                            if (inputNode.value === "") {
                                inputNode.classList.add('jp-shipping-alert');
                                inputNode.placeholder = `👉 Wpisz: ${expectedValue}`;
                                inputNode.title = `Jalapeño: Wymagane ręczne wpisanie ${expectedValue}`;
                            } else {
                                inputNode.classList.remove('jp-shipping-alert');
                                inputNode.placeholder = "Shipping costs";
                            }
                        } else if (attempts > 20) {
                            clearInterval(interval);
                        }
                        attempts++;
                    }, 50);
                };

                let canonicalUrlNode = document.querySelector('textarea[name="canonicalUrl"]');
                let linkToCheck = (canonicalUrlNode && canonicalUrlNode.value.trim() !== "")
                                    ? canonicalUrlNode.value.toLowerCase()
                                    : urlTextarea.value.toLowerCase();

                // Wysyłka Amazon
                if (settings.enableAutoAmazonShipping && linkToCheck.includes('amazon.pl')) {
                    let price = getCurrentPrice();

                    if (price !== null) {
                        let allLabels = Array.from(document.querySelectorAll('label'));
                        let freeDelLabel = allLabels.find(l => l.innerText.trim().includes("Free Delivery"));
                        let wrapper = freeDelLabel ? freeDelLabel.closest('.v-input--selection-controls') : null;
                        let checkbox = wrapper ? wrapper.querySelector('input[type="checkbox"]') : null;
                        let isChecked = checkbox ? (checkbox.checked || checkbox.getAttribute('aria-checked') === 'true') : (wrapper && (wrapper.classList.contains('v-input--is-label-active') || wrapper.classList.contains('v-input--is-dirty')));

                        if (price >= 65) {
                            if (freeDelLabel && freeDelLabel.style.backgroundColor === "rgb(255, 82, 82)") {
                                freeDelLabel.style.backgroundColor = "var(--jp-stat-act-bg)";
                                freeDelLabel.style.color = "var(--jp-stat-act-co)";
                                freeDelLabel.title = "";
                            }
                            let shipInput = document.querySelector('input[data-jp-shipping="true"]');
                            if (shipInput) {
                                shipInput.classList.remove('jp-shipping-alert');
                                shipInput.placeholder = "Shipping costs";
                            }

                            if (!window.jpUserEditedShipping) {
                                setVuetifyCheckbox("Free Delivery", true, true);
                            }
                        } else if (price > 0 && price < 65) {
                            if (!window.jpUserEditedShipping && isChecked) {
                                setVuetifyCheckbox("Free Delivery", false, true);
                                isChecked = false;
                            }

                            // OSTRZEŻENIE: Jeśli darmowa dostawa jest ZAZNACZONA mimo ceny < 65
                            if (isChecked && freeDelLabel) {
                                freeDelLabel.style.backgroundColor = "#ff5252"; // Jaskrawy czerwony
                                freeDelLabel.style.color = "#fff";
                                freeDelLabel.title = "BŁĄD: Amazon poniżej 65 zł ma płatną wysyłkę! Odznacz darmową dostawę.";
                                freeDelLabel.style.padding = "2px 6px";
                                freeDelLabel.style.borderRadius = "4px";
                            } else if (freeDelLabel && freeDelLabel.style.backgroundColor === "rgb(255, 82, 82)") {
                                freeDelLabel.style.backgroundColor = "";
                                freeDelLabel.style.color = "";
                            }
                            //test
                            //highlightShippingField("8,99");
                            setTimeout(() => {
                                if (!window.jpUserEditedShipping) {
                                    setShippingCost("8,99");
                                }
                            }, 150);
                        }
                    }
                }

                // Auto Wysyłka Allegro
                if (settings.enableAutoAmazonShipping && linkToCheck.includes('allegro.pl') && !window.jpUserEditedShipping) {
                    let shipInput = document.querySelector('input[placeholder="Shipping costs"]') || document.querySelector('input[data-jp-shipping="true"]');
                    if (shipInput && shipInput.value.trim() === "") {
                        setTimeout(() => {
                            if (!window.jpUserEditedShipping) {
                                setShippingCost("10,49");
                            }
                        }, 150);
                    }
                }

                // Auto Wysyłka Zalando Lounge
                if (settings.enableAutoAmazonShipping && linkToCheck.includes('zalando-lounge.pl') && !window.jpUserEditedShipping) {
                    let shipInput = document.querySelector('input[placeholder="Shipping costs"]') || document.querySelector('input[data-jp-shipping="true"]');
                    if (shipInput && shipInput.value.trim() === "") {
                        setTimeout(() => {
                            if (!window.jpUserEditedShipping) {
                                setShippingCost("9,95");
                            }
                        }, 150);
                    }
                }

                // Allegro
                /*
                if (settings.enableAutoAmazonShipping && linkToCheck.includes('allegro.pl') && !window.jpUserEditedShipping) {
                    let shipInput = document.querySelector('input[placeholder="Shipping costs"]') || document.querySelector('input[data-jp-shipping="true"]');
                    if (shipInput && shipInput.value.trim() === "") {
                        highlightShippingField("10,49");
                    }
                }
                */

                // Auto Markety
                if (settings.enableAutoLocalStore) {
                    let titleStr = getCurrentTitle().toLowerCase();
                    let matchedStore = null;
                    const marketDB = [
                        { keys: ['biedronka', 'biedronki', 'biedronce'], url: 'https://www.biedronka.pl', local: true },
                        { keys: ['dino'], url: 'https://marketdino.pl', local: true },
                        { keys: ['kaufland', 'kauflandzie'], url: 'https://www.kaufland.pl', local: true },
                        { keys: ['auchan', 'auchanie'], url: 'https://www.auchan.pl', local: true },
                        { keys: ['carrefour', 'kerfur', 'carrefourze'], url: 'https://www.carrefour.pl', local: true },
                        { keys: ['aldi'], url: 'https://www.aldi.pl', local: true },
                        { keys: ['netto'], url: 'https://netto.pl', local: true },
                        { keys: ['polomarket', 'polo market', 'polomarkecie'], url: 'https://www.polomarket.pl', local: true },
                        { keys: ['leclerc', 'eleclerc', 'e.leclerc'], url: 'https://leclerc.pl', local: true },
                        { keys: ['lidl', 'lidlu'], url: 'https://www.lidl.pl', local: false },
                        { keys: ['action'], url: 'https://www.action.com/pl-pl/', local: true },
                        { keys: ['stokrotka', 'stokrotce'], url: 'https://stokrotka.pl/', local: true },
                        { keys: ['intermarche'], url: 'https://intermarche.pl/', local: true },
                        { keys: ['selgros'], url: 'https://www.selgros.pl/', local: true },
                        { keys: ['lewiatan'], url: 'https://lewiatan.pl/', local: true },
                        { keys: ['topaz', 'topaz24'], url: 'https://topaz24.pl/', local: true },
                        { keys: ['Leroy Merlin'], url: 'https://www.leroymerlin.pl/', local: false },
                        { keys: ['Castorama'], url: 'https://www.castorama.pl/', local: false },
                        { keys: ['Obi', 'OBI'], url: 'https://www.obi.pl/', local: false },
                        { keys: ['sinsay'], url: 'https://www.sinsay.com/pl/pl/', local: false },
                    ];

                    matchedStore = marketDB.find(store => {
                        let isMatched = store.keys.some(key => new RegExp('\\b' + key + '\\b').test(titleStr));
                        let isExcluded = store.exclude ? store.exclude.some(ex => titleStr.includes(ex)) : false;
                        return isMatched && !isExcluded;
                    });

                    if (matchedStore) {
                        if (urlTextarea.value.trim() === "") {
                            urlTextarea.value = matchedStore.url;
                            urlTextarea.dispatchEvent(new Event('input', {bubbles: true}));
                        }
                        if (matchedStore.local) {
                            setTimeout(() => {
                                setVuetifyCheckbox("Local offer", true, true);
                                setVuetifyCheckbox("Okazja stacjonarna", true, true);
                            }, 200);
                        }
                    }
                }
            };
            checkAutomations();

            let rightCol = document.createElement('div');
            rightCol.className = "mod-right-col";

            if (settings.enableHistory || settings.enableMetaInfo) {
                let historyWrapper = document.createElement('div');
                historyWrapper.className = "pepper-history-box";
                rightCol.appendChild(historyWrapper);
                fetchPepperHistory(smartQuery, historyWrapper, false, currentTitle);
            } else {
                rightCol.innerHTML = `<div style="color:var(--jp-text-muted); font-size:11px; padding-top: 15px;">${t('lblHistDisabled')}</div>`;
            }
            toolsBox.appendChild(leftCol);
            toolsBox.appendChild(rightCol);

            let targetDiv = document.querySelector('.layout.column.mb-3.px-4');
            if (targetDiv && targetDiv.parentNode) {
                targetDiv.parentNode.insertBefore(toolsBox, targetDiv);
            } else {
                urlTextarea.parentNode.appendChild(toolsBox);
            }

            let detectAndConvertCallback = null;

            if (settings.enableCalculator) {
                let couponInput = document.querySelector('input[placeholder="Coupon name"]');
                if (couponInput && !document.getElementById('pepper-mod-converter-wrapper')) {
                    let couponRow = couponInput.closest('.flex.shrink');

                    if (couponRow && couponRow.parentNode) {
                        let wrapper = document.createElement('div');
                        wrapper.id = 'pepper-mod-converter-wrapper';
                        wrapper.style.cssText = 'display: flex; flex-direction: row; width: 100%; align-items: stretch;';
                        couponRow.parentNode.insertBefore(wrapper, couponRow);
                        wrapper.appendChild(couponRow);
                        couponRow.style.flexGrow = "1";

                        let convBox = document.createElement('div');
                        convBox.className = "rounded-medium px-3 mb-2 mt-0";
                        convBox.style.cssText = "display: flex; align-items: center; flex: 1 1 auto; width: 100%; max-width: 420px; padding: 0 !important; margin-left: 15px; margin-bottom: 24px; background: var(--jp-input-bg); border: 1px solid var(--jp-border); border-radius: 6px;";

                        convBox.innerHTML = `
                            <select id="mod-conv-from" style="background: transparent; border: none; outline: none; font-weight: bold; font-size: 14px; cursor: pointer; color: var(--jp-input-text); margin-left: 12px;">
                                <option value="EUR" selected>EUR</option>
                                <option value="USD">USD</option>
                                <option value="GBP">GBP</option>
                            </select>
                            <input type="text" id="mod-conv-amount" placeholder="Kwota" style="background: transparent; border: none; outline: none; width: 65px; font-size: 16px; margin-left: 5px; color: var(--jp-input-text);">
                            <span style="margin: 0 8px; color: var(--jp-text-muted);">➔</span>
                            <span id="mod-conv-result" style="font-weight: bold; min-width: 65px; font-size: 15px; color: var(--jp-stat-act-co);">0,00 zł</span>

                            <div style="display: flex; flex-direction: column; gap: 4px; margin-left: auto; padding: 4px 8px; border-left: 1px solid var(--jp-border); background: var(--jp-bg); border-top-right-radius: inherit; border-bottom-right-radius: inherit; height: 100%; justify-content: center;">
                                <button id="mod-conv-btn-price" class="mod-conv-btn-v2">${t('calcPastePln')}</button>
                                <button id="mod-conv-btn-title" class="mod-conv-btn-v2">${t('calcTitleCur')}</button>
                            </div>
                        `;
                        wrapper.appendChild(convBox);

                        fetchExchangeRates((rates) => {
                            let btnPrice = document.getElementById('mod-conv-btn-price');
                            let btnTitle = document.getElementById('mod-conv-btn-title');
                            let inputAmt = document.getElementById('mod-conv-amount');
                            let selFrom = document.getElementById('mod-conv-from');
                            let resultSpan = document.getElementById('mod-conv-result');

                            let currentCalculatedPLN = 0;
                            let currentOriginalValue = 0;
                            selFrom.value = settings.defaultCurrency || 'EUR';
                            let lastDetectedString = "";

                            let updateResult = () => {
                                let rawVal = inputAmt.value.replace(',', '.').replace(/[^\d.]/g, '');
                                let val = parseFloat(rawVal);

                                if(isNaN(val) || val <= 0) {
                                    resultSpan.innerText = "0,00 zł";
                                    currentOriginalValue = 0;
                                    currentCalculatedPLN = 0;
                                    return;
                                }

                                currentOriginalValue = val;
                                currentCalculatedPLN = (val / rates[selFrom.value]) * rates['PLN'];
                                resultSpan.innerText = currentCalculatedPLN.toFixed(2).replace('.', ',') + " zł";
                            };

                            detectAndConvertCallback = (text) => {
                                let priceMatch = text.match(/(?:(?:€|\$|£|EUR|USD|GBP)\s*(\d+(?:[.,]\d+)?))|(?:\b(\d+(?:[.,]\d+)?)\s*(?:€|\$|£|EUR|USD|GBP)(?!\s*\d))/i);
                                if (priceMatch) {
                                    let currentMatch = priceMatch[0].toLowerCase();
                                    if (currentMatch !== lastDetectedString) {
                                        lastDetectedString = currentMatch;
                                        let extractedNum = priceMatch[1] || priceMatch[2];
                                        inputAmt.value = extractedNum.replace(',', '.');

                                        if (currentMatch.includes('eur') || currentMatch.includes('€')) selFrom.value = 'EUR';
                                        if (currentMatch.includes('usd') || currentMatch.includes('$')) selFrom.value = 'USD';
                                        if (currentMatch.includes('gbp') || currentMatch.includes('£')) selFrom.value = 'GBP';
                                        updateResult();
                                    }
                                } else {
                                    lastDetectedString = "";
                                    if(text.toLowerCase().includes('eur') || text.includes('€')) { selFrom.value = 'EUR'; }
                                    if(text.toLowerCase().includes('usd') || text.includes('$')) { selFrom.value = 'USD'; }
                                    if(text.toLowerCase().includes('gbp') || text.includes('£')) { selFrom.value = 'GBP'; }
                                }
                            };

                            detectAndConvertCallback(currentTitle);
                            inputAmt.addEventListener('input', updateResult);
                            selFrom.addEventListener('change', updateResult);
                            updateResult();
                            /*
                            const triggerVueInput = async (element, value) => {
                                if (!element) {
                                    console.warn("❌ brak elementu");
                                    return;
                                }

                                console.log("👉 Symuluję wpisywanie:", value);

                                element.focus();

                                element.value = '';
                                element.dispatchEvent(new Event('input', { bubbles: true }));

                                for (let char of value) {
                                    element.value += char;

                                    element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
                                    element.dispatchEvent(new Event('input', { bubbles: true }));
                                    element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));

                                    await new Promise(r => setTimeout(r, 10)); // mikro delay
                                }

                                element.dispatchEvent(new Event('change', { bubbles: true }));
                                element.blur();

                                console.log("✅ Final value:", element.value);
                            };
                            */

                            btnPrice.onclick = (e) => {
                                e.preventDefault();

                                if (currentCalculatedPLN <= 0) {
                                    console.warn("❌ Brak wartości do wklejenia");
                                    return;
                                }

                                let priceInput =
                                    document.querySelector('input[placeholder="Price"]') ||
                                    document.querySelector('input[aria-label="Price"]') ||
                                    document.querySelector('input[type="text"]');

                                console.log("🔎 znaleziony input:", priceInput);

                                if (priceInput) {
                                    let formatted = currentCalculatedPLN.toFixed(2).replace('.', ',');

                                    console.log("💰 Wklejam:", formatted);

                                    triggerVueInput(priceInput, formatted);

                                    let oldText = btnPrice.innerText;
                                    btnPrice.innerText = t('calcPasted');
                                    btnPrice.style.backgroundColor = "var(--jp-stat-act-bg)";

                                    setTimeout(() => {
                                        btnPrice.style.backgroundColor = "";
                                        btnPrice.innerText = oldText;
                                    }, 1500);
                                } else {
                                    console.error("❌ Nie znaleziono inputa ceny!");
                                }
                            };

                            btnTitle.onclick = (e) => {
                                e.preventDefault();
                                if(currentOriginalValue <= 0) return;
                                let titleInput = document.querySelector('input[placeholder="Thread title"]');
                                if(titleInput) {
                                    let symbol = selFrom.value === 'EUR' ? '€' : (selFrom.value === 'USD' ? '$' : '£');
                                    let stringToAppend = ` | ${currentOriginalValue.toFixed(2).replace('.', ',')}${symbol}`;

                                    if (!titleInput.value.includes(stringToAppend)) {
                                        triggerVueInput(titleInput, titleInput.value.trim() + stringToAppend);
                                    }

                                    let oldText = btnTitle.innerText;
                                    btnTitle.innerText = t('calcAdded');
                                    btnTitle.style.backgroundColor = "var(--jp-stat-act-bg)";
                                    setTimeout(() => { btnTitle.style.backgroundColor = ""; btnTitle.innerText = oldText; }, 1500);
                                }
                            };
                        });
                    }
                }
            }

            let titleInputField = document.querySelector('input[placeholder="Thread title"]');
            if (titleInputField) {
                titleInputField.addEventListener('input', debounce((e) => {
                    let val = e.target.value;
                    renderQuickLinks(val);
                    checkAutomations();
                    if (typeof detectAndConvertCallback === 'function') detectAndConvertCallback(val);
                }, 400));
            }

            let priceInputNode = document.querySelector('input[placeholder="Price"]');
            if (priceInputNode) {
                priceInputNode.addEventListener('input', debounce(() => checkAutomations(), 400));
            }
        }
        return true;
    }

    fetchExchangeRates(() => {});

    setInterval(() => {
        let titleInput = document.querySelector('input[placeholder="Thread title"]');
        let isAlreadyInjected = document.querySelector('.mod-tools-container');

        if (titleInput && !isAlreadyInjected) checkDeal();
        checkInfractionModal();
        checkInspectorModal();
        checkHoldNoteAutomator();
        checkMessageTemplates();
        //checkInfractionNoteAutomator();

    }, 300);

    loadDatabase(() => {
        if (settings.enableFakePromo) checkFakePromoWarning();
    });
})();
