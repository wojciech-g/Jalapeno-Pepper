# 🌶️ Jalapeño - PepperModPL add-on

![Version](https://img.shields.io/badge/Version-4.6.3-brightgreen)
![Platform](https://img.shields.io/badge/Platform-Tampermonkey%20%7C%20Violentmonkey-orange)
![For](https://img.shields.io/badge/For-Pepper.pl%20Moderation-blue)

**Jalapeño** is a powerful, unofficial extension (UserScript) designed to facilitate and speed up the daily workflow of Pepper.pl moderators. The script automates repetitive tasks, provides essential contextual information, and protects against approving fake or cyclic promotions (Fake Promo).

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

![Screenshot: Fake Promo warning banner]<img width="1207" height="357" alt="image" src="https://github.com/user-attachments/assets/7940918d-c92d-4969-b3c6-4f99621387a6" />


### 📊 2. Similar Deals & History (Pepper Search Engine)
Instead of manually searching for duplicates, Jalapeño does it for you live! 
* Displays recently added similar deals based on a "Smart Query" (intelligent title filtering).
* **Full statistics:** Shows status (Active/Expired/Deleted), price, temperature, author (banned users are highlighted in red!), store, and date added.
* **Category distribution:** Displays a percentage breakdown of categories, making it easier to assign the correct one.
* **Keyword fallback:** If no exact match is found, it falls back to searching by general categories (e.g., "tv", "laptop").

![Screenshot: History and similar deals panel]<img width="1221" height="324" alt="Zrzut ekranu 2026-05-14 o 16 16 54" src="https://github.com/user-attachments/assets/b548748e-0607-447f-8588-30bd18d5ef57" />


### 💱 3. Built-in Currency Calculator (EUR / USD / GBP)
No more manual currency conversions in new tabs.
* Automatically detects foreign currencies in the deal title.
* Converts the amount to PLN based on always up-to-date exchange rates (API).
* **Action buttons:** You will see a "Paste PLN" button (replaces the price in the form) and a "Title + currency" button (automatically appends the original price to the title, e.g., ` | 45.99€`).

![Screenshot: Currency calculator]<img width="1318" height="815" alt="Zrzut ekranu 2026-05-14 o 09 49 48" src="https://github.com/user-attachments/assets/d1f7a8a3-9dd9-4a58-9fe6-534e4427f3d3" />


### 🤖 4. Shipping & Local Stores Assistant (Automation)
* **Amazon, Allegro, Zalando Lounge:** The script knows the free delivery thresholds. It automatically checks the "Free Delivery" option (e.g., for Amazon above 65 PLN) or automatically fills in the exact shipping costs (e.g., 8.99 PLN / 10.49 PLN).
* **Local Stores:** If store names like Biedronka, Dino, Lidl, Kaufland, etc., appear in the title, the script automatically fills in the default URL and checks the "Local offer" / "Okazja stacjonarna" boxes.

### 📝 5. Message Templates (Hold) & Auto-Notes
Stop typing the same thing over and over—use quick buttons instead!
* **Ready-made templates:** Buttons above the message field (Expiration Date, Price, Coins, Currency, Availability, Link, Code, Source) that append formatted text directly to the user message.
* **Auto-Note for Moderators:** The script analyzes what you send to the user and automatically enters the reason for the Hold procedure (e.g., "Confirmation", "Source") into the moderator note field for the rest of the team.
* Automatically formats texts in warning/ban windows.

![Screenshot: Hold message templates] <img width="1006" height="649" alt="Zrzut ekranu 2026-05-14 o 16 24 51" src="https://github.com/user-attachments/assets/8bb10dad-103e-42d8-8761-c98c4795791f" />


### ✨ 6. "Quick Append" Floating Button
A small, discreet button next to the title field that allows you to append your customized text (e.g., ` | Smart! Okazja`) to the title and optionally check/uncheck free delivery with a single click.

### 🔗 7. Quick Links (External Search Engines)
A dedicated panel with buttons to instantly check the product on:
* Ceneo, Keepa, GG.deals, PerfumeHub, LubimyCzytać, UpolujEbooka, Promoklocki, DekuDeals, Google.
*(You can hide any unneeded buttons in the settings).*

---

## ⚙️ Settings and Configuration

The script features a powerful, graphical configuration UI accessible by clicking the **⚙️** icon inside the moderation panel.

* 🌗 **Theme:** Light or Dark (match it to your preferences!).
* 🌍 **Language:** Polish (PL) or English (EN).
* 🔧 **Toggle modules:** Don't need the history tab? Turn it off. Prefer manual math? Disable the calculator.
* 🎛️ **Full history customization:** Choose exactly what data points (Author, Temperature, Store, Copy Button) should be displayed in the history list (includes a live preview in the settings menu!).
* 🛑 **Stop Words:** Define custom words that the script should ignore when analyzing the title for search queries.

![Screenshot: Jalapeno settings window] <img width="2012" height="1514" alt="image" src="https://github.com/user-attachments/assets/a0584a05-e5f0-403e-91e5-431798d3fa32" />


---

## 🛠️ Technologies and API
* **Fake Promo Database:** Google Apps Script (Web App)
* **Exchange Rates:** Open Exchange Rates API (`open.er-api.com`)
* **Styling:** Injected CSS with CSS variables support (Light/Dark Mode).

---

👤 **Author:** [Xcited](https://www.pepper.pl/profile/Xcited)  
🐛 **Bug reports and feature requests:** Head over to the [Issues](https://github.com/wojciech-g/Jalapeno-Pepper/issues) tab or let me know about them here: https://docs.google.com/spreadsheets/d/1eguFqRMikJQW55eEgt1K5gdUlGgqvghHb9ryVA3MpHA/edit?gid=0#gid=0.
