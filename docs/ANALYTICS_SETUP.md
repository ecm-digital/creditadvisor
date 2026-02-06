# Integracja Analytics i Śledzenie Konwersji

## Google Analytics 4 (GA4)

### Krok 1: Utwórz konto GA4
1. Przejdź do [Google Analytics](https://analytics.google.com/)
2. Kliknij "Rozpocznij pomiar"
3. Utwórz konto i właściwość
4. Wybierz platformę: **Web**
5. Wprowadź nazwę strumienia: `blachlinski.pl`
6. URL strony: `https://www.blachlinski.pl`

### Krok 2: Skopiuj Measurement ID
Po utworzeniu otrzymasz **Measurement ID** w formacie: `G-XXXXXXXXXX`

### Krok 3: Dodaj do .env
```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Krok 4: Dodaj snippet do index.html
Wklej poniższy kod **PRZED zamykającym tagiem `</head>`**:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## Google Search Console

### Weryfikacja domeny
1. Przejdź do [Google Search Console](https://search.google.com/search-console/)
2. Dodaj właściwość: `https://www.blachlinski.pl`
3. Wybierz metodę weryfikacji: **Tag HTML** (najprostsze)
4. Skopiuj meta tag i dodaj do `<head>` w `index.html`:

```html
<meta name="google-site-verification" content="TWOJ_KOD_WERYFIKACYJNY" />
```

5. Po weryfikacji prześlij sitemap:
   - Przejdź do: **Mapy witryn**
   - Dodaj URL: `https://www.blachlinski.pl/sitemap.xml`

---

## Meta Pixel (Facebook/Instagram Ads) - Opcjonalnie

### Krok 1: Utwórz piksel
1. Przejdź do [Meta Business Suite](https://business.facebook.com/)
2. Przejdź do **Menedżer zdarzeń** → Utwórz piksel
3. Skopiuj **Pixel ID** (liczba 15-16 cyfr)

### Krok 2: Dodaj do .env
```bash
VITE_META_PIXEL_ID=123456789012345
```

### Krok 3: Dodaj snippet do index.html
```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '123456789012345');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=123456789012345&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->
```

---

## Śledzenie zdarzeń niestandardowych (Events)

### Przykład: Śledzenie wypełnienia formularza

W pliku `src/components/landing/LeadForm.tsx` dodaj:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Twoja logika wysyłania formularza...
    
    // Google Analytics Event
    if (window.gtag) {
        window.gtag('event', 'form_submission', {
            form_name: 'lead_magnet',
            form_location: 'landing_page'
        });
    }
    
    // Meta Pixel Event
    if (window.fbq) {
        window.fbq('track', 'Lead');
    }
};
```

### Dodaj typy TypeScript

Stwórz plik `src/types/analytics.d.ts`:

```typescript
interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
}
```

---

## Zdarzenia do śledzenia (rekomendacje)

| Wydarzenie | Nazwa GA4 | Meta Pixel |
|------------|-----------|------------|
| Wysłanie formularza kontaktowego | `form_submission` | `Lead` |
| Kliknięcie "Umów konsultację" | `consultation_click` | `Schedule` |
| Pobranie kalkulatora | `calculator_use` | `ViewContent` |
| Wysłanie formularza rejestracji | `sign_up` | `CompleteRegistration` |
| Kliknięcie w numer telefonu | `phone_click` | `Contact` |

---

## Hotjar (opcjonalnie - mapy ciepła i nagrania sesji)

### Krok 1: Załóż konto
1. Przejdź do [Hotjar.com](https://www.hotjar.com/)
2. Utwórz darmowe konto (do 35 sesji dziennie)

### Krok 2: Dodaj snippet
```html
<!-- Hotjar Tracking Code -->
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:YOUR_HJID,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

---

## Monitoring wydajności

### Google PageSpeed Insights
- URL: https://pagespeed.web.dev/
- Sprawdzaj regularnie wynik dla mobile i desktop
- Cel: >90 punktów (zarówno mobile jak i desktop)

### Core Web Vitals
Monitoruj w **Google Search Console > Wrażenia użytkownika**:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

---

## Checklist wdrożenia analytics

- [ ] Google Analytics 4 - dodany i zweryfikowany
- [ ] Google Search Console - domena zweryfikowana
- [ ] Sitemap przesłany do GSC
- [ ] robots.txt zweryfikowany
- [ ] Meta Pixel (jeśli używasz reklam Facebook/Instagram)
- [ ] Zdarzenia niestandardowe skonfigurowane
- [ ] Typy TypeScript dla window.gtag/fbq
- [ ] Test wysyłki zdarzeń (Podgląd w czasie rzeczywistym GA4)
- [ ] Hotjar (opcjonalnie)
- [ ] Regularne sprawdzanie PageSpeed

---

## Gdzie znaleźć dane (po 7-14 dniach)

1. **Google Analytics 4**: 
   - Raporty > Pozyskiwanie > Ruch > Przegląd
   - Ile osób wchodzi, skąd, jak długo zostają

2. **Google Search Console**:
   - Skuteczność > Zapytania
   - Jakie frazy wpisują ludzie w Google, aby trafić na stronę

3. **Meta Business Suite** (jeśli używasz):
   - Menedżer zdarzeń > Twój piksel
   - Ile osób kliknęło reklamy, ile wypełniło formularz

**Regularne sprawdzanie: co tydzień przez pierwsze 2 miesiące, potem co miesiąc.**
