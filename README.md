# 🌶️ Jalapeño - PepperModPL add-on

![Version](https://img.shields.io/badge/Version-4.7.9-brightgreen)
![Platform](https://img.shields.io/badge/Platform-Tampermonkey%20%7C%20Violentmonkey-orange)
![For](https://img.shields.io/badge/For-Pepper.pl%20Moderation-blue)

**Jalapeño** is a powerful, unofficial extension designed to facilitate and speed up the daily workflow of Pepper.pl moderators. The script automates repetitive tasks, provides essential contextual information, and protects against approving fake or cyclic promotions.

---

## 📦 Installation

1. Install a script manager extension in your browser (e.g., [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/)).
2. Click the link below to install the script:
   👉 **[INSTALL JALAPEÑO](https://raw.githubusercontent.com/wojciech-g/Jalapeno-Pepper/main/jalapeno.user.js)**
3. Open the Pepper moderation panel to see the script in action.

---

## 🚀 Main Features

The script consists of multiple modules that you can freely enable or disable in the settings.

### 🚩 1. "Fake Promo" Database (Protection against cyclic deals)
Automatically analyzes added links and titles, warning you with a prominent red banner if a given offer is listed in the fake/cyclic promotions database.
* **Quick add:** You can add a new "fake deal" along with its standard price to the database with a single click.
* *Requires a connected Google Apps Script backend.*

<img width="1207" height="357" alt="image" src="https://github.com/user-attachments/assets/7940918d-c92d-4969-b3c6-4f99621387a6" />

### 📊 2. Similar Deals & History (Pepper Search Engine)
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
* **Action buttons:** You will see a "Paste PLN" button (replaces the price in the form) and a "Title + currency" button (automatically appends the original price to the title, e.g., ` | 45.99€`).

<img width="1163" height="537" alt="Zrzut ekranu 2026-05-14 o 16 21 15" src="https://github.com/user-attachments/assets/be6ebee4-0822-45b9-adaa-1dc2c61f207a" />

### 🤖 4. Shipping & Local Stores Assistant (Automation)
* **Amazon, Allegro, Zalando Lounge:** The script knows the free delivery thresholds. It automatically checks the "Free Delivery" option (e.g., for Amazon above 65 PLN) or automatically fills in the exact shipping costs (e.g., 8.99 PLN / 10.49 PLN).
* **Local Stores:** If store names like Biedronka, Dino, Lidl, Kaufland, etc., appear in the title, the script automatically fills in the default URL and checks the "Local offer" / "Okazja stacjonarna" boxes.

### 📝 5. Hold Message Templates & Auto-Notes
Stop typing the same thing over and over when putting deals on hold or issuing infractions!
* **Hold Templates:** Buttons above the message field (Expiration Date, Price, Coins, Currency, Link, Code, etc.) that append formatted text directly to the user message.
* **Auto-Note for Moderators (Hold):** The script analyzes what you send to the user and automatically enters the reason for the Hold procedure into the moderator note field.
* **Infraction & Deletion Notes:** Automatically generates and fills the internal moderator note when you delete a comment, deal, or issue a warning/ban, keeping the moderation log clean and consistent.

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
A small, discreet button next to the title field that allows you to append your customized text (e.g., ` | Smart! Okazja`) to the title and optionally check/uncheck free delivery with a single click.

### 🏪 9. Merchant Notes System
Keep track of store-specific rules, warnings, or tips. The script allows you to add, edit, and delete internal notes for any merchant directly in the moderation panel.
* Notes are displayed as prominent alerts when processing a deal from a specific store.
* Fully synced across the team using a backend API (Google Apps Script).

<img width="1219" height="446" alt="Zrzut ekranu 2026-05-31 o 16 57 26" src="https://github.com/user-attachments/assets/520336e3-8243-410b-97cb-de495b26ee8b" />

<img width="1219" height="200" alt="Zrzut ekranu 2026-05-31 o 16 58 08" src="https://github.com/user-attachments/assets/6a065b26-1c91-4fcf-9017-af5e15c1ffaa" />

---

## ⚙️ Settings and Configuration

The script features a powerful, graphical configuration UI accessible by clicking the **⚙️** icon inside the moderation panel.

* 🌗 **Full UI Themes (Dark Mode):** Choose between Light and Dark mode. The script completely overhauls both the legacy V1 (Angular) and modern V2 (Vuetify) moderation panels, providing a consistent, custom-tailored, eye-friendly Dark Mode across the entire admin dashboard.
* 🌍 **Language:** Polish (PL) or English (EN).
* 🔧 **Toggle modules:** Don't need the history tab? Turn it off. Prefer manual math? Disable the calculator.
* 🎛️ **Full history customization:** Choose exactly what data points (Author, Temperature, Store, Copy Button) should be displayed in the history list (includes a live preview in the settings menu!).
* 🛑 **Stop Words:** Define custom words that the script should ignore when analyzing the title for search queries.
* 📍 **Floating Approve Button:** An optional setting to move the "Approve & Send PM" button to a more accessible, floating position on the screen, saving you from unnecessary scrolling.

<img width="843" height="874" alt="Zrzut ekranu 2026-05-31 o 17 51 34" src="https://github.com/user-attachments/assets/73052f78-a8a4-460d-85f1-911283a34923" />

---

## 💎 Advanced Features & QoL Improvements

Jalapeño works quietly in the background to prevent human errors and streamline the workflow with several smart tweaks:

* 🚨 **Amazon Delivery Fail-safe:** If an Amazon deal is priced under 65 PLN but the "Free Delivery" box is checked, the script highlights the delivery label in bright red with a tooltip warning you to uncheck it and apply shipping costs.
* ⚖️ **Infraction & Warning Auto-formatting:** The script actively monitors the inspector/infraction modal. It checks whether you've selected "Warning only" or assigned penalty points, and flawlessly updates the boilerplate placeholder (e.g., automatically replacing `***ostrzeżenie / punkty karne:` with `Poprzez tę wiadomość otrzymujesz punkty karne (2).`).
* ✂️ **Smart Hold Note Extractor:** If you type a custom message to the user during a Hold procedure, the script neatly extracts your custom text, safely truncates it to 270 characters (to prevent cutting off), and pastes it into the moderator notes field for your team to see.
* ✋ **Manual Intervention Detection:** Jalapeño respects your manual inputs. If you manually type a shipping cost or click the free delivery checkbox, the script flags it and stops "fighting" you with its automations, giving you full control.
* 🤝 **Active Editing Highlight:** Visually highlights deals (with an orange border and background) that are "currently edited by" another moderator, preventing accidental overlapping of work.
* 💾 **Save Button Text Fix:** Automatically changes the confusing "Dodaj Okazję" (Add Deal) text on the main save button to a much more logical "Zapisz edycję" (Save edit) when you are modifying an existing deal.
* 🖼️ **Image Editor UI Cleanup:** Removes unnecessary borders, standardizes backgrounds, and tones down overly bright warning banners in the built-in image editor for a much cleaner look.

---

## 🛠️ Technologies and API
* **Fake Promo Database:** Google Apps Script (Web App)
* **Exchange Rates:** Open Exchange Rates API (`open.er-api.com`)
* **Styling:** Injected CSS with CSS variables support (Light/Dark Mode).

---

👤 **Author:** [Xcited](https://www.pepper.pl/profile/Xcited)  
🐛 **Bug reports and feature requests:** Head over to the [Issues](https://github.com/wojciech-g/Jalapeno-Pepper/issues) tab or let me know about them here: https://docs.google.com/spreadsheets/d/1eguFqRMikJQW55eEgt1K5gdUlGgqvghHb9ryVA3MpHA/edit?gid=0#gid=0.
