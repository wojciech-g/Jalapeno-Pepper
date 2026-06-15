// ==UserScript==
// @name         Jalapeño (Dżalapinio) by Xcited
// @namespace    https://raw.githubusercontent.com/wojciech-g/Jalapeno-Pepper/main/jalapeno.user.js
// @version      4.8.4
// @description  Skrypt optymalizujący pracę moderatorów z ponad 18 funkcjonalnościami.
// @author       Xcited (https://www.pepper.pl/profile/Xcited)
// @homepageURL  https://github.com/wojciech-g/Jalapeno-Pepper
// @supportURL   https://github.com/wojciech-g/Jalapeno-Pepper/issues
// @updateURL    https://raw.githubusercontent.com/wojciech-g/Jalapeno-Pepper/main/jalapeno.user.js
// @downloadURL  https://raw.githubusercontent.com/wojciech-g/Jalapeno-Pepper/main/jalapeno.user.js
// @match        *://*.pepper.pl/admin-v2/moderation/*
// @match        *://*.pepper.pl/admin/inspector/users/*
// @match        *://www.google.com/*
// @match        *://www.google.pl/*
// @match        *://lens.google.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @connect      www.pepper.pl
// @connect      open.er-api.com
// @connect      translate.googleapis.com
// @connect      raw.githubusercontent.com
// @connect      *
// ==/UserScript==


