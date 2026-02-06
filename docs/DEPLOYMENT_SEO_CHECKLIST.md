# Pre-Deployment SEO Checklist

Przed wdrożeniem strony na produkcję (`www.blachlinski.pl`), upewnij się, że wszystkie poniższe elementy są gotowe.

---

## ✅ Elementy techniczne ON-PAGE

### Meta tagi (index.html)
- [x] `<title>` - zoptymalizowany pod SEO (50-60 znaków)
- [x] `<meta name="description">` - unikalne, zachęcające (150-160 znaków)
- [x] `<meta name="keywords">` - główne słowa kluczowe
- [x] `<link rel="canonical">` - wskazuje na www.blachlinski.pl
- [x] Open Graph tags (og:title, og:description, og:image)
- [x] Twitter Card tags
- [x] Schema.org JSON-LD (FinancialService)

### Struktura HTML
- [x] Jeden nagłówek H1 na stronie głównej
- [x] Hierarchia nagłówków (H1 > H2 > H3) bez przeskoków
- [x] Alt text dla wszystkich obrazów
- [x] Semantyczne tagi HTML5 (`<header>`, `<main>`, `<section>`, `<footer>`)

### Pliki konfiguracyjne
- [x] `robots.txt` - utworzony i skonfigurowany
- [x] `sitemap.xml` - utworzony z listą URL-i
- [x] `og-image.jpg` - obraz do social media (min 1200x630px)
- [ ] `favicon.ico` / `favicon.png` - ikona strony

---

## ✅ Wydajność (Performance)

### Obrazy
- [x] Główne zdjęcie (Hero) ma atrybut `loading="eager"`
- [ ] **TODO:** Pozostałe obrazy mają `loading="lazy"`
- [ ] **TODO:** Wszystkie obrazy skompresowane (TinyPNG, Squoosh)
- [ ] **TODO:** Format WebP dla większych obrazów

### Skrypty i Style
- [ ] **TODO:** CSS minifikowany (automatycznie przez Vite build)
- [ ] **TODO:** JavaScript minifikowany (automatycznie przez Vite build)
- [ ] **TODO:** Usunięte nieużywane biblioteki z `package.json`

### Testy wydajności
- [ ] Google PageSpeed Insights: Mobile >85, Desktop >90
- [ ] GTmetrix: Grade A/B
- [ ] WebPageTest: First Contentful Paint < 1.8s

---

## ✅ Content SEO

### Strona główna (Landing Page)
- [x] H1 zawiera główne słowo kluczowe ("ekspert kredytowy")
- [x] Pierwsze 100 słów zawiera główne słowo kluczowe
- [x] Sekcja FAQ z pytaniami long-tail (10 pytań)
- [x] Treść >1500 słów (zalecane dla lepszego SEO)
- [x] Call-to-Action (CTA) jasno widoczne

### Linki wewnętrzne
- [ ] **TODO:** Link do przyszłego bloga (jeśli zostanie wdrożony)
- [ ] **TODO:** Link do kalkulatora kredytowego
- [ ] Link do /login, /register w stopce

### Linki zewnętrzne
- [ ] **TODO (opcjonalne):** Link do NBP lub KNF jako źródło autorytatywne

---

## ✅ Google Tools Setup

### Google Search Console
- [ ] Domena www.blachlinski.pl zweryfikowana
- [ ] Sitemap przesłany (`https://www.blachlinski.pl/sitemap.xml`)
- [ ] Monitoring błędów indeksacji włączony
- [ ] Ustawione preferowane URL (z www lub bez)

### Google Analytics 4
- [ ] Konto GA4 utworzone
- [ ] Measurement ID dodany do `index.html`
- [ ] Zdarzenia niestandardowe skonfigurowane (form_submission, consultation_click)
- [ ] Test w trybie podglądu (Real-time reports)

### Google Business Profile (Local SEO)
- [ ] Profil utworzony i zweryfikowany
- [ ] Opis firmy wypełniony (750 znaków)
- [ ] Zdjęcia dodane (logo + zdjęcie profilowe)
- [ ] Link do zbierania recenzji utworzony
- [ ] Pierwsze 3 recenzje zebrane

---

## ✅ Firebase Configuration

### Authorized Domains (Authentication)
- [ ] `www.blachlinski.pl` dodana do Authorized Domains
- [ ] `blachlinski.pl` (bez www) dodana do Authorized Domains
- [ ] Redirects poprawnie skonfigurowane (http → https, bez www → www)

