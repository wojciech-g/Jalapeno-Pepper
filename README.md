# 🌶️ Jalapeño - PepperModPL add-on

![Version](https://img.shields.io/badge/Version-5.0.15-brightgreen)
![Platform](https://img.shields.io/badge/Platform-Tampermonkey%20%7C%20Violentmonkey-orange)
![For](https://img.shields.io/badge/For-Pepper.pl%20Moderation-red)

**Jalapeño** is a powerful, unofficial extension designed to facilitate and speed up the daily workflow of Pepper.pl moderators. The script automates repetitive tasks, provides essential contextual information, and protects against approving fake or cyclic promotions.

> 🥦 **Dla edytorów (nie moderatorów):** lekki skrypt z podpowiedziami kategorii — osobna instalacja, opis w **[README-editors.md](README-editors.md)**.

---

## 📦 Installation

1. Install a script manager extension in your browser (e.g., [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/)).
2. Click the link below to install the script:
   👉 **[INSTALL JALAPEÑO](https://raw.githubusercontent.com/wojciech-g/Jalapeno-Pepper/main/jalapeno.user.js)**
3. Open the Pepper moderation panel to see the script in action.

---

## 🚀 Main Features

The script consists of multiple modules that you can freely enable or disable in the settings panel (🌶️ button in the top toolbar).

### 🚨 1. "Fake Promo" Database (Protection against cyclic deals)
Automatically analyzes added links and titles, warning you with a prominent red banner if a given offer is listed in the fake/cyclic promotions database.
* **Quick add:** You can add a new "fake deal" along with its standard price to the database with a single click.
* *Requires a connected Google Apps Script backend.*

<img width="1207" height="357" alt="image" src="https://github.com/user-attachments/assets/7940918d-c92d-4969-b3c6-4f99621387a6" />

### 🔍 2. Similar Deals & History (Pepper Search Engine)
Instead of manually searching for duplicates, Jalapeño does it for you live!
* Displays recently added similar deals based on a "Smart Query" (intelligent title filtering).
* **Full statistics:** Shows status (Active/Expired/Deleted), price, temperature, author (banned users are highlighted in red!), store, and date added.
* **Category distribution:** Displays a percentage breakdown of categories, making it easier to assign the correct one.
* **Keyword fallback:** If no exact match is found, it falls back to searching by general categories (e.g., "tv", "laptop").

<img width="1221" height="324" alt="Zrzut ekranu 2026-05-14 o 16 16 54" src="https://github.com/user-attachments/assets/b548748e-0607-447f-8588-30bd18d5ef57" />

### 💱 3. Built-in Currency Calculator (EUR / USD / GBP)
No more manual currency conversions in new tabs.
* Automatically detects foreign currencies in the deal title.
* Converts the amount to PLN based on always up-to-date exchange rates (API).
* **Action buttons:** "Paste PLN" (replaces the price in the form) and "Title + currency" (automatically appends the original price to the title, e.g., ` | 45.99€`).

<img width="1163" height="537" alt="Zrzut ekranu 2026-05-14 o 16 21 15" src="https://github.com/user-attachments/assets/be6ebee4-0822-45b9-adaa-1dc2c61f207a" />

### 🤖 4. Shipping & Local Stores Assistant (Automation)
* **Amazon, Allegro, Zalando Lounge:** The script knows the free delivery thresholds. It automatically checks the "Free Delivery" option or fills in exact shipping costs.
* **Local Stores:** If store names like Biedronka, Dino, Lidl, Kaufland, etc., appear in the title, the script automatically fills in the default URL and checks the "Local offer" box.

### 📝 5. Hold Message Templates & Auto-Notes
Stop typing the same thing over and over when putting deals on hold or issuing infractions!
* **Hold Templates:** Buttons above the message field (Expiration Date, Price, Coins, Currency, Link, Code, etc.) that append formatted text directly to the user message.
* **Auto-Note for Moderators (Hold):** Analyzes what you send to the user and automatically enters the reason for the Hold procedure into the moderator note field.
* **Infraction & Deletion Notes:** Automatically generates and fills the internal moderator note when you delete a comment, deal, or issue a warning/ban.

<img width="1006" height="649" alt="Zrzut ekranu 2026-05-14 o 16 24 51" src="https://github.com/user-attachments/assets/8bb10dad-103e-42d8-8761-c98c4795791f" />

### ✅ 6. Approve & Send Message (A&M) Templates
Save time when approving deals that required your modifications!
* A dedicated checklist automatically appears in the Approve modal.
* Select from a list of quick reasons (e.g., "Price rounded", "Added missing shipping cost", "Expanded title").
* The script cleanly formats them into a bulleted list and inserts them directly into your PM to the author.

<img width="1008" height="787" alt="Zrzut ekranu 2026-05-31 o 17 01 42" src="https://github.com/user-attachments/assets/df991e08-8f9a-458c-8899-64877ffd0ba8" />

### 🔗 7. Quick Links (External Search Engines)
A dedicated panel with buttons to instantly check the product on:
* Ceneo, Keepa, GG.deals, PerfumeHub, LubimyCzytać, UpolujEbooka, Promoklocki, DekuDeals, Google.
*(You can hide any unneeded buttons in the settings).*

<img width="292" height="155" alt="Zrzut ekranu 2026-05-31 o 17 40 50" src="https://github.com/user-attachments/assets/52257aae-02b6-4ae2-9105-63ac820a641d" />

### ✨ 8. "Quick Append" Floating Button
A small, discreet button next to the title field that allows you to append your customized text to the title and optionally check/uncheck free delivery with a single click.

### 🪣 9. Merchant Notes System
Keep track of store-specific rules, warnings, or tips. Allows you to add, edit, and delete internal notes for any merchant directly in the moderation panel.
* Notes are displayed as prominent alerts when processing a deal from a specific store.
* Fully synced across the team using a backend API (Google Apps Script).

<img width="1219" height="446" alt="Zrzut ekranu 2026-05-31 o 16 57 26" src="https://github.com/user-attachments/assets/520336e3-8243-410b-97cb-de495b26ee8b" />

### 🚚 10. Custom Shipping Costs Database
A dedicated side panel that displays and manages delivery costs for specific stores.
* **API Sync:** Fetches and saves shipping rules from a shared Google Apps Script backend to keep the whole team updated.
* **Smart Application:** If the deal's current price and entered shipping cost don't match the database rules, a green "Apply" button appears.
* **Manual Override:** Add, edit, or delete shipping costs for any store straight from the UI.

<img width="1024" height="500" alt="No data found in database" src="https://github.com/user-attachments/assets/6a54292f-0eb2-4ec0-bd92-a20bd79d60a1" />

<img width="1794" height="877" alt="ChatGPT Image 9 cze 2026, 12_25_25" src="https://github.com/user-attachments/assets/fe97cc9e-65a2-416c-803c-ae27c9d3f560" />

### 🔒 11. Quick Lock Controls (Edit & Expire)
A set of handy buttons injected directly into the moderation panel to quickly lock or unlock deals.
* **Edit Lock / Unlock:** Instantly block the author from modifying the deal.
* **Expire Lock / Unlock:** Prevent the deal from being expired or un-expired.
* Triggers background API requests without reloading the page.

<img width="1207" height="154" alt="Zrzut ekranu 2026-06-9 o 12 45 19" src="https://github.com/user-attachments/assets/be11df10-8af3-4b5b-b0de-4fd614554319" />

### 🚨 12. Price Increase Warning (>1%)
Protects against authors artificially inflating prices after posting.
* **Queue Detection:** Scans edit logs of the first 10 deals on the moderation list. A prominent red warning badge appears if the price increased by more than 1% from its lowest recorded point.
* **In-Deal Toast Alert:** A sliding warning toast instantly notifies you of the exact percentage increase when you open a deal.

<img width="1024" height="500" alt="No data found in database (1)" src="https://github.com/user-attachments/assets/9db6d59f-3cba-4479-973f-a8193a736609" />

### 🔴 13. Banned & Unauthenticated Highlighting
Automatically scans the page and visually emphasizes specific user statuses.
* **"Banned" Alert:** Wraps the word "banned" in a highly visible, bright red badge.
* **"Unauthenticated" Alert:** Highlights with a prominent yellow warning box.
* Works everywhere across the administration panel — history logs, inspector views, user profiles.

<img width="1211" height="173" alt="Zrzut ekranu 2026-06-9 o 12 57 58" src="https://github.com/user-attachments/assets/cd5b9b43-a0b9-4928-805a-e3ad862cc3d0" />

### 🏷️ 14. Category Advisor
Suggests the best category for a deal based on Pepper history and internal rewards data.
* **Auto-suggestions:** Percentage pills next to the category field when a confident match is found.
* **Manual search:** Search by keyword with results from both Pepper threads and the rewards database.

<img width="272" height="592" alt="Zrzut ekranu 2026-06-22 o 23 41 22" src="https://github.com/user-attachments/assets/8fb6f8c6-819f-4bb8-84ce-82f332401632" />

### 🔴 15. Offline Deals Queue Panel
Surfaces deals with broken or unreachable links across the entire moderation queue (`deals/new`).
* **Full pagination scan:** Scans all list pages and detects the native `error` icon / "Offline" label.
* **Dedicated panel:** A separate "offline" tab with a filterable list; click a deal to open it for review.
* **Auto-refresh:** Count and list update in the background as Pepper finishes rendering link-check icons.

<img width="1070" height="119" alt="Zrzut ekranu 2026-06-23 o 18 31 51" src="https://github.com/user-attachments/assets/e77b8389-b05e-44f7-b2e7-722b5ea9285d" />

<img width="1841" height="626" alt="Zrzut ekranu 2026-06-23 o 18 39 12" src="https://github.com/user-attachments/assets/616c0a0c-e8cf-46d1-af93-34d5a6edba92" />

### 📅 16. Exact Timestamps on Queue Lists
Replaces relative times ("Submitted 4 hours ago") with precise datetimes on **New**, **On Hold**, and **Reported** lists.
* Format: `23.06.2026 18:31:51` (Submitted + Published when available).
* Data sourced from the moderation list JSON API.

### 👤 17. User Inspector Links (Metabase + IPs)
Quick-access toolbar on the thread edit page and in the legacy user inspector profile.

**On thread edit** (below the user card):
* **Track UUID** — Metabase UUID tracker
* **Co dodaje** — top threads by author
* **Na kogo głosuje** — cold/hot vote patterns
* **Wykres temperatury** — temperature evolution for the current deal
* **All IPs** — expandable panel with recent IPs (clickable → inspector), plus "open all in tabs"

<img width="1211" height="417" alt="Zrzut ekranu 2026-06-23 o 21 28 52" src="https://github.com/user-attachments/assets/6ae0583d-e396-48ef-9808-2ac3ca5014ec" />

### 🔬 18. Product Inspector & Research Tools
* **EAN / ASIN detection:** Finds product identifiers in the title or URL; generates a barcode preview.
* **Reverse image search:** One-click Google Lens from the main deal image.
* **Link expander:** Unshortens redirect URLs before you review the deal.
* **Lens AI description:** Fetches and inserts Google Lens AI overview text into the description field.
* **Allegro images:** Pulls product images from Allegro listing pages into the Pepper form.

<img width="1217" height="831" alt="Zrzut ekranu 2026-06-15 o 10 47 28" src="https://github.com/user-attachments/assets/9e1fd3c1-4f7a-4f6d-b91a-4595ed8ebeab" />

### 🛒 19. Shop Info Panel *(new in 5.0)*
Automatically fetches seller/merchant data from the deal's offer URL and displays it in a fixed side panel — without leaving the moderation page.

**Supported platforms:** Allegro · Erli · AliExpress · Amazon · Empik · eBay · Kaufland

**Key features:**
* Opens AliExpress / Empik in a **background tab** using a nonce-based mechanism — user-opened tabs of the same URL are **never accidentally closed**
* Checks the seller against the **blacklist database** and shows a prominent warning if found
* "Dodaj wpis" button to submit a new blacklist entry directly from the panel
* Fixed to the left edge of the screen, positioned above the "Historia" session tab — never overlaps it
* Polish date/time format: `07.03.2026, 23:01:24`

---

## ⚙️ Settings and Configuration

The script features a powerful, graphical configuration UI accessible by clicking the **🌶️** icon in the moderation panel toolbar.

* 🌓 **Full UI Themes (Dark Mode):** Choose between Light and Dark mode. The script completely overhauls both the legacy V1 (Angular) and modern V2 (Vuetify) moderation panels.
* 🌐 **Language:** Polish (PL) or English (EN).
* 🧩 **Toggle modules:** Every feature can be independently enabled or disabled.
* 🗂️ **Full history customization:** Choose exactly what data points (Author, Temperature, Store, Copy Button) to display in the history list — includes a live preview.
* 🔞 **Stop Words:** Define custom words that the script should ignore when analyzing titles for search queries.
* 📌 **Floating Approve Button:** Move the "Approve & Send PM" button to a floating, accessible position.

<img width="1210" height="1284" alt="Zrzut ekranu 2026-06-9 o 13 04 10" src="https://github.com/user-attachments/assets/f6fd4d8d-05cb-42d6-ab92-65956287324e" />

---

## 🎉 What's New in 5.0

| # | Change |
|---|--------|
| 🛒 | **Shop Info Panel** — fully integrated seller lookup for 7 merchant platforms, with blacklist checking and safe nonce-based tab management |
| 👋 | **Welcome splash screen** — personalized greeting with the moderator's name on first load of each session, with animated countdown bar |
| 🎨 | **Consistent orange accent** — all button hover/focus states now use the Jalapeño orange palette; blue accents removed throughout the UI |
| 🔧 | **Banner & note placement fix** — fake promo alerts, merchant notes, and lock buttons no longer overlap native Save / Approve / Delete buttons |
| 🔴 | **"Banned" highlight scope fix** — the highlight feature no longer triggers inside the settings modal or welcome splash |
| 🔒 | **Lock button labels** — renamed "Edycja" → "Edit" and "Ważność" → "Expire" for consistency |

---

## 🛠️ Technologies and API
* **Fake Promo | Merchant Notes | Shipping Costs Database:** Google Apps Script (Web App)
* **Exchange Rates:** Open Exchange Rates API (`open.er-api.com`)
* **Metabase (user/deal analytics):** UUID tracker, top threads, vote patterns, temperature charts
* **User IPs:** Pepper admin API (`GET /admin/users/{id}`)
* **Blacklist (Shop Info):** `pepper.spamowisko.ovh` API
* **Styling:** Injected CSS with CSS variables support (Light/Dark Mode)

---

🤖 **Author:** [Xcited](https://www.pepper.pl/profile/Xcited)
🐛 **Bug reports and feature requests:** Head over to the [Issues](https://github.com/wojciech-g/Jalapeno-Pepper/issues) tab or the [feedback spreadsheet](https://docs.google.com/spreadsheets/d/1eguFqRMikJQW55eEgt1K5gdUlGgqvghHb9ryVA3MpHA/edit?gid=0#gid=0).