(() => {
  // src/ui/theme.js
  function injectThemeCSS(settings3) {
    const isDark = settings3.theme === "dark";
    const darkTextColor = settings3.darkTextColor || "#dbdee1";
    const fontSize = settings3.fontSize || "default";
    const fontRule = fontSize !== "default" ? `body, .v-application, .page-content, .card-body { font-size: ${fontSize} !important; }` : "";
    let css = `
            :root {
                --jp-bg: ${isDark ? "#2b2d31" : "#f9f9f9"};
                --jp-border: ${isDark ? "#404249" : "#e0e0e0"};

                --jp-text: ${isDark ? darkTextColor : "#333"};
                --jp-text-muted: ${isDark ? "#949ba4" : "#777"};

                --jp-btn-bg: ${isDark ? "#383a40" : "#fff"};
                --jp-btn-border: ${isDark ? "#5c5f66" : "#ccc"};
                --jp-btn-hover: ${isDark ? "#404249" : "#e6e6e6"};

                --jp-modal-bg: ${isDark ? "#2b2d31" : "#fff"};
                --jp-modal-overlay: ${isDark ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)"};

                --jp-row-bg: ${isDark ? "#1e1f22" : "#f0f8ff"};
                --jp-row-border: ${isDark ? "#383a40" : "#b3d4ff"};

                --jp-preview-bg: ${isDark ? "#1e1f22" : "#fff"};

                --jp-input-bg: ${isDark ? "#313338" : "#fff"};
                --jp-input-text: ${isDark ? darkTextColor : "#000"};

                --jp-link: ${isDark ? "#4fc3f7" : "#03a9f4"};

                --jp-fake-btn-bg: ${isDark ? "#4a1c1c" : "#ff9800"};
                --jp-fake-btn-hover: ${isDark ? "#732a2a" : "#e68a00"};
                --jp-fake-btn-text: ${isDark ? "#ff8a80" : "#fff"};
                --jp-fake-btn-border: ${isDark ? "#d32f2f" : "transparent"};
                --jp-fake-alert-bg: ${isDark ? "#d32f2f" : "#ff4d4d"};

                --jp-temp-hot: ${isDark ? "#ef5350" : "#ff5252"};
                --jp-temp-cold: ${isDark ? "#4fc3f7" : "#03a9f4"};

                --jp-stat-act-bg: ${isDark ? "#1b3320" : "#e8f5e9"};
                --jp-stat-act-co: ${isDark ? "#81c784" : "#2e7d32"};
                --jp-stat-act-bo: ${isDark ? "#2e5c36" : "#a5d6a7"};

                --jp-stat-exp-bg: ${isDark ? "#313338" : "#eeeeee"};
                --jp-stat-exp-co: ${isDark ? "#949ba4" : "#616161"};
                --jp-stat-exp-bo: ${isDark ? "#404249" : "#e0e0e0"};

                --jp-stat-del-bg: ${isDark ? "#4a1c1c" : "#ffebee"};
                --jp-stat-del-co: ${isDark ? "#e57373" : "#c62828"};
                --jp-stat-del-bo: ${isDark ? "#732a2a" : "#ef9a9a"};

                --jp-alert-field-bg: ${isDark ? "#423600" : "#fff9c4"};
                --jp-alert-field-co: ${isDark ? "#ffeb3b" : "#333"};

                --jp-template-btn-bg: ${isDark ? "#1e1f22" : "#e3f2fd"};
                --jp-template-btn-hover: ${isDark ? "#383a40" : "#bbdefb"};
                --jp-template-btn-border: ${isDark ? "#404249" : "#90caf9"};

                --jp-approve-bg: ${isDark ? "#383a40" : "#ff9800"};
                --jp-approve-bg-hover: ${isDark ? "#404249" : "#e68a00"};
                --jp-approve-border: ${isDark ? "#5c5f66" : "#e68a00"};
                --jp-approve-border-hover: ${isDark ? "#6b6f78" : "#cc7a00"};
                --jp-approve-text: ${isDark ? darkTextColor : "#fff"};

                --jp-switch-track: ${isDark ? "rgba(201, 106, 26, 0.45)" : "rgba(255, 152, 0, 0.45)"};
                --jp-switch-thumb: ${isDark ? "#c96a1a" : "#ff9800"};
                --jp-switch-thumb-border: ${isDark ? "#a65412" : "#e68a00"};
                --jp-switch-ripple: ${isDark ? "rgba(201, 106, 26, 0.18)" : "rgba(255, 152, 0, 0.18)"};
                --jp-switch-track-off: ${isDark ? "#4a4d55" : "#bdbdbd"};
                --jp-switch-thumb-off: ${isDark ? "#8b8f98" : "#fafafa"};
            }

            ${fontRule}

            /* =========================================
               2. WSPÓLNE STYLE KOMPONENTÓW JALAPENO
               ========================================= */

            .jp-shipping-alert { border: 2px dashed #ff5252 !important; box-shadow: 0 0 5px rgba(255, 82, 82, 0.3) !important; transition: all 0.3s ease; }
            .jp-shipping-alert::placeholder { color: #ff5252 !important; opacity: 0.8 !important; font-weight: 500 !important; }

            .jp-template-btn {
                background-color: var(--jp-template-btn-bg); color: var(--jp-text);
                border: 1px solid var(--jp-template-btn-border);
                padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer;
                font-weight: 500; transition: background-color 0.2s; white-space: nowrap;
            }
            .jp-template-btn:hover { background-color: var(--jp-template-btn-hover); }
            .jp-templates-container { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }

            .mod-floating-btn {
                position: absolute; top: -15px; left: -15px;
                background-color: var(--jp-btn-bg); color: var(--jp-link);
                border: 2px solid var(--jp-border); border-radius: 50%;
                width: 36px; height: 36px; font-size: 16px; cursor: pointer;
                box-shadow: 0 2px 5px rgba(0,0,0,0.4); z-index: 100;
                display: flex; align-items: center; justify-content: center; transition: all 0.2s;
            }
            .mod-floating-btn:hover { background-color: var(--jp-link); color: #fff; border-color: var(--jp-link); transform: scale(1.1); }

            .jp-relative-container { position: relative !important; }
            .jp-approve-moved {
                position: absolute !important; left: 55px !important; top: -45px !important;
                z-index: 100 !important; box-shadow: 0 4px 10px rgba(0,0,0,0.4) !important; transition: transform 0.2s ease !important;
            }
            .jp-approve-moved:hover { transform: scale(1.05) !important; }

            #shopinfo {
                text-align: center !important; padding: 15px !important; margin: 10px 0 !important;
                background-color: var(--jp-bg) !important; color: var(--jp-text) !important;
                border: 1px solid var(--jp-border) !important; border-radius: 8px !important; font-family: sans-serif !important;
            }
            #shopinfo img {
                display: block !important; margin: 10px auto 0 auto !important; width: 25% !important; filter: ${isDark ? "invert(1) hue-rotate(180deg)" : "none"} !important;
            }

            /* MERCHANT NOTES STYLING */
            .jp-merchant-notes-section {
                transition: all 0.3s ease;
            }
            .jp-merchant-note-input:focus {
                outline: none !important;
                border-color: #ff9800 !important;
                box-shadow: 0 0 4px rgba(255, 152, 0, 0.3) !important;
            }
            .jp-merchant-note-save:hover {
                opacity: 0.9;
                transform: translateY(-1px);
            }
            .jp-merchant-note-delete:hover {
                opacity: 0.9;
                transform: translateY(-1px);
            }
            .jp-merchant-note-display {
                animation: slideIn 0.3s ease-out;
            }
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            /* MERCHANT NOTES DELETE BUTTONS */
            .jp-merchant-note-delete-single, .jp-merchant-note-delete-btn {
                background-color: var(--jp-stat-del-bg) !important;
                color: var(--jp-stat-del-co) !important;
                border: 1px solid var(--jp-stat-del-bo) !important;
                padding: 3px 6px !important;
                border-radius: 3px !important;
                cursor: pointer !important;
                font-size: 12px !important;
                font-weight: 500 !important;
                transition: all 0.2s ease !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 3px !important;
            }
            .jp-merchant-note-delete-single:hover, .jp-merchant-note-delete-btn:hover {
                filter: brightness(0.9);
                transform: scale(1.05) !important;
            }

            /* MERCHANT NOTE ALERT BOX */
            .jp-merchant-note-alert {
                background-color: var(--jp-template-btn-bg) !important;
                color: white !important;
                padding: 8px 12px !important;
                text-align: left !important;
                font-size: 12px !important;
                border-radius: 4px !important;
                margin-bottom: 8px !important;
                border-left: 3px solid #ff9800 !important;
                z-index: 100 !important;
            }

            /* LOCK BUTTONS CONTAINER */
            .jp-lock-buttons-container {
                display: grid !important;
                grid-template-columns: 1fr 1fr !important;
                gap: 8px !important;
                height: fit-content !important;
            }

            .jp-edit-lock-btn, .jp-edit-unlock-btn, .jp-expire-lock-btn, .jp-expire-unlock-btn {
                background-color: #5a5a5a !important;
                color: white !important;
                border: none !important;
                padding: 8px 12px !important;
                border-radius: 3px !important;
                cursor: pointer !important;
                font-size: 12px !important;
                font-weight: 500 !important;
                transition: all 0.2s ease !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
            }

            .jp-edit-unlock-btn, .jp-expire-unlock-btn {
                background-color: #ff6b6b !important;
            }

            .jp-edit-lock-btn:hover, .jp-edit-unlock-btn:hover, .jp-expire-lock-btn:hover, .jp-expire-unlock-btn:hover {
                opacity: 0.9 !important;
                transform: translateY(-1px) !important;
            }

            .jp-edit-lock-btn:disabled, .jp-edit-unlock-btn:disabled, .jp-expire-lock-btn:disabled, .jp-expire-unlock-btn:disabled {
                opacity: 0.6 !important;
                cursor: not-allowed !important;
            }

            /* MERCHANT NOTES WRAPPER */
            .jp-note-buttons-wrapper {
                display: flex !important;
                gap: 8px !important;
                margin-bottom: 8px !important;
                z-index: 100 !important;
            }

            .jp-note-buttons-wrapper .jp-merchant-note-alert {
                flex: 3 !important;
            }

            .jp-note-buttons-wrapper .jp-lock-buttons-container {
                flex: 1 !important;
            }

            /* MERCHANT NOTE EDIT CONTAINER */
            .jp-merchant-note-edit-container {
                background-color: var(--jp-template-btn-bg) !important;
                padding: 10px 12px !important;
                border-radius: 4px !important;
                margin-bottom: 8px !important;
                border-left: 3px solid #ff9800 !important;
                z-index: 100 !important;
            }

            .jp-merchant-note-edit-input {
                width: 100% !important;
                padding: 6px !important;
                border: 1px solid var(--jp-border) !important;
                background-color: var(--jp-input-bg) !important;
                color: var(--jp-text) !important;
                border-radius: 3px !important;
                font-size: 12px !important;
                box-sizing: border-box !important;
                margin-bottom: 6px !important;
            }

            .jp-merchant-note-edit-input:focus {
                outline: none !important;
                border-color: #ff9800 !important;
            }

            .jp-merchant-note-button-group {
                display: flex !important;
                gap: 6px !important;
            }

            .jp-merchant-note-save-edit, .jp-merchant-note-cancel-edit {
                flex: 1 !important;
                border: none !important;
                padding: 5px !important;
                border-radius: 3px !important;
                cursor: pointer !important;
                font-size: 11px !important;
                font-weight: 500 !important;
                color: white !important;
                transition: all 0.2s ease !important;
            }

            .jp-merchant-note-save-edit {
                background-color: #366141 !important;
            }

            .jp-merchant-note-cancel-edit {
                background-color: #757575 !important;
            }

            .jp-merchant-note-save-edit:hover, .jp-merchant-note-cancel-edit:hover {
                opacity: 0.9 !important;
            }

            /* SHIPPING COSTS PANEL */
            .jp-shipping-costs-alert {
                background-color: var(--jp-template-btn-bg) !important;
                color: white !important;
                padding: 8px 12px !important;
                text-align: left !important;
                font-size: 12px !important;
                border-radius: 4px !important;
                margin-bottom: 8px !important;
                border-left: 3px solid #4fc3f7 !important;
                z-index: 100 !important;
            }

            .jp-shipping-cost-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 6px;
                border-radius: 3px;
                margin-bottom: 6px;
                border-left: 2px solid #4fc3f7;
                background-color: rgba(255, 255, 255, 0.05);
            }

            .jp-shipping-cost-item-content {
                color: var(--jp-text);
                font-size: 11px;
                word-break: break-word;
                flex: 1;
            }

            .jp-shipping-cost-btn {
                background-color: #2196f3 !important;
                color: white !important;
                border: none !important;
                padding: 4px 8px !important;
                border-radius: 3px !important;
                cursor: pointer !important;
                font-size: 11px !important;
                font-weight: 500 !important;
                transition: all 0.2s ease !important;
            }

            .jp-shipping-cost-btn:hover {
                background-color: #1976d2 !important;
                opacity: 0.9 !important;
            }

            .jp-shipping-cost-delete-btn {
                background-color: #f44336 !important;
                color: white !important;
                border: none !important;
                padding: 2px 6px !important;
                border-radius: 3px !important;
                cursor: pointer !important;
                font-size: 10px !important;
                font-weight: 500 !important;
                transition: all 0.2s ease !important;
                flex-shrink: 0;
            }

            .jp-shipping-cost-delete-btn:hover {
                background-color: #d32f2f !important;
            }

            .jp-shipping-cost-edit-container {
                background-color: var(--jp-template-btn-bg) !important;
                padding: 10px 12px !important;
                border-radius: 4px !important;
                margin-bottom: 8px !important;
                border-left: 3px solid #4fc3f7 !important;
                z-index: 100 !important;
            }

            .jp-shipping-cost-form-row {
                display: flex;
                gap: 8px;
                margin-bottom: 8px;
                align-items: center;
            }

            .jp-shipping-cost-input {
                flex: 1;
                padding: 6px !important;
                border: 1px solid var(--jp-border) !important;
                background-color: var(--jp-input-bg) !important;
                color: var(--jp-input-text) !important;
                border-radius: 3px !important;
                font-size: 12px !important;
                box-sizing: border-box !important;
            }

            .jp-shipping-cost-input:focus {
                outline: none !important;
                border-color: #4fc3f7 !important;
            }

            .jp-shipping-cost-button-group {
                display: flex;
                gap: 6px;
            }

            .jp-shipping-cost-save-edit, .jp-shipping-cost-cancel-edit {
                flex: 1;
                border: none !important;
                padding: 5px !important;
                border-radius: 3px !important;
                cursor: pointer !important;
                font-size: 11px !important;
                font-weight: 500 !important;
                color: white !important;
                transition: all 0.2s ease !important;
            }

            .jp-shipping-cost-save-edit {
                background-color: #2196f3 !important;
            }

            .jp-shipping-cost-cancel-edit {
                background-color: #757575 !important;
            }

            .jp-shipping-cost-save-edit:hover, .jp-shipping-cost-cancel-edit:hover {
                opacity: 0.9 !important;
            }

            .mShippingCosts {
                margin-top: 0;
            }
        `;
    if (isDark) {
      css += `
                /* -----------------------------------------
                   A. NOWY PANEL MODERACJI (V2 - Vuetify)
                   ----------------------------------------- */
                body, .v-application, .v-content, .v-content__wrap, .theme--light.v-application, .grey.lighten-3 { background-color: #1e1f22 !important; color: var(--jp-text) !important; }
                .theme--light.v-card, .theme--light.v-sheet, .theme--light.v-list, .theme--light.v-navigation-drawer, .theme--light.v-menu__content,
                .theme--light.v-tabs-items, .theme--light.v-tabs, .theme--light.v-expansion-panel, .theme--light.v-footer {
                    background-color: #2b2d31 !important; color: var(--jp-text) !important; border-color: #1e1f22 !important;
                }
                .theme--light.v-expansion-panel .v-expansion-panel__container { background-color: #2b2d31 !important; color: var(--jp-text) !important; }
                .theme--light.v-expansion-panel .v-expansion-panel__header { color: var(--jp-text) !important; }

                .theme--light .v-tabs__bar { background-color: #1e1f22 !important; }
                .theme--light .v-tabs__item { color: #949ba4 !important; }
                .theme--light .v-tabs__item--active { color: #ff9800 !important; }
                .theme--light .v-tabs__item--active, .theme--light .v-tabs__item--active .v-icon { color: #d84315 !important; }

                .redactor-box, .redactor-editor, .ce-block__content, .codex-editor__redactor { background-color: #1e1f22 !important; color: var(--jp-text) !important; border: 1px solid #383a40 !important; }
                .theme--light.v-toolbar { background-color: #1e1f22 !important; color: var(--jp-text) !important; }

                .theme--light.v-data-table, .theme--light.v-data-table .v-data-table__wrapper table { background-color: #2b2d31 !important; color: var(--jp-text) !important; }
                .theme--light.v-data-table tbody tr:hover:not(.v-data-table__expanded__content) { background-color: #313338 !important; }
                .theme--light.v-divider, .theme--light .v-divider { border-color: #383a40 !important; }

                /* -----------------------------------------
                   NOWE POLA TEKSTOWE V2 (Przezroczyste tło, pojedyncza linia)
                   ----------------------------------------- */
                .theme--light.v-text-field > .v-input__control > .v-input__slot,
                .theme--light.v-text-field--solo > .v-input__control > .v-input__slot {
                    background-color: transparent !important;
                    border: none !important;
                    border-bottom: 1px solid #5c5f66 !important;
                    border-radius: 0 !important;
                    box-shadow: none !important;
                    color: var(--jp-text) !important;
                    transition: border-color 0.3s;
                }

                .theme--light.v-text-field > .v-input__control > .v-input__slot::before,
                .theme--light.v-text-field > .v-input__control > .v-input__slot::after {
                    display: none !important;
                }

                /* Subtelniejsze pomarańczowe podkreślenie (1px zamiast 2px) */
                .theme--light.v-text-field.v-input--is-focused > .v-input__control > .v-input__slot {
                    border-bottom: 1px solid #d84315 !important;
                }

                .theme--light.v-input input, .theme--light.v-input textarea { color: var(--jp-text) !important; }
                .theme--light.v-input input::placeholder, .theme--light.v-input textarea::placeholder, ::-webkit-input-placeholder { color: #949ba4 !important; opacity: 1 !important; }
                .theme--light.v-label { color: #949ba4 !important; }

                .theme--light.v-text-field .v-text-field__details .v-messages { color: var(--jp-text-muted) !important; }

                #pepper-mod-converter-wrapper > div.rounded-medium {
                    background-color: transparent !important;
                    border: none !important;
                    border-bottom: 1px solid #5c5f66 !important;
                    border-radius: 0 !important;
                }
                #pepper-mod-converter-wrapper > div.rounded-medium > div:last-child {
                    background-color: transparent !important;
                    border-left: none !important;
                }
                #mod-conv-amount, #mod-conv-from { color: var(--jp-text) !important; }
                #pepper-mod-converter-wrapper .mod-conv-btn-v2 { background-color: #383a40 !important; color: var(--jp-text) !important; border: 1px solid #5c5f66 !important; }
                #pepper-mod-converter-wrapper .mod-conv-btn-v2:hover { background-color: #404249 !important; }

                .theme--light .v-select__selection, .theme--light .v-select__selection--comma,
                .theme--light .v-select__selections, .theme--light .v-select__selections input { color: var(--jp-text) !important; }
                .theme--light .v-select__selections .v-select__selection--disabled { color: #949ba4 !important; }
                .theme--light .v-select .v-input__append-inner .v-icon { color: #949ba4 !important; }
                .theme--light .v-menu__content .v-list, .theme--light .v-menu__content .v-select-list { background-color: #2b2d31 !important; }
                .theme--light .v-menu__content .v-list__tile__title, .theme--light .v-menu__content .v-list-item__title { color: var(--jp-text) !important; }
                .theme--light .v-menu__content .v-list__tile:hover, .theme--light .v-menu__content .v-list-item:hover { background-color: #383a40 !important; }
                .theme--light .v-menu__content .v-list__tile--active, .theme--light .v-menu__content .v-list-item--active { background-color: #404249 !important; color: #c96a1a !important; }

                /* PRZYCISKI V2 */
                .theme--light.v-btn { color: var(--jp-text) !important; }
                .theme--light.v-btn.v-btn--outline { border-color: #5c5f66 !important; background-color: transparent !important; }
                .theme--light.v-btn.v-btn--outline:hover, .theme--light.v-btn.v-btn--flat:hover, .theme--light.v-btn.v-btn--icon:hover { background-color: rgba(255,255,255,0.08) !important; }
                .theme--light.v-btn:not(.v-btn--flat):not(.v-btn--outline):not(.v-btn--icon) { background-color: #383a40 !important; }
                .theme--light.v-btn:not(.v-btn--flat):not(.v-btn--outline):not(.v-btn--icon):hover { background-color: #404249 !important; }
                .theme--light.v-btn.v-btn--disabled { opacity: 0.5 !important; }

                /* Główne Przyciski V2 */
                html body .v-application .theme--light.v-btn.cept-thread-moderation-acknowledge-btn:not(.v-btn--disabled),
                html body .v-application .theme--light.v-btn.jp-approve-moved:not(.v-btn--disabled),
                html body .v-application .theme--light.v-btn.primary:not(.v-btn--disabled),
                html body .v-application .theme--light.v-btn.warning:not(.v-btn--disabled),
                html body .v-application .theme--light.v-btn.success:not(.v-btn--disabled) {
                    background: var(--jp-approve-bg) !important; background-color: var(--jp-approve-bg) !important;
                    border: 1px solid var(--jp-approve-border) !important; color: var(--jp-approve-text) !important; box-shadow: none !important;
                }
                .theme--light.v-btn.primary::before, .theme--light.v-btn.warning::before, .theme--light.v-btn.success::before,
                .theme--light.v-btn.cept-thread-moderation-acknowledge-btn::before, .theme--light.v-btn.jp-approve-moved::before { background-color: transparent !important; }
                html body .v-application .theme--light.v-btn.cept-thread-moderation-acknowledge-btn:not(.v-btn--disabled):hover,
                html body .v-application .theme--light.v-btn.jp-approve-moved:not(.v-btn--disabled):hover,
                html body .v-application .theme--light.v-btn.primary:not(.v-btn--disabled):hover,
                html body .v-application .theme--light.v-btn.warning:not(.v-btn--disabled):hover,
                html body .v-application .theme--light.v-btn.success:not(.v-btn--disabled):hover {
                    background: var(--jp-approve-bg-hover) !important; background-color: var(--jp-approve-bg-hover) !important;
                    border-color: var(--jp-approve-border-hover) !important;
                }

                html body .v-application .theme--light.v-btn.cept-thread-moderation-acknowledge-btn:not(.v-btn--disabled) { background-color: #9e360b !important; border: 1px solid #7a2806 !important; color: #ffffff !important; }
                html body .v-application .theme--light.v-btn.cept-thread-moderation-acknowledge-btn:not(.v-btn--disabled):hover { background-color: #7a2806 !important; }
                html body .v-application .theme--light.v-btn.v-btn--outline.cept-thread-moderation-acknowledge-btn:not(.v-btn--disabled) { background-color: transparent !important; color: #9e360b !important; border: 1px solid #9e360b !important; }
                html body .v-application .theme--light.v-btn.v-btn--outline.cept-thread-moderation-acknowledge-btn:not(.v-btn--disabled):hover { background-color: rgba(158, 54, 11, 0.15) !important; }

                /* Data i Czas */
                .theme--light .v-picker__body, .theme--light .v-date-picker-header, .theme--light .v-date-picker-table { background-color: #2b2d31 !important; color: var(--jp-text) !important; }
                .theme--light .v-date-picker-table th { color: #949ba4 !important; }
                .theme--light .v-date-picker-table .v-btn { background-color: transparent !important; border: none !important; color: var(--jp-text) !important; }
                .theme--light .v-date-picker-table .v-btn:hover { background-color: #404249 !important; }
                .theme--light .v-time-picker-clock { background-color: #2b2d31 !important; }
                .theme--light .v-time-picker-clock__inner { background-color: #1e1f22 !important; }
                .theme--light .v-time-picker-clock__item span { color: var(--jp-text) !important; }
                .theme--light .v-time-picker-clock__item--active span { color: #ffffff !important; }

                /* Alerty i Tła Peppera */
                .grey.lighten-5, .grey.lighten-4, .white, .theme--light.grey.lighten-4, .theme--light.grey.lighten-5 {
                    background-color: #313338 !important; color: var(--jp-text) !important; border-color: #1e1f22 !important;
                }
                .theme--light.v-icon { color: #949ba4 !important; }

                /* Pomarańczowe ikony Vuetify -> zgaszony pomarańcz */
                .theme--light.v-icon.orange--text { color: #d84315 !important; }

                .theme--light .v-chip { background-color: #404249 !important; color: var(--jp-text) !important; }
                .black--text { color: var(--jp-text) !important; }
                .grey--text, .grey--text.text--darken-1, .grey--text.text--darken-2, .grey--text.text--darken-3, .grey--text.text--darken-4, .grey--text.text-lighten--1 { color: #949ba4 !important; }

                .theme--light .green--text { color: #81c784 !important; }
                .theme--light .red--text { color: #e57373 !important; }
                .theme--light .orange--text { color: #ffb74d !important; }
                .theme--light .blue--text { color: #64b5f6 !important; }

                .red.lighten-5 { background-color: #4a1c1c !important; color: #ff8a80 !important; }
                .orange.lighten-5, .orange.lighten-4 { background-color: #4a3311 !important; color: #ffb74d !important; }
                .green.lighten-5 { background-color: #1b3320 !important; color: #81c784 !important; }
                .blue.lighten-5 { background-color: #1a233a !important; color: #90caf9 !important; }
                .yellow.lighten-4 { background-color: #423600 !important; color: #ffeb3b !important; }

                .theme--light.v-footer { background-color: #2b2d31 !important; border-top: 1px solid #404249 !important; }
                .theme--light.v-footer .red, .theme--light.v-footer hr.red { background-color: rgba(180, 50, 50, 0.25) !important; border-color: rgba(180, 50, 50, 0.4) !important; }
                .theme--light.v-footer .red .white--text, .theme--light.v-footer .red .v-icon.white--text { color: #e8a5a5 !important; }
                .theme--light.v-footer hr.thick.red { height: 1px !important; background-color: rgba(180, 50, 50, 0.5) !important; border: none !important; }
                .theme--light.v-footer .blue, .theme--light.v-footer .primary { background-color: #0d47a1 !important; border-color: #0d47a1 !important; }

                .theme--light .accent--text, .theme--light .v-input--switch__track.accent--text { color: #d84315 !important; }
                .theme--light .v-input--switch__thumb.accent--text { color: #d84315 !important; background-color: #d84315 !important; }
                .v-image div.primary.white--text { background-color: #d84315 !important; color: #ffffff !important; }
                .theme--light.v-card.jp-card-edited { background-color: rgba(178, 92, 0, 0.15) !important; border: 2px solid #b25c00 !important; }

                /* -----------------------------------------
                   B. STARY PANEL ADMINA (V1 - Angular/Ace)
                   ----------------------------------------- */
                body.ng-scope, .main-container, .page-content, .card, .card-header, .card-body, .bg--light {
                    background-color: #1e1f22 !important; color: var(--jp-text) !important; border-color: #383a40 !important;
                }
                .navbar.navbar-pepper .navbar-inner { background: #1e1f22 !important; border-bottom: 1px solid #383a40 !important; box-shadow: none !important; }
                .navbar.navbar-pepper .brand { color: #d84315 !important; text-shadow: none !important; }

                /* POLA TEKSTOWE V1 (Tylko dolne podkreślenie, przezroczyste tło) */
                .nav-search-input, #ban_reason_input, .peps-admin-profile-links + .border-top .ds-form input[type="checkbox"] + .lbl::before, textarea, select, input[type="text"] {
                    background-color: transparent !important;
                    color: var(--jp-text) !important;
                    border: none !important;
                    border-bottom: 1px solid #5c5f66 !important;
                    border-radius: 0 !important;
                    box-shadow: none !important;
                    transition: border-color 0.3s;
                }
                .nav-search-input:focus, #ban_reason_input:focus, textarea:focus, select:focus, input[type="text"]:focus {
                    border-bottom: 1px solid #d84315 !important; /* Subtelniejsze, jednopikselowe podkreślenie */
                    outline: none !important;
                }

                /* Ostrzeżenie User created last 48H */
                p[style*="border: 3px solid red"] {
                    border: none !important;
                    border-left: 4px solid #d32f2f !important;
                    background-color: #4a1c1c !important;
                    color: #ff8a80 !important;
                    padding: 6px 10px !important;
                    border-radius: 4px;
                    font-weight: 500 !important;
                }

                .sidebar { background-color: #1e1f22 !important; border-right: 1px solid #383a40 !important; }
                .nav-list > li > a { background-color: #1e1f22 !important; color: var(--jp-text) !important; border-color: #383a40 !important; text-shadow: none !important; }
                .nav-list > li > a:hover { background-color: #2b2d31 !important; }
                .nav-list > li.active > a, .nav-list > li.active > a:focus { background-color: #313338 !important; color: #d84315 !important; }
                .nav-list > li > .submenu { background-color: #1e1f22 !important; border-color: #383a40 !important; }

                .border-bottom, .border-top, .border-all, .no-border-bottom { border-color: #383a40 !important; }
                .text-gray, .text-gray-darker, .text-mute, .muted { color: #949ba4 !important; }
                .text-bold, .text-medium { color: #ffffff !important; }

                .nav-tabs { border-bottom: 1px solid #383a40 !important; }
                .nav-tabs > li > a { background-color: #1e1f22 !important; border: 1px solid #383a40 !important; color: #949ba4 !important; }
                .nav-tabs > li.active > a, .nav-tabs > li.active > a:hover {
                    background-color: #2b2d31 !important; border-color: #383a40 !important; border-bottom-color: transparent !important; color: #d84315 !important;
                }

                .btn.btn-light, .btn-round, .id-copy-button, .uuidtrack-button {
                    background-color: #313338 !important; color: var(--jp-text) !important; border: 1px solid #404249 !important; background-image: none !important; text-shadow: none !important;
                }
                .btn.btn-light:hover, .btn-round:hover, .id-copy-button:hover, .uuidtrack-button:hover { background-color: #404249 !important; }
                .btn-danger { background-color: #a71b1c !important; border-color: #a71b1c !important; color: #fff !important; background-image: none !important; text-shadow: none !important; }

                .temperature-bar { background-color: #313338 !important; }
                .temperature-bar .bar.hot { background-color: #ef5350 !important; }
                .temperature-bar .bar.cold { background-color: #4fc3f7 !important; }
                div[style*="border: 2px solid red"] { background-color: #4a1c1c !important; border-color: #d32f2f !important; color: #ff8a80 !important; }
                div[style*="border: 2px solid red"] span[style*="color:red"] { color: #ff8a80 !important; }

                /* Tabele i Paginacja V1 */
                .tab-content, .tab-content > div { background-color: #1e1f22 !important; color: var(--jp-text) !important; }
                .table { background-color: #1e1f22 !important; color: var(--jp-text) !important; border: 1px solid #383a40 !important; }
                .table th, .table td { border-top: 1px solid #383a40 !important; background-color: #1e1f22 !important; color: var(--jp-text) !important; }
                .table-striped tbody > tr:nth-child(odd) > td, .table-striped tbody > tr:nth-child(odd) > th { background-color: #2b2d31 !important; }
                .table tbody tr.expired > td, .table tbody tr.deleted > td { background-color: #313338 !important; opacity: 0.6; }
                .table tbody tr.moderated > td { background-color: rgba(92, 21, 21, 0.4) !important; }

                .pagination ul { box-shadow: none !important; }
                .pagination ul > li > a, .pagination ul > li > span {
                    background-color: #313338 !important; color: var(--jp-text) !important; border-color: #404249 !important; text-shadow: none !important;
                }
                .pagination ul > li > a:hover, .pagination ul > li > span:hover { background-color: #404249 !important; color: #ffffff !important; }
                .pagination ul > li.active > a, .pagination ul > li.active > span {
                    background-color: #bd3a11 !important; color: #ffffff !important; border-color: #9e2e0b !important;
                }
                .pagination ul > li.disabled > span, .pagination ul > li.disabled > a, .pagination ul > li.disabled > a:hover {
                    background-color: #1e1f22 !important; color: #5c5f66 !important; border-color: #383a40 !important; cursor: not-allowed !important;
                }

                .ds-pagination, ds-pagination, ds-pagination > div { background-color: #1e1f22 !important; border-color: #383a40 !important; }
                .ds-pagination-pageSizeLabel { color: #949ba4 !important; font-weight: 500 !important; }

                .form-search .icon-search, .form-search .icon-spinner { color: #949ba4 !important; }
                .table .btn-primary { background-color: #1a233a !important; border-color: #2a3b5c !important; color: #64b5f6 !important; background-image: none !important; }
                .table .btn-primary:hover { background-color: #23304c !important; }
                .table td p.red { color: #e57373 !important; }

                /* =========================================
                   Slidery, Config
                   ========================================= */

                /* Pasek (slider) podkreślający aktywną zakładkę */
                .theme--light .v-tabs__slider.orange,
                .v-tabs__slider.orange {
                    background-color: #d84315 !important;
                    border-color: #d84315 !important;
                }

                .theme--light a.link[href*="/admin/inspector/users/"],
                .theme--light a.link[href*="/admin/inspector/ips"] {
                    color: #d84315 !important;
                    text-decoration: none !important;
                }

                .theme--light a.link[href*="/admin/inspector/users/"]:hover,
                .theme--light a.link[href*="/admin/inspector/ips"]:hover {
                    color: #bf360c !important;
                }

                .theme--light a.link[href*="/admin/inspector/users/"] i.orange--text,
                .theme--light a.link[href*="/admin/inspector/ips"] i.orange--text {
                    color: inherit !important;
                }

                /* Wymuszenie przesunięcia przycisku Config w prawo (o 100px) */
                #open_peppermod_config {
                    left: 157px !important;
                }

                span[style*="color:red"], span[style*="color: red"] {
                    color: #e57373 !important; /* Łagodny, pastelowy czerwony */
                }

                .theme--light .yellow.lighten-2.cept-highlighted-text {
                    background-color: #5c1515 !important;
                    color: #ff8a80 !important;
                    padding: 0 2px;
                    border-radius: 2px;
                }

                /* =========================================
                   MODUŁ EDYCJI OBRAZKA (Image Editor)
                   ========================================= */

                /* 1. Usunięcie obramowania głównego kontenera */
                .imageEditor.border-grey--dark {
                    border: none !important;
                }

                /* 2. Usunięcie obramowania z przycisku otwierania obrazka */
                .imageEditor .border-grey--dark {
                    border: none !important;
                }

                /* 3. Ujednolicenie tła menu edytora */
                .imageEditor-menu {
                    background-color: #2b2d31 !important;
                    border-left: 1px solid #383a40 !important;
                }

                /* 4. Opcjonalnie: Zgaszenie jaskrawego żółtego alertu o słabej jakości */
                .imageEditor .orange.lighten-5 {
                    background-color: #4a3311 !important;
                    border: 1px solid #7d5a10 !important;
                    color: #ffb74d !important;
                }

                /* 5. Usunięcie obramowania z przycisków (jakby ktoś chciał pełną czystość) */
                .imageEditor .v-btn {
                    border: none !important;
                }

                /* =========================================
                   MODAL BANOWANIA (Stary panel V1)
                   ========================================= */
                .modal-content, .modal-body, .modal-header, .modal-footer,
                .modal-body > div, .form-horizontal {
                    background-color: #2b2d31 !important;
                    color: var(--jp-text) !important;
                    border-color: #383a40 !important;
                }
                .modal-header, .modal-footer {
                    border-bottom: 1px solid #383a40 !important;
                    border-top: 1px solid #383a40 !important;
                }
                .modal-header .close {
                    color: var(--jp-text) !important;
                    text-shadow: none !important;
                    opacity: 0.8 !important;
                }
                .modal-header .close:hover {
                    opacity: 1 !important;
                }

                /* =========================================
                   TREEVIEW (Drzewo Wyboru np. województw)
                   ========================================= */
                .theme--light .v-treeview-node__label {
                    color: var(--jp-text) !important;
                }
                .theme--light .v-treeview-node__checkbox {
                    color: #949ba4 !important;
                }
                .theme--light .v-treeview-node--active > .v-treeview-node__root .v-treeview-node__checkbox {
                    color: #d84315 !important;
                }
            `;
    } else {
      css += `
                /* 1. Naprawa tła kontenera i samego edytora w jasnym motywie */
                .bg--main {
                    background-color: #ffffff !important;
                }

                .redactor-box, .redactor-editor, .ce-block__content, .codex-editor__redactor {
                    background-color: #ffffff !important;
                    color: #333333 !important;
                    border: 1px solid #cccccc !important;
                }

                /* Tło paska narzędzi edytora, żeby nie zlewał się z polem tekstowym */
                .redactor-toolbar {
                    background-color: #f5f5f5 !important;
                    border-bottom: 1px solid #cccccc !important;
                }

                /* 2. Przesunięcie przycisku Config w prawo (analogicznie do trybu nocnego) */
                #open_peppermod_config {
                    left: 157px !important;
                }
            `;
    }
    GM_addStyle(css);
  }

  // src/utils/text.js
  var settings = {};
  function initTextUtils(currentSettings) {
    settings = currentSettings;
  }
  function getCorePattern(url) {
    if (!url) return "";
    let u = decodeURIComponent(url).toLowerCase().trim();
    u = u.replace(/^https?:\/\//, "").replace(/^(www\.|m\.|mobile\.)/, "");
    return u.split("?")[0].replace(/\/$/, "");
  }
  function generateSmartQuery(title) {
    let clean = title.replace(/\[.*?\]|\(.*?\)|\{.*?\}/g, " ");
    let custom = settings.customStopWords.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
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
  function getFallbackWord(title) {
    let custom = settings.customStopWords.split(",").map((s) => s.trim().toLowerCase()).filter((s) => s.length > 0);
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
  function getCleanNoteFromMessage(messageText) {
    if (!messageText) return "";
    let msg = messageText.toLowerCase();
    if (msg.includes("zakwalifikowana przez nasz zespół jako spam") || msg.includes("potraktowane jako spam")) {
      return "Spam";
    }
    if (msg.includes("zakwalifikowana przez nasz zespół jako autopromocja") || msg.includes("potraktowane jako autopromocja") || msg.includes("udostępniania własnych reflinków")) {
      return "Autopromocja";
    }
    if (msg.includes("uznana przez nasz zespół za obraźliwą") || msg.includes("potraktowane jako obraźliwe zachowanie") || msg.includes("sformułowania uderzające")) {
      return "Obraźliwe zachowanie";
    }
    if (msg.includes("podszycie się pod inną osobę, tworzeniu multikont") || msg.includes("nieuzasadnione zgłaszanie i wygaszanie treści jest u nas niedozwolone.")) {
      return "Naruszenie regulaminu";
    }
    if (msg.includes("NIESTANDARDOWY OPIS")) {
      return "Niestandardowe naruszenie: ";
    }
    if (msg.includes("tworzeniem multikont lub niewłaściwym używaniem systemu ocen") || msg.includes("zależy nam na sprawiedliwych i naturalnych ocenach")) {
      return "Multikonta / manipulacja systemem ocen";
    }
    if (msg.includes("zdublowałeś istniejącą okazję")) {
      return "Dubel";
    }
    if (msg.includes("zawiera niekompletne informacje") || msg.includes("brakuje w niej") || msg.includes("musimy potwierdzić")) {
      return "Uzupełnienie informacji";
    }
    if (msg.includes("oferty polecające") || msg.includes("reflinki") || msg.includes("działań agencji marketingowych")) {
      return "Oferty polecające / reflinki";
    }
    if (msg.includes("treści powiązane z polityką")) {
      return "Polityka";
    }
    if (msg.includes("wyłącznie z Twoim kontem")) {
      return "Decyzje moderacji";
    }
    if (msg.includes("propozycję sprzedaży")) {
      return "Sprzedaż / Wspólne zakupy / Wymiany";
    }
    if (msg.includes("nadużywaniem przycisków") || msg.includes("ustawieniem nazwy użytkownika")) {
      return "Nadużycie funkcji";
    }
    if (msg.includes("związane z tworzeniem multikont") || msg.includes("niewłaściwym używaniem systemu ocen")) {
      return "Multikonto / Manipulacja głosów";
    }
    if (msg.includes("sprawdzamy tylko pierwsze komentarze")) {
      return "Decyzje moderacji";
    }
    return "";
  }

  // src/ui/toast.js
  function showToast(message, isError = false) {
    let toast = document.createElement("div");
    toast.textContent = message;
    toast.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background-color: ${isError ? "#f44336" : "#4caf50"};
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.4);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            transform: translateY(-20px);
            pointer-events: none;
        `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-20px)";
      setTimeout(() => toast.remove(), 300);
    }, 3e3);
  }

  // src/core/i18n.js
  var settings2 = {};
  function initI18n(currentSettings) {
    settings2 = currentSettings;
  }
  var i18n = {
    pl: {
      titleSettings: "⚙️ Ustawienia Jalapeño",
      secAppearance: "🎨 Wygląd i Interfejs",
      secModules: "🚀 Aktywne Moduły",
      secConfig: "⚙️ Konfiguracja Szczegółowa",
      secHistory: "📜 Personalizacja Historii",
      lblFontColor: "Kolor czcionki (Tryb nocny):",
      lblFontSize: "Globalny rozmiar czcionki:",
      fontColorDefault: "Domyślny (Szaro-biały)",
      fontColorWhite: "Czysty biały",
      fontColorGray: "Ciemniejszy szary",
      fontColorBlue: "Lekki błękit",
      fontVerySmall: "Bardzo Mała (12px)",
      fontSmall: "Mała (13px)",
      fontDefault: "Domyślna",
      fontLarge: "Większa (15px)",
      fontVeryLarge: "Duża (16px)",
      activeModules: "Aktywne moduły:",
      histPers: "Personalizacja 'Podobnych okazji' (Historia):",
      livePreview: "Podgląd na żywo:",
      defCurrency: "Kalkulator - Domyślna waluta:",
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
      mMoveApprove: "Przesuń przycisk 'Approve & Send PM'",
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
      lblCom: "💬 Kom:",
      lblMerchantNotes: "📝 Notatki - Merchant",
      btnAddMerchantNote: "Dodaj notatkę",
      btnRemoveMerchantNote: "🗑️ Usuń notatkę",
      placeholderMerchantNote: "Dodaj notatkę dla tego merchanta...",
      msgMerchantNoteSaved: "✅ Notatka zapisana i zsynchronizowana",
      msgMerchantNoteDeleted: "✅ Notatka usunięta",
      msgMerchantNoteError: "❌ Błąd synchronizacji notatki",
      lblShippingCosts: "🚚 Koszty Dostawy",
      lblShippingCost: "Koszt dostawy (PLN)",
      lblFreeDeliveryFrom: "Darmowa dostawa od (PLN)",
      lblShippingNote: "Notatka (opcjonalna)",
      btnAddShippingCost: "Dodaj koszt dostawy",
      btnSaveShippingCost: "💾 Zapisz",
      btnDeleteShippingCost: "🗑️ Usuń",
      msgShippingCostSaved: "✅ Koszt dostawy zapisany i zsynchronizowany",
      msgShippingCostDeleted: "✅ Koszt dostawy usunięty",
      msgShippingCostError: "❌ Błąd synchronizacji kosztu dostawy",
      mLockButtons: "Lock/Unlock przyciski (Edit Lock & Expire Lock)",
      mBannedHighlight: "Podświetlenie 'banned' i 'unauthenticated'",
      lblShippingOffset: "Wysokość panelu dostawy (px):",
      mPriceWarning: "Ostrzeżenie o wzroście ceny (>1%)",
      mImageSearch: "Wyszukiwanie obrazem (Google Lens)",
      mProductInspector: "Inspektor produktu (EAN / ASIN)",
      mInsertToDescription: "🖼 Wstaw do opisu",
      mNoIdentifiers: "Nie znaleziono identyfikatorów",
      mCopyEAN: "Kopiuj EAN",
      mCopyBarcode: "📋 Kopiuj barcode",
      mInspectorTitle: "🔎 Inspektor (EAN / ASIN)",
      mInsertOpenFirst: 'Najpierw otwórz "Edytuj opis", a następnie kliknij 🖼 Wstaw do opisu',
      mInsertSuccess: '✅ Barcode wstawiony — dokonaj dowolnej zmiany i kliknij "Zapisz edycję"',
      mInsertFailed: "❌ Wstawianie nieudane: ",
      mToolbarBarcodeTitle: "Wstaw barcode EAN do opisu",
      mLinkExpander: "Rozwijanie skróconych linków w opisie",
      mToolbarExpandLinksTitle: "Rozwiń skrócone linki w opisie",
      mExpandLinksOpenFirst: 'Najpierw otwórz "Edytuj opis", a następnie kliknij przycisk URL',
      mExpandLinksNone: "Nie znaleziono skróconych linków w opisie",
      mExpandLinksExpandFailed: "Znaleziono {n} skróconych linków, ale nie udało się ich rozwinąć",
      mExpandLinksSuccess: 'Rozwinięto {n} link(ów) — dokonaj dowolnej zmiany i kliknij "Zapisz edycję"',
      mExpandLinksFailed: "Nie udało się rozwinąć linków: ",
      mLensBtn: "🔍 Wyszukaj z Google Lens",
      mLensTitle: "Otwórz bieżący obraz w Google Lens",
      mLensDescription: "Opis produktu z AI Overview (Google Lens)",
      mLensAiCopied: "Opis po polsku skopiowany do schowka. Wróć do zakładki Pepper — wklei się automatycznie do opisu.",
      mLensAiPasted: "Opis z Lens wklejony do opisu okazji",
      mLensAiNothingPending: "Brak gotowego opisu — kliknij przycisk AI w edytorze opisu, aby otworzyć Lens",
      mLensAiOpenEditor: 'Najpierw otwórz "Edytuj opis"',
      mLensAiOpenLens: "🔍 Lens otwarty — poczekaj na AI Overview i wróć tutaj",
      mLensAiNoImage: "Brak zdjęcia okazji — dodaj obrazek przed użyciem opisu AI",
      mToolbarLensAiTitle: "Otwórz Lens i wygeneruj opis produktu (AI Overview)",
      mUpdateAvailable: "Dostępna nowa wersja Jalapeño {v} — kliknij ikonę Tampermonkey → Jalapeño → Sprawdź aktualizacje",
      mClipboardUnavailable: "❌ Schowek nie obsługuje obrazów w tej przeglądarce",
      mCopiedBarcode: "📋 Barcode skopiowany jako PNG",
      mCopyBarcodeError: "❌ Nie udało się skopiować barcode: ",
      mApproveReasons: "Szablony wiadomości (Approve & Send PM)",
      // Analytics
      secAnalytics: "📊 Statystyki Produktywności",
      statUsageHeader: "Użycie",
      statAutomationsHeader: "Automatyzacje",
      statWarningsHeader: "Ostrzeżenia",
      statInspectorHeader: "Inspektor",
      statSummaryHeader: "Podsumowanie",
      statSessions: "Sesje",
      statDaysUsed: "Dni używania",
      statDealsChecked: "Sprawdzone okazje",
      statCalculatorHeader: "Kalkulator",
      statCalculatorCalculations: "Przeliczenia",
      statCalculatorButtonClicks: "Kliknięcia przycisków",
      statShippingAutofills: "Autouzupełnienia wysyłki",
      statMerchantNotes: "Notatki merchantów",
      statApproveReasons: "Szablony Approve & Send PM",
      statTemplates: "Użyte szablony wiadomości (Hold)",
      statHoldNotes: "Użyte notatki hold",
      statInfractionNotes: "Użyte notatki kar/usunięć",
      statLockButtons: "Użycia przycisków lock/unlock",
      statFakePromoWarnings: "Ostrzeżenia Fake Promo",
      statPriceWarnings: "Ostrzeżenia wzrostu ceny",
      statEanDetections: "Wykrycia EAN",
      statBarcodeGenerations: "Generacje barcodów",
      statReverseSearches: "Wyszukiwania obrazem",
      statLensDescriptions: "Wygenerowane opisy AI (Lens)",
      statLensDescriptionsInserted: "Wklejone opisy AI",
      statTotalAutomations: "Łącznie automatyzacji",
      statTotalWarnings: "Łącznie ostrzeżeń",
      statManualActionsAvoided: "Uniknięte czynności ręczne",
      btnResetStats: "Resetuj statystyki",
      confirmResetStats: "Czy na pewno chcesz zresetować wszystkie statystyki? Tej operacji nie można cofnąć."
    },
    en: {
      titleSettings: "⚙️ Jalapeño Settings",
      secAppearance: "🎨 Appearance & UI",
      secModules: "🚀 Active Modules",
      secConfig: "⚙️ Advanced Configuration",
      secHistory: "📜 History Personalization",
      lblFontColor: "Font Color (Dark Mode):",
      lblFontSize: "Global Font Size:",
      fontColorDefault: "Default (Gray-white)",
      fontColorWhite: "Pure White",
      fontColorGray: "Darker Gray",
      fontColorBlue: "Light Blue",
      fontVerySmall: "Very Small (12px)",
      fontSmall: "Small (13px)",
      fontDefault: "Default",
      fontLarge: "Large (15px)",
      fontVeryLarge: "Very Large (16px)",
      activeModules: "Active modules:",
      histPers: "'Similar deals' Customization (History):",
      livePreview: "Live preview:",
      defCurrency: "Converter - Default currency:",
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
      mMoveApprove: "Move 'Approve & Send PM' button",
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
      lblCom: "💬 Com:",
      lblMerchantNotes: "📝 Merchant Notes",
      btnAddMerchantNote: "Add note",
      btnRemoveMerchantNote: "🗑️ Delete note",
      placeholderMerchantNote: "Add a note for this merchant...",
      msgMerchantNoteSaved: "✅ Note saved and synchronized",
      msgMerchantNoteDeleted: "✅ Note deleted",
      msgMerchantNoteError: "❌ Note synchronization error",
      lblShippingCosts: "🚚 Shipping Costs",
      lblShippingCost: "Shipping cost (PLN)",
      lblFreeDeliveryFrom: "Free delivery from (PLN)",
      lblShippingNote: "Note (optional)",
      btnAddShippingCost: "Add shipping cost",
      btnSaveShippingCost: "💾 Save",
      btnDeleteShippingCost: "🗑️ Delete",
      msgShippingCostSaved: "✅ Shipping cost saved and synchronized",
      msgShippingCostDeleted: "✅ Shipping cost deleted",
      msgShippingCostError: "❌ Shipping cost synchronization error",
      mLockButtons: "Lock/Unlock buttons (Edit Lock & Expire Lock)",
      mBannedHighlight: "Highlight 'banned' and 'unauthenticated' words",
      lblShippingOffset: "Shipping panel top offset (px):",
      mPriceWarning: "Price increase warning (>1%)",
      mImageSearch: "Reverse Image Search (Google Lens)",
      mProductInspector: "Product Inspector (EAN / ASIN)",
      mInsertToDescription: "🖼 Insert to description",
      mNoIdentifiers: "No identifiers found",
      mCopyEAN: "Copy EAN",
      mCopyBarcode: "📋 Copy Barcode",
      mInspectorTitle: "🔎 Inspector (EAN / ASIN)",
      mInsertOpenFirst: 'Open "Edit description" first, then click 🖼 Insert to description',
      mInsertSuccess: '✅ Barcode inserted — make any change, then click "Zapisz edycję"',
      mInsertFailed: "❌ Insert failed: ",
      mToolbarBarcodeTitle: "Insert EAN barcode into description",
      mLinkExpander: "Expand shortened links in description",
      mToolbarExpandLinksTitle: "Expand shortened links in description",
      mExpandLinksOpenFirst: 'Open "Edit description" first, then click the URL button',
      mExpandLinksNone: "No shortened links found in the description",
      mExpandLinksExpandFailed: "Found {n} shortened link(s), but could not expand them",
      mExpandLinksSuccess: 'Expanded {n} link(s) — make any change, then click "Zapisz edycję"',
      mExpandLinksFailed: "Could not expand links: ",
      mLensBtn: "🔍 Search with Google Lens",
      mLensTitle: "Open current image in Google Lens",
      mLensDescription: "Product description from AI Overview (Google Lens)",
      mLensAiCopied: "Polish description copied to clipboard. Return to the Pepper tab — it will auto-paste into the description.",
      mLensAiPasted: "Lens description pasted into deal description",
      mLensAiNothingPending: "No ready description — click the AI button in the description editor to open Lens",
      mLensAiOpenEditor: 'Open "Edit description" first',
      mLensAiOpenLens: "🔍 Lens opened — wait for AI Overview and return here",
      mLensAiNoImage: "No deal image found — add an image before using AI description",
      mToolbarLensAiTitle: "Open Lens and generate product description (AI Overview)",
      mUpdateAvailable: "New Jalapeño version {v} available — open Tampermonkey → Jalapeño → Check for updates",
      mClipboardUnavailable: "❌ Clipboard image API not available in this browser",
      mCopiedBarcode: "📋 Barcode copied as PNG image",
      mCopyBarcodeError: "❌ Could not copy barcode: ",
      mApproveReasons: "Message templates (Approve & Send PM)",
      // Analytics
      secAnalytics: "📊 Productivity Statistics",
      statUsageHeader: "Usage",
      statAutomationsHeader: "Automations",
      statWarningsHeader: "Warnings",
      statInspectorHeader: "Inspector",
      statSummaryHeader: "Summary",
      statSessions: "Sessions",
      statDaysUsed: "Days used",
      statDealsChecked: "Deals checked",
      statCalculatorHeader: "Calculator",
      statCalculatorCalculations: "Conversions",
      statCalculatorButtonClicks: "Button clicks",
      statShippingAutofills: "Shipping autofills",
      statMerchantNotes: "Merchant notes",
      statApproveReasons: "Approve & Send PM templates",
      statTemplates: "Hold message templates used",
      statHoldNotes: "Hold notes used",
      statInfractionNotes: "Infraction automations used",
      statLockButtons: "Lock/Unlock button uses",
      statFakePromoWarnings: "Fake promo warnings",
      statPriceWarnings: "Price warnings",
      statEanDetections: "EAN detections",
      statBarcodeGenerations: "Barcode generations",
      statReverseSearches: "Reverse image searches",
      statLensDescriptions: "Lens AI descriptions generated",
      statLensDescriptionsInserted: "Lens AI descriptions inserted",
      statTotalAutomations: "Total automations triggered",
      statTotalWarnings: "Total warnings shown",
      statManualActionsAvoided: "Manual actions avoided",
      btnResetStats: "Reset Statistics",
      confirmResetStats: "Are you sure you want to reset all statistics? This cannot be undone."
    }
  };
  var t = (key) => i18n[settings2.language][key] || key;

  // src/features/highlight.js
  function highlightEditedCards() {
    document.querySelectorAll(".v-card").forEach((card) => {
      let text = card.innerText.toLowerCase();
      if (text.includes("currently edited by") || text.includes("edytowane przez") || text.includes("edytowany przez")) {
        card.classList.add("jp-card-edited");
      } else {
        card.classList.remove("jp-card-edited");
      }
    });
  }
  function highlightBannedAndUnauthenticated() {
    document.querySelectorAll("*").forEach((element) => {
      for (let node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && !element.dataset.jpHighlighted) {
          let text = node.textContent.toLowerCase();
          if (text.includes("banned") || text.includes("unauthenticated")) {
            let span = document.createElement("span");
            span.textContent = node.textContent;
            span.dataset.jpHighlighted = "true";
            if (text.includes("banned")) {
              Object.assign(span.style, {
                backgroundColor: "#ffcccc",
                color: "#cc0000",
                border: "2px solid red",
                fontWeight: "bold",
                borderRadius: "4px",
                padding: "2px 5px"
              });
            } else if (text.includes("unauthenticated")) {
              Object.assign(span.style, {
                backgroundColor: "#fff3cd",
                color: "#856404",
                border: "2px solid #ffeeba",
                fontWeight: "bold",
                borderRadius: "4px",
                padding: "2px 5px"
              });
            }
            element.replaceChild(span, node);
            element.dataset.jpHighlighted = "true";
            break;
          }
        }
      }
    });
  }
  function updateSaveButtonText() {
    document.querySelectorAll("span.flex--inline.boxAlign-ai--all-c").forEach((span) => {
      if (span.innerText.trim() === "Dodaj Okazję") {
        span.innerText = "Zapisz edycję";
      }
    });
  }

  // src/features/analytics.js
  var ANALYTICS_KEY = "jalapenoAnalytics";
  function load() {
    return GM_getValue(ANALYTICS_KEY, {});
  }
  function save(data) {
    GM_setValue(ANALYTICS_KEY, data);
  }
  function initAnalytics() {
    if (!sessionStorage.getItem("jpAnalyticsSessionCounted")) {
      sessionStorage.setItem("jpAnalyticsSessionCounted", "1");
      increment("totalSessions");
    }
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const stored = load();
    if (stored._lastDayUsed !== today) {
      stored.totalDaysUsed = (stored.totalDaysUsed || 0) + 1;
      stored._lastDayUsed = today;
      save(stored);
    }
  }
  function increment(metricName, amount = 1) {
    const stored = load();
    stored[metricName] = (stored[metricName] || 0) + amount;
    save(stored);
  }
  function getStats() {
    const stored = load();
    const s = Object.assign({
      // Usage
      totalSessions: 0,
      totalDaysUsed: 0,
      totalPageChecks: 0,
      settingsOpened: 0,
      calculatorCalculations: 0,
      calculatorButtonClicks: 0,
      // Automations
      autoShippingFilled: 0,
      autoMerchantNotesInserted: 0,
      autoApproveReasonsUsed: 0,
      autoTemplatesUsed: 0,
      autoHoldNotesUsed: 0,
      autoInfractionNotesUsed: 0,
      lockButtonsUsed: 0,
      // Warnings
      fakePromoWarningsShown: 0,
      priceWarningsShown: 0,
      // Inspector
      eanDetections: 0,
      barcodeGenerations: 0,
      reverseImageSearches: 0,
      lensDescriptionsGenerated: 0,
      lensDescriptionsInserted: 0
    }, stored);
    s.totalAutomationsTriggered = s.autoShippingFilled + s.autoMerchantNotesInserted + s.autoApproveReasonsUsed + s.autoTemplatesUsed + s.autoHoldNotesUsed + s.autoInfractionNotesUsed + s.lockButtonsUsed;
    s.totalWarningsShown = s.fakePromoWarningsShown + s.priceWarningsShown;
    s.totalInspectorActions = s.eanDetections + s.barcodeGenerations + s.reverseImageSearches + s.lensDescriptionsGenerated + s.lensDescriptionsInserted;
    s.manualActionsAvoided = s.autoShippingFilled + s.autoMerchantNotesInserted + s.autoApproveReasonsUsed + s.autoTemplatesUsed + s.autoHoldNotesUsed + s.autoInfractionNotesUsed + s.lockButtonsUsed;
    return s;
  }
  function resetStats() {
    save({});
  }

  // src/features/reverseImageSearch.js
  function getImageUrl() {
    const img = document.querySelector(".imageEditor img[src]");
    if (img && img.src && !img.src.startsWith("data:image/gif") && !img.src.endsWith("/blank.gif")) {
      return img.src;
    }
    const vImg = document.querySelector(".imageEditor .v-image__image");
    if (vImg && vImg.style.backgroundImage) {
      const m = vImg.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
      if (m && m[1]) return m[1];
    }
    const fallback = document.querySelector('.imageEditor-preview img, [class*="imageEditor"] img');
    if (fallback && fallback.src && !fallback.src.startsWith("data:image/gif")) {
      return fallback.src;
    }
    return null;
  }
  function updateLensBtn(btn) {
    const url = getImageUrl();
    if (url) {
      btn.dataset.imageUrl = url;
      btn.style.display = "";
    } else {
      btn.style.display = "none";
    }
  }
  function injectLensBtn(editor) {
    if (document.getElementById("jp-lens-btn")) return;
    const btn = document.createElement("button");
    btn.id = "jp-lens-btn";
    btn.className = "jp-lens-btn";
    btn.type = "button";
    btn.textContent = t("mLensBtn");
    btn.title = t("mLensTitle");
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const url = btn.dataset.imageUrl || getImageUrl();
      if (url) {
        increment("reverseImageSearches");
        window.open("https://lens.google.com/uploadbyurl?url=" + encodeURIComponent(url), "_blank");
      }
    });
    editor.insertAdjacentElement("afterend", btn);
    updateLensBtn(btn);
    const observer = new MutationObserver(() => updateLensBtn(btn));
    observer.observe(editor, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["src", "style"]
    });
  }
  function initReverseImageSearch() {
    if (document.getElementById("jp-lens-btn")) return;
    let attempts = 0;
    const MAX_ATTEMPTS = 20;
    const RETRY_MS = 500;
    function tryInject() {
      const editor = document.querySelector(".imageEditor");
      if (editor) {
        injectLensBtn(editor);
      } else if (++attempts < MAX_ATTEMPTS) {
        setTimeout(tryInject, RETRY_MS);
      }
    }
    tryInject();
  }

  // src/features/productInspector.js
  var L_CODES = [
    "0001101",
    "0011001",
    "0010011",
    "0111101",
    "0100011",
    "0110001",
    "0101111",
    "0111011",
    "0110111",
    "0001011"
  ];
  var G_CODES = [
    "0100111",
    "0110011",
    "0011011",
    "0100001",
    "0011101",
    "0111001",
    "0000101",
    "0010001",
    "0001001",
    "0010111"
  ];
  var R_CODES = [
    "1110010",
    "1100110",
    "1101100",
    "1000010",
    "1011100",
    "1001110",
    "1010000",
    "1000100",
    "1001000",
    "1110100"
  ];
  var EAN_PARITY = [
    "LLLLLL",
    "LLGLGG",
    "LLGGLG",
    "LLGGGL",
    "LGLLGG",
    "LGGLLG",
    "LGGGLL",
    "LGLGLG",
    "LGLGGL",
    "LGGLGL"
  ];
  function validateEAN13(code) {
    if (!/^\d{13}$/.test(code)) return false;
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(code[i], 10) * (i % 2 === 0 ? 1 : 3);
    }
    return (10 - sum % 10) % 10 === parseInt(code[12], 10);
  }
  function generateEAN13SVG(code) {
    const W = 2;
    const H = 55;
    const HG = 62;
    const QZ = 9;
    const EXTRA = 14;
    const digits = code.split("").map(Number);
    const parity = EAN_PARITY[digits[0]];
    let rects = "";
    let x = EXTRA + QZ * W;
    function drawBits(pattern, height) {
      for (const bit of pattern) {
        if (bit === "1") {
          rects += `<rect x="${x}" y="0" width="${W}" height="${height}" fill="#000"/>`;
        }
        x += W;
      }
    }
    const leftGuardStart = x;
    drawBits("101", HG);
    const leftDigitsStart = x;
    for (let i = 0; i < 6; i++) {
      const table = parity[i] === "G" ? G_CODES : L_CODES;
      drawBits(table[digits[i + 1]], H);
    }
    const leftDigitsEnd = x;
    drawBits("01010", HG);
    const rightDigitsStart = x;
    for (let i = 0; i < 6; i++) {
      drawBits(R_CODES[digits[i + 7]], H);
    }
    const rightDigitsEnd = x;
    drawBits("101", HG);
    const totalW = EXTRA + (QZ + 3 + 42 + 5 + 42 + 3 + QZ) * W;
    const textY = HG + 10;
    const totalH = textY + 4;
    const svgText = (cx, content, anchor = "middle") => `<text x="${cx}" y="${textY}" font-family="monospace" font-size="9" text-anchor="${anchor}" fill="#000">${content}</text>`;
    const texts = [
      // First digit — left of start guard
      svgText(EXTRA - 2, digits[0], "end"),
      // Left 6 digits — centred below their bars
      svgText((leftDigitsStart + leftDigitsEnd) / 2, digits.slice(1, 7).join("")),
      // Right 6 digits — centred below their bars
      svgText((rightDigitsStart + rightDigitsEnd) / 2, digits.slice(7).join(""))
    ];
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}" style="background:#fff;border-radius:2px;display:block;">` + rects + texts.join("") + `</svg>`;
  }
  function getDescriptionText() {
    const parts = [];
    const textareaSelectors = [
      'textarea[placeholder="Description"]',
      'textarea[aria-label="Description"]',
      'textarea[name="description"]'
    ];
    for (const sel of textareaSelectors) {
      const el = document.querySelector(sel);
      if (el && el.value) parts.push(el.value);
    }
    const richEditor = document.querySelector('.tiptap, .ProseMirror, .redactor-editor, [contenteditable="true"]');
    if (richEditor) parts.push(richEditor.textContent);
    const rendered = document.querySelector(
      '.cept-thread-description-container, [class*="thread-description"], [class*="description-container"]'
    );
    if (rendered) parts.push(rendered.textContent);
    return parts.join(" ");
  }
  function detectIdentifiers() {
    const title = document.querySelector('input[placeholder="Thread title"]')?.value || "";
    const mainUrl = document.querySelector('textarea[name="mainUrl"]')?.value || "";
    const canonUrl = document.querySelector('textarea[name="canonicalUrl"]')?.value || "";
    const desc = getDescriptionText();
    const corpus = [title, mainUrl, canonUrl, desc].join(" ");
    const result = { ean: null, asin: null };
    const ean13Candidates = corpus.match(/\b\d{13}\b/g);
    if (ean13Candidates) {
      result.ean = ean13Candidates.find(validateEAN13) || null;
    }
    const asinFromUrl = corpus.match(/\/dp\/([A-Z0-9]{10})(?:[/?]|$)/);
    if (asinFromUrl) {
      result.asin = asinFromUrl[1];
    } else {
      const asinStandalone = corpus.match(/\bB[0-9][A-Z0-9]{8}\b/);
      if (asinStandalone) result.asin = asinStandalone[0];
    }
    return result;
  }
  function addCopyHandler(btn, text) {
    btn.addEventListener("click", () => {
      const origLabel = btn.textContent;
      const showFeedback = () => {
        btn.textContent = "✅";
        setTimeout(() => {
          btn.textContent = origLabel;
        }, 1200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(showFeedback).catch(() => execCopy(text, showFeedback));
      } else {
        execCopy(text, showFeedback);
      }
    });
  }
  function execCopy(text, callback) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;left:-9999px;top:-9999px;opacity:0;";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      if (callback) callback();
    } catch (_) {
    }
  }
  function makeLink(label, url) {
    const a = document.createElement("a");
    a.className = "jp-inspector-btn jp-inspector-link";
    a.textContent = label;
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    return a;
  }
  function makeIdRow(type, value) {
    const row = document.createElement("div");
    row.className = "jp-inspector-id-row";
    const label = document.createElement("span");
    label.className = "jp-inspector-label";
    label.textContent = type + ":";
    row.appendChild(label);
    const val = document.createElement("span");
    val.className = "jp-inspector-value";
    val.textContent = value;
    row.appendChild(val);
    row.appendChild(makeLink("Google", "https://www.google.com/search?q=" + encodeURIComponent(value)));
    return row;
  }
  async function copyBarcodeAsImage(svgStr, btn) {
    if (!navigator.clipboard || !navigator.clipboard.write) {
      showToast(t("mClipboardUnavailable"), true);
      return;
    }
    const origLabel = btn.textContent;
    try {
      const blob = await svgToPngBlob(svgStr);
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      btn.textContent = "✅";
      setTimeout(() => {
        btn.textContent = origLabel;
      }, 1200);
      showToast(t("mCopiedBarcode"));
    } catch (err) {
      btn.textContent = origLabel;
      showToast(t("mCopyBarcodeError") + err.message, true);
    }
  }
  var _lastUploadedUrl = null;
  var _currentEan = null;
  async function svgToPngBlob(svgStr) {
    const wMatch = svgStr.match(/\swidth="(\d+\.?\d*)"/);
    const hMatch = svgStr.match(/\sheight="(\d+\.?\d*)"/);
    const svgW = wMatch ? parseFloat(wMatch[1]) : 240;
    const svgH = hMatch ? parseFloat(hMatch[1]) : 76;
    const SCALE = 3;
    const dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr);
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("SVG image failed to load"));
    });
    const canvas = document.createElement("canvas");
    canvas.width = svgW * SCALE;
    canvas.height = svgH * SCALE;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve, reject) => {
      canvas.toBlob((b) => b ? resolve(b) : reject(new Error("toBlob returned null")), "image/png");
    });
  }
  function redactorPrepend(iframeWin, editor, imgHtml) {
    const $ = iframeWin.$;
    if ($) {
      const $textarea = $('textarea[name="description"], textarea').first();
      if ($textarea.length) {
        const r = $textarea.data("redactor");
        if (r) {
          const existing = r.$editor ? r.$editor.html() : r.get ? r.get() : editor.innerHTML;
          const newHtml = imgHtml + existing;
          if (typeof r.set === "function") {
            r.set(newHtml);
          } else if (r.$editor) {
            r.$editor.html(newHtml);
            if (typeof r.sync === "function") r.sync();
          } else {
            editor.innerHTML = newHtml;
          }
          console.log("[JP Insert] Redactor jQuery API used ✅");
          const ta = $textarea[0];
          if (ta) {
            const nativeSetter = Object.getOwnPropertyDescriptor(
              iframeWin.HTMLTextAreaElement.prototype,
              "value"
            )?.set;
            if (nativeSetter) nativeSetter.call(ta, ta.value);
            ta.dispatchEvent(new iframeWin.Event("input", { bubbles: true }));
            ta.dispatchEvent(new iframeWin.Event("change", { bubbles: true }));
            console.log("[JP Insert] Vue dirty-state events fired ✅");
          }
          return;
        }
      }
    }
    editor.innerHTML = imgHtml + editor.innerHTML;
    editor.dispatchEvent(new Event("input", { bubbles: true }));
    console.log("[JP Insert] Direct DOM fallback used");
  }
  async function insertBarcodeIntoDescription(svgStr, ean, btn) {
    const origLabel = btn.textContent;
    btn.disabled = true;
    try {
      btn.textContent = "⏳ Checking…";
      const iframeEl = document.querySelector('iframe[src*="description/edit"]');
      let editorEl = null;
      try {
        editorEl = iframeEl?.contentDocument?.querySelector(".redactor-editor");
      } catch (_) {
      }
      if (!editorEl) {
        showToast(t("mInsertOpenFirst"), true);
        return;
      }
      const iframeDoc = iframeEl.contentDocument;
      const iframeWin = iframeEl.contentWindow;
      const editor = editorEl;
      console.log("[JP Insert] Editor ready — content length:", editor.innerHTML.length);
      btn.textContent = "⏳ Uploading…";
      const blob = await svgToPngBlob(svgStr);
      const cookieMatch = document.cookie.match(/xsrf_t=([^;]+)/);
      const xsrfToken = cookieMatch ? decodeURIComponent(cookieMatch[1]).replace(/^"|"$/g, "") : "";
      const fd = new FormData();
      fd.append("image", blob, `barcode-${ean}.png`);
      const rawUrl = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "POST",
          url: "https://www.pepper.pl/image/upload/threads",
          headers: {
            "X-XSRF-TOKEN": xsrfToken,
            "X-Requested-With": "XMLHttpRequest",
            "Accept": "application/json"
          },
          data: fd,
          onload(res) {
            try {
              const parsed = JSON.parse(res.responseText);
              if (parsed?.status === "success") {
                const slot = parsed.data?.slot;
                const url = slot ? parsed.data?.image?.raw?.[slot]?.url : null;
                if (url) {
                  _lastUploadedUrl = url;
                  console.log("[JP Insert] Uploaded ✅ raw URL:", url);
                  resolve(url);
                } else {
                  reject(new Error("No image URL in upload response"));
                }
              } else {
                reject(new Error("Upload rejected: " + (parsed?.messages?.[0] ?? "unknown")));
              }
            } catch (e) {
              reject(new Error("Upload response parse failed: " + e.message));
            }
          },
          onerror() {
            reject(new Error("Upload network error"));
          }
        });
      });
      btn.textContent = "⏳ Inserting…";
      const imgHtml = `<img src="${rawUrl}" alt="EAN ${ean}">`;
      redactorPrepend(iframeWin, editor, imgHtml);
      console.log("[JP Insert] Image prepended ✅");
      showToast(t("mInsertSuccess"));
    } catch (err) {
      console.error("[JP Insert] Failed:", err);
      showToast(t("mInsertFailed") + err.message, true);
    } finally {
      btn.disabled = false;
      btn.textContent = origLabel;
    }
  }
  var _lastCountedBarcodeEan = null;
  function makeBarcodeSection(ean) {
    const section = document.createElement("div");
    section.className = "jp-inspector-barcode";
    if (ean !== _lastCountedBarcodeEan) {
      _lastCountedBarcodeEan = ean;
      increment("barcodeGenerations");
    }
    const svgStr = generateEAN13SVG(ean);
    const tmp = document.createElement("div");
    tmp.innerHTML = svgStr;
    section.appendChild(tmp.firstChild);
    const actions = document.createElement("div");
    actions.className = "jp-inspector-barcode-actions";
    const copyEanBtn = document.createElement("button");
    copyEanBtn.type = "button";
    copyEanBtn.className = "jp-inspector-btn";
    copyEanBtn.textContent = t("mCopyEAN");
    addCopyHandler(copyEanBtn, ean);
    actions.appendChild(copyEanBtn);
    const copyImgBtn = document.createElement("button");
    copyImgBtn.type = "button";
    copyImgBtn.className = "jp-inspector-btn";
    copyImgBtn.textContent = t("mCopyBarcode");
    copyImgBtn.addEventListener("click", () => copyBarcodeAsImage(svgStr, copyImgBtn));
    actions.appendChild(copyImgBtn);
    const insertBtn = document.createElement("button");
    insertBtn.type = "button";
    insertBtn.className = "jp-inspector-btn";
    insertBtn.title = "Upload barcode and insert it at the start of the description";
    insertBtn.textContent = t("mInsertToDescription");
    insertBtn.addEventListener("click", () => insertBarcodeIntoDescription(svgStr, ean, insertBtn));
    actions.appendChild(insertBtn);
    section.appendChild(actions);
    return section;
  }
  var _lastCountedEan = null;
  function renderInspectorBody(body, ids) {
    while (body.firstChild) body.removeChild(body.firstChild);
    _currentEan = ids.ean ?? null;
    if (!ids.ean && !ids.asin) {
      const empty = document.createElement("div");
      empty.className = "jp-inspector-empty";
      empty.textContent = t("mNoIdentifiers");
      body.appendChild(empty);
      return;
    }
    if (ids.ean) {
      if (ids.ean !== _lastCountedEan) {
        _lastCountedEan = ids.ean;
        increment("eanDetections");
      }
      body.appendChild(makeIdRow("EAN", ids.ean));
    }
    if (ids.asin) body.appendChild(makeIdRow("ASIN", ids.asin));
    if (ids.ean) body.appendChild(makeBarcodeSection(ids.ean));
  }
  var _watchedIframes = /* @__PURE__ */ new WeakSet();
  function injectBarcodeToolbarBtn(targetDoc) {
    const toolbar = targetDoc.querySelector(".toolbar");
    if (!toolbar) return false;
    if (toolbar.querySelector(".jp-toolbar-barcode-btn")) return true;
    const btn = targetDoc.createElement("button");
    btn.type = "button";
    btn.className = "button button--type-tag button--mode-light button--square jp-toolbar-barcode-btn";
    btn.title = t("mToolbarBarcodeTitle");
    btn.innerHTML = '<span class="flex--inline boxAlign-ai--all-c" style="font-size:10px;font-weight:700;line-height:1;padding:0 2px;">EAN</span>';
    btn.addEventListener("click", () => {
      if (!_currentEan) {
        showToast(t("mNoIdentifiers"), true);
        return;
      }
      const svgStr = generateEAN13SVG(_currentEan);
      insertBarcodeIntoDescription(svgStr, _currentEan, btn);
    });
    toolbar.appendChild(btn);
    return true;
  }
  function watchIframeToolbar(iframe, iframeDoc) {
    if (_watchedIframes.has(iframe)) return;
    _watchedIframes.add(iframe);
    const innerObs = new MutationObserver(() => {
      injectBarcodeToolbarBtn(iframeDoc);
    });
    innerObs.observe(iframeDoc.body, { childList: true, subtree: true });
  }
  function watchForDescriptionToolbar() {
    function checkAndInject() {
      injectBarcodeToolbarBtn(document);
      const iframe = document.querySelector('iframe[src*="description/edit"]');
      if (!iframe) return;
      let iframeDoc;
      try {
        iframeDoc = iframe.contentDocument;
      } catch (_) {
        return;
      }
      if (!iframeDoc?.body) return;
      const injected = injectBarcodeToolbarBtn(iframeDoc);
      if (!injected) {
        watchIframeToolbar(iframe, iframeDoc);
      }
    }
    const parentObs = new MutationObserver(checkAndInject);
    parentObs.observe(document.body, { childList: true, subtree: true });
    checkAndInject();
  }
  function initProductInspector(leftCol) {
    if (document.getElementById("jp-inspector-panel")) return;
    const panel = document.createElement("div");
    panel.id = "jp-inspector-panel";
    panel.className = "jp-inspector-panel";
    const header = document.createElement("div");
    header.className = "jp-inspector-header";
    header.textContent = t("mInspectorTitle");
    panel.appendChild(header);
    const body = document.createElement("div");
    body.className = "jp-inspector-body";
    panel.appendChild(body);
    leftCol.appendChild(panel);
    function refresh() {
      renderInspectorBody(body, detectIdentifiers());
    }
    refresh();
    let debounceTimer;
    const debouncedRefresh = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(refresh, 400);
    };
    const watchSelectors = [
      'input[placeholder="Thread title"]',
      'textarea[name="mainUrl"]',
      'textarea[name="canonicalUrl"]'
    ];
    watchSelectors.forEach((sel) => {
      const el = document.querySelector(sel);
      if (el) el.addEventListener("input", debouncedRefresh);
    });
    watchForDescriptionToolbar();
  }

  // src/features/linkExpander.js
  var SHORTENER_HOSTS = /* @__PURE__ */ new Set([
    "a.co",
    "amzn.asia",
    "amzn.com",
    "amzn.eu",
    "amzn.to",
    "app.link",
    "bit.ly",
    "buff.ly",
    "cutt.ly",
    "goo.gl",
    "is.gd",
    "ow.ly",
    "rb.gy",
    "rebrand.ly",
    "s.click.aliexpress.com",
    "shorturl.at",
    "soo.gd",
    "t.co",
    "tiny.cc",
    "tinyurl.com"
  ]);
  var _watchedIframes2 = /* @__PURE__ */ new WeakSet();
  var EXPAND_CONCURRENCY = 8;
  var EXPAND_TIMEOUT_MS = 8e3;
  var _initialized = false;
  function needsExpansion(url) {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
      if (SHORTENER_HOSTS.has(host)) return true;
      if (host.startsWith("amzn.")) return true;
      if (/^\/d\/[a-z0-9]+$/i.test(parsed.pathname)) return true;
      if (host.includes("amazon") && /^\/gp\/aws\/redirect/i.test(parsed.pathname)) return true;
      return false;
    } catch (_) {
      return false;
    }
  }
  function decodeHtmlEntities(text) {
    const el = document.createElement("textarea");
    el.innerHTML = text;
    return el.value;
  }
  function normalizeMatchedUrl(url) {
    const trimmed = trimUrlSuffix(url.trim());
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith("//")) return "https:" + trimmed;
    return "https://" + trimmed;
  }
  function trimUrlSuffix(url) {
    return url.replace(/[.,);!\]?]+$/g, "");
  }
  function collectUrls(html) {
    const urls = /* @__PURE__ */ new Set();
    const decoded = decodeHtmlEntities(html);
    const hrefRe = /href=["']([^"']+)["']/gi;
    let match;
    while ((match = hrefRe.exec(decoded)) !== null) {
      let href = match[1].trim();
      try {
        href = decodeURIComponent(href);
      } catch (_) {
      }
      if (/^https?:\/\//i.test(href)) urls.add(href);
      else if (href.startsWith("//")) urls.add("https:" + href);
    }
    const textRe = /(?:https?:\/\/|\/\/|(?:www\.)?)[^\s<>"')\]]+/gi;
    const textMatches = decoded.match(textRe) || [];
    textMatches.forEach((raw) => urls.add(normalizeMatchedUrl(raw)));
    const amznRe = /(?:https?:\/\/)?(?:www\.)?amzn\.eu\/d\/[A-Za-z0-9]+/gi;
    const amznMatches = decoded.match(amznRe) || [];
    amznMatches.forEach((raw) => urls.add(normalizeMatchedUrl(raw)));
    return [...urls];
  }
  function cleanExpandedUrl(url) {
    try {
      const parsed = new URL(url);
      parsed.search = "";
      parsed.hash = "";
      return parsed.href;
    } catch (_) {
      return url.split("?")[0].split("#")[0];
    }
  }
  function parseLocationHeader(responseHeaders) {
    if (!responseHeaders) return null;
    const match = responseHeaders.match(/^Location:\s*(.+)$/im);
    return match ? match[1].trim() : null;
  }
  function gmFetchFinalUrl(url) {
    const attempt = (method) => new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method,
        url,
        timeout: EXPAND_TIMEOUT_MS,
        headers: {
          "User-Agent": navigator.userAgent,
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7"
        },
        onload(res) {
          const location2 = parseLocationHeader(res.responseHeaders);
          const finalUrl = res.finalUrl || res.responseURL || location2 || url;
          resolve({ finalUrl, status: res.status, location: location2 });
        },
        onerror: () => reject(new Error("Network error")),
        ontimeout: () => reject(new Error("Request timed out"))
      });
    });
    const pickBestUrl = (res) => {
      if (res.status >= 300 && res.status < 400 && res.location) return res.location;
      if (res.finalUrl && res.finalUrl !== url) return res.finalUrl;
      return null;
    };
    return attempt("GET").then((get) => {
      const resolved = pickBestUrl(get);
      if (resolved) return cleanExpandedUrl(resolved);
      if (get.status >= 400) throw new Error("HTTP " + get.status);
      return cleanExpandedUrl(get.finalUrl);
    }).catch(() => attempt("HEAD").then((head) => {
      const resolved = pickBestUrl(head);
      if (resolved) return cleanExpandedUrl(resolved);
      if (head.status >= 400) throw new Error("HTTP " + head.status);
      return cleanExpandedUrl(head.finalUrl);
    }));
  }
  async function resolveAllUrls(candidates) {
    const results = new Array(candidates.length).fill(null);
    let nextIndex = 0;
    async function worker() {
      while (nextIndex < candidates.length) {
        const i = nextIndex++;
        const shortUrl = candidates[i];
        try {
          const expanded = await gmFetchFinalUrl(shortUrl);
          if (expanded && expanded !== shortUrl && !needsExpansion(expanded)) {
            results[i] = { shortUrl, expanded };
          }
        } catch (err) {
          console.warn("[JP LinkExpander] Could not expand:", shortUrl, err);
        }
      }
    }
    const workers = Array.from(
      { length: Math.min(EXPAND_CONCURRENCY, candidates.length) },
      () => worker()
    );
    await Promise.all(workers);
    return results;
  }
  function applyUrlReplacement(html, shortUrl, expanded) {
    let result = html.split(shortUrl).join(expanded);
    const trimmed = trimUrlSuffix(shortUrl);
    if (trimmed !== shortUrl) {
      result = result.split(trimmed).join(expanded);
    }
    const withoutProto = shortUrl.replace(/^https?:\/\//i, "");
    if (withoutProto !== shortUrl) {
      result = result.split(withoutProto).join(expanded);
    }
    return result;
  }
  async function expandLinksInHtml(html, searchBlob = html) {
    const candidates = collectUrls(searchBlob).filter(needsExpansion);
    if (candidates.length === 0) return { html, count: 0, found: 0 };
    const resolved = await resolveAllUrls(candidates);
    let result = html;
    let count = 0;
    for (const item of resolved) {
      if (!item) continue;
      result = applyUrlReplacement(result, item.shortUrl, item.expanded);
      count++;
    }
    return { html: result, count, found: candidates.length };
  }
  function getDescriptionEditor() {
    const iframe = document.querySelector('iframe[src*="description/edit"]');
    if (!iframe) return null;
    try {
      const iframeDoc = iframe.contentDocument;
      const editor = iframeDoc?.querySelector(".redactor-editor");
      if (!iframeDoc || !editor) return null;
      return { iframe, iframeDoc, iframeWin: iframe.contentWindow, editor };
    } catch (_) {
      return null;
    }
  }
  function getRedactorHtml(iframeWin, editor) {
    let html = editor.innerHTML;
    let textareaValue = "";
    const $ = iframeWin.$;
    if ($) {
      const $textarea = $('textarea[name="description"], textarea').first();
      if ($textarea.length) {
        textareaValue = $textarea[0]?.value || "";
        const r = $textarea.data("redactor");
        if (r) {
          html = r.$editor ? r.$editor.html() : r.get ? r.get() : editor.innerHTML;
        }
      }
    }
    const editorPlain = (html || "").replace(/<[^>]+>/g, "").trim();
    if (!editorPlain && textareaValue.trim()) return textareaValue;
    if (!html.trim() && textareaValue.trim()) return textareaValue;
    return html;
  }
  function getEditorContent(iframeWin, editor) {
    const html = getRedactorHtml(iframeWin, editor);
    let textareaValue = "";
    const $ = iframeWin.$;
    if ($) {
      const $textarea = $('textarea[name="description"], textarea').first();
      textareaValue = $textarea[0]?.value || "";
    }
    const plain = editor.textContent || "";
    return {
      html,
      searchBlob: [html, textareaValue, plain].join("\n")
    };
  }
  function setRedactorHtml(iframeWin, editor, html) {
    const $ = iframeWin.$;
    if ($) {
      const $textarea = $('textarea[name="description"], textarea').first();
      if ($textarea.length) {
        const r = $textarea.data("redactor");
        if (r) {
          if (typeof r.set === "function") {
            r.set(html);
          } else if (r.$editor) {
            r.$editor.html(html);
            if (typeof r.sync === "function") r.sync();
          } else {
            editor.innerHTML = html;
          }
          const ta = $textarea[0];
          if (ta) {
            const nativeSetter = Object.getOwnPropertyDescriptor(
              iframeWin.HTMLTextAreaElement.prototype,
              "value"
            )?.set;
            if (nativeSetter) nativeSetter.call(ta, ta.value);
            ta.dispatchEvent(new iframeWin.Event("input", { bubbles: true }));
            ta.dispatchEvent(new iframeWin.Event("change", { bubbles: true }));
          }
          return;
        }
      }
    }
    editor.innerHTML = html;
    editor.dispatchEvent(new Event("input", { bubbles: true }));
  }
  async function expandLinksInDescription(btn) {
    const origLabel = btn.innerHTML;
    btn.disabled = true;
    try {
      const ctx = getDescriptionEditor();
      if (!ctx) {
        showToast(t("mExpandLinksOpenFirst"), true);
        return;
      }
      btn.innerHTML = '<span class="flex--inline boxAlign-ai--all-c" style="font-size:10px;font-weight:700;line-height:1;padding:0 2px;">⏳</span>';
      const { html: currentHtml, searchBlob } = getEditorContent(ctx.iframeWin, ctx.editor);
      const { html: newHtml, count, found } = await expandLinksInHtml(currentHtml, searchBlob);
      if (found === 0) {
        showToast(t("mExpandLinksNone"), true);
        return;
      }
      if (count === 0) {
        showToast(t("mExpandLinksExpandFailed").replace("{n}", String(found)), true);
        return;
      }
      btn.innerHTML = '<span class="flex--inline boxAlign-ai--all-c" style="font-size:10px;font-weight:700;line-height:1;padding:0 2px;">✏️</span>';
      setRedactorHtml(ctx.iframeWin, ctx.editor, newHtml);
      increment("linksExpanded", count);
      showToast(t("mExpandLinksSuccess").replace("{n}", String(count)));
    } catch (err) {
      console.error("[JP LinkExpander] Failed:", err);
      showToast(t("mExpandLinksFailed") + err.message, true);
    } finally {
      btn.disabled = false;
      btn.innerHTML = origLabel;
    }
  }
  function injectExpandLinksToolbarBtn(targetDoc) {
    const toolbar = targetDoc.querySelector(".toolbar");
    if (!toolbar) return false;
    if (toolbar.querySelector(".jp-toolbar-expand-links-btn")) return true;
    const btn = targetDoc.createElement("button");
    btn.type = "button";
    btn.className = "button button--type-tag button--mode-light button--square jp-toolbar-expand-links-btn";
    btn.title = t("mToolbarExpandLinksTitle");
    btn.innerHTML = '<span class="flex--inline boxAlign-ai--all-c" style="font-size:10px;font-weight:700;line-height:1;padding:0 2px;">URL</span>';
    btn.addEventListener("click", () => expandLinksInDescription(btn));
    toolbar.appendChild(btn);
    return true;
  }
  function watchIframeToolbar2(iframe, iframeDoc) {
    if (_watchedIframes2.has(iframe)) return;
    _watchedIframes2.add(iframe);
    const innerObs = new MutationObserver(() => {
      injectExpandLinksToolbarBtn(iframeDoc);
    });
    innerObs.observe(iframeDoc.body, { childList: true, subtree: true });
  }
  function watchForDescriptionToolbar2() {
    function checkAndInject() {
      injectExpandLinksToolbarBtn(document);
      const iframe = document.querySelector('iframe[src*="description/edit"]');
      if (!iframe) return;
      let iframeDoc;
      try {
        iframeDoc = iframe.contentDocument;
      } catch (_) {
        return;
      }
      if (!iframeDoc?.body) return;
      const injected = injectExpandLinksToolbarBtn(iframeDoc);
      if (!injected) {
        watchIframeToolbar2(iframe, iframeDoc);
      }
    }
    const parentObs = new MutationObserver(checkAndInject);
    parentObs.observe(document.body, { childList: true, subtree: true });
    checkAndInject();
  }
  function initLinkExpander() {
    if (_initialized) return;
    _initialized = true;
    watchForDescriptionToolbar2();
  }

  // src/features/lensAiOverview.js
  var PENDING_DESC_KEY = "jpPendingLensDescription";
  var PENDING_DESC_TS_KEY = "jpPendingLensDescriptionTs";
  var LENS_FLOW_KEY = "jpLensFlowActive";
  var LENS_PASTED_KEY = "jpLensDescriptionPasted";
  var _watchedIframes3 = /* @__PURE__ */ new WeakSet();
  var _innerObservers = /* @__PURE__ */ new WeakMap();
  var _pasteInitialized = false;
  var _googleInitialized = false;
  var _lastProcessedOverview = "";
  var _toolbarDebounceTimer = null;
  var _autoPasteScheduled = false;
  var _autoPasteDone = false;
  function translateToPolish(text) {
    const CHUNK_SIZE = 3500;
    const translateChunk = (chunk) => new Promise((resolve, reject) => {
      const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pl&dt=t&q=" + encodeURIComponent(chunk);
      GM_xmlhttpRequest({
        method: "GET",
        url,
        timeout: 2e4,
        onload(res) {
          try {
            const data = JSON.parse(res.responseText);
            const translated = (data[0] || []).map((part) => part[0]).join("");
            resolve(translated || chunk);
          } catch (err) {
            reject(err);
          }
        },
        onerror: () => reject(new Error("Translation network error")),
        ontimeout: () => reject(new Error("Translation timed out"))
      });
    });
    if (text.length <= CHUNK_SIZE) return translateChunk(text);
    const chunks = [];
    for (let i = 0; i < text.length; i += CHUNK_SIZE) {
      chunks.push(text.slice(i, i + CHUNK_SIZE));
    }
    return chunks.reduce(
      (promise, chunk) => promise.then((acc) => translateChunk(chunk).then((part) => acc + part)),
      Promise.resolve("")
    );
  }
  var NOISE_LINE_PATTERNS = [
    /Kliknij dwukrotnie/i,
    /Widoczna jest (krótka|pełna) treść/i,
    /Przeczytaj (krótką|pełną) treść/i,
    /^(Show more|Show less|Pokaż więcej|Pokaż mniej|Pokaż wszystko)$/i,
    /^(Źródła|Sources)$/i,
    /^Ekspert ds\./i,
    /Przewidzieć/i,
    /^Funciona muy bien\.?$/i
  ];
  var STOP_LINE_PATTERNS = [
    /^Amazon\.pl$/i,
    /^Allegro$/i,
    /^\+\d+$/,
    /^\d+\s*witryn/i,
    /Pokaż wszystko/i,
    /^(Ceneo|empik|botland|Media Expert|RTV Euro AGD|Oficjalny Sklep)/i,
    /SONOFF.*\.\.\.$/i,
    /Inteligentny.*\.\.\.$/i
  ];
  function isShoppingOrJunkLine(line) {
    if (/\d+[,.]\d{2}\s*zł/i.test(line)) return true;
    if (/[·•]/.test(line) && /\d/.test(line)) return true;
    if (/osób zakupiło|dostawa pojutrze|zakupione|Inteligentnie!/i.test(line)) return true;
    if (/^Biały, prostokątny|^Czarny, prostokątny/i.test(line)) return true;
    if (/^\d{1,2}\.\d{1,2}\.\d{4}/.test(line)) return true;
    if (line.length > 100 && /\.{3}$/.test(line)) return true;
    return false;
  }
  function isNoiseLine(line) {
    return NOISE_LINE_PATTERNS.some((re) => re.test(line));
  }
  function shouldStopCollection(line) {
    return STOP_LINE_PATTERNS.some((re) => re.test(line));
  }
  function mergeIntoParagraphs(lines) {
    const paragraphs = [];
    let current = "";
    for (const line of lines) {
      if (!current) {
        current = line;
        continue;
      }
      const continues = !current.endsWith(".") && /^[a-ząćęłńóśźż(]/.test(line);
      if (continues) {
        current += " " + line;
      } else {
        paragraphs.push(current);
        current = line;
      }
    }
    if (current) paragraphs.push(current);
    return paragraphs.map((p) => p.replace(/\s+/g, " ").trim()).filter((p) => p.length >= 25 && /[.!?]$/.test(p)).slice(0, 6).join("\n\n");
  }
  function cleanAiOverviewRaw(raw) {
    const text = raw.replace(/^AI\s*Overview\s*/i, "").replace(/^Przegląd\s+AI\s*/i, "").trim();
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const kept = [];
    for (const line of lines) {
      if (shouldStopCollection(line)) break;
      if (isNoiseLine(line) || isShoppingOrJunkLine(line)) continue;
      kept.push(line);
    }
    const merged = mergeIntoParagraphs(kept);
    return merged.length >= 40 ? merged : null;
  }
  function findAiOverviewHeading() {
    const labelRe = /^(AI\s*Overview|Przegląd\s+AI)$/i;
    for (const el of document.querySelectorAll("h1, h2, h3, div, span")) {
      if (labelRe.test(el.textContent.trim())) return el;
    }
    return null;
  }
  function collectProseParagraphs(root) {
    const lines = [];
    for (const p of root.querySelectorAll("p")) {
      if (p.closest('a[href*="/shopping"]') || p.closest('[data-attrid*="product"]')) break;
      if (p.querySelector('a[href*="amazon"], a[href*="allegro"]')) break;
      const line = (p.innerText || "").trim();
      if (!line) continue;
      if (shouldStopCollection(line)) break;
      if (isNoiseLine(line) || isShoppingOrJunkLine(line)) continue;
      lines.push(line);
    }
    return lines;
  }
  function extractAiOverviewText() {
    const heading = findAiOverviewHeading();
    if (heading) {
      const root = heading.closest("[data-container-id]") || heading.closest("[data-hveid]") || heading.closest(".WaaZC") || heading.parentElement?.parentElement?.parentElement;
      if (root) {
        const proseLines = collectProseParagraphs(root);
        if (proseLines.length > 0) {
          const merged = mergeIntoParagraphs(proseLines);
          if (merged.length >= 40) return merged;
        }
        const cleaned = cleanAiOverviewRaw(root.innerText || "");
        if (cleaned) return cleaned;
      }
    }
    for (const block of document.querySelectorAll('[data-container-id="aimc"]')) {
      const proseLines = collectProseParagraphs(block);
      if (proseLines.length > 0) {
        const merged = mergeIntoParagraphs(proseLines);
        if (merged.length >= 40) return merged;
      }
      const cleaned = cleanAiOverviewRaw(block.innerText || "");
      if (cleaned) return cleaned;
    }
    return null;
  }
  function formatDescription(text) {
    const lines = text.replace(/\r\n/g, "\n").split("\n").map((l) => l.trim()).filter(Boolean);
    const kept = [];
    for (const line of lines) {
      if (shouldStopCollection(line)) break;
      if (isNoiseLine(line) || isShoppingOrJunkLine(line)) continue;
      kept.push(line);
    }
    let result = kept.length > 0 ? mergeIntoParagraphs(kept) : text;
    result = result.replace(/\n{3,}/g, "\n\n").replace(/([.!?])\s+(?=[A-ZĄĆĘŁŃÓŚŹŻ])/g, "$1\n\n").trim();
    if (result.length > 1500) {
      result = result.slice(0, 1500).replace(/\s+\S*$/, "") + ".";
    }
    return result;
  }
  function storePendingDescription(text) {
    GM_setValue(PENDING_DESC_KEY, text);
    GM_setValue(PENDING_DESC_TS_KEY, Date.now());
  }
  function getPendingDescription() {
    const text = GM_getValue(PENDING_DESC_KEY, "");
    const ts = GM_getValue(PENDING_DESC_TS_KEY, 0);
    if (!text || !ts || Date.now() - ts > 30 * 60 * 1e3) return null;
    return text;
  }
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;left:-9999px;top:0;";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
  }
  function showGoogleBanner(preview) {
    let banner = document.getElementById("jp-lens-ai-banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "jp-lens-ai-banner";
      banner.style.cssText = [
        "position:fixed",
        "bottom:20px",
        "right:20px",
        "z-index:2147483647",
        "max-width:360px",
        "padding:14px 16px",
        "border-radius:8px",
        "background:#1e1f22",
        "color:#fff",
        "font:13px/1.5 sans-serif",
        "box-shadow:0 4px 20px rgba(0,0,0,.35)",
        "border:1px solid #4fc3f7"
      ].join(";");
      document.body.appendChild(banner);
    }
    const short = preview.length > 120 ? preview.slice(0, 117) + "…" : preview;
    banner.replaceChildren();
    const title = document.createElement("div");
    title.style.cssText = "font-weight:700;color:#4fc3f7;margin-bottom:6px;";
    title.textContent = "🌶️ Jalapeño";
    const msg = document.createElement("div");
    msg.style.marginBottom = "8px";
    msg.textContent = t("mLensAiCopied");
    const previewEl = document.createElement("div");
    previewEl.style.cssText = "font-size:11px;color:#b9bbbe;max-height:72px;overflow:hidden;";
    previewEl.textContent = short;
    banner.append(title, msg, previewEl);
  }
  async function processAiOverview(rawText) {
    if (!rawText || rawText === _lastProcessedOverview) return;
    _lastProcessedOverview = rawText;
    try {
      const translated = await translateToPolish(rawText);
      const formatted = formatDescription(translated);
      if (!formatted) return;
      storePendingDescription(formatted);
      await copyToClipboard(formatted);
      increment("lensDescriptionsGenerated");
      showGoogleBanner(formatted);
    } catch (err) {
      console.warn("[JP LensAI] Processing failed:", err);
    }
  }
  function watchForAiOverview() {
    let debounceTimer = null;
    const scan = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const text = extractAiOverviewText();
        if (text) processAiOverview(text);
      }, 1500);
    };
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
    scan();
  }
  function initLensAiOverview(settings3) {
    if (_googleInitialized || settings3.enableLensDescription === false) return;
    _googleInitialized = true;
    watchForAiOverview();
  }
  function getDescriptionEditor2() {
    const iframe = document.querySelector('iframe[src*="description/edit"]');
    if (!iframe) return null;
    try {
      const iframeDoc = iframe.contentDocument;
      const editor = iframeDoc?.querySelector(".redactor-editor");
      if (!iframeDoc || !editor) return null;
      return { iframeDoc, iframeWin: iframe.contentWindow, editor };
    } catch (_) {
      return null;
    }
  }
  function getRedactorHtml2(iframeWin, editor) {
    const $ = iframeWin.$;
    if ($) {
      const $textarea = $('textarea[name="description"], textarea').first();
      if ($textarea.length) {
        const r = $textarea.data("redactor");
        if (r) {
          return r.$editor ? r.$editor.html() : r.get ? r.get() : editor.innerHTML;
        }
      }
    }
    return editor.innerHTML;
  }
  function setRedactorHtml2(iframeWin, editor, html) {
    const $ = iframeWin.$;
    if ($) {
      const $textarea = $('textarea[name="description"], textarea').first();
      if ($textarea.length) {
        const r = $textarea.data("redactor");
        if (r) {
          if (typeof r.set === "function") {
            r.set(html);
          } else if (r.$editor) {
            r.$editor.html(html);
            if (typeof r.sync === "function") r.sync();
          } else {
            editor.innerHTML = html;
          }
          const ta = $textarea[0];
          if (ta) {
            const nativeSetter = Object.getOwnPropertyDescriptor(
              iframeWin.HTMLTextAreaElement.prototype,
              "value"
            )?.set;
            if (nativeSetter) nativeSetter.call(ta, ta.value);
            ta.dispatchEvent(new iframeWin.Event("input", { bubbles: true }));
            ta.dispatchEvent(new iframeWin.Event("change", { bubbles: true }));
          }
          return;
        }
      }
    }
    editor.innerHTML = html;
    editor.dispatchEvent(new Event("input", { bubbles: true }));
  }
  function appendDescriptionText(text) {
    const ctx = getDescriptionEditor2();
    if (!ctx) return false;
    const htmlBlock = text.split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
    const current = getRedactorHtml2(ctx.iframeWin, ctx.editor);
    const separator = current.trim() ? "<p><br></p>" : "";
    setRedactorHtml2(ctx.iframeWin, ctx.editor, current + separator + htmlBlock);
    return true;
  }
  function pastePendingDescription(btn) {
    const pending = getPendingDescription();
    if (!pending) {
      showToast(t("mLensAiNothingPending"), true);
      return false;
    }
    if (!appendDescriptionText(pending)) {
      showToast(t("mLensAiOpenEditor"), true);
      return false;
    }
    sessionStorage.setItem(LENS_PASTED_KEY, "1");
    sessionStorage.removeItem(LENS_FLOW_KEY);
    GM_setValue(PENDING_DESC_KEY, "");
    increment("lensDescriptionsInserted");
    showToast(t("mLensAiPasted"));
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<span style="font-size:10px;font-weight:700;">✅</span>';
      setTimeout(() => {
        btn.innerHTML = orig;
      }, 1500);
    }
    return true;
  }
  function openLensForDescription(btn) {
    const url = getImageUrl();
    if (!url) {
      showToast(t("mLensAiNoImage"), true);
      return;
    }
    markLensFlowStarted();
    window.open("https://lens.google.com/uploadbyurl?url=" + encodeURIComponent(url), "_blank");
    showToast(t("mLensAiOpenLens"));
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<span class="flex--inline boxAlign-ai--all-c" style="font-size:10px;font-weight:700;line-height:1;padding:0 2px;">⏳</span>';
      setTimeout(() => {
        btn.innerHTML = orig;
      }, 1500);
    }
  }
  function handleAiToolbarClick(btn) {
    if (getPendingDescription() && sessionStorage.getItem(LENS_PASTED_KEY) !== "1") {
      if (pastePendingDescription(btn)) return;
    }
    openLensForDescription(btn);
  }
  function injectLensAiToolbarBtn(targetDoc) {
    const toolbar = targetDoc.querySelector(".toolbar");
    if (!toolbar) return false;
    if (toolbar.querySelector(".jp-toolbar-lens-ai-btn")) return true;
    const btn = targetDoc.createElement("button");
    btn.type = "button";
    btn.className = "button button--type-tag button--mode-light button--square jp-toolbar-lens-ai-btn";
    btn.title = t("mToolbarLensAiTitle");
    btn.innerHTML = '<span class="flex--inline boxAlign-ai--all-c" style="font-size:10px;font-weight:700;line-height:1;padding:0 2px;">AI</span>';
    btn.addEventListener("click", () => handleAiToolbarClick(btn));
    toolbar.appendChild(btn);
    return true;
  }
  function watchIframeToolbar3(iframe, iframeDoc) {
    if (_watchedIframes3.has(iframe)) return;
    _watchedIframes3.add(iframe);
    const innerObs = new MutationObserver(() => {
      if (injectLensAiToolbarBtn(iframeDoc)) {
        innerObs.disconnect();
        _innerObservers.delete(iframe);
      }
    });
    _innerObservers.set(iframe, innerObs);
    innerObs.observe(iframeDoc.body, { childList: true, subtree: true });
  }
  function scheduleAutoPaste() {
    if (_autoPasteScheduled || _autoPasteDone) return;
    if (sessionStorage.getItem(LENS_PASTED_KEY) === "1") return;
    if (sessionStorage.getItem(LENS_FLOW_KEY) !== "1") return;
    if (!getPendingDescription()) return;
    _autoPasteScheduled = true;
    setTimeout(() => {
      _autoPasteScheduled = false;
      if (_autoPasteDone || sessionStorage.getItem(LENS_PASTED_KEY) === "1") return;
      if (tryAutoPaste()) {
        _autoPasteDone = true;
      }
    }, 1200);
  }
  function tryAutoPaste() {
    if (sessionStorage.getItem(LENS_PASTED_KEY) === "1") return false;
    if (sessionStorage.getItem(LENS_FLOW_KEY) !== "1") return false;
    if (!getPendingDescription()) return false;
    if (pastePendingDescription()) {
      sessionStorage.setItem(LENS_PASTED_KEY, "1");
      return true;
    }
    return false;
  }
  function watchForDescriptionToolbar3() {
    function doCheckAndInject() {
      injectLensAiToolbarBtn(document);
      const iframe = document.querySelector('iframe[src*="description/edit"]');
      if (!iframe) {
        _autoPasteScheduled = false;
        return;
      }
      let iframeDoc;
      try {
        iframeDoc = iframe.contentDocument;
      } catch (_) {
        return;
      }
      if (!iframeDoc?.body) return;
      const toolbarReady = injectLensAiToolbarBtn(iframeDoc);
      if (!toolbarReady) {
        watchIframeToolbar3(iframe, iframeDoc);
        return;
      }
      scheduleAutoPaste();
    }
    function checkAndInject() {
      clearTimeout(_toolbarDebounceTimer);
      _toolbarDebounceTimer = setTimeout(doCheckAndInject, 400);
    }
    const parentObs = new MutationObserver(checkAndInject);
    parentObs.observe(document.body, { childList: true, subtree: true });
    checkAndInject();
  }
  function initLensDescriptionPaste(settings3) {
    if (_pasteInitialized || settings3.enableLensDescription === false) return;
    _pasteInitialized = true;
    watchForDescriptionToolbar3();
  }
  function markLensFlowStarted() {
    sessionStorage.setItem(LENS_FLOW_KEY, "1");
    sessionStorage.removeItem(LENS_PASTED_KEY);
    GM_setValue(PENDING_DESC_KEY, "");
    GM_setValue(PENDING_DESC_TS_KEY, 0);
    _autoPasteDone = false;
    _autoPasteScheduled = false;
  }

  // src/features/updateCheck.js
  var UPDATE_CHECK_URL = "https://raw.githubusercontent.com/wojciech-g/Jalapeno-Pepper/main/jalapeno.user.js";
  var LAST_CHECK_KEY = "jpLastUpdateCheck";
  function isNewerVersion(remote, local) {
    const r = remote.split(".").map((n) => parseInt(n, 10) || 0);
    const l = local.split(".").map((n) => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(r.length, l.length); i++) {
      if ((r[i] || 0) > (l[i] || 0)) return true;
      if ((r[i] || 0) < (l[i] || 0)) return false;
    }
    return false;
  }
  function checkForScriptUpdate() {
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    if (GM_getValue(LAST_CHECK_KEY) === today) return;
    GM_setValue(LAST_CHECK_KEY, today);
    const localVersion = typeof GM_info !== "undefined" && GM_info.script ? GM_info.script.version : null;
    if (!localVersion) return;
    GM_xmlhttpRequest({
      method: "GET",
      url: UPDATE_CHECK_URL,
      timeout: 12e3,
      onload(res) {
        const match = res.responseText.match(/@version\s+([\d.]+)/);
        if (!match) return;
        const remoteVersion = match[1];
        if (!isNewerVersion(remoteVersion, localVersion)) return;
        showToast(t("mUpdateAvailable").replace("{v}", remoteVersion), true);
      }
    });
  }

  // src/main.js
  (function() {
    "use strict";
    const isGoogleLensContext = /^www\.google\.(com|pl)$/.test(location.hostname) || location.hostname === "lens.google.com";
    const API_URL = "https://script.google.com/macros/s/AKfycbxPY1KVfIZ-MdhBG_QPYhE-H8QsDCqIp2OkD9nBKU8-tGh8mF5OReV0KRVFMecUX0xUcQ/exec";
    const MERCHANT_NOTES_API_URL = "https://script.google.com/macros/s/AKfycbyLBnmCCfJPnmc1owPB-pcxENNXkRuLEb0jkgmBOseU4bpFQVFsPMojJUcxD8vd-x3d/exec";
    const SHIPPING_COSTS_API_URL = "https://script.google.com/macros/s/AKfycbw-oGcwhBWyvNjr4qosje8MbDXBeiVJeoUa5BLQ1cKUJK51LnvjMw0o7oHNfax72eE1/exec";
    const DEBUG = true;
    let fakePromoDB = {};
    let exchangeRates = null;
    const DEFAULT_SETTINGS = {
      theme: "light",
      // 'light' | 'dark'
      language: "pl",
      // 'pl' | 'en'
      defaultCurrency: "EUR",
      historyCount: 3,
      customStopWords: "",
      hiddenButtons: ["DekuDeals"],
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
      customFloatingText: " - Spersonalizuj mnie w ustawieniach!",
      floatingButtonAutoFreeDelivery: false,
      enableMoveApproveBtn: false,
      enableInfractionNote: true,
      enableMerchantNotes: true,
      enableShippingCosts: true,
      enableApproveReasons: true,
      enableLockButtons: true,
      enableBannedHighlight: true,
      shippingPanelTopOffset: 135,
      enablePriceWarning: true,
      enableReverseImageSearch: true,
      enableProductInspector: true,
      enableLinkExpander: true,
      enableLensDescription: true
    };
    let settings3 = Object.assign({}, DEFAULT_SETTINGS, GM_getValue("jalapenoSettings", {}));
    initTextUtils(settings3);
    initI18n(settings3);
    if (isGoogleLensContext) {
      initLensAiOverview(settings3);
      return;
    }
    initAnalytics();
    checkForScriptUpdate();
    function saveSettings(newSettings) {
      settings3 = newSettings;
      GM_setValue("jalapenoSettings", settings3);
      location.reload();
    }
    injectThemeCSS(settings3);
    function openSettings() {
      increment("settingsOpened");
      const stats = getStats();
      const modalHtml = `
            <div class="modal-overlay" id="modal-overlay"></div>
            <div id="jalapeno-settings-modal" style="max-height: 90vh; overflow-y: auto;">
                <h2 style="margin-top:0; margin-bottom: 25px; text-align: center; color: var(--jp-link);">${t("titleSettings")}</h2>

                <h4 style="margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid var(--jp-border); color: var(--jp-text); font-size: 15px;">
                    ${t("secAppearance")}
                </h4>
                <div class="settings-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px 20px;">
                    <div>
                        <label>${t("optTheme")}</label>
                        <select id="set-theme" style="width:100%">
                            <option value="light" ${settings3.theme === "light" ? "selected" : ""}>Light (Jasny)</option>
                            <option value="dark" ${settings3.theme === "dark" ? "selected" : ""}>Dark (Ciemny)</option>
                        </select>
                    </div>
                    <div>
                        <label>${t("optLang")}</label>
                        <select id="set-lang" style="width:100%">
                            <option value="pl" ${settings3.language === "pl" ? "selected" : ""}>Polski (PL)</option>
                            <option value="en" ${settings3.language === "en" ? "selected" : ""}>English (EN)</option>
                        </select>
                    </div>
                    <div>
                        <label>${t("lblFontColor")}</label>
                        <select id="set-dark-text-color" style="width:100%">
                            <option value="#dbdee1" ${settings3.darkTextColor === "#dbdee1" ? "selected" : ""}>${t("fontColorDefault")}</option>
                            <option value="#ffffff" ${settings3.darkTextColor === "#ffffff" ? "selected" : ""}>${t("fontColorWhite")}</option>
                            <option value="#949ba4" ${settings3.darkTextColor === "#949ba4" ? "selected" : ""}>${t("fontColorGray")}</option>
                            <option value="#b2dfdb" ${settings3.darkTextColor === "#b2dfdb" ? "selected" : ""}>${t("fontColorBlue")}</option>
                        </select>
                    </div>
                    <div>
                        <label>${t("lblFontSize")}</label>
                        <select id="set-font-size" style="width:100%">
                            <option value="12px" ${settings3.fontSize === "12px" ? "selected" : ""}>${t("fontVerySmall")}</option>
                            <option value="13px" ${settings3.fontSize === "13px" ? "selected" : ""}>${t("fontSmall")}</option>
                            <option value="default" ${!settings3.fontSize || settings3.fontSize === "default" ? "selected" : ""}>${t("fontDefault")}</option>
                            <option value="15px" ${settings3.fontSize === "15px" ? "selected" : ""}>${t("fontLarge")}</option>
                            <option value="16px" ${settings3.fontSize === "16px" ? "selected" : ""}>${t("fontVeryLarge")}</option>
                        </select>
                    </div>
                </div>

                <h4 style="margin: 30px 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid var(--jp-border); color: var(--jp-text); font-size: 15px;">
                    ${t("secModules")}
                </h4>
                <div class="settings-row">
                    <div style="font-size: 13px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-fakepromo" ${settings3.enableFakePromo ? "checked" : ""}> ${t("mFakePromo")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-calc" ${settings3.enableCalculator ? "checked" : ""}> ${t("mCalc")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-hist" ${settings3.enableHistory ? "checked" : ""}> ${t("mHist")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-meta" ${settings3.enableMetaInfo ? "checked" : ""}> ${t("mMeta")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-fallback" ${settings3.enableKeywordFallback ? "checked" : ""}> ${t("mFall")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-auto-amazon" ${settings3.enableAutoAmazonShipping ? "checked" : ""}> ${t("mAutoAmz")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-auto-local" ${settings3.enableAutoLocalStore ? "checked" : ""}> ${t("mAutoLoc")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-hold-note" ${settings3.enableAutoHoldNote ? "checked" : ""}> ${t("mHoldNote")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-infraction-note" ${settings3.enableInfractionNote ? "checked" : ""}> ${t("mInfracNote")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-templates" ${settings3.enableMessageTemplates ? "checked" : ""}> ${t("mTemplates")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-floating-btn" ${settings3.enableFloatingButton ? "checked" : ""}> ${t("mFloatingBtn")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-move-approve" ${settings3.enableMoveApproveBtn ? "checked" : ""}> ${t("mMoveApprove")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-merchant-notes" ${settings3.enableMerchantNotes ? "checked" : ""}> ${t("lblMerchantNotes")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-shipping-costs" ${settings3.enableShippingCosts ? "checked" : ""}> ${t("lblShippingCosts")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-approve-reasons" ${settings3.enableApproveReasons ? "checked" : ""}> ${t("mApproveReasons")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-lock-buttons" ${settings3.enableLockButtons ? "checked" : ""}> ${t("mLockButtons")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-banned-highlight" ${settings3.enableBannedHighlight ? "checked" : ""}> ${t("mBannedHighlight")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-price-warning" ${settings3.enablePriceWarning ? "checked" : ""}> ${t("mPriceWarning")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-image-search" ${settings3.enableReverseImageSearch ? "checked" : ""}> ${t("mImageSearch")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-lens-description" ${settings3.enableLensDescription ? "checked" : ""}> ${t("mLensDescription")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-product-inspector" ${settings3.enableProductInspector ? "checked" : ""}> ${t("mProductInspector")}</label>
                        <label style="font-weight:normal; cursor:pointer;"><input type="checkbox" id="set-link-expander" ${settings3.enableLinkExpander ? "checked" : ""}> ${t("mLinkExpander")}</label>
                    </div>
                </div>

                <h4 style="margin: 30px 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid var(--jp-border); color: var(--jp-text); font-size: 15px;">
                    ${t("secConfig")}
                </h4>

                <div class="settings-row" style="width: 50%;">
                    <label>${t("defCurrency")}</label>
                    <select id="set-currency" style="width:100%">
                        <option value="EUR" ${settings3.defaultCurrency === "EUR" ? "selected" : ""}>EUR</option>
                        <option value="USD" ${settings3.defaultCurrency === "USD" ? "selected" : ""}>USD</option>
                        <option value="GBP" ${settings3.defaultCurrency === "GBP" ? "selected" : ""}>GBP</option>
                    </select>
                </div>

                <div class="settings-row" style="display: grid; grid-template-columns: 2fr 1.5fr 1fr; gap: 20px; align-items: end; margin-top: 15px;">
                    <div>
                        <label>${t("lblFloatingText")}</label>
                        <input type="text" id="set-floating-text" value="${settings3.customFloatingText}" placeholder="np.  | Smart! Okazja" style="width:100%">
                    </div>
                    <div>
                        <label style="font-weight:normal; display:flex; align-items:center; gap:5px; height: 35px; margin-bottom: 2px; cursor:pointer;">
                            <input type="checkbox" id="set-floating-freedel" ${settings3.floatingButtonAutoFreeDelivery ? "checked" : ""}> ${t("lblFloatingFreeDel")}
                        </label>
                    </div>
                    <div>
                        <label>${t("lblShippingOffset")}</label>
                        <input type="number" id="set-shipping-offset" value="${settings3.shippingPanelTopOffset}" style="width:100%">
                    </div>
                </div>

                <div class="settings-row" style="margin-top: 15px;">
                    <label>${t("stopWords")}</label>
                    <textarea id="set-stopwords" style="width: 100%; min-height: 50px;" placeholder="np. fryer, cheap, now">${settings3.customStopWords}</textarea>
                </div>

                <div class="settings-row" style="margin-top: 15px;">
                    <label>${t("hideBtns")}</label>
                    <div style="font-size: 12px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 5px;">
                        ${["Ceneo", "Keepa", "GG.deals", "PerfumeHub", "LubimyCzytać", "UpolujEbooka", "Promoklocki", "DekuDeals"].map((btn) => `
                            <label style="font-weight:normal; cursor:pointer;">
                                <input type="checkbox" class="hide-btn-check" value="${btn}" ${settings3.hiddenButtons.includes(btn) ? "checked" : ""}> ${btn}
                            </label>
                        `).join("")}
                    </div>
                </div>

                <h4 style="margin: 30px 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid var(--jp-border); color: var(--jp-text); font-size: 15px;">
                    ${t("secHistory")}
                </h4>

                <div class="settings-row" style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                    <label style="margin: 0;">${t("histCount")}</label>
                    <input type="number" id="set-history-count" value="${settings3.historyCount}" min="1" max="10" style="width: 80px;">
                </div>

                <div class="settings-row settings-row-special">
                    <label style="margin-bottom: 10px; display: block;">${t("histPers")}</label>
                    <div style="font-size: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px;">
                        <label style="cursor:pointer;"><input type="checkbox" class="hist-toggle" id="set-h-status" ${settings3.histShowStatus ? "checked" : ""}> ${t("hStatus")}</label>
                        <label style="cursor:pointer;"><input type="checkbox" class="hist-toggle" id="set-h-price" ${settings3.histShowPrice ? "checked" : ""}> ${t("hPrice")}</label>
                        <label style="cursor:pointer;"><input type="checkbox" class="hist-toggle" id="set-h-temp" ${settings3.histShowTemp ? "checked" : ""}> ${t("hTemp")}</label>
                        <label style="cursor:pointer;"><input type="checkbox" class="hist-toggle" id="set-h-merchant" ${settings3.histShowMerchant ? "checked" : ""}> ${t("hMerch")}</label>
                        <label style="cursor:pointer;"><input type="checkbox" class="hist-toggle" id="set-h-category" ${settings3.histShowCategory ? "checked" : ""}> ${t("hCat")}</label>
                        <label style="cursor:pointer;"><input type="checkbox" class="hist-toggle" id="set-h-date" ${settings3.histShowDate ? "checked" : ""}> ${t("hDate")}</label>
                        <label style="cursor:pointer;"><input type="checkbox" class="hist-toggle" id="set-h-author" ${settings3.histShowAuthor ? "checked" : ""}> ${t("hAuth")}</label>
                        <label style="cursor:pointer;"><input type="checkbox" class="hist-toggle" id="set-h-copy" ${settings3.histShowCopy ? "checked" : ""}> ${t("hCopy")}</label>
                    </div>
                    <div class="preview-box">
                        <strong>${t("livePreview")}</strong>
                        <ul style="margin: 8px 0 0 15px; padding: 0; list-style: none;">
                            <li id="history-preview-item" style="line-height: 1.6;"></li>
                        </ul>
                    </div>
                </div>

                <h4 style="margin: 30px 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid var(--jp-border); color: var(--jp-text); font-size: 15px;">
                    ${t("secAnalytics")}
                </h4>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: var(--jp-text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">${t("statUsageHeader")}</div>
                        <div class="jp-stat-grid">
                            <span>${t("statSessions")}</span><strong>${stats.totalSessions}</strong>
                            <span>${t("statDaysUsed")}</span><strong>${stats.totalDaysUsed}</strong>
                            <span>${t("statDealsChecked")}</span><strong>${stats.totalPageChecks}</strong>
                        </div>

                        <div style="font-size: 11px; font-weight: 600; color: var(--jp-text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin: 14px 0 8px 0;">${t("statCalculatorHeader")}</div>
                        <div class="jp-stat-grid">
                            <span>${t("statCalculatorCalculations")}</span><strong>${stats.calculatorCalculations}</strong>
                            <span>${t("statCalculatorButtonClicks")}</span><strong>${stats.calculatorButtonClicks}</strong>
                        </div>

                        <div style="font-size: 11px; font-weight: 600; color: var(--jp-text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin: 14px 0 8px 0;">${t("statAutomationsHeader")}</div>
                        <div class="jp-stat-grid">
                            <span>${t("statShippingAutofills")}</span><strong>${stats.autoShippingFilled}</strong>
                            <span>${t("statMerchantNotes")}</span><strong>${stats.autoMerchantNotesInserted}</strong>
                            <span>${t("statApproveReasons")}</span><strong>${stats.autoApproveReasonsUsed}</strong>
                            <span>${t("statTemplates")}</span><strong>${stats.autoTemplatesUsed}</strong>
                            <span>${t("statHoldNotes")}</span><strong>${stats.autoHoldNotesUsed}</strong>
                            <span>${t("statInfractionNotes")}</span><strong>${stats.autoInfractionNotesUsed}</strong>
                            <span>${t("statLockButtons")}</span><strong>${stats.lockButtonsUsed}</strong>
                        </div>
                    </div>

                    <div>
                        <div style="font-size: 11px; font-weight: 600; color: var(--jp-text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">${t("statWarningsHeader")}</div>
                        <div class="jp-stat-grid">
                            <span>${t("statFakePromoWarnings")}</span><strong>${stats.fakePromoWarningsShown}</strong>
                            <span>${t("statPriceWarnings")}</span><strong>${stats.priceWarningsShown}</strong>
                        </div>

                        <div style="font-size: 11px; font-weight: 600; color: var(--jp-text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin: 14px 0 8px 0;">${t("statInspectorHeader")}</div>
                        <div class="jp-stat-grid">
                            <span>${t("statEanDetections")}</span><strong>${stats.eanDetections}</strong>
                            <span>${t("statBarcodeGenerations")}</span><strong>${stats.barcodeGenerations}</strong>
                            <span>${t("statReverseSearches")}</span><strong>${stats.reverseImageSearches}</strong>
                            <span>${t("statLensDescriptions")}</span><strong>${stats.lensDescriptionsGenerated}</strong>
                            <span>${t("statLensDescriptionsInserted")}</span><strong>${stats.lensDescriptionsInserted}</strong>
                        </div>
                    </div>
                </div>

                <div style="background: var(--jp-input-bg); border: 1px solid var(--jp-border); border-radius: 6px; padding: 12px 15px; margin-top: 15px;">
                    <div class="jp-stat-grid" style="grid-template-columns: 2fr 1fr;">
                        <span>${t("statTotalAutomations")}</span><strong>${stats.totalAutomationsTriggered}</strong>
                        <span>${t("statTotalWarnings")}</span><strong>${stats.totalWarningsShown}</strong>
                        <span style="color: var(--jp-link); font-weight: 500;">${t("statManualActionsAvoided")}</span><strong style="color: var(--jp-link);">${stats.manualActionsAvoided}</strong>
                    </div>
                </div>

                <div style="margin-top: 12px; text-align: right;">
                    <button id="btn-reset-stats" style="background: var(--jp-fake-btn-bg); color: var(--jp-fake-btn-text); border: 1px solid var(--jp-fake-btn-border); padding: 6px 14px; border-radius: 4px; cursor: pointer; font-size: 12px;">🗑️ ${t("btnResetStats")}</button>
                </div>

                <div class="settings-actions" style="margin-top: 25px;">
                    <button class="btn-cancel" id="btn-close-settings">${t("btnCancel")}</button>
                    <button class="btn-save" id="btn-save-settings">${t("btnSave")}</button>
                </div>
            </div>
        `;
      document.body.insertAdjacentHTML("beforeend", modalHtml);
      const updatePreview = () => {
        let pStatus = document.getElementById("set-h-status").checked ? `<span style="background: var(--jp-stat-exp-bg); color: var(--jp-stat-exp-co); padding: 2px 5px; border-radius: 3px; font-size: 10px; font-weight: bold; margin-right: 5px; border: 1px solid var(--jp-stat-exp-bo);">${t("statExpired")}</span>` : "";
        let pTitle = `<a href="#" onclick="return false;" style="color: var(--jp-link); text-decoration:none; font-weight: 500;">Najlepsze Jalapeño ever...</a>`;
        let pPrice = document.getElementById("set-h-price").checked ? `<b style="margin-left:5px; color:var(--jp-input-text);">2137,00 zł</b>` : "";
        let pTemp = document.getElementById("set-h-temp").checked ? `<span style="color: var(--jp-temp-hot); font-weight:bold; margin-left:5px;">[420°]</span>` : "";
        let pCopy = document.getElementById("set-h-copy").checked ? `<span style="cursor:pointer; font-size:12px; margin-left:8px;">📋</span>` : "";
        let pCat = document.getElementById("set-h-category").checked ? `${t("lblCat")} Elektronika` : "";
        let pDate = document.getElementById("set-h-date").checked ? `${t("lblAdded")} 20.04.2026` : "";
        let pAuthor = document.getElementById("set-h-author").checked ? `${t("lblBy")} <span style="color: #e57373; font-weight: bold;" title="Banned">Xcited</span>` : "";
        let pMerch = document.getElementById("set-h-merchant").checked ? `${t("lblIn")} 🏪 Pepper.pl` : "";
        let metaParts = [pDate, pAuthor, pMerch].filter(Boolean).join(" ");
        let pMeta = pCat || metaParts ? `<br><span style="color: var(--jp-text-muted); font-size: 11px; margin-left:5px;">${pCat} ${metaParts ? `(${metaParts.trim()})` : ""}</span>` : "";
        document.getElementById("history-preview-item").innerHTML = `${pStatus}${pTitle}${pPrice}${pTemp}${pCopy}${pMeta}`;
      };
      document.querySelectorAll(".hist-toggle").forEach((el) => el.addEventListener("change", updatePreview));
      updatePreview();
      document.getElementById("btn-save-settings").onclick = () => {
        const hidden = Array.from(document.querySelectorAll(".hide-btn-check:checked")).map((el) => el.value);
        saveSettings({
          theme: document.getElementById("set-theme").value,
          language: document.getElementById("set-lang").value,
          darkTextColor: document.getElementById("set-dark-text-color").value,
          fontSize: document.getElementById("set-font-size").value,
          defaultCurrency: document.getElementById("set-currency").value,
          historyCount: parseInt(document.getElementById("set-history-count").value),
          customStopWords: document.getElementById("set-stopwords").value,
          hiddenButtons: hidden,
          enableFakePromo: document.getElementById("set-fakepromo").checked,
          enableCalculator: document.getElementById("set-calc").checked,
          enableHistory: document.getElementById("set-hist").checked,
          enableMetaInfo: document.getElementById("set-meta").checked,
          enableKeywordFallback: document.getElementById("set-fallback").checked,
          enableAutoAmazonShipping: document.getElementById("set-auto-amazon").checked,
          enableAutoLocalStore: document.getElementById("set-auto-local").checked,
          histShowStatus: document.getElementById("set-h-status").checked,
          histShowPrice: document.getElementById("set-h-price").checked,
          histShowTemp: document.getElementById("set-h-temp").checked,
          histShowCopy: document.getElementById("set-h-copy").checked,
          histShowCategory: document.getElementById("set-h-category").checked,
          histShowDate: document.getElementById("set-h-date").checked,
          histShowAuthor: document.getElementById("set-h-author").checked,
          histShowMerchant: document.getElementById("set-h-merchant").checked,
          enableAutoHoldNote: document.getElementById("set-hold-note").checked,
          enableInfractionNote: document.getElementById("set-infraction-note").checked,
          enableMessageTemplates: document.getElementById("set-templates").checked,
          enableFloatingButton: document.getElementById("set-floating-btn").checked,
          customFloatingText: document.getElementById("set-floating-text").value,
          floatingButtonAutoFreeDelivery: document.getElementById("set-floating-freedel").checked,
          enableMoveApproveBtn: document.getElementById("set-move-approve").checked,
          enableMerchantNotes: document.getElementById("set-merchant-notes").checked,
          enableShippingCosts: document.getElementById("set-shipping-costs").checked,
          enableApproveReasons: document.getElementById("set-approve-reasons").checked,
          enableLockButtons: document.getElementById("set-lock-buttons").checked,
          enableBannedHighlight: document.getElementById("set-banned-highlight").checked,
          shippingPanelTopOffset: parseInt(document.getElementById("set-shipping-offset").value) || 0,
          enablePriceWarning: document.getElementById("set-price-warning").checked,
          enableReverseImageSearch: document.getElementById("set-image-search").checked,
          enableLensDescription: document.getElementById("set-lens-description").checked,
          enableProductInspector: document.getElementById("set-product-inspector").checked,
          enableLinkExpander: document.getElementById("set-link-expander").checked
        });
      };
      document.getElementById("btn-reset-stats").onclick = () => {
        if (confirm(t("confirmResetStats"))) {
          resetStats();
          location.reload();
        }
      };
      document.getElementById("btn-close-settings").onclick = () => {
        document.getElementById("modal-overlay").remove();
        document.getElementById("jalapeno-settings-modal").remove();
      };
    }
    GM_addStyle(`
        .jp-stat-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 4px 10px;
            font-size: 12px;
            color: var(--jp-text);
        }
        .jp-stat-grid strong {
            text-align: right;
            color: var(--jp-link);
        }
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
            background-color: var(--jp-fake-btn-bg);
            color: var(--jp-fake-btn-text);
            border: 1px solid var(--jp-fake-btn-border);
            padding: 6px 12px;
            cursor: pointer;
            font-size: 12px;
            border-radius: 4px;
            font-weight: bold;
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
            z-index: 10000; width: 1200px; padding: 20px; font-family: sans-serif; color: var(--jp-text);
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

        .jp-shipping-side-panel {
                width: 300px;
                background: var(--jp-bg);
                border: 1px solid var(--jp-border);
                border-radius: 6px;
                padding: 15px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                position: absolute;
                left: 100%;
                top: ${settings3.shippingPanelTopOffset !== void 0 ? settings3.shippingPanelTopOffset : 135}px; /* <--- POZYCJA Z USTAWIEŃ */
                margin-left: 10px;
                z-index: 1;
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            }

        /* ===== Reverse Image Search — Lens button ===== */
        .jp-lens-btn {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin-top: 6px;
            padding: 4px 10px;
            background: var(--jp-btn-bg);
            color: var(--jp-text);
            border: 1px solid var(--jp-btn-border);
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.15s;
        }
        .jp-lens-btn:hover { background: var(--jp-btn-hover); }

        /* ===== Product Inspector panel ===== */
        .jp-inspector-panel {
            background: var(--jp-bg);
            border: 1px solid var(--jp-border);
            border-radius: 4px;
            padding: 8px;
            font-size: 11px;
            color: var(--jp-text);
        }
        .jp-inspector-header {
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 6px;
            color: var(--jp-text);
        }
        .jp-inspector-body { display: flex; flex-direction: column; gap: 5px; }
        .jp-inspector-id-row {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 3px;
        }
        .jp-inspector-label {
            font-weight: bold;
            min-width: 38px;
            color: var(--jp-text-muted);
            font-size: 10px;
            text-transform: uppercase;
            flex-shrink: 0;
        }
        .jp-inspector-value {
            font-family: monospace;
            font-size: 11px;
            color: var(--jp-text);
            flex-grow: 1;
            word-break: break-all;
        }
        .jp-inspector-btn {
            background: var(--jp-btn-bg);
            color: var(--jp-text);
            border: 1px solid var(--jp-btn-border);
            padding: 1px 5px;
            font-size: 9px;
            border-radius: 3px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            line-height: 14px;
            white-space: nowrap;
            font-family: inherit;
        }
        .jp-inspector-btn:hover { background: var(--jp-btn-hover); }
        .jp-inspector-link { text-decoration: none; }
        .jp-inspector-barcode {
            margin-top: 5px;
            padding-top: 6px;
            border-top: 1px dashed var(--jp-border);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
        }
        .jp-inspector-barcode svg { max-width: 100%; height: auto; }
        .jp-inspector-barcode-actions { display: flex; gap: 4px; }
        .jp-inspector-empty {
            color: var(--jp-text-muted);
            font-size: 10px;
            font-style: italic;
        }

    `);
    function fetchExchangeRates(callback) {
      if (exchangeRates) return callback(exchangeRates);
      let cachedRates = sessionStorage.getItem("pepperExchangeRates");
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
            sessionStorage.setItem("pepperExchangeRates", JSON.stringify(exchangeRates));
            callback(exchangeRates);
          } catch (e) {
          }
        }
      });
    }
    function getCurrentPrice() {
      let priceInput = document.querySelector('input[placeholder="Price"]');
      if (!priceInput || !priceInput.value) return null;
      return parseFloat(priceInput.value.replace(/[^\d,.-]/g, "").replace(",", "."));
    }
    function getCurrentTitle() {
      let titleInput = document.querySelector('input[placeholder="Thread title"]');
      return titleInput && titleInput.value ? titleInput.value.trim() : "";
    }
    function loadDatabase(callback) {
      let cachedDB = sessionStorage.getItem("pepperFakePromoDB");
      if (cachedDB) {
        fakePromoDB = JSON.parse(cachedDB);
        if (callback) callback();
      }
      GM_xmlhttpRequest({
        method: "GET",
        url: API_URL,
        onload: function(response) {
          if (response.status === 200) {
            fakePromoDB = JSON.parse(response.responseText);
            sessionStorage.setItem("pepperFakePromoDB", response.responseText);
            if (callback) callback();
          }
        }
      });
    }
    function addToDatabase(pattern, price, note, btnElement) {
      btnElement.innerText = t("btnAdding");
      btnElement.disabled = true;
      GM_xmlhttpRequest({
        method: "POST",
        url: API_URL,
        data: JSON.stringify({ url: pattern, price, note }),
        headers: { "Content-Type": "application/json" },
        onload: function() {
          btnElement.innerText = t("btnAdded");
        }
      });
    }
    function showWarning(note, dbPrice, currentPrice, matchedBy) {
      let container = document.querySelector(".v-card.rounded-medium.border-grey--dark") || document.body;
      if (document.querySelector(".fake-promo-alert")) return;
      increment("fakePromoWarningsShown");
      let alertBox = document.createElement("div");
      alertBox.className = "fake-promo-alert";
      alertBox.innerHTML = `⚠️ ${t("alertFakePromo")}<br>
                              <strong>${t("alertStdPrice")} ${dbPrice} zł </strong> (${t("alertCurrent")} ${currentPrice} zł)<br>
                              <strong>${t("alertEntry")}</strong> ${note} <br>
                              <span style="font-size: 11px; opacity: 0.8;">${t("alertPattern")} ${matchedBy}</span>`;
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
        let currentIsJustDomain = !currentCore.includes("/");
        let isMatch = false;
        if (currentCore === dbCore) {
          isMatch = true;
        } else if (!currentIsJustDomain && dbCore !== "") {
          if (currentCore.includes("/") && dbCore.includes("/")) {
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
        let dbPrice = typeof matchedEntry === "object" && matchedEntry.price !== void 0 ? matchedEntry.price : 0;
        let dbNote = typeof matchedEntry === "object" && matchedEntry.note !== void 0 ? matchedEntry.note : String(matchedEntry);
        if (currentPrice === null || currentPrice >= dbPrice || dbPrice === 0) {
          showWarning(dbNote, dbPrice, currentPrice || "???", matchedPatternName);
        }
      }
    }
    function getMerchantNotes() {
      return GM_getValue("jalapenoMerchantNotes", {});
    }
    function getModeratorName() {
      let saved = localStorage.getItem("jalapenoModeratorName");
      if (saved && saved !== "keyboard_arrow_down" && saved !== "Jalapeño User") {
        return saved;
      }
      let username = null;
      let scripts = document.querySelectorAll("script");
      for (let script of scripts) {
        let content = script.textContent;
        if (content.includes("window.__INITIAL_STATE__") && content.includes('"username"')) {
          let match = content.match(/"username":"([^"]+)"/);
          if (match && match[1]) {
            username = match[1];
            break;
          }
        }
      }
      if (!username && typeof unsafeWindow !== "undefined" && unsafeWindow.__INITIAL_STATE__) {
        try {
          let stateStr = JSON.stringify(unsafeWindow.__INITIAL_STATE__);
          let match = stateStr.match(/"username":"([^"]+)"/);
          if (match && match[1]) username = match[1];
        } catch (e) {
          if (DEBUG) console.warn("Błąd unsafeWindow: ", e);
        }
      }
      if (username && !username.includes("keyboard_arrow")) {
        localStorage.setItem("jalapenoModeratorName", username);
        return username;
      }
      return "Jalapeño User";
    }
    function saveMerchantNote(merchantName, noteText, moderatorName = null) {
      if (!merchantName || !noteText) return false;
      let allNotes = getMerchantNotes();
      let merchantKey = merchantName.toLowerCase();
      let timestamp = (/* @__PURE__ */ new Date()).toISOString();
      let moderator = moderatorName || getModeratorName();
      if (!allNotes[merchantKey]) {
        allNotes[merchantKey] = [];
      }
      allNotes[merchantKey].push({
        text: noteText,
        savedAt: timestamp,
        savedBy: moderator
      });
      GM_setValue("jalapenoMerchantNotes", allNotes);
      sendMerchantNoteDeltaToAPI(merchantKey, allNotes[merchantKey]);
      return true;
    }
    function deleteMerchantNote(merchantName, noteIndex) {
      if (!merchantName) return false;
      let allNotes = getMerchantNotes();
      let merchantKey = merchantName.toLowerCase();
      if (allNotes[merchantKey] && allNotes[merchantKey][noteIndex]) {
        allNotes[merchantKey].splice(noteIndex, 1);
        if (allNotes[merchantKey].length === 0) {
          delete allNotes[merchantKey];
        }
      }
      GM_setValue("jalapenoMerchantNotes", allNotes);
      sendMerchantNoteDeltaToAPI(merchantKey, allNotes[merchantKey] || []);
      return true;
    }
    function sendMerchantNoteDeltaToAPI(merchantKey, notesArray) {
      if (!MERCHANT_NOTES_API_URL) {
        if (DEBUG) console.warn("⚠️ MERCHANT_NOTES_API_URL not configured");
        return;
      }
      GM_xmlhttpRequest({
        method: "POST",
        url: MERCHANT_NOTES_API_URL,
        data: JSON.stringify({
          action: "updateMerchantNotes",
          merchantName: merchantKey,
          notesArray
        }),
        headers: { "Content-Type": "application/json" },
        onload: function(response) {
          try {
            let data = JSON.parse(response.responseText);
            if (data && data.notes && typeof data.notes === "object") {
              GM_setValue("jalapenoMerchantNotes", data.notes);
              if (DEBUG) console.log("✅ Merchant notes synchronized (Delta)");
            }
          } catch (e) {
          }
        },
        onerror: function() {
          if (DEBUG) console.warn("⚠️ Failed to sync merchant notes");
        }
      });
    }
    function getMerchantNotesList(merchantName) {
      if (!merchantName) return [];
      let allNotes = getMerchantNotes();
      let merchantKey = merchantName.toLowerCase();
      return allNotes[merchantKey] || [];
    }
    function fetchMerchantNotesFromAPI() {
      if (!MERCHANT_NOTES_API_URL) {
        if (DEBUG) console.warn("⚠️ MERCHANT_NOTES_API_URL not configured");
        return;
      }
      GM_xmlhttpRequest({
        method: "POST",
        url: MERCHANT_NOTES_API_URL,
        data: JSON.stringify({
          action: "getMerchantNotes"
        }),
        headers: { "Content-Type": "application/json" },
        onload: function(response) {
          try {
            let data = JSON.parse(response.responseText);
            if (data && data.notes && typeof data.notes === "object") {
              GM_setValue("jalapenoMerchantNotes", data.notes);
              if (DEBUG) console.log("✅ Merchant notes updated directly from API");
            }
          } catch (e) {
            if (DEBUG) console.warn("⚠️ Error parsing merchant notes from API:", e);
          }
        },
        onerror: function() {
          if (DEBUG) console.warn("⚠️ Failed to fetch merchant notes from API");
        }
      });
    }
    function getShippingCosts() {
      return GM_getValue("jalapenoShippingCosts", {});
    }
    function getShippingCostsList(merchantName) {
      if (!merchantName) return null;
      let allCosts = getShippingCosts();
      let merchantKey = merchantName.toLowerCase();
      return allCosts[merchantKey] || null;
    }
    function saveShippingCost(merchantName, shippingData) {
      if (!merchantName || !shippingData) return false;
      let merchantKey = merchantName.toLowerCase();
      let newCostData = {
        cost: shippingData.cost,
        freeDeliveryFrom: shippingData.freeDeliveryFrom,
        note: shippingData.note || "",
        savedAt: (/* @__PURE__ */ new Date()).toISOString(),
        savedBy: getModeratorName()
      };
      let allCosts = getShippingCosts();
      allCosts[merchantKey] = newCostData;
      GM_setValue("jalapenoShippingCosts", allCosts);
      if (SHIPPING_COSTS_API_URL && !SHIPPING_COSTS_API_URL.includes("WSTAW_TU")) {
        GM_xmlhttpRequest({
          method: "POST",
          url: SHIPPING_COSTS_API_URL,
          data: JSON.stringify({
            action: "updateShippingCost",
            merchantName: merchantKey,
            shippingData: newCostData
          }),
          headers: { "Content-Type": "application/json" },
          onload: function(response) {
            try {
              let res = JSON.parse(response.responseText);
              if (res.costs) GM_setValue("jalapenoShippingCosts", res.costs);
            } catch (e) {
            }
          }
        });
      }
      return true;
    }
    function deleteShippingCost(merchantName) {
      if (!merchantName) return false;
      let merchantKey = merchantName.toLowerCase();
      let allCosts = getShippingCosts();
      if (allCosts[merchantKey]) {
        delete allCosts[merchantKey];
        GM_setValue("jalapenoShippingCosts", allCosts);
      }
      if (SHIPPING_COSTS_API_URL && !SHIPPING_COSTS_API_URL.includes("WSTAW_TU")) {
        GM_xmlhttpRequest({
          method: "POST",
          url: SHIPPING_COSTS_API_URL,
          data: JSON.stringify({
            action: "deleteShippingCost",
            merchantName: merchantKey
          }),
          headers: { "Content-Type": "application/json" },
          onload: function(response) {
            try {
              let res = JSON.parse(response.responseText);
              if (res.costs) GM_setValue("jalapenoShippingCosts", res.costs);
            } catch (e) {
            }
          }
        });
      }
      return true;
    }
    function fetchShippingCostsFromAPI() {
      if (!SHIPPING_COSTS_API_URL || SHIPPING_COSTS_API_URL.includes("WSTAW_TU")) {
        if (DEBUG) console.warn("⚠️ SHIPPING_COSTS_API_URL not configured");
        return;
      }
      GM_xmlhttpRequest({
        method: "POST",
        url: SHIPPING_COSTS_API_URL,
        data: JSON.stringify({
          action: "getShippingCosts"
        }),
        headers: { "Content-Type": "application/json" },
        onload: function(response) {
          try {
            let data = JSON.parse(response.responseText);
            if (data && data.costs && typeof data.costs === "object") {
              GM_setValue("jalapenoShippingCosts", data.costs);
              if (DEBUG) console.log("✅ Shipping costs updated directly from API");
            }
          } catch (e) {
            if (DEBUG) console.warn("⚠️ Error parsing shipping costs from API:", e);
          }
        },
        onerror: function() {
          if (DEBUG) console.warn("⚠️ Failed to fetch shipping costs from API");
        }
      });
    }
    function displayMerchantNote(merchantName, merchantElement = null) {
      if (!settings3.enableMerchantNotes || !merchantName) return;
      let notesList = getMerchantNotesList(merchantName);
      if (notesList.length === 0) return;
      let lastNote = notesList[notesList.length - 1];
      let targetElement = merchantElement;
      if (!targetElement) {
        targetElement = Array.from(document.querySelectorAll("span, div, p")).find(
          (el) => el.innerText && el.innerText.includes(merchantName) && el.innerText.length < 100
        );
      }
      if (!targetElement) return;
      if (targetElement.parentNode.querySelector(".jp-merchant-note-display")) return;
      let noteBox = document.createElement("div");
      noteBox.className = "jp-merchant-note-display";
      let lastIndex = notesList.length - 1;
      let dateStr = new Date(lastNote.savedAt).toLocaleDateString("pl-PL");
      noteBox.innerHTML = `
            <div style="background-color: var(--jp-template-btn-bg); border-left: 3px solid #ff9800; padding: 8px 12px; margin: 8px 0; border-radius: 4px; font-size: 12px;">
                <div style="font-weight: 500; color: #ff9800; margin-bottom: 4px;"> ${t("lblMerchantNotes")}</div>
                <div style="color: var(--jp-text); word-break: break-word; margin-bottom: 4px;">${lastNote.text}</div>
                <div style="font-size: 10px; color: #bbb; margin-bottom: 4px;">${lastNote.savedBy} • ${dateStr}</div>
                <button class="jp-merchant-note-delete-btn" data-index="${lastIndex}" title="Usuń notatkę">🗑️ ${t("btnRemoveMerchantNote")}</button>
            </div>
        `;
      noteBox.querySelector(".jp-merchant-note-delete-btn").addEventListener("click", (e) => {
        let index = parseInt(e.currentTarget.getAttribute("data-index"));
        if (confirm("⚠️ Czy na pewno chcesz trwale usunąć tę notatkę?")) {
          deleteMerchantNote(merchantName, index);
          noteBox.remove();
        }
      });
      targetElement.parentNode.insertBefore(noteBox, targetElement.nextSibling);
    }
    function fetchPepperHistory(query, containerNode, isFallback = false, originalTitle = "") {
      let encodedQuery = encodeURIComponent(query);
      containerNode.innerHTML = `<span style="color:var(--jp-text-muted);">🔄 ${isFallback ? t("lblFallback") : t("lblFetching") + " <b>" + query + "</b>..."}</span>`;
      let urlTextarea = document.querySelector('textarea[name="mainUrl"]');
      let currentMainUrl = urlTextarea ? urlTextarea.value.trim() : "";
      let getMerchantFromForm = () => {
        let merchantInput = document.querySelector('input[placeholder="Merchant name"], input[placeholder="No merchant"]');
        if (merchantInput && merchantInput.value && merchantInput.value.trim() !== "") {
          return merchantInput.value.trim();
        }
        if (currentMainUrl) {
          try {
            return new URL(currentMainUrl).hostname.replace(/^www\./, "");
          } catch (e) {
          }
        }
        return "---";
      };
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://www.pepper.pl/search?q=${encodedQuery}`,
        onload: function(res) {
          let parser = new DOMParser();
          let doc = parser.parseFromString(res.responseText, "text/html");
          let deals = doc.querySelectorAll("article.thread, div.thread");
          let queryWords = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
          let validDeals = [];
          let currentTitleLower = getCurrentTitle().toLowerCase();
          let currentThreadIdMatch = window.location.href.match(/(?:-|\/deals\/edit\/)(\d+)(?:\/|$|\?)/);
          let currentThreadId = currentThreadIdMatch ? parseInt(currentThreadIdMatch[1]) : null;
          let fallbackMerchant = getMerchantFromForm();
          let metaInfoHtml = settings3.enableMetaInfo ? `<span style="margin-right: 15px; border-right: 1px solid var(--jp-border); padding-right: 15px;">${t("lblStore")} <b style="color:var(--jp-input-text);">${fallbackMerchant}</b> | ${t("lblTemp")} <span style="color:var(--jp-text-muted)">---°</span></span>` : "";
          let currentDealFound = false;
          deals.forEach((deal) => {
            let vueDataEl = deal.querySelector("[data-vue3]");
            if (!vueDataEl) return;
            try {
              let vueJson = JSON.parse(vueDataEl.getAttribute("data-vue3"));
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
                if (settings3.enableMetaInfo) {
                  let fallbackDomain = "---";
                  try {
                    if (currentMainUrl) {
                      fallbackDomain = new URL(currentMainUrl).hostname.replace(/^www\./, "");
                    } else if (threadInfo.linkHost) {
                      fallbackDomain = threadInfo.linkHost.replace(/^www\./, "");
                    }
                  } catch (e) {
                  }
                  let m = threadInfo.merchant && threadInfo.merchant.merchantName ? threadInfo.merchant.merchantName : fallbackDomain;
                  let temp = threadInfo.temperature !== null ? Math.round(threadInfo.temperature) : "---";
                  let pubDateStr = "---";
                  if (threadInfo.publishedAt) {
                    let d = new Date(threadInfo.publishedAt * 1e3);
                    let day = String(d.getDate()).padStart(2, "0");
                    let month = String(d.getMonth() + 1).padStart(2, "0");
                    let year = d.getFullYear();
                    let hours = String(d.getHours()).padStart(2, "0");
                    let minutes = String(d.getMinutes()).padStart(2, "0");
                    pubDateStr = `${day}.${month}.${year}, ${hours}:${minutes}`;
                  }
                  let comments = threadInfo.commentCount !== void 0 ? threadInfo.commentCount : 0;
                  metaInfoHtml = `<span style="margin-right: 15px; border-right: 1px solid var(--jp-border); padding-right: 15px; color:var(--jp-text-muted);">
                                                    ${t("lblStore")} <b style="color:var(--jp-input-text);">${m}</b> |
                                                    ${t("lblTemp")} <b style="color:var(--jp-input-text);">${temp}°</b> |
                                                    🕒 ${t("lblAdded")} <b style="color:var(--jp-input-text);">${pubDateStr}</b> |
                                                    ${t("lblCom")} <b style="color:var(--jp-input-text);">${comments}</b>
                                                </span>`;
                }
                return;
              }
              let titleLower = threadInfo.title.toLowerCase();
              let isMatch = queryWords.length === 0 || queryWords.some((word) => titleLower.includes(word));
              if (isMatch || isFallback) {
                validDeals.push(threadInfo);
              }
            } catch (e) {
            }
          });
          if (validDeals.length === 0 && settings3.enableKeywordFallback && !isFallback) {
            let fallbackQuery = "";
            if (originalTitle) fallbackQuery = getFallbackWord(originalTitle);
            if (!fallbackQuery) {
              let words = query.split(" ").filter((w) => w.length > 2);
              if (words.length > 0) fallbackQuery = words[0];
            }
            if (fallbackQuery) {
              fetchPepperHistory(fallbackQuery, containerNode, true, originalTitle);
              return;
            }
          }
          let categoryCount = {};
          let totalCategorized = 0;
          validDeals.forEach((threadInfo) => {
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
              let percent = Math.round(categoryCount[cat] / totalCategorized * 100);
              statsArray.push({ cat, percent });
            }
            statsArray.sort((a, b) => b.percent - a.percent);
            let formattedStats = statsArray.map((item) => `<b style="color:var(--jp-input-text);">${item.percent}%</b> ${item.cat}`).join(" | ");
            catHtml = `<span title="Analyzed ${totalCategorized} items" style="color:var(--jp-text-muted);">📊 <b style="color:var(--jp-input-text);">${t("lblCatStats")} ${isFallback ? "(fallback)" : ""}:</b> ${formattedStats}</span>`;
          }
          if (metaInfoHtml !== "" || catHtml !== "") {
            statsHtml = `<div style="margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dotted var(--jp-border); font-size: 11px; display: flex; align-items: center;">
                                    ${metaInfoHtml}
                                    ${catHtml}
                                 </div>`;
          }
          let html = statsHtml;
          if (settings3.enableHistory && !isFallback) {
            html += `<strong>${t("lblSimilar")}</strong><ul style="margin: 5px 0 0 15px; padding: 0;">`;
            let count = 0;
            validDeals.forEach((threadInfo) => {
              if (count >= settings3.historyCount) return;
              let tThread = threadInfo.title;
              let link = threadInfo.url;
              let mName = threadInfo.merchant && threadInfo.merchant.merchantName ? threadInfo.merchant.merchantName : null;
              let p = threadInfo.price !== null && threadInfo.price !== void 0 && threadInfo.price > 0 ? threadInfo.price.toFixed(2).replace(".", ",") + " zł" : "---";
              let tempNum = threadInfo.temperature !== null ? threadInfo.temperature : 0;
              let temp = Math.round(tempNum) + "°";
              let tempClass = tempNum < 0 ? "temp-cold" : "temp-hot";
              let isBanned = false;
              if (threadInfo.user) {
                if (threadInfo.user.isBanned || threadInfo.user.isDeleted || threadInfo.user.status === "deleted" || threadInfo.user.status === "banned") isBanned = true;
              }
              let authorName = threadInfo.user && threadInfo.user.username ? threadInfo.user.username : "---";
              let authorHtml = isBanned ? `<span style="color: #e57373; font-weight: bold;">${authorName}</span>` : authorName;
              let category = threadInfo.mainGroup && threadInfo.mainGroup.threadGroupName ? threadInfo.mainGroup.threadGroupName : "Inne";
              let dateStr = "";
              if (threadInfo.publishedAt) {
                let d = new Date(threadInfo.publishedAt * 1e3);
                let day = String(d.getDate()).padStart(2, "0");
                let month = String(d.getMonth() + 1).padStart(2, "0");
                let year = d.getFullYear();
                dateStr = `${day}.${month}.${year}`;
              }
              let statusBadge = "";
              if (threadInfo.deletedAt !== null || threadInfo.status === "Deleted") {
                statusBadge = `<span style="background: var(--jp-stat-del-bg); color: var(--jp-stat-del-co); padding: 2px 5px; border-radius: 3px; font-size: 10px; font-weight: bold; margin-right: 5px; border: 1px solid var(--jp-stat-del-bo);">${t("statDeleted")}</span>`;
              } else if (threadInfo.isExpired === true) {
                statusBadge = `<span style="background: var(--jp-stat-exp-bg); color: var(--jp-stat-exp-co); padding: 2px 5px; border-radius: 3px; font-size: 10px; font-weight: bold; margin-right: 5px; border: 1px solid var(--jp-stat-exp-bo);">${t("statExpired")}</span>`;
              } else {
                statusBadge = `<span style="background: var(--jp-stat-act-bg); color: var(--jp-stat-act-co); padding: 2px 5px; border-radius: 3px; font-size: 10px; font-weight: bold; margin-right: 5px; border: 1px solid var(--jp-stat-act-bo);">${t("statActive")}</span>`;
              }
              let sStatus = settings3.histShowStatus ? statusBadge : "";
              let sPrice = settings3.histShowPrice ? `<b style="margin-left:5px; color:var(--jp-input-text);">${p}</b>` : "";
              let sTemp = settings3.histShowTemp ? `<span class="${tempClass}" style="margin-left:5px;">[${temp}]</span>` : "";
              let sCopy = settings3.histShowCopy ? `<span style="cursor:pointer; font-size:12px; margin-left:8px;" onclick="navigator.clipboard.writeText('${link}'); this.innerText='✔️'; setTimeout(()=>this.innerText='📋', 1500);">📋</span>` : "";
              let sCat = settings3.histShowCategory ? `${t("lblCat")} ${category}` : "";
              let sDate = settings3.histShowDate ? `${t("lblAdded")} ${dateStr}` : "";
              let sAuth = settings3.histShowAuthor ? `${t("lblBy")} ${authorHtml}` : "";
              let sMerch = settings3.histShowMerchant && mName ? `${t("lblIn")} 🏪 <b style="color:var(--jp-input-text);">${mName}</b>` : "";
              let metaParts = [sDate, sAuth, sMerch].filter(Boolean).join(" ");
              let metaRow = sCat || metaParts ? `<br><span style="color: var(--jp-text-muted); font-size: 11px; margin-left:5px;">${sCat} ${metaParts ? `(${metaParts.trim()})` : ""}</span>` : "";
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
            if (validDeals.length === 0) html += `<li style="color: var(--jp-text-muted); margin-top: 5px;">${t("lblNoResults")}</li>`;
            html += `</ul>`;
          } else if (isFallback) {
            html += `<div style="color:var(--jp-text-muted); font-size:11px; margin-top: 5px;">${t("lblNotFoundLookingForSimilar")} <b style="color:var(--jp-input-text);">${query}</b></div>`;
          } else {
            html += `<div style="color:var(--jp-text-muted); font-size:11px; margin-top: 5px;">${t("lblHistDisabled")}</div>`;
          }
          containerNode.innerHTML = html;
        }
      });
    }
    function checkMessageTemplates() {
      if (!settings3.enableMessageTemplates) return;
      let userMsgTa = document.querySelector('textarea[placeholder="Message for the user"]');
      if (!userMsgTa) return;
      if (document.getElementById("jp-hold-templates-wrapper")) return;
      let parentContainer = userMsgTa.closest(".v-input") || userMsgTa.parentElement;
      const templates = [
        { label: "Termin", text: "podaj proszę w tytule / opisie okazji termin przydatności do spożycia produktu, którego dotyczy okazja." },
        { label: "Cena", text: "jak uzyskać taką cenę? Jakiego kodu należy użyć / jaki produkt należy dobrać w celu uzyskania podanej ceny?" },
        { label: "Monety", text: "cena podana w okazji musi być ceną możliwą do uzyskania bez wykorzystania monet. Popraw to proszę dodając prawidłową cenę w tytule / opisie okazji (cena w obcej walucie) oraz polu cena (cena w PLN)." },
        { label: "Waluta", text: "dodaj proszę cenę w EURO / USD / GBP w tytule i/lub opisie okazji." },
        { label: "Dostępność", text: "podaj proszę w opisie / tytule okazji ilość produktów dostępnych w promocji." },
        { label: "Link nie działa", text: "link nie działa / nie prowadzi bezpośrednio do produktu. Popraw proszę link w swojej okazji." },
        { label: "Kod nie działa", text: "kod rabatowy podany w publikacji nie działa. Być może wygasł, zużyto pulę dostępnych kodów lub produkt nie spełnia wymagań. Podaj proszę alternatywny kod / powiedz co zrobić, aby kod zadziałał." },
        { label: "Kod - źródło", text: "podaj proszę źródło kodu wraz z jego potwierdzeniem (np. link do strony informującej o kodzie, screenshot maila / wiadomości SMS etc.)." }
      ];
      let templatesWrapper = document.createElement("div");
      templatesWrapper.id = "jp-hold-templates-wrapper";
      templatesWrapper.className = "jp-templates-container";
      const insertTextToVue = (element, newText) => {
        element.focus();
        let valueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        valueSetter.call(element, newText);
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
        element.blur();
        element.focus();
      };
      templates.forEach((tpl) => {
        let btn = document.createElement("button");
        btn.className = "jp-template-btn";
        btn.innerText = tpl.label;
        btn.onclick = (e) => {
          e.preventDefault();
          increment("autoTemplatesUsed");
          let currentText = userMsgTa.value;
          let anchor = "ponieważ brakuje w niej:";
          let tailAnchor = "Możesz łatwo uzupełnić to";
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
      if (!settings3.enableAutoHoldNote) return;
      let userMsgTa = document.querySelector('textarea[placeholder="Message for the user"]');
      let modNoteTa = document.querySelector('textarea[aria-label="Note for moderators"]');
      if (!userMsgTa || !modNoteTa) return;
      let text = userMsgTa.value;
      if (!text) return;
      let extractedNote = "";
      if (text.includes("Weryfikacja bezpośrednio u źródła") || text.includes("potwierdzić źródło tej promocji")) {
        extractedNote = "Żródło";
      } else if (text.includes("Dodanie zdjęcia produktu") || text.includes("dostępności dla każdego klienta oraz opcji zakupu online")) {
        extractedNote = "Potwierdzenie";
      } else if (text.includes("potrzebujemy przykładów okazyjnych produktów") || text.includes("brakuje konkretnych przykładów przecenionych produktów")) {
        extractedNote = "Przykłady produktów";
      } else if (text.includes("lokalizację sklepu") || text.includes("W opisie brakuje nam tylko lokalizacji")) {
        extractedNote = "Lokalizacja";
      } else if (text.includes("specyfikacje pojazdu") || text.includes("jego dostępności dla każdego klienta oraz opcji zakupu online.")) {
        extractedNote = "Pojazdy";
      } else if (text.includes("ponieważ brakuje w niej:")) {
        let parts = text.split("ponieważ brakuje w niej:");
        if (parts.length > 1) {
          let customText = parts[1].split("Nie możemy się doczekać")[0];
          customText = customText.split("Możesz łatwo uzupełnić to")[0];
          customText = customText.trim();
          if (customText.length > 0) {
            extractedNote = customText.length > 270 ? customText.substring(0, 270) + "..." : customText;
          }
        }
      } else if (text.includes("[TUTAJ WPISZ NIESTANDARDOWY OPIS")) {
        extractedNote = "Niestandardowe wymaganie";
      }
      if (extractedNote && modNoteTa.dataset.jpLastAutoNote !== extractedNote) {
        let setNativeValue = (element, value) => {
          let valueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
          valueSetter.call(element, value);
          element.dispatchEvent(new Event("input", { bubbles: true }));
        };
        if (modNoteTa.value === "" || modNoteTa.value === (modNoteTa.dataset.jpLastAutoNote || "")) {
          setNativeValue(modNoteTa, extractedNote);
          modNoteTa.dataset.jpLastAutoNote = extractedNote;
          increment("autoHoldNotesUsed");
        }
      }
    }
    function checkInfractionNoteAutomator() {
      if (!settings3.enableInfractionNote) return;
      let noteInput = null;
      let messageText = "";
      if (window.location.href.includes("/inspector/")) {
        noteInput = document.querySelector('textarea#notes, textarea[name="notes"]');
        let msgTa = document.querySelector('textarea[aria-label="Message for the user"]') || document.querySelector("textarea.text-area-with-counter");
        if (!msgTa) {
          let textareas = Array.from(document.querySelectorAll("textarea"));
          msgTa = textareas.find((t2) => t2.value.includes("Poprzez tę wiadomość") || t2.value.includes("W związku z tym"));
        }
        if (msgTa) messageText = msgTa.value;
      } else {
        let activeModal = document.querySelector(".v-dialog--active") || document.querySelector('[role="dialog"]');
        if (activeModal) {
          noteInput = document.querySelector('input[placeholder="Leave a note for moderators"]');
          let msgTa = activeModal.querySelector('textarea[aria-label="Message for the user"]');
          if (msgTa) messageText = msgTa.value;
        }
      }
      if (messageText && noteInput) {
        let cleanNote = getCleanNoteFromMessage(messageText);
        if (cleanNote && noteInput.dataset.jpLastReason !== cleanNote) {
          let setNativeValue = (element, value) => {
            let proto = Object.getPrototypeOf(element);
            let valueSetter = Object.getOwnPropertyDescriptor(proto, "value").set;
            valueSetter.call(element, value);
            element.dispatchEvent(new Event("input", { bubbles: true }));
            element.dispatchEvent(new Event("change", { bubbles: true }));
          };
          if (noteInput.value === "" || noteInput.value === (noteInput.dataset.jpLastReason || "")) {
            setNativeValue(noteInput, cleanNote);
            noteInput.dataset.jpLastReason = cleanNote;
            increment("autoInfractionNotesUsed");
          }
        }
      }
    }
    function checkInfractionModal() {
      if (window.location.href.includes("/inspector/")) return;
      let ta = document.querySelector('textarea[aria-label="Message for the user"]');
      if (!ta) return;
      let val = ta.value;
      let modal = ta.closest(".v-dialog") || ta.closest('[role="dialog"]') || document.body;
      let warningCheckbox = modal.querySelector('input[aria-label="Warning only"]');
      let pointsInput = modal.querySelector('input[type="number"]');
      let isWarning = warningCheckbox ? warningCheckbox.checked || warningCheckbox.getAttribute("aria-checked") === "true" : false;
      let points = pointsInput ? parseInt(pointsInput.value) || 0 : 0;
      let desiredLine = "Poprzez tę wiadomość otrzymujesz ";
      let desiredLineNew = "W związku z tym na Twoje konto zostało nałożone oficjalne ";
      let desiredLineSuffix = "";
      if (isWarning) {
        desiredLine += "ostrzeżenie.";
        desiredLineSuffix = "ostrzeżenie.";
      } else if (points > 0) {
        desiredLine += `punkty karne (${points}).`;
        desiredLineSuffix = `punkty karne (${points}).`;
      } else {
        desiredLine += "***ostrzeżenie / punkty karne:";
        desiredLineSuffix = "***ostrzeżenie / punkty karne:";
      }
      if (ta.dataset.jpLastDesiredLine === desiredLine) return;
      let currentLineMatch = val.match(/Poprzez tę wiadomość otrzymujesz .*/);
      let currentLineNewMatch = val.match(/W związku z tym na Twoje konto zostało nałożone oficjalne .*/);
      if (currentLineMatch) {
        let currentLine = currentLineMatch[0];
        if (!isWarning && points === 0 && (val.includes("Zależy nam, aby zapewnić bezpieczeństwo") || val.includes("Zależy nam na budowaniu bezpiecznej społeczności"))) {
          ta.value = val.replace(currentLine + "\n\n", "").replace(currentLine, "");
          ta.dispatchEvent(new Event("input", { bubbles: true }));
          ta.dataset.jpLastDesiredLine = desiredLine;
        } else if (currentLine !== desiredLine) {
          ta.value = val.replace(currentLine, desiredLine);
          ta.dispatchEvent(new Event("input", { bubbles: true }));
          ta.dataset.jpLastDesiredLine = desiredLine;
        }
      } else if (currentLineNewMatch) {
        let currentLine = currentLineNewMatch[0];
        let desiredLineNewFull = desiredLineNew + desiredLineSuffix;
        if (currentLine !== desiredLineNewFull) {
          ta.value = val.replace(currentLine, desiredLineNewFull);
          ta.dispatchEvent(new Event("input", { bubbles: true }));
          ta.dataset.jpLastDesiredLine = desiredLine;
        }
      } else if (val.includes("Zależy nam, aby zapewnić bezpieczeństwo") || val.includes("Zależy nam na budowaniu bezpiecznej społeczności")) {
        if (isWarning || points > 0) {
          let oldPhrase = val.includes("Zależy nam, aby zapewnić bezpieczeństwo") ? "Zależy nam, aby zapewnić bezpieczeństwo" : "Zależy nam na budowaniu bezpiecznej społeczności";
          ta.value = val.replace(oldPhrase, desiredLine + "\n\n" + oldPhrase);
          ta.dispatchEvent(new Event("input", { bubbles: true }));
          ta.dataset.jpLastDesiredLine = desiredLine;
        }
      } else {
        ta.dataset.jpLastDesiredLine = desiredLine;
      }
    }
    function checkInspectorModal() {
      if (!window.location.href.includes("/inspector/")) return;
      let textareas = Array.from(document.querySelectorAll("textarea"));
      let ta = textareas.find((t2) => t2.value.includes("Poprzez tę wiadomość otrzymujesz") || t2.value.includes("W związku z tym na Twoje konto zostało nałożone oficjalne"));
      if (!ta) return;
      let val = ta.value;
      let container = ta.closest(".card") || document.body;
      let pointsInput = container.querySelector('input[type="number"], input#points, input[name="points"]');
      let points = pointsInput ? parseInt(pointsInput.value) : 0;
      if (isNaN(points)) points = 0;
      let isWarning = points === 0;
      let desiredLine = "Poprzez tę wiadomość otrzymujesz ";
      let desiredLineNew = "W związku z tym na Twoje konto zostało nałożone oficjalne ";
      let desiredLineSuffix = "";
      if (isWarning) {
        desiredLine += "ostrzeżenie.";
        desiredLineSuffix = "ostrzeżenie.";
      } else {
        desiredLine += `punkty karne (${points}).`;
        desiredLineSuffix = `punkty karne (${points}).`;
      }
      if (ta.dataset.jpLastDesiredLine === desiredLine) return;
      let currentLineMatch = val.match(/Poprzez tę wiadomość otrzymujesz.*/);
      let currentLineNewMatch = val.match(/W związku z tym na Twoje konto zostało nałożone oficjalne .*/);
      if (currentLineMatch) {
        let currentLine = currentLineMatch[0];
        if (currentLine !== desiredLine) {
          ta.value = val.replace(currentLine, desiredLine);
          ta.dispatchEvent(new Event("input", { bubbles: true }));
          ta.dataset.jpLastDesiredLine = desiredLine;
        }
      } else if (currentLineNewMatch) {
        let currentLine = currentLineNewMatch[0];
        let desiredLineNewFull = desiredLineNew + desiredLineSuffix;
        if (currentLine !== desiredLineNewFull) {
          ta.value = val.replace(currentLine, desiredLineNewFull);
          ta.dispatchEvent(new Event("input", { bubbles: true }));
          ta.dataset.jpLastDesiredLine = desiredLine;
        }
      } else {
        ta.dataset.jpLastDesiredLine = desiredLine;
      }
    }
    function checkPriceIncrease(threadId) {
      if (!threadId) return;
      let url = `https://www.pepper.pl/admin/thread-edit-log/${threadId}`;
      let xsrfToken = "";
      let match = document.cookie.match(/xsrf_t=([^;]+)/);
      if (match) {
        xsrfToken = decodeURIComponent(match[1]).replace(/^"|"$/g, "");
      }
      fetch(url, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-XSRF-TOKEN": xsrfToken
        }
      }).then((res) => res.json()).then((data) => {
        let changesArray = null;
        if (data && data.changes) {
          changesArray = data.changes;
        } else if (data && data.data && data.data.thread && data.data.thread.changes) {
          changesArray = data.data.thread.changes;
        } else if (data && data.data && data.data.changes) {
          changesArray = data.data.changes;
        } else if (Array.isArray(data)) {
          let itemWithChanges = data.find((item) => item && item.changes);
          if (itemWithChanges) changesArray = itemWithChanges.changes;
        }
        if (!changesArray || changesArray.length === 0) return;
        let priceChanges = changesArray.filter((c) => c.property === "price");
        if (priceChanges.length === 0) return;
        let allPrices = priceChanges.flatMap((c) => [parseFloat(c.old_value), parseFloat(c.new_value)]).filter((p) => !isNaN(p) && p > 0);
        let lowestPrice = Math.min(...allPrices);
        let currentPrice = getCurrentPrice();
        if (currentPrice === null || isNaN(currentPrice)) {
          priceChanges.sort((a, b) => a.created_at - b.created_at);
          currentPrice = parseFloat(priceChanges[priceChanges.length - 1].new_value);
        }
        if (isNaN(lowestPrice) || isNaN(currentPrice) || lowestPrice <= 0) return;
        let increasePercent = (currentPrice - lowestPrice) / lowestPrice * 100;
        if (increasePercent > 1) {
          if (document.querySelector(".jp-price-warning-toast")) return;
          increment("priceWarningsShown");
          let alertBox = document.createElement("div");
          alertBox.className = "jp-price-warning-toast";
          alertBox.style.cssText = `
                    position: fixed;
                    top: 85px;
                    right: 20px;
                    background-color: #e65100;
                    color: white;
                    padding: 15px 35px 15px 15px;
                    border-radius: 6px;
                    font-weight: bold;
                    font-size: 14px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                    border: 2px solid #ff9800;
                    z-index: 10000;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    transform: translateX(100%);
                    opacity: 0;
                `;
          let formattedOld = lowestPrice.toFixed(2).replace(".", ",");
          let formattedNew = currentPrice.toFixed(2).replace(".", ",");
          alertBox.innerHTML = `
                    <div style="cursor: pointer; position: absolute; top: 5px; right: 10px; font-size: 16px; opacity: 0.8;" onclick="this.parentElement.remove()">✖</div>
                    <div style="font-size: 18px; margin-bottom: 6px; padding-right: 15px;">
                        📈 <strong>UWAGA! Cena wzrosła o ${increasePercent.toFixed(1)}% względem najniższej!</strong>
                    </div>
                    <span style="font-size: 15px; font-weight: normal;">Najniższa w logach: <strong>${formattedOld} zł</strong> ➔ Obecna: <strong>${formattedNew} zł</strong> (zweryfikuj z edit log)</span>
                `;
          document.body.appendChild(alertBox);
          requestAnimationFrame(() => {
            alertBox.style.opacity = "1";
            alertBox.style.transform = "translateX(0)";
          });
        }
      }).catch((e) => {
        if (DEBUG) console.error("❌ JALAPEÑO: Błąd:", e);
      });
    }
    let queueFetchDelay = 0;
    function checkQueuePriceIncreases() {
      if (!settings3.enablePriceWarning) return;
      if (!window.location.href.includes("/admin-v2/moderation/deals/")) return;
      let dealLinks = Array.from(document.querySelectorAll('a[href^="/admin-v2/moderation/thread/"]')).slice(0, 10);
      dealLinks.forEach((link) => {
        let match = link.href.match(/thread\/(\d+)/);
        if (!match) return;
        let threadId = match[1];
        let container = link.closest(".flex.xs12.py-0.pl-4");
        if (!container) return;
        if (container.dataset.jpPriceChecked) return;
        container.dataset.jpPriceChecked = "pending";
        if (DEBUG) console.log(`⏳ JALAPEÑO: Kolejkuję sprawdzenie logów dla okazji ID: ${threadId}`);
        let xsrfToken = "";
        let cookieMatch = document.cookie.match(/xsrf_t=([^;]+)/);
        if (cookieMatch) {
          xsrfToken = decodeURIComponent(cookieMatch[1]).replace(/^"|"$/g, "");
        }
        setTimeout(() => {
          if (DEBUG) console.log(`📡 JALAPEÑO: Pobieram dane (fetch) dla ID: ${threadId}...`);
          fetch(`https://www.pepper.pl/admin/thread-edit-log/${threadId}`, {
            method: "GET",
            credentials: "same-origin",
            headers: {
              "Accept": "application/json",
              "X-Requested-With": "XMLHttpRequest",
              "X-XSRF-TOKEN": xsrfToken
            }
          }).then((res) => res.json()).then((data) => {
            container.dataset.jpPriceChecked = "done";
            let changesArray = null;
            if (data && data.changes) {
              changesArray = data.changes;
            } else if (data && data.data && data.data.thread && data.data.thread.changes) {
              changesArray = data.data.thread.changes;
            } else if (data && data.data && data.data.changes) {
              changesArray = data.data.changes;
            } else if (Array.isArray(data)) {
              let itemWithChanges = data.find((item) => item && item.changes);
              if (itemWithChanges) changesArray = itemWithChanges.changes;
            }
            if (!changesArray || changesArray.length === 0) {
              if (DEBUG) console.log(`ℹ️ JALAPEÑO [ID: ${threadId}]: Brak zmian w logach.`);
              return;
            }
            let priceChanges = changesArray.filter((c) => c.property === "price");
            if (priceChanges.length === 0) {
              if (DEBUG) console.log(`ℹ️ JALAPEÑO [ID: ${threadId}]: Historia edycji istnieje, ale brak w niej zmian ceny.`);
              return;
            }
            let allPrices = priceChanges.flatMap((c) => [parseFloat(c.old_value), parseFloat(c.new_value)]).filter((p) => !isNaN(p) && p > 0);
            let lowestPrice = Math.min(...allPrices);
            priceChanges.sort((a, b) => a.created_at - b.created_at);
            let currentPrice = parseFloat(priceChanges[priceChanges.length - 1].new_value);
            if (isNaN(lowestPrice) || isNaN(currentPrice) || lowestPrice <= 0) {
              if (DEBUG) console.warn(`⚠️ JALAPEÑO [ID: ${threadId}]: Wykryto nieprawidłowe wartości cen (najniższa: ${lowestPrice}, obecna: ${currentPrice}).`);
              return;
            }
            let increasePercent = (currentPrice - lowestPrice) / lowestPrice * 100;
            if (DEBUG) {
              console.log(`📊 JALAPEÑO [ID: ${threadId}]: Kalkulacja:`);
              console.log(`   ➔ Najniższa znaleziona cena: ${lowestPrice} zł`);
              console.log(`   ➔ Najnowsza (obecna) cena: ${currentPrice} zł`);
              console.log(`   ➔ Wyliczony wzrost: ${increasePercent.toFixed(2)}%`);
            }
            if (increasePercent > 1) {
              if (DEBUG) console.log(`🚨 JALAPEÑO [ID: ${threadId}]: Zmiana powyżej 1%! Dodaję etykietę na ekran.`);
              increment("priceWarningsShown");
              let formattedOld = lowestPrice.toFixed(2).replace(".", ",");
              let formattedNew = currentPrice.toFixed(2).replace(".", ",");
              let badge = document.createElement("div");
              badge.style.cssText = `
                            background-color: var(--jp-stat-del-bg);
                            border-left: 4px solid var(--jp-stat-del-bo);
                            color: var(--jp-stat-del-co);
                            padding: 4px 8px;
                            font-size: 12px;
                            font-weight: bold;
                            margin-bottom: 6px;
                            border-radius: 3px;
                            display: inline-block;
                        `;
              badge.innerHTML = `📈 UWAGA: Cena wzrosła o ${increasePercent.toFixed(1)}% (z ${formattedOld} zł na ${formattedNew} zł)`;
              container.prepend(badge);
            } else {
              if (DEBUG) console.log(`✅ JALAPEÑO [ID: ${threadId}]: Cena nie wzrosła lub zmiana wynosi poniżej 1%.`);
            }
          }).catch((e) => {
            container.dataset.jpPriceChecked = "error";
            if (DEBUG) console.error(`❌ JALAPEÑO [ID: ${threadId}]: Błąd krytyczny podczas pobierania danych z API:`, e);
          });
        }, queueFetchDelay);
        queueFetchDelay += 150;
      });
      if (dealLinks.length === 0) queueFetchDelay = 0;
      else setTimeout(() => {
        queueFetchDelay = 0;
      }, queueFetchDelay + 500);
    }
    function checkDeal() {
      let urlTextarea = document.querySelector('textarea[name="mainUrl"]');
      let currentTitle = getCurrentTitle();
      if (!urlTextarea || !currentTitle) return false;
      if (settings3.enableFakePromo) checkFakePromoWarning();
      if (!document.querySelector(".mod-tools-container") && !window.jpDealCheckersAttached) {
        window.jpDealCheckersAttached = true;
        increment("totalPageChecks");
        const triggerVueInput = async (element, value) => {
          if (!element) return;
          element.focus();
          element.value = "";
          element.dispatchEvent(new Event("input", { bubbles: true }));
          for (let char of value) {
            element.value += char;
            element.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true }));
            element.dispatchEvent(new Event("input", { bubbles: true }));
            element.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
            await new Promise((r) => setTimeout(r, 10));
          }
          element.dispatchEvent(new Event("change", { bubbles: true }));
          element.blur();
        };
        let toolsBox = document.createElement("div");
        toolsBox.className = "mod-tools-container";
        toolsBox.style.position = "relative";
        let settingsBtn = document.createElement("button");
        settingsBtn.innerHTML = "⚙️";
        settingsBtn.className = "mod-settings-btn";
        settingsBtn.style.cssText = "position: absolute; top: 5px; right: 5px; z-index: 10;";
        settingsBtn.onclick = (e) => {
          e.preventDefault();
          openSettings();
        };
        toolsBox.appendChild(settingsBtn);
        if (settings3.enableFloatingButton) {
          let floatBtn = document.createElement("button");
          floatBtn.innerHTML = "✨";
          floatBtn.className = "mod-floating-btn";
          floatBtn.title = "Dodaj tekst: " + settings3.customFloatingText;
          floatBtn.onclick = async (e) => {
            e.preventDefault();
            let titleInput = document.querySelector('input[placeholder="Thread title"]');
            if (titleInput && settings3.customFloatingText) {
              let currentVal = titleInput.value;
              if (!currentVal.includes(settings3.customFloatingText.trim())) {
                await triggerVueInput(titleInput, currentVal + settings3.customFloatingText);
              }
            }
            if (settings3.floatingButtonAutoFreeDelivery) {
              setVuetifyCheckbox("Free Delivery", true, true);
            }
            floatBtn.innerHTML = "✅";
            setTimeout(() => {
              floatBtn.innerHTML = "✨";
            }, 1500);
          };
          toolsBox.appendChild(floatBtn);
        }
        let leftCol = document.createElement("div");
        leftCol.className = "mod-left-col";
        const debounce = (func, delay) => {
          let timeoutId;
          return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              func.apply(null, args);
            }, delay);
          };
        };
        if (settings3.enableFakePromo) {
          let addBtn = document.createElement("button");
          addBtn.innerText = t("btnFakePromoMark");
          addBtn.className = "fake-promo-btn";
          addBtn.onclick = (e) => {
            e.preventDefault();
            let autoPrice = getCurrentPrice() || 0;
            let corePat = getCorePattern(urlTextarea.value);
            if (confirm(`${t("promptFakePromo")} ${corePat}
${t("promptPrice")} ${autoPrice} zł`)) {
              addToDatabase(corePat, autoPrice, currentTitle, addBtn);
            }
          };
          leftCol.appendChild(addBtn);
        }
        let smartQuery = generateSmartQuery(currentTitle);
        let linksWrapper = document.createElement("div");
        linksWrapper.className = "mod-links-wrapper";
        leftCol.appendChild(linksWrapper);
        let renderQuickLinks = (titleToUse) => {
          let sQuery = generateSmartQuery(titleToUse);
          let pQuery = sQuery;
          if (titleToUse.toLowerCase().includes("lego")) {
            let numbers = titleToUse.match(/\b\d{4,7}\b/g);
            if (numbers) {
              let setId = numbers.find((num) => !(num.length === 4 && (num.startsWith("201") || num.startsWith("202"))));
              if (setId) {
                sQuery = `LEGO ${setId}`;
                pQuery = setId;
              }
            }
          }
          let encodedPerfumeQuery = encodeURIComponent(sQuery).replace(/%20/g, "+");
          let encodedEbookQuery = encodeURIComponent(sQuery).replace(/%20/g, "+");
          let encodedQuery = encodeURIComponent(sQuery);
          let encodedPromoQuery = encodeURIComponent(pQuery);
          let buttonsHtml = "";
          const allButtons = [
            { id: "Ceneo", icon: "🔍", url: `https://www.ceneo.pl/;szukaj-${encodedQuery}` },
            { id: "Keepa", icon: "📈", url: `https://keepa.com/#!search/3-${encodedQuery}` },
            { id: "GG.deals", icon: "🎮", url: `https://gg.deals/games/?title=${encodedQuery}` },
            { id: "PerfumeHub", icon: "💨", url: `https://perfumehub.pl/search?q=${encodedPerfumeQuery}` },
            { id: "LubimyCzytać", icon: "📖", url: `https://lubimyczytac.pl/szukaj/ksiazki?phrase=${encodedQuery}` },
            { id: "UpolujEbooka", icon: "📚", url: `https://upolujebooka.pl/szukaj,${encodedEbookQuery}.html#search` },
            { id: "Promoklocki", icon: "🧱", url: `https://promoklocki.pl/?s=${encodedPromoQuery}` },
            { id: "DekuDeals", icon: "🍄", url: `https://www.dekudeals.com/search?q=${encodedQuery}` },
            { id: "Google", icon: "🌐", url: `https://www.google.com/search?q=${encodedQuery}` }
          ];
          allButtons.forEach((btn) => {
            if (!settings3.hiddenButtons.includes(btn.id)) {
              buttonsHtml += `<a href="${btn.url}" target="_blank" class="mod-quick-btn">${btn.icon} ${btn.id}</a>`;
            }
          });
          linksWrapper.innerHTML = buttonsHtml;
        };
        renderQuickLinks(currentTitle);
        if (typeof window.jpUserEditedShipping === "undefined") {
          window.jpUserEditedShipping = false;
          window.jpAutoShippingSet = false;
          document.body.addEventListener("input", (e) => {
            if (e.isTrusted && e.target && e.target.tagName === "INPUT" && e.target.placeholder === "Shipping costs") {
              window.jpUserEditedShipping = true;
              e.target.style.backgroundColor = "";
              e.target.style.color = "";
              e.target.title = "";
              if (settings3.enableShippingCosts) setTimeout(updateShippingCostAlert, 200);
            }
          }, true);
          document.body.addEventListener("click", (e) => {
            if (e.isTrusted) {
              let wrapper = e.target.closest(".v-input--selection-controls");
              if (wrapper && wrapper.innerText.includes("Free Delivery")) {
                window.jpUserEditedShipping = true;
                window.jpAutoShippingSet = false;
                let coloredElements = Array.from(wrapper.querySelectorAll("*")).filter((x) => x.style && x.style.backgroundColor);
                coloredElements.forEach((el) => {
                  el.style.backgroundColor = "";
                  el.style.color = "";
                  el.style.padding = "";
                });
                if (settings3.enableShippingCosts) setTimeout(updateShippingCostAlert, 200);
              }
            }
          }, true);
        }
        let setVuetifyCheckbox = (labelText, desiredState, applyStyle = false) => {
          let elements = Array.from(document.querySelectorAll("div, span, p, label"));
          let targetEl = elements.find((el) => {
            return Array.from(el.childNodes).some(
              (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().includes(labelText)
            );
          });
          if (!targetEl) return null;
          let parentRow = targetEl.closest(".layout.align-center") || targetEl.parentElement;
          let wrapper = parentRow ? parentRow.querySelector(".v-input--selection-controls") : null;
          if (!wrapper) {
            parentRow = parentRow.parentElement;
            wrapper = parentRow ? parentRow.querySelector(".v-input--selection-controls") : null;
            if (!wrapper) return null;
          }
          let input = wrapper.querySelector('input[type="checkbox"]');
          let isChecked = input ? input.checked || input.getAttribute("aria-checked") === "true" : wrapper.classList.contains("v-input--is-label-active") || wrapper.classList.contains("v-input--is-dirty");
          if (isChecked !== desiredState) {
            let clickTarget = wrapper.querySelector('input[type="checkbox"]') || wrapper.querySelector(".v-input--selection-controls__ripple");
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
        const getShippingInput = () => {
          return document.querySelector('input[placeholder="Shipping costs"]') || document.querySelector('input[data-jp-shipping="true"]');
        };
        const getVueInstance = (el) => {
          while (el) {
            if (el.__vue__) return el.__vue__;
            el = el.parentElement;
          }
          return null;
        };
        const afterVueUpdate = (el) => {
          const vm = getVueInstance(el);
          if (vm) {
            return new Promise((resolve) => vm.$nextTick(() => setTimeout(resolve, 80)));
          }
          return new Promise((r) => setTimeout(r, 400));
        };
        const setShippingCost = async (value) => {
          let input = getShippingInput();
          if (!input) {
            if (DEBUG) console.warn("❌ Shipping input not found");
            return;
          }
          if (DEBUG) console.log("🚚 Auto shipping:", value);
          input.dispatchEvent(new FocusEvent("focus", { bubbles: true, composed: true }));
          input.value = "";
          input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
          for (let char of value) {
            input.value += char;
            input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, composed: true }));
            input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
            input.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, composed: true }));
            await new Promise((r) => setTimeout(r, 10));
          }
          input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
          input.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
          input.dispatchEvent(new FocusEvent("blur", { bubbles: true, composed: true }));
          await new Promise((r) => setTimeout(r, 50));
          input.classList.remove("jp-shipping-alert");
          input.style.color = "";
          input.style.backgroundColor = "";
          if (DEBUG) console.log("✅ Shipping set:", input.value);
        };
        let checkAutomations = () => {
          let urlTextarea2 = document.querySelector('textarea[name="mainUrl"]');
          if (!urlTextarea2) return;
          if (!window.jpLastCheckedUrl) {
            window.jpLastCheckedUrl = urlTextarea2.value;
          } else if (window.jpLastCheckedUrl !== urlTextarea2.value) {
            window.jpLastCheckedUrl = urlTextarea2.value;
            window.jpUserEditedShipping = false;
            window.jpAutoShippingSet = false;
            window.jpDealCheckersAttached = false;
            window.jpAutoLocalStoreCounted = null;
          }
          let canonicalUrlNode = document.querySelector('textarea[name="canonicalUrl"]');
          let linkToCheck = canonicalUrlNode && canonicalUrlNode.value.trim() !== "" ? canonicalUrlNode.value.toLowerCase() : urlTextarea2.value.toLowerCase();
          if (settings3.enableAutoAmazonShipping && linkToCheck.includes("amazon.pl")) {
            let price = getCurrentPrice();
            if (price !== null) {
              let allLabels = Array.from(document.querySelectorAll("label"));
              let freeDelLabel = allLabels.find((l) => l.innerText.trim().includes("Free Delivery"));
              let wrapper = freeDelLabel ? freeDelLabel.closest(".v-input--selection-controls") : null;
              let checkbox = wrapper ? wrapper.querySelector('input[type="checkbox"]') : null;
              let isChecked = checkbox ? checkbox.checked || checkbox.getAttribute("aria-checked") === "true" : wrapper && (wrapper.classList.contains("v-input--is-label-active") || wrapper.classList.contains("v-input--is-dirty"));
              if (price >= 65) {
                if (freeDelLabel && freeDelLabel.style.backgroundColor === "rgb(255, 82, 82)") {
                  freeDelLabel.style.backgroundColor = "var(--jp-stat-act-bg)";
                  freeDelLabel.style.color = "var(--jp-stat-act-co)";
                  freeDelLabel.title = "";
                }
                let shipInput = getShippingInput();
                if (shipInput) {
                  shipInput.classList.remove("jp-shipping-alert");
                  shipInput.placeholder = "Shipping costs";
                }
                window.jpAutoShippingSet = false;
                if (!window.jpUserEditedShipping) {
                  setVuetifyCheckbox("Free Delivery", true, true);
                }
              } else if (price > 0 && price < 65) {
                if (!window.jpUserEditedShipping && isChecked) {
                  isChecked = false;
                }
                if (isChecked && freeDelLabel) {
                  freeDelLabel.style.backgroundColor = "#ff5252";
                  freeDelLabel.style.color = "#fff";
                  freeDelLabel.title = "BŁĄD: Amazon poniżej 65 zł ma płatną wysyłkę! Odznacz darmową dostawę.";
                  freeDelLabel.style.padding = "2px 6px";
                  freeDelLabel.style.borderRadius = "4px";
                } else if (freeDelLabel && freeDelLabel.style.backgroundColor === "rgb(255, 82, 82)") {
                  freeDelLabel.style.backgroundColor = "";
                  freeDelLabel.style.color = "";
                }
                if (!window.jpUserEditedShipping && !window.jpAutoShippingSet) {
                  window.jpAutoShippingSet = true;
                  increment("autoShippingFilled");
                  (async () => {
                    setVuetifyCheckbox("Free Delivery", false, true);
                    await afterVueUpdate(getShippingInput());
                    if (!window.jpUserEditedShipping) {
                      await setShippingCost("8,99");
                    }
                  })();
                }
              }
            }
          }
          if (settings3.enableAutoAmazonShipping && linkToCheck.includes("allegro.pl") && !window.jpUserEditedShipping) {
            let shipInput = getShippingInput();
            if (shipInput && shipInput.value.trim() === "") {
              increment("autoShippingFilled");
              setTimeout(() => {
                if (!window.jpUserEditedShipping) {
                  setShippingCost("10,49");
                }
              }, 150);
            }
          }
          if (settings3.enableAutoAmazonShipping && linkToCheck.includes("zalando-lounge.pl") && !window.jpUserEditedShipping) {
            let shipInput = getShippingInput();
            if (shipInput && shipInput.value.trim() === "") {
              increment("autoShippingFilled");
              setTimeout(() => {
                if (!window.jpUserEditedShipping) {
                  setShippingCost("9,95");
                }
              }, 150);
            }
          }
          if (settings3.enableAutoLocalStore) {
            let titleStr = getCurrentTitle().toLowerCase();
            let matchedStore = null;
            const marketDB = [
              { keys: ["biedronka", "biedronki", "biedronce"], url: "https://www.biedronka.pl", local: true },
              { keys: ["dino"], url: "https://marketdino.pl", local: true },
              { keys: ["kaufland", "kauflandzie"], url: "https://www.kaufland.pl", local: true },
              { keys: ["auchan", "auchanie"], url: "https://www.auchan.pl", local: true },
              { keys: ["carrefour", "kerfur", "carrefourze"], url: "https://www.carrefour.pl", local: true },
              { keys: ["aldi"], url: "https://www.aldi.pl", local: true },
              { keys: ["netto"], url: "https://netto.pl", local: true },
              { keys: ["polomarket", "polo market", "polomarkecie"], url: "https://www.polomarket.pl", local: true },
              { keys: ["leclerc", "eleclerc", "e.leclerc"], url: "https://leclerc.pl", local: true },
              { keys: ["lidl", "lidlu"], url: "https://www.lidl.pl", local: false },
              { keys: ["action"], url: "https://www.action.com/pl-pl/", local: true },
              { keys: ["stokrotka", "stokrotce"], url: "https://stokrotka.pl/", local: true },
              { keys: ["intermarche"], url: "https://intermarche.pl/", local: true },
              { keys: ["selgros"], url: "https://www.selgros.pl/", local: true },
              { keys: ["lewiatan"], url: "https://lewiatan.pl/", local: true },
              { keys: ["topaz", "topaz24"], url: "https://topaz24.pl/", local: true },
              { keys: ["Leroy Merlin"], url: "https://www.leroymerlin.pl/", local: false },
              { keys: ["Castorama"], url: "https://www.castorama.pl/", local: false },
              { keys: ["Obi"], url: "https://www.obi.pl/", local: false },
              { keys: ["sinsay"], url: "https://www.sinsay.com/pl/pl/", local: false },
              { keys: ["ikea"], url: "https://www.ikea.com/pl/pl/", local: false },
              { keys: ["zabka", "żabka", "zabce", "zappsy", "zappsów"], url: "https://www.zabka.pl/", local: true },
              { keys: ["half price", "halfprice"], url: "https://www.halfprice.eu/en", local: true }
            ];
            matchedStore = marketDB.find((store) => {
              let isMatched = store.keys.some((key) => new RegExp("\\b" + key + "\\b").test(titleStr));
              let isExcluded = store.exclude ? store.exclude.some((ex) => titleStr.includes(ex)) : false;
              return isMatched && !isExcluded;
            });
            if (matchedStore) {
              if (urlTextarea2.value.trim() === "") {
                urlTextarea2.value = matchedStore.url;
                urlTextarea2.dispatchEvent(new Event("input", { bubbles: true }));
              }
              if (window.jpAutoLocalStoreCounted !== matchedStore.url) {
                window.jpAutoLocalStoreCounted = matchedStore.url;
                increment("autoShippingFilled");
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
        let rightCol = document.createElement("div");
        rightCol.className = "mod-right-col";
        if (settings3.enableHistory || settings3.enableMetaInfo) {
          let historyWrapper = document.createElement("div");
          historyWrapper.className = "pepper-history-box";
          rightCol.appendChild(historyWrapper);
          fetchPepperHistory(smartQuery, historyWrapper, false, currentTitle);
        } else {
          rightCol.innerHTML = `<div style="color:var(--jp-text-muted); font-size:11px; padding-top: 15px;">${t("lblHistDisabled")}</div>`;
        }
        if (settings3.enableProductInspector) initProductInspector(leftCol);
        toolsBox.appendChild(leftCol);
        toolsBox.appendChild(rightCol);
        let mainFormPanel = document.querySelector(".layout.column.mb-3.px-4") || document.querySelector(".mb-3");
        if (mainFormPanel && !document.getElementById("jp-shipping-side-panel")) {
          mainFormPanel.style.position = "relative";
          let sidePanel = document.createElement("div");
          sidePanel.id = "jp-shipping-side-panel";
          sidePanel.className = "jp-shipping-side-panel";
          mainFormPanel.appendChild(sidePanel);
        }
        let targetDiv = document.querySelector(".layout.column.mb-3.px-4");
        if (targetDiv && targetDiv.parentNode) {
          targetDiv.parentNode.insertBefore(toolsBox, targetDiv);
        } else {
          urlTextarea.parentNode.appendChild(toolsBox);
        }
        if (settings3.enableReverseImageSearch) initReverseImageSearch();
        if (settings3.enableLensDescription) initLensDescriptionPaste(settings3);
        if (settings3.enableLinkExpander) initLinkExpander();
        if (settings3.enablePriceWarning) {
          let threadMatch = window.location.href.match(/moderation\/thread\/(\d+)/);
          if (threadMatch && threadMatch[1]) {
            checkPriceIncrease(threadMatch[1]);
          }
        }
        let merchantNoteAlert = null;
        const getMerchantNameForNotes = () => {
          let merchantInput = document.querySelector('input[placeholder="Merchant name"], input[placeholder="No merchant"]');
          if (merchantInput && merchantInput.value.trim()) {
            return merchantInput.value.trim();
          }
          let historyBox = document.querySelector(".pepper-history-box");
          if (historyBox) {
            let text = historyBox.innerText;
            let match = text.match(/🏪 Sklep:\s*([^|\n]+)/);
            if (match && match[1]) {
              let parsedMerchant = match[1].trim();
              if (parsedMerchant !== "---") {
                return parsedMerchant;
              }
            }
          }
          let canonicalUrlNode = document.querySelector('textarea[name="canonicalUrl"]');
          let mainUrlNode = document.querySelector('textarea[name="mainUrl"]');
          let fallbackUrl = "";
          if (canonicalUrlNode && canonicalUrlNode.value.trim() !== "") {
            fallbackUrl = canonicalUrlNode.value.trim();
          } else if (mainUrlNode && mainUrlNode.value.trim() !== "") {
            fallbackUrl = mainUrlNode.value.trim();
          }
          if (fallbackUrl) {
            try {
              let domain = new URL(fallbackUrl).hostname.replace(/^www\./, "");
              if (domain) return domain;
            } catch (e) {
            }
          }
          return null;
        };
        const editMerchantNote = (merchantName, callback) => {
          let editContainer = document.createElement("div");
          editContainer.className = "jp-merchant-note-edit-container";
          editContainer.innerHTML = `
                    <div style="font-weight: 500; color: #ff9800; margin-bottom: 8px; font-size: 12px;">📝 Nowa notatka dla ${merchantName}</div>
                    <input type="text" class="jp-merchant-note-edit-input" placeholder="${t("placeholderMerchantNote")}" value="">
                    <div class="jp-merchant-note-button-group">
                        <button class="jp-merchant-note-save-edit">💾 ${t("btnAddMerchantNote")}</button>
                        <button class="jp-merchant-note-cancel-edit">Anuluj</button>
                    </div>
                `;
          let oldWrapper = document.querySelector(".jp-note-buttons-wrapper");
          if (oldWrapper && oldWrapper.parentNode) {
            oldWrapper.parentNode.removeChild(oldWrapper);
          }
          let standaloneLock = document.querySelector(".jp-lock-buttons-standalone");
          if (standaloneLock && standaloneLock.parentNode) {
            standaloneLock.parentNode.removeChild(standaloneLock);
          }
          let fakePromoAlert = document.querySelector(".fake-promo-alert");
          if (fakePromoAlert && fakePromoAlert.parentNode) {
            fakePromoAlert.parentNode.insertBefore(editContainer, fakePromoAlert.nextSibling);
          } else {
            let container = document.querySelector(".v-card.rounded-medium.border-grey--dark") || document.body;
            container.prepend(editContainer);
          }
          let input = editContainer.querySelector(".jp-merchant-note-edit-input");
          input.focus();
          let saveBtn = editContainer.querySelector(".jp-merchant-note-save-edit");
          let cancelBtn = editContainer.querySelector(".jp-merchant-note-cancel-edit");
          saveBtn.addEventListener("click", () => {
            let noteText = input.value.trim();
            if (noteText) {
              saveMerchantNote(merchantName, noteText);
            }
            callback();
          });
          cancelBtn.addEventListener("click", () => {
            callback();
          });
        };
        const editShippingCost = (merchantName, callback) => {
          let targetContainer = document.getElementById("jp-shipping-side-panel");
          if (!targetContainer) return;
          let currentCosts = getShippingCostsList(merchantName);
          let costValue = currentCosts ? currentCosts.cost : "";
          let freeDeliveryValue = currentCosts ? currentCosts.freeDeliveryFrom : "";
          let noteValue = currentCosts ? currentCosts.note : "";
          targetContainer.innerHTML = `
                    <div style="font-weight: bold; color: #4fc3f7; font-size: 15px; margin-bottom: 12px;">🚚 Edycja: ${merchantName}</div>
                    <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
                        <div>
                            <label style="font-size: 11px; color: var(--jp-text-muted); font-weight: bold;">Koszt dostawy (PLN):</label>
                            <input type="text" class="jp-shipping-cost-cost" value="${costValue}" style="width: 100%; padding: 8px; background: var(--jp-input-bg); border: 1px solid var(--jp-border); color: var(--jp-input-text); border-radius: 4px; box-sizing: border-box; margin-top: 4px;">
                        </div>
                        <div>
                            <label style="font-size: 11px; color: var(--jp-text-muted); font-weight: bold;">Darmowa dostawa od (PLN):</label>
                            <input type="text" class="jp-shipping-cost-free-from" value="${freeDeliveryValue}" style="width: 100%; padding: 8px; background: var(--jp-input-bg); border: 1px solid var(--jp-border); color: var(--jp-input-text); border-radius: 4px; box-sizing: border-box; margin-top: 4px;">
                        </div>
                        <div>
                            <label style="font-size: 11px; color: var(--jp-text-muted); font-weight: bold;">Notatka (opcjonalnie):</label>
                            <input type="text" class="jp-shipping-cost-note" value="${noteValue}" style="width: 100%; padding: 8px; background: var(--jp-input-bg); border: 1px solid var(--jp-border); color: var(--jp-input-text); border-radius: 4px; box-sizing: border-box; margin-top: 4px;">
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="jp-shipping-cost-save-edit" style="flex: 1; background-color: #2e7d32; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px;">💾 Zapisz</button>
                        <button class="jp-shipping-cost-cancel-edit" style="flex: 1; background-color: #757575; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px;">Anuluj</button>
                    </div>
                `;
          let costInput = targetContainer.querySelector(".jp-shipping-cost-cost");
          costInput.focus();
          targetContainer.querySelector(".jp-shipping-cost-save-edit").addEventListener("click", () => {
            let cost = targetContainer.querySelector(".jp-shipping-cost-cost").value.trim();
            let freeFrom = targetContainer.querySelector(".jp-shipping-cost-free-from").value.trim();
            let note = targetContainer.querySelector(".jp-shipping-cost-note").value.trim();
            if (cost || freeFrom || note) {
              let safeCost = cost ? parseFloat(cost.replace(",", ".").replace(/[^\d.]/g, "")) : 0;
              let safeFreeFrom = freeFrom ? parseFloat(freeFrom.replace(",", ".").replace(/[^\d.]/g, "")) : 0;
              saveShippingCost(merchantName, {
                cost: safeCost,
                freeDeliveryFrom: safeFreeFrom,
                note
              });
            }
            callback();
          });
          targetContainer.querySelector(".jp-shipping-cost-cancel-edit").addEventListener("click", () => {
            callback();
          });
        };
        let lastCountedShippingMerchant = null;
        const updateShippingCostAlert = () => {
          let targetContainer = document.getElementById("jp-shipping-side-panel");
          if (!targetContainer) return;
          if (!settings3.enableShippingCosts) {
            targetContainer.style.display = "none";
            return;
          } else {
            targetContainer.style.display = "flex";
          }
          let merchantName = getMerchantNameForNotes();
          if (!merchantName || merchantName === "---") {
            targetContainer.innerHTML = `<div style="color:var(--jp-text-muted); font-size:12px; text-align:center;">Wybierz lub wpisz sklep, aby zobaczyć koszty dostawy...</div>`;
            return;
          }
          let shippingCosts = getShippingCostsList(merchantName);
          if (!shippingCosts) {
            targetContainer.innerHTML = `
                        <div style="font-weight: bold; color: #4fc3f7; font-size: 15px; margin-bottom: 8px;">🚚 Dostawa z ${merchantName}</div>
                        <div style="font-size: 12px; color: var(--jp-text-muted); margin-bottom: 12px; line-height: 1.4;">Brak zapisanych kosztów dostawy dla tego sklepu.</div>
                        <button class="jp-shipping-cost-pull-btn" style="width: 100%; background-color: #ff9800; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold; margin-bottom: 8px; transition: 0.2s;">📥 Pobierz z formularza obok</button>
                        <button class="jp-shipping-cost-add-btn" style="width: 100%; background-color: #2196f3; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold; transition: 0.2s;">➕ Wpisz ręcznie</button>
                    `;
            targetContainer.querySelector(".jp-shipping-cost-pull-btn").addEventListener("click", () => {
              let nativeInput2 = document.querySelector('input[placeholder="Shipping costs"], input[data-jp-shipping="true"]');
              let allLabels2 = Array.from(document.querySelectorAll("label"));
              let freeDelLabel2 = allLabels2.find((l) => l.innerText.trim().includes("Free Delivery"));
              let wrapper2 = freeDelLabel2 ? freeDelLabel2.closest(".v-input--selection-controls") : null;
              let checkbox2 = wrapper2 ? wrapper2.querySelector('input[type="checkbox"]') : null;
              let isFreeChecked2 = checkbox2 ? checkbox2.checked || checkbox2.getAttribute("aria-checked") === "true" : wrapper2 && (wrapper2.classList.contains("v-input--is-label-active") || wrapper2.classList.contains("v-input--is-dirty"));
              if (isFreeChecked2) {
                saveShippingCost(merchantName, { cost: 0, freeDeliveryFrom: 0, note: "" });
                updateShippingCostAlert();
              } else if (nativeInput2 && nativeInput2.value.trim() !== "") {
                let parsedVal = parseFloat(nativeInput2.value.replace(",", ".").replace(/[^\d.]/g, ""));
                if (!isNaN(parsedVal)) {
                  saveShippingCost(merchantName, { cost: parsedVal, freeDeliveryFrom: 0, note: "" });
                  updateShippingCostAlert();
                } else {
                  alert("❌ Błąd: Nie można rozpoznać kwoty w polu formularza.");
                }
              } else {
                alert("❌ Błąd: Pole kosztów jest puste, a dostawa nie jest darmowa.");
              }
            });
            targetContainer.querySelector(".jp-shipping-cost-add-btn").addEventListener("click", () => {
              editShippingCost(merchantName, updateShippingCostAlert);
            });
            return;
          }
          if (merchantName !== lastCountedShippingMerchant) {
            lastCountedShippingMerchant = merchantName;
            increment("autoShippingFilled");
          }
          let price = getCurrentPrice() || 0;
          let nativeInput = document.querySelector('input[placeholder="Shipping costs"], input[data-jp-shipping="true"]');
          let nativeValue = nativeInput ? nativeInput.value.trim() : "";
          let parsedNativeValue = nativeValue ? parseFloat(nativeValue.replace(",", ".").replace(/[^\d.]/g, "")) : null;
          let shouldBeFree = shippingCosts.freeDeliveryFrom > 0 && price >= shippingCosts.freeDeliveryFrom || shippingCosts.cost === 0;
          let allLabels = Array.from(document.querySelectorAll("label"));
          let freeDelLabel = allLabels.find((l) => l.innerText.trim().includes("Free Delivery"));
          let wrapper = freeDelLabel ? freeDelLabel.closest(".v-input--selection-controls") : null;
          let checkbox = wrapper ? wrapper.querySelector('input[type="checkbox"]') : null;
          let isFreeChecked = checkbox ? checkbox.checked || checkbox.getAttribute("aria-checked") === "true" : wrapper && (wrapper.classList.contains("v-input--is-label-active") || wrapper.classList.contains("v-input--is-dirty"));
          let needsUpdate = false;
          if (shouldBeFree) {
            if (!isFreeChecked) needsUpdate = true;
          } else {
            if (isFreeChecked || parsedNativeValue !== shippingCosts.cost) needsUpdate = true;
          }
          let applyBtnHtml = needsUpdate ? `<button class="jp-shipping-apply-btn" style="width: 100%; background-color: #4caf50; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold; margin-bottom: 8px; transition: 0.2s; box-shadow: 0 2px 5px rgba(76, 175, 80, 0.4);">🚀 Zastosuj koszty w okazji</button>` : "";
          targetContainer.innerHTML = `
                    <div style="font-weight: bold; color: #4fc3f7; font-size: 15px; margin-bottom: 8px;">🚚 Dostawa z ${merchantName}</div>
                    <div style="background: var(--jp-input-bg); border: 1px solid #4fc3f7; border-left: 4px solid #4fc3f7; border-radius: 4px; padding: 12px; margin-bottom: 12px; font-size: 13px; color: var(--jp-text); line-height: 1.6;">
                        <div style="margin-bottom: 4px;">💵 <b>Koszt:</b> <span style="color:var(--jp-input-text); font-weight:bold;">${shippingCosts.cost} PLN</span></div>
                        ${shippingCosts.freeDeliveryFrom > 0 ? `<div style="margin-bottom: 4px;">🎁 <b>Darmowa od:</b> <span style="color:var(--jp-input-text); font-weight:bold;">${shippingCosts.freeDeliveryFrom} PLN</span></div>` : ""}
                        ${shippingCosts.note ? `<div>📌 <b>Info:</b> ${shippingCosts.note}</div>` : ""}
                    </div>
                    ${applyBtnHtml}
                    <div style="display: flex; gap: 8px;">
                        <button class="jp-shipping-cost-btn" title="Edytuj koszt" style="flex: 1; background-color: #5a5a5a; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold;">✏️ Edytuj</button>
                        <button class="jp-shipping-cost-delete-btn" title="Usuń" style="flex: 1; background-color: #f44336; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold;">🗑️ Usuń</button>
                    </div>
                `;
          if (needsUpdate) {
            targetContainer.querySelector(".jp-shipping-apply-btn").addEventListener("click", async () => {
              if (shouldBeFree) {
                setVuetifyCheckbox("Free Delivery", true, true);
                if (nativeInput && nativeInput.value !== "") {
                  nativeInput.focus();
                  nativeInput.value = "";
                  nativeInput.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
                  nativeInput.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
                  nativeInput.blur();
                }
              } else {
                const costStr = shippingCosts.cost.toString().replace(".", ",");
                setVuetifyCheckbox("Free Delivery", false, true);
                await afterVueUpdate(getShippingInput());
                await setShippingCost(costStr);
              }
              window.jpUserEditedShipping = true;
              setTimeout(() => updateShippingCostAlert(), 400);
            });
          }
          targetContainer.querySelector(".jp-shipping-cost-btn").addEventListener("click", () => {
            editShippingCost(merchantName, updateShippingCostAlert);
          });
          targetContainer.querySelector(".jp-shipping-cost-delete-btn").addEventListener("click", () => {
            if (confirm("⚠️ Czy na pewno chcesz usunąć ten koszt dostawy z bazy?")) {
              deleteShippingCost(merchantName);
              updateShippingCostAlert();
            }
          });
        };
        const updateMerchantNoteAlert = () => {
          if (!settings3.enableMerchantNotes) {
            let oldWrapper = document.querySelector(".jp-note-buttons-wrapper");
            if (oldWrapper && oldWrapper.parentNode) {
              oldWrapper.parentNode.removeChild(oldWrapper);
            }
            let editPanel = document.querySelector(".jp-merchant-note-edit-container");
            if (editPanel && editPanel.parentNode) {
              editPanel.parentNode.removeChild(editPanel);
            }
            return;
          }
          let merchantName = getMerchantNameForNotes();
          if (!merchantName) {
            let oldWrapper = document.querySelector(".jp-note-buttons-wrapper");
            if (oldWrapper && oldWrapper.parentNode) {
              oldWrapper.parentNode.removeChild(oldWrapper);
            }
            let editPanel = document.querySelector(".jp-merchant-note-edit-container");
            if (editPanel && editPanel.parentNode) {
              editPanel.parentNode.removeChild(editPanel);
            }
            return;
          }
          let notesList = getMerchantNotesList(merchantName);
          merchantNoteAlert = document.createElement("div");
          merchantNoteAlert.className = "jp-merchant-note-alert";
          let alertHTML = `<div style="font-weight: 500; color: #ff9800; margin-bottom: 6px; font-size: 11px;">📝 ${merchantName}</div>`;
          if (notesList.length > 0) {
            notesList.forEach((note, index) => {
              let dateObj = new Date(note.savedAt);
              let dateStr = dateObj.toLocaleDateString("pl-PL") + " " + dateObj.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
              alertHTML += `
                            <div style="display: flex; align-items: center; gap: 8px; padding: 6px; border-radius: 3px; margin-bottom: 6px; border-left: 2px solid #ff9800; background-color: rgba(255,255,255,0.05);">
                                <div style="color: var(--jp-text); font-size: 11px; word-break: break-word; flex: 1;">${note.text}</div>
                                <span style="font-size: 9px; color: #888; white-space: nowrap;">${note.savedBy} • ${dateStr}</span>
                                <button class="jp-merchant-note-delete-single" data-index="${index}" title="Usuń notatkę" style="padding: 2px 6px; font-size: 10px; flex-shrink: 0;">🗑️</button>
                            </div>
                        `;
            });
          }
          alertHTML += `
                    <button class="jp-merchant-note-edit-btn" style="width: 100%; background-color: #4a7a59; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: 500; transition: all 0.2s ease;">+ ${t("btnAddMerchantNote")}</button>
                `;
          merchantNoteAlert.innerHTML = alertHTML;
          let deleteButtons = merchantNoteAlert.querySelectorAll(".jp-merchant-note-delete-single");
          deleteButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
              let index = parseInt(btn.getAttribute("data-index"));
              if (confirm("⚠️ Czy na pewno chcesz trwale usunąć tę notatkę?")) {
                deleteMerchantNote(merchantName, index);
                updateMerchantNoteAlert();
              }
            });
          });
          let editBtn = merchantNoteAlert.querySelector(".jp-merchant-note-edit-btn");
          if (editBtn) {
            editBtn.addEventListener("click", () => {
              editMerchantNote(merchantName, updateMerchantNoteAlert);
            });
          }
          rebuildNoteButtonsWrapper(merchantNoteAlert);
        };
        const updateLockButtons = () => {
          if (!settings3.enableLockButtons) {
            let existingLock2 = document.querySelector(".jp-lock-buttons-standalone");
            if (existingLock2 && existingLock2.parentNode) {
              existingLock2.parentNode.removeChild(existingLock2);
            }
            return;
          }
          if (settings3.enableMerchantNotes) {
            return;
          }
          let existingLock = document.querySelector(".jp-lock-buttons-standalone");
          if (existingLock) {
            return;
          }
          let lockButtonsContainer = document.createElement("div");
          lockButtonsContainer.className = "jp-lock-buttons-standalone jp-lock-buttons-container";
          lockButtonsContainer.style.cssText = "margin-bottom: 10px;";
          lockButtonsContainer.innerHTML = `
                    <button class="jp-edit-lock-btn" title="Zablokuj edycję">🔒 Edit Lock</button>
                    <button class="jp-edit-unlock-btn" title="Odblokuj edycję">🔓 Edit Unlock</button>
                    <button class="jp-expire-lock-btn" title="Zablokuj ważność">⏰ Expire Lock</button>
                    <button class="jp-expire-unlock-btn" title="Odblokuj ważność">⏳ Expire Unlock</button>
                `;
          let fakePromoAlert = document.querySelector(".fake-promo-alert");
          if (fakePromoAlert && fakePromoAlert.parentNode) {
            fakePromoAlert.parentNode.insertBefore(lockButtonsContainer, fakePromoAlert.nextSibling);
          } else {
            let container = document.querySelector(".v-card.rounded-medium.border-grey--dark") || document.body;
            container.prepend(lockButtonsContainer);
          }
          attachLockButtonEvents(lockButtonsContainer);
        };
        const rebuildNoteButtonsWrapper = (noteAlertElement) => {
          let oldWrapper = document.querySelector(".jp-note-buttons-wrapper");
          if (oldWrapper && oldWrapper.parentNode) {
            oldWrapper.parentNode.removeChild(oldWrapper);
          }
          let standaloneLock = document.querySelector(".jp-lock-buttons-standalone");
          if (standaloneLock && standaloneLock.parentNode) {
            standaloneLock.parentNode.removeChild(standaloneLock);
          }
          let editPanel = document.querySelector(".jp-merchant-note-edit-container");
          if (editPanel && editPanel.parentNode) {
            editPanel.parentNode.removeChild(editPanel);
          }
          if (!settings3.enableMerchantNotes) {
            updateLockButtons();
            return;
          }
          if (!noteAlertElement) {
            return;
          }
          if (settings3.enableLockButtons) {
            let wrapperContainer = document.createElement("div");
            wrapperContainer.className = "jp-note-buttons-wrapper";
            wrapperContainer.style.cssText = "display: flex; gap: 10px; margin-bottom: 10px;";
            noteAlertElement.style.flex = "3";
            wrapperContainer.appendChild(noteAlertElement);
            let lockButtonsContainer = document.createElement("div");
            lockButtonsContainer.className = "jp-lock-buttons-container";
            lockButtonsContainer.style.flex = "1";
            lockButtonsContainer.innerHTML = `
                        <button class="jp-edit-lock-btn" title="Zablokuj edycję">🔒 Edit Lock</button>
                        <button class="jp-edit-unlock-btn" title="Odblokuj edycję">🔓 Edit Unlock</button>
                        <button class="jp-expire-lock-btn" title="Zablokuj ważność">⏰ Expire Lock</button>
                        <button class="jp-expire-unlock-btn" title="Odblokuj ważność">⏳ Expire Unlock</button>
                    `;
            wrapperContainer.appendChild(lockButtonsContainer);
            let fakePromoAlert = document.querySelector(".fake-promo-alert");
            if (fakePromoAlert && fakePromoAlert.parentNode) {
              fakePromoAlert.parentNode.insertBefore(wrapperContainer, fakePromoAlert.nextSibling);
            } else {
              let container = document.querySelector(".v-card.rounded-medium.border-grey--dark") || document.body;
              container.prepend(wrapperContainer);
            }
            attachLockButtonEvents(wrapperContainer);
          } else {
            let fakePromoAlert = document.querySelector(".fake-promo-alert");
            if (fakePromoAlert && fakePromoAlert.parentNode) {
              fakePromoAlert.parentNode.insertBefore(noteAlertElement, fakePromoAlert.nextSibling);
            } else {
              let container = document.querySelector(".v-card.rounded-medium.border-grey--dark") || document.body;
              container.prepend(noteAlertElement);
            }
          }
        };
        const attachLockButtonEvents = (container) => {
          let editLockBtn = container.querySelector(".jp-edit-lock-btn");
          let editUnlockBtn = container.querySelector(".jp-edit-unlock-btn");
          let expireLockBtn = container.querySelector(".jp-expire-lock-btn");
          let expireUnlockBtn = container.querySelector(".jp-expire-unlock-btn");
          if (editLockBtn) {
            editLockBtn.addEventListener("click", async (e) => {
              e.preventDefault();
              editLockBtn.disabled = true;
              try {
                await sendLockRequest("edit", "lock");
                increment("lockButtonsUsed");
                showToast(`✅ Edit lock włączony`);
              } catch (err) {
                showToast(`❌ Błąd: ${err}`, true);
              } finally {
                editLockBtn.disabled = false;
              }
            });
          }
          if (editUnlockBtn) {
            editUnlockBtn.addEventListener("click", async (e) => {
              e.preventDefault();
              editUnlockBtn.disabled = true;
              try {
                await sendLockRequest("edit", "unlock");
                increment("lockButtonsUsed");
                showToast(`✅ Edit lock wyłączony`);
              } catch (err) {
                showToast(`❌ Błąd: ${err}`, true);
              } finally {
                editUnlockBtn.disabled = false;
              }
            });
          }
          if (expireLockBtn) {
            expireLockBtn.addEventListener("click", async (e) => {
              e.preventDefault();
              expireLockBtn.disabled = true;
              try {
                await sendLockRequest("expire", "lock");
                increment("lockButtonsUsed");
                showToast(`✅ Expire lock włączony`);
              } catch (err) {
                showToast(`❌ Błąd: ${err}`, true);
              } finally {
                expireLockBtn.disabled = false;
              }
            });
          }
          if (expireUnlockBtn) {
            expireUnlockBtn.addEventListener("click", async (e) => {
              e.preventDefault();
              expireUnlockBtn.disabled = true;
              try {
                await sendLockRequest("expire", "unlock");
                increment("lockButtonsUsed");
                showToast(`✅ Expire lock wyłączony`);
              } catch (err) {
                showToast(`❌ Błąd: ${err}`, true);
              } finally {
                expireUnlockBtn.disabled = false;
              }
            });
          }
        };
        if (settings3.enableMerchantNotes) {
          let lastCountedMerchantForNotes = null;
          const originalUpdateMerchantNoteAlert = updateMerchantNoteAlert;
          const trackedUpdateMerchantNoteAlert = () => {
            originalUpdateMerchantNoteAlert();
            const currentMerchant = getMerchantNameForNotes();
            if (currentMerchant && currentMerchant !== lastCountedMerchantForNotes) {
              const notesList = getMerchantNotesList(currentMerchant);
              if (notesList.length > 0) {
                lastCountedMerchantForNotes = currentMerchant;
                increment("autoMerchantNotesInserted");
              }
            }
          };
          trackedUpdateMerchantNoteAlert();
          let merchantInput = document.querySelector('input[placeholder="Merchant name"], input[placeholder="No merchant"]');
          if (merchantInput) {
            merchantInput.addEventListener("change", trackedUpdateMerchantNoteAlert);
            merchantInput.addEventListener("input", debounce(trackedUpdateMerchantNoteAlert, 300));
          }
        }
        if (settings3.enableShippingCosts) {
          updateShippingCostAlert();
          let merchantInput = document.querySelector('input[placeholder="Merchant name"], input[placeholder="No merchant"]');
          if (merchantInput) {
            merchantInput.addEventListener("change", updateShippingCostAlert);
            merchantInput.addEventListener("input", debounce(updateShippingCostAlert, 300));
          }
        }
        updateLockButtons();
        let detectAndConvertCallback = null;
        if (settings3.enableCalculator) {
          let couponInput = document.querySelector('input[placeholder="Coupon name"]');
          if (couponInput && !document.getElementById("pepper-mod-converter-wrapper")) {
            let couponRow = couponInput.closest(".flex.shrink");
            if (couponRow && couponRow.parentNode) {
              let wrapper = document.createElement("div");
              wrapper.id = "pepper-mod-converter-wrapper";
              wrapper.style.cssText = "display: flex; flex-direction: row; width: 100%; align-items: stretch;";
              couponRow.parentNode.insertBefore(wrapper, couponRow);
              wrapper.appendChild(couponRow);
              couponRow.style.flexGrow = "1";
              let convBox = document.createElement("div");
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
                                <button id="mod-conv-btn-price" class="mod-conv-btn-v2">${t("calcPastePln")}</button>
                                <button id="mod-conv-btn-title" class="mod-conv-btn-v2">${t("calcTitleCur")}</button>
                            </div>
                        `;
              wrapper.appendChild(convBox);
              fetchExchangeRates((rates) => {
                let btnPrice = document.getElementById("mod-conv-btn-price");
                let btnTitle = document.getElementById("mod-conv-btn-title");
                let inputAmt = document.getElementById("mod-conv-amount");
                let selFrom = document.getElementById("mod-conv-from");
                let resultSpan = document.getElementById("mod-conv-result");
                let currentCalculatedPLN = 0;
                let currentOriginalValue = 0;
                selFrom.value = settings3.defaultCurrency || "EUR";
                let lastDetectedString = "";
                let lastCountedConversion = "";
                let updateResult = () => {
                  let rawVal = inputAmt.value.replace(",", ".").replace(/[^\d.]/g, "");
                  let val = parseFloat(rawVal);
                  if (isNaN(val) || val <= 0) {
                    resultSpan.innerText = "0,00 zł";
                    currentOriginalValue = 0;
                    currentCalculatedPLN = 0;
                    return;
                  }
                  currentOriginalValue = val;
                  currentCalculatedPLN = val / rates[selFrom.value] * rates["PLN"];
                  resultSpan.innerText = currentCalculatedPLN.toFixed(2).replace(".", ",") + " zł";
                  const conversionKey = `${selFrom.value}:${val}:${currentCalculatedPLN.toFixed(2)}`;
                  if (conversionKey !== lastCountedConversion) {
                    lastCountedConversion = conversionKey;
                    increment("calculatorCalculations");
                  }
                };
                detectAndConvertCallback = (text) => {
                  let priceMatch = text.match(/(?:(?:€|\$|£|EUR|USD|GBP)\s*(\d+(?:[.,]\d+)?))|(?:\b(\d+(?:[.,]\d+)?)\s*(?:€|\$|£|EUR|USD|GBP)(?!\s*\d))/i);
                  if (priceMatch) {
                    let currentMatch = priceMatch[0].toLowerCase();
                    if (currentMatch !== lastDetectedString) {
                      lastDetectedString = currentMatch;
                      let extractedNum = priceMatch[1] || priceMatch[2];
                      inputAmt.value = extractedNum.replace(",", ".");
                      if (currentMatch.includes("eur") || currentMatch.includes("€")) selFrom.value = "EUR";
                      if (currentMatch.includes("usd") || currentMatch.includes("$")) selFrom.value = "USD";
                      if (currentMatch.includes("gbp") || currentMatch.includes("£")) selFrom.value = "GBP";
                      updateResult();
                    }
                  } else {
                    lastDetectedString = "";
                    if (text.toLowerCase().includes("eur") || text.includes("€")) {
                      selFrom.value = "EUR";
                    }
                    if (text.toLowerCase().includes("usd") || text.includes("$")) {
                      selFrom.value = "USD";
                    }
                    if (text.toLowerCase().includes("gbp") || text.includes("£")) {
                      selFrom.value = "GBP";
                    }
                  }
                };
                detectAndConvertCallback(currentTitle);
                inputAmt.addEventListener("input", updateResult);
                selFrom.addEventListener("change", updateResult);
                updateResult();
                btnPrice.onclick = (e) => {
                  e.preventDefault();
                  if (currentCalculatedPLN <= 0) {
                    if (DEBUG) console.warn("❌ Brak wartości do wklejenia");
                    return;
                  }
                  let priceInput = document.querySelector('input[placeholder="Price"]') || document.querySelector('input[aria-label="Price"]') || document.querySelector('input[type="text"]');
                  if (DEBUG) console.log("🔎 znaleziony input:", priceInput);
                  if (priceInput) {
                    let formatted = currentCalculatedPLN.toFixed(2).replace(".", ",");
                    if (DEBUG) console.log("💰 Wklejam:", formatted);
                    triggerVueInput(priceInput, formatted);
                    increment("calculatorButtonClicks");
                    let oldText = btnPrice.innerText;
                    btnPrice.innerText = t("calcPasted");
                    btnPrice.style.backgroundColor = "var(--jp-stat-act-bg)";
                    setTimeout(() => {
                      btnPrice.style.backgroundColor = "";
                      btnPrice.innerText = oldText;
                    }, 1500);
                  } else {
                    if (DEBUG) console.error("❌ Nie znaleziono inputa ceny!");
                  }
                };
                btnTitle.onclick = (e) => {
                  e.preventDefault();
                  if (currentOriginalValue <= 0) return;
                  let titleInput = document.querySelector('input[placeholder="Thread title"]');
                  if (titleInput) {
                    let symbol = selFrom.value === "EUR" ? "€" : selFrom.value === "USD" ? "$" : "£";
                    let stringToAppend = ` | ${currentOriginalValue.toFixed(2).replace(".", ",")}${symbol}`;
                    if (!titleInput.value.includes(stringToAppend)) {
                      triggerVueInput(titleInput, titleInput.value.trim() + stringToAppend);
                    }
                    increment("calculatorButtonClicks");
                    let oldText = btnTitle.innerText;
                    btnTitle.innerText = t("calcAdded");
                    btnTitle.style.backgroundColor = "var(--jp-stat-act-bg)";
                    setTimeout(() => {
                      btnTitle.style.backgroundColor = "";
                      btnTitle.innerText = oldText;
                    }, 1500);
                  }
                };
              });
            }
          }
        }
        let titleInputField = document.querySelector('input[placeholder="Thread title"]');
        if (titleInputField) {
          titleInputField.addEventListener("input", debounce((e) => {
            let val = e.target.value;
            renderQuickLinks(val);
            checkAutomations();
            if (typeof detectAndConvertCallback === "function") detectAndConvertCallback(val);
          }, 400));
        }
        let priceInputNode = document.querySelector('input[placeholder="Price"]');
        if (priceInputNode) {
          priceInputNode.addEventListener("input", debounce(() => {
            checkAutomations();
            if (settings3.enableShippingCosts) updateShippingCostAlert();
          }, 400));
        }
      }
      return true;
    }
    fetchExchangeRates(() => {
    });
    fetchMerchantNotesFromAPI();
    loadDatabase();
    function getPromoSlugFromPage() {
      let referrer = document.referrer;
      if (referrer) {
        try {
          let match = referrer.match(/\/promocje\/([^\/\?]+)/);
          if (match && match[1]) {
            if (DEBUG) console.log("✅ Slug wyciągnięty z referer-a");
            return match[1];
          }
        } catch (e) {
        }
      }
      try {
        let allLinks = document.querySelectorAll('a[href*="/promocje/"]');
        for (let link of allLinks) {
          let href = link.getAttribute("href");
          let match = href.match(/\/promocje\/([^\/\?]+)/);
          if (match && match[1]) {
            if (DEBUG) console.log("✅ Slug wyciągnięty ze strony:", match[1]);
            return match[1];
          }
        }
      } catch (e) {
        if (DEBUG) console.warn("❌ Błąd szukania linku:", e);
      }
      try {
        let threadMatch = window.location.href.match(/moderation\/thread\/(\d+)/);
        if (threadMatch && threadMatch[1]) {
          let threadId = threadMatch[1];
          if (DEBUG) console.log("ℹ️ Thread ID:", threadId);
        }
      } catch (e) {
      }
      return null;
    }
    function sendLockRequest(lockType, action) {
      let slug = getPromoSlugFromPage();
      if (!slug) {
        alert("❌ Nie udało się znaleźć slug-a okazji.\n\nUpewnij się, że:\n1. Jesteś na stronie moderacji okazji\n2. Link do okazji jest wyświetlony na stronie\n\nJeśli problem się powtarza, spróbuj odświeżyć stronę.");
        return Promise.reject("No slug found");
      }
      let endpoint = lockType === "edit" ? "edit-lock" : "expire-lock";
      let url = `https://www.pepper.pl/promocje/${slug}/${endpoint}`;
      if (DEBUG) console.log(`🔒 Wysyłam ${action} request do ${endpoint}:`, url);
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "POST",
          url,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest"
          },
          data: `action=${action}`,
          onload: function(response) {
            if (DEBUG) console.log(`✅ Odpowiedź ${endpoint}:`, response.status, response.responseText);
            resolve(response);
          },
          onerror: function(error) {
            console.error(`❌ Błąd przy wysyłaniu ${endpoint}:`, error);
            reject(error);
          }
        });
      });
    }
    function displayMerchantNotesOnPage() {
      if (!settings3.enableMerchantNotes) return;
      let profileHeading = document.querySelector('h1, h2, [class*="title"]');
      if (profileHeading && profileHeading.innerText && !profileHeading.parentNode.querySelector(".jp-merchant-note-display")) {
        let merchantName = profileHeading.innerText.trim();
        if (merchantName && merchantName.length > 2 && merchantName.length < 50) {
          let notesList = getMerchantNotesList(merchantName);
          if (notesList && notesList.length > 0) {
            displayMerchantNote(merchantName, profileHeading);
          }
        }
      }
    }
    function moveNativeApproveBtn() {
      if (!settings3.enableMoveApproveBtn) return;
      let allBtns = Array.from(document.querySelectorAll("button.v-btn"));
      let targetBtn = allBtns.find((b) => b.innerText && b.innerText.includes("APPROVE & SEND PM"));
      if (targetBtn && !targetBtn.classList.contains("jp-approve-moved")) {
        targetBtn.classList.add("jp-approve-moved");
        let container = targetBtn.closest(".layout.wrap");
        if (container) {
          container.classList.add("jp-relative-container");
        } else {
          targetBtn.parentElement.classList.add("jp-relative-container");
        }
      }
    }
    function getCurrentDealCategory() {
      const extractFromChip = (content) => {
        const icon = content.querySelector("i.material-icons");
        if (!icon || icon.textContent.trim() !== "close") return null;
        const name = content.textContent.replace(/close/gi, "").replace(/\s+/g, " ").trim();
        return name || null;
      };
      const labelNodes = Array.from(document.querySelectorAll("label, .v-label, div"));
      const categoryLabel = labelNodes.find((el) => /^(Category|Kategoria|Thread category)$/i.test(el.textContent.trim()));
      if (categoryLabel) {
        const container = categoryLabel.closest(".layout") || categoryLabel.closest(".flex") || categoryLabel.parentElement?.parentElement?.parentElement;
        if (container) {
          for (const content of container.querySelectorAll(".v-btn__content")) {
            const name = extractFromChip(content);
            if (name) return name;
          }
        }
      }
      for (const content of document.querySelectorAll(".v-btn__content")) {
        const name = extractFromChip(content);
        if (name) return name;
      }
      return null;
    }
    function getCurrentCouponCode() {
      const input = document.querySelector('input[placeholder="Coupon name"]');
      return input?.value?.trim() || null;
    }
    function getApproveReasonText(reason, reasonsMap) {
      if (reason === "Kategoria") {
        const category = getCurrentDealCategory();
        if (category) {
          return `Poprawiliśmy kategorię okazji na „${category}”. Dobrą praktyką jest wybór właściwej kategorii już przy dodawaniu wpisu — ułatwia to społeczności znalezienie okazji w odpowiednich zakładkach i otrzymywanie alertów.`;
        }
        return "Poprawiliśmy kategorię okazji. Dobrą praktyką jest wybór właściwej kategorii już przy dodawaniu wpisu — ułatwia to społeczności znalezienie okazji w odpowiednich zakładkach i otrzymywanie alertów.";
      }
      if (reason === "Kod rabatowy") {
        const code = getCurrentCouponCode();
        if (code) {
          return `Uzupełniliśmy brakujący kod rabatowy „${code}”, który powinien być podany w okazji. Pamiętaj proszę, aby przy kolejnych publikacjach od razu wpisywać działający kod — to kluczowa informacja dla społeczności, bez której trudno skorzystać z promocji.`;
        }
        return "Uzupełniliśmy brakujący kod rabatowy w okazji. Pamiętaj proszę, aby przy kolejnych publikacjach od razu wpisywać działający kod — to kluczowa informacja dla społeczności, bez której trudno skorzystać z promocji.";
      }
      return reasonsMap[reason];
    }
    function checkApproveMessageModal() {
      if (!settings3.enableApproveReasons) return;
      let titleNodes = document.querySelectorAll("h3.title");
      let isApproveModalOpen = Array.from(titleNodes).some((node) => node.innerText.includes("Approve and Send Message"));
      if (!isApproveModalOpen) return;
      let ta = document.querySelector('textarea[placeholder="Message for the thread submitter"]');
      if (!ta) return;
      const isTargetTemplate = /Uzupełniliśmy\/zmieniliśmy/i.test(ta.value);
      let wrapper = document.getElementById("jp-approve-reasons-wrapper");
      if (!wrapper) {
        const APPROVE_REASONS = {
          "Waluta": "Dodaliśmy do opisu cenę w oryginalnej obcej walucie. Przy ofertach od zagranicznych sprzedawców dobrze jest dopisywać oryginalną walutę obok ceny w złotówkach. Kursy walut potrafią się szybko zmieniać, więc dzięki temu cena w okazji zawsze będzie precyzyjna, a społeczność łatwo sprawdzi realny koszt w danym momencie.",
          "Koszt dostawy": "Dodaliśmy brakujący koszt dostawy. Następnym razem pamiętaj proszę o uzupełnieniu wysyłki. Dla naszej społeczności ostateczna cena razem z dostawą to kluczowa informacja, żeby uczciwie ocenić całościowy koszt i zdecydować o zakupie.",
          "Tytuł (uzupełnienie)": "Uzupełniliśmy tytuł o dokładną nazwę/ rodzaj /producenta i model produktu. Mała wskazówka na przyszłość: warto podawać pełną nazwę sprzętu już przy dodawaniu okazji najlepiej w formacie [Rodzaj sprzętu] [Producent] [Model] (np. Karta graficzna ASUS RTX 4060). W przypadku wielu sklepów wystarczy przekopiować to z ich strony. Dla naszej społeczności to kluczowa informacja, żeby od razu wiedzieć, czego dotyczy oferta i łatwiej znaleźć ją w wyszukiwarce.",
          "Tytuł (zbędne)": "Zmieniliśmy odrobinę tytuł. Mała podpowiedź na przyszłość: w tytule najlepiej podawać wyłącznie samą nazwę produktu oraz jego model. Taki tytuł ułatwia społeczności wyszukiwanie okazji i sprawia, że wygląda on o wiele lepiej.",
          "KNC / NBP": "Zaktualizowaliśmy w okazji kolejną najlepszą cenę, czyli najniższą kwotę, za jaką można teraz kupić ten produkt w innych sklepach. Warto pamiętać o tym polu, bo przekreślone ceny promocyjne na stronach sprzedawców bywają mocno zawyżone. Podanie realnego porównania od razu pokazuje społeczności faktyczną obniżkę, a to zazwyczaj przynosi masę plusów!",
          "Zaokrąglenie ceny": "Poprawiliśmy cenę w okazji na dokładną kwotę bez zaokrągleń. Na przyszłość staraj się podawać cenę co do grosza, dokładnie taką, jaka jest w sklepie. Dla naszej społeczności liczy się każdy grosz, a precyzyjna kwota pozwala od razu zobaczyć realną, najniższą cenę i bezkonkurencyjność oferty.",
          "Data zakończenia": "Uzupełniliśmy w okazji datę zakończenia promocji, którą udało się zweryfikować na stronie sklepu. Dobrą praktyką jest dopisywanie czasu trwania promocji, jeśli tylko jest podany. Dzięki temu okazja wygaśnie automatycznie w odpowiednim momencie, a społeczność dostanie jasną informację, ile czasu zostało na zakupy.",
          "Rozwinięcie linku": "Podmieniliśmy w okazji link ze skróconego na pełny adres do sklepu. Jako szybki tip: na platformie zawsze używamy pełnych linków bez skracaczy lub krótkich linków z aplikacji. Bardzo często aplikacje mobilne sklepów podczas kliknięcia Udostępnij automatycznie generują takie skrócone adresy.\n\nDla porównania:\nLink z aplikacji: https://amzn.eu/d/00qOnKk2\nPrawidłowy pełny link: https://www.amazon.pl/dp/B0B9BBJ3BL\n\nDzięki dodawaniu pełnych adresów system prawidłowo rozpoznaje sprzedawcę, a nasza społeczność bez problemu znajduje ofertę i od razu otrzymuje ustawione alerty o promocji.",
          "Oczyszczenie linku": "Oczyściliśmy link w okazji z dodatkowych parametrów i tagów po znaku zapytania. Pamiętaj proszę, że zgodnie z naszym regulaminem na platformie nie pozwalamy na wrzucanie linków afiliacyjnych ani reflinków.\n\nMała wskazówka na przyszłość: przed wklejeniem linku na Peppera warto skasować z paska adresu wszystko, co znajduje się po znaku zapytania.",
          "Okazja lokalna": "Oznaczyliśmy w okazji, że to oferta lokalna, żeby społeczność wiedziała, że znajdzie produkt stacjonarnie a nie online. Dobrą praktyką przy dodawaniu takich promocji jest zaznaczenie opcji stacjonarnej już w formularzu. Jasna informacja oszczędza czas innym użytkownikom i pozwala im od razu zaplanować zakupy na miejscu.",
          "Okazja->Kupon": "Zmieniliśmy typ Twojego wpisu z okazji na kupon. Mała wskazówka na przyszłość: formę okazji wybieramy wtedy, gdy podajesz cenę konkretnego produktu lub dodajesz kod z przynajmniej jednym przykładem zakupu. Kupony są idealne na ogólne akcje promocyjne i kody rabatowe bez rozpisywania przykładów. Dzięki takiemu podziałowi społeczność łatwiej trafia na Twoje okazje w odpowiednich zakładkach.",
          "Kategoria": "",
          "Kod rabatowy": "",
          "Opis": "Dodaliśmy do opisu specyfikację i najważniejsze parametry produktu. Dobrą praktyką na przyszłość jest wrzucanie krótkich danych technicznych lub cech sprzętu już przy tworzeniu opisu okazji. Dla naszej społeczności to ogromne ułatwienie, bo pozwala szybko ocenić opłacalność oferty bez konieczności szukania szczegółów na innych stronach. Co więcej, jeśli znasz ten produkt, używałeś go lub testowałeś, niesamowicie ważna i pomocna dla innych jest Twoja osobista opinia, wrażenia z użytkowania."
        };
        let container = ta.closest(".v-input").parentNode;
        wrapper = document.createElement("div");
        wrapper.id = "jp-approve-reasons-wrapper";
        wrapper.style.cssText = "margin: 10px 0 15px 0; padding: 12px; background: var(--jp-input-bg); border: 1px solid var(--jp-border); border-radius: 6px;";
        wrapper.style.display = isTargetTemplate ? "block" : "none";
        let header = document.createElement("div");
        header.innerHTML = '<strong style="color: var(--jp-link);">🛠️ Szybkie szablony (A&M)</strong><br><span style="font-size: 11px; color: var(--jp-text-muted);">Zaznacz powody edycji (wkleją się poniżej słowa "uzupełniliśmy/zmieniliśmy").</span>';
        header.style.marginBottom = "10px";
        wrapper.appendChild(header);
        let checkboxContainer = document.createElement("div");
        checkboxContainer.style.cssText = "display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; max-height: 200px; overflow-y: auto; padding-right: 5px;";
        let updateTextarea = () => {
          let baseVal = ta.value;
          let anchorRegex = /(Uzupełniliśmy\/zmieniliśmy:?)/i;
          let closingRegex = /(Czekamy na Twoje kolejne okazje!.*)/i;
          let matchAnchor = baseVal.match(anchorRegex);
          let matchClosing = baseVal.match(closingRegex);
          if (!matchAnchor) return;
          let beforeText = baseVal.substring(0, matchAnchor.index + matchAnchor[0].length);
          if (!beforeText.endsWith(":")) beforeText += ":";
          let closingText = matchClosing ? matchClosing[0] : "Czekamy na Twoje kolejne okazje!";
          let newInsertedText = "";
          let checkboxes = wrapper.querySelectorAll('input[type="checkbox"]:checked');
          checkboxes.forEach((cb) => {
            newInsertedText += "\n- " + getApproveReasonText(cb.value, APPROVE_REASONS) + "\n";
          });
          let finalVal = beforeText + (newInsertedText ? "\n" + newInsertedText + "\n" : "\n\n") + closingText;
          let valueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
          valueSetter.call(ta, finalVal);
          ta.dispatchEvent(new Event("input", { bubbles: true }));
        };
        Object.keys(APPROVE_REASONS).forEach((reason) => {
          let lbl = document.createElement("label");
          lbl.style.cssText = "display: flex; align-items: flex-start; gap: 5px; cursor: pointer; color: var(--jp-text); line-height: 1.2;";
          let cb = document.createElement("input");
          cb.type = "checkbox";
          cb.value = reason;
          cb.style.marginTop = "2px";
          cb.addEventListener("change", (ev) => {
            if (ev.target.checked) increment("autoApproveReasonsUsed");
            updateTextarea();
          });
          lbl.appendChild(cb);
          lbl.appendChild(document.createTextNode(reason));
          checkboxContainer.appendChild(lbl);
        });
        wrapper.appendChild(checkboxContainer);
        container.insertBefore(wrapper, ta.closest(".v-input"));
      } else {
        wrapper.style.display = isTargetTemplate ? "block" : "none";
      }
    }
    let lastHighlightCheck = 0;
    let lastUpdateSaveBtn = 0;
    let lastBannedHighlightCheck = 0;
    const RARE_FUNCTION_INTERVAL = 1500;
    let lastKnownHref = "";
    setInterval(() => {
      let currentHref = window.location.href;
      if (currentHref !== lastKnownHref) {
        lastKnownHref = currentHref;
        window.jpDealCheckersAttached = false;
        window.jpLastCheckedUrl = null;
        window.jpUserEditedShipping = false;
        window.jpAutoShippingSet = false;
        let oldWarningBox = document.querySelector(".jp-price-warning-toast");
        if (oldWarningBox) oldWarningBox.remove();
      }
      let isModeration = currentHref.includes("/admin-v2/moderation/");
      let isInspector = currentHref.includes("/admin/inspector/");
      if (!isModeration && !isInspector) return;
      let titleInput = document.querySelector('input[placeholder="Thread title"]');
      let isAlreadyInjected = document.querySelector(".mod-tools-container");
      if (titleInput && !isAlreadyInjected) checkDeal();
      checkInfractionModal();
      checkInspectorModal();
      checkHoldNoteAutomator();
      checkMessageTemplates();
      moveNativeApproveBtn();
      checkInfractionNoteAutomator();
      displayMerchantNotesOnPage();
      checkApproveMessageModal();
      checkQueuePriceIncreases();
      let now = Date.now();
      if (now - lastHighlightCheck >= RARE_FUNCTION_INTERVAL) {
        highlightEditedCards();
        lastHighlightCheck = now;
      }
      if (now - lastUpdateSaveBtn >= RARE_FUNCTION_INTERVAL) {
        updateSaveButtonText();
        lastUpdateSaveBtn = now;
      }
      if (settings3.enableBannedHighlight && now - lastBannedHighlightCheck >= RARE_FUNCTION_INTERVAL) {
        highlightBannedAndUnauthenticated();
        lastBannedHighlightCheck = now;
      }
    }, 300);
  })();
})();