### Hosting
- [ ] Build produkcyjny wygenerowany (`npm run build`)
- [ ] Deploy na Firebase Hosting wykonany (`firebase deploy`)
- [ ] Custom domain `www.blachlinski.pl` powiązany
- [ ] SSL certyfikat aktywny (HTTPS)

### Firestore & Functions
- [ ] Firestore rules zaktualizowane (bezpieczeństwo)
- [ ] Cloud Functions wdrożone (jeśli używane)
- [ ] Zmienne środowiskowe ustawione w Firebase

---

## ✅ Social Media Integration (opcjonalnie)

### Meta Pixel (Facebook/Instagram Ads)
- [ ] Pixel ID dodany do `index.html`
- [ ] Test zdarzeń w Meta Events Manager
- [ ] Zdarzenie `Lead` śledzące formularze

### LinkedIn Business
- [ ] Profil osobisty aktualny
- [ ] Post o uruchomieniu strony
- [ ] Link do strony w bio

---

## ✅ Security & Legal

### HTTPS & SSL
- [x] Certyfikat SSL aktywny (Firebase obsługuje automatycznie)
- [x] Wszystkie requesty przekierowywane na HTTPS

### RODO & Privacy
- [ ] **TODO:** Polityka prywatności dostępna na stronie
- [ ] **TODO:** Informacja o cookies (opcjonalnie banner)
- [ ] **TODO:** Regulamin korzystania z serwisu

---

## ✅ Final Tests (przed publikacją)

### Testy funkcjonalne
- [ ] Formularz kontaktowy działa poprawnie
- [ ] Rejestracja i logowanie działają
- [ ] Wszystkie linki działają (brak 404)
- [ ] Responsywność: desktop, tablet, mobile
- [ ] Test w różnych przeglądarkach (Chrome, Safari, Firefox)

### Testy SEO
- [ ] Google Mobile-Friendly Test: PASSED
- [ ] Structured Data Testing Tool: No errors
- [ ] Open Graph Preview (Facebook Debugger): wygląda dobrze
- [ ] Twitter Card Validator: wygląd OK

### Testy Analytics
- [ ] GA4 śledzi PageView
- [ ] GA4 śledzi zdarzenia niestandardowe (form submission)
- [ ] Meta Pixel śledzi PageView (jeśli używane)
- [ ] Google Search Console: pierwsza strona zaindeksowana

---

## 🚀 Deployment Workflow

### Krok 1: Final Build
```bash
npm run build
```

### Krok 2: Deploy to Firebase
```bash
firebase deploy --only hosting
```

### Krok 3: Weryfikacja
- Otwórz https://www.blachlinski.pl
- Sprawdź konsolę przeglądarki (brak błędów)
- Test Mobile-Friendly
- Test PageSpeed Insights

### Krok 4: Post-Deployment
- Prześlij sitemap do Google Search Console
- Opublikuj post na LinkedIn/Facebook o uruchomieniu
- Wyślij link do pierwszych 5 klientów z prośbą o recenzję

---

## 📊 Monitoring (pierwsze 30 dni)

### Tydzień 1-2
- [ ] Sprawdź Google Search Console - czy strona jest indeksowana
- [ ] Sprawdź GA4 - czy ruch jest rejestrowany
- [ ] Sprawdź błędy w konsoli przeglądarki

### Tydzień 3-4
- [ ] Pierwsze pozycje w Google - sprawdź keyword ranking
- [ ] Zebrano min. 3 recenzje w Google Business
- [ ] PageSpeed nadal >85

### Miesiąc 2-3
- [ ] Ruch organiczny >100 użytkowników/m-c
- [ ] Minimum 5 wypełnionych formularzy
- [ ] Pozycja w TOP 10 dla "doradca kredytowy [lokalizacja]"

---

## ✨ Bonus: Quick Wins SEO (po uruchomieniu)

1. **Tydzień 1:** Napisz pierwszy artykuł blogowy (np. "Jak obliczyć zdolność kredytową?")
2. **Tydzień 2:** Dodaj link do artykułu w Google Business Post
3. **Tydzień 3:** Poproś 5 zadowolonych klientów o recenzję
4. **Tydzień 4:** Dodaj stronę do katalogów lokalnych (Pkt.pl, Panoramafirm.pl)

---

## 🎯 Cele SEO na 6 miesięcy

✅ **TOP 3** dla fraz: "doradca kredytowy", "ekspert kredytowy"
✅ **TOP 5** dla fraz: "kredyt hipoteczny", "kredyt gotówkowy"
✅ **500+ użytkowników organicznych** miesięcznie
✅ **20+ wypełnionych formularzy** miesięcznie
✅ **15+ recenzji Google** (średnia 4.8/5)

**Powodzenia! 🚀**
