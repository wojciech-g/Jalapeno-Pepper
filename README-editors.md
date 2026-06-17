# 🤖 Jalapeño for editors — Asystent Kategorii

![Version](https://img.shields.io/badge/Wersja-1.0.3-brightgreen)
![Platform](https://img.shields.io/badge/Platforma-Tampermonkey-orange)
![Dla](https://img.shields.io/badge/Dla-Edytorów%20Pepper.pl-blue)

**Jalapeño for editors** to lekki, osobny skrypt userscript — **nie wymaga** pełnego Jalapeño dla moderatorów. Pokazuje podpowiedzi kategorii na podstawie bazy historycznych okazji ze Slacka, podczas dodawania lub edycji wpisu na Pepper.pl.

> 📘 Pełny skrypt dla moderatorów opisuje [README.md](README.md).

---

## 📦 Instalacja (Tampermonkey)

### Krok 1 — Rozszerzenie do przeglądarki

Zainstaluj menedżer userscriptów:

| Przeglądarka | Link |
|---|---|
| Chrome / Edge / Opera | [Tampermonkey](https://www.tampermonkey.net/) |
| Firefox | [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/) |
| Safari | [Tampermonkey](https://www.tampermonkey.net/) (wersja dla Safari) |

Alternatywnie możesz użyć [Violentmonkey](https://violentmonkey.github.io/) — kroki są takie same.

### Krok 2 — Instalacja skryptu

1. Kliknij link instalacyjny (otworzy się strona surowego pliku `.user.js`):

   👉 **[ZAINSTALUJ ASYSTENTA KATEGORII](https://raw.githubusercontent.com/wojciech-g/Jalapeno-Pepper/main/jalapeno-categories.user.js)**

2. Tampermonkey powinien automatycznie pokazać okno **„Instalacja skryptu”** z podglądem kodu.
3. Kliknij **„Zainstaluj”**.

### Krok 3 — Sprawdzenie

1. Kliknij ikonę Tampermonkey na pasku przeglądarki.
2. Na liście powinien być wpis: **„Jalapeño for editors — Asystent Kategorii”** (status: włączony).
3. Wejdź na formularz dodawania okazji, np.  
   [pepper.pl/submission/promocje/add](https://www.pepper.pl/submission/promocje/add?thread_created_location=thread_type_selection)
4. Po prawej stronie ekranu pojawi się panel **„🤖 Asystent Kategorii”**.

### Aktualizacje

Tampermonkey sprawdza aktualizacje automatycznie (pole `@updateURL` w skrypcie). Możesz też wymusić ręcznie:

**Ikona Tampermonkey → Jalapeño for editors → Sprawdź aktualizacje**

---

## 🚀 Co robi skrypt?

### 1. Podpowiedzi na żywo (auto)

Gdy wpisujesz **tytuł okazji** w polu:

```html
<input name="title" placeholder="Krótki tytuł opisujący znalezioną okazję" …>
```

skrypt na bieżąco:

- odczytuje tytuł,
- szuka pasujących słów w bazie kategorii,
- pokazuje listę kategorii z **procentowym prawdopodobieństwem**,
- pod każdą kategorią wyświetla **przykładowe okazje** z bazy (tytuł + data).

Przykład 1: 
<img width="1158" height="493" alt="Zrzut ekranu 2026-06-17 o 19 06 01" src="https://github.com/user-attachments/assets/e9747edf-cc31-48b5-9b89-f1759d6c6d19" />

Przykład 2:
<img width="1228" height="900" alt="Zrzut ekranu 2026-06-17 o 19 05 00" src="https://github.com/user-attachments/assets/e2094d8c-891c-4efb-9cdd-13e1bfa44d92" />

Algorytm:

- ignoruje zbyt ogólne słowa (`max`, `pro`, `plus`, `rabat` itd.),
- mocniej waży pierwsze słowa tytułu (marka, typ produktu),
- odrzuca słowa rozrzucone po wielu kategoriach bez wyraźnego lidera,
- pokazuje maks. **4** najtrafniejsze propozycje.

### 2. Ręczne wyszukiwanie w bazie

Na dole panelu jest pole **„Szukaj w bazie”**. Wpisz słowo kluczowe (min. 3 znaki), np. `laptop`, `lego`, `perfum` — zobaczysz rozkład kategorii dla tego słowa wraz z przykładami.

Przydatne, gdy tytuł jest nietypowy lub chcesz sprawdzić, jak klasyfikowane były podobne produkty w przeszłości.

### 3. Panel boczny

- Panel jest **przyklejony do prawej krawędzi** ekranu.
- Przycisk **◀** zwija panel — zostaje widoczna zakładka **„🤖 Kategorie”**; kliknij ją, aby rozwinąć.
- Przycisk **🌙 / ☀️** przełącza motyw **jasny / ciemny** (zapamiętywany w przeglądarce).

---

## 📍 Gdzie działa?

Skrypt uruchamia się na stronach formularza okazji:

| Adres | Opis |
|---|---|
| `https://www.pepper.pl/submission/*` | Dodawanie i edycja okazji (wszystkie typy: promocje, kody, darmowe, itd.) |

**Nie działa** w panelu moderacji (`/admin-v2/moderation/`) — tam podpowiedzi ma pełne Jalapeño (moduł w panelu bocznym).

---

## ❓ FAQ

### Czy muszę mieć zainstalowane pełne Jalapeño?

**Nie.** To osobny, niezależny skrypt. Możesz mieć tylko Asystenta Kategorii, tylko Jalapeño, albo oba naraz — nie kolidują ze sobą.

### Skąd biorą się dane?

Baza kategorii (`baza_kategorii_finalna.json`) jest hostowana na GitHubie w tym samym repozytorium co Jalapeño. Skrypt pobiera ją przy pierwszym uruchomieniu strony i trzyma w pamięci na czas sesji.

### Panel się nie pokazuje

1. Sprawdź, czy skrypt jest **włączony** w Tampermonkey.
2. Upewnij się, że jesteś na stronie `/submission/...`, nie na liście okazji ani profilu.
3. Odśwież stronę (F5).
4. Sprawdź, czy inne rozszerzenia (AdBlock itp.) nie blokują skryptu.

### Podpowiedzi są puste lub dziwne

- Wpisz **dłuższy, opisowy tytuł** — samo „okazja” lub „super” nie wystarczy.
- Użyj **wyszukiwarki ręcznej** na dole panelu, jeśli auto-podpowiedzi nie trafiają.
- Baza opiera się na historii — zupełnie nowe kategorie produktów mogą nie mieć jeszcze danych.

### Jak zgłosić błąd lub pomysł?

[Issues na GitHubie](https://github.com/wojciech-g/Jalapeno-Pepper/issues) — w tytule dopisz `[editors]`, żeby było wiadomo, o który skrypt chodzi.

---

👤 **Autor:** [Xcited](https://www.pepper.pl/profile/Xcited)  
🔗 **Repozytorium:** [Jalapeno-Pepper](https://github.com/wojciech-g/Jalapeno-Pepper)
