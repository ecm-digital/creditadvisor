# Credit Advisor App

Aplikacja do zarządzania klientami kredytowymi z integracją SMSAPI.pl.

## Konfiguracja Supabase

Aby połączyć aplikację z bazą danych Supabase:

1. **Utwórz projekt w Supabase**: Zarejestruj się na [https://supabase.com](https://supabase.com) i utwórz nowy projekt

2. **Uruchom migrację**:
   - W panelu Supabase przejdź do SQL Editor
   - Skopiuj zawartość pliku `supabase/migrations/001_create_clients_table.sql`
   - Wykonaj migrację w SQL Editor

3. **Skonfiguruj zmienne środowiskowe**:
   - W pliku `.env` dodaj:
   ```
   VITE_SUPABASE_URL=https://twoj-projekt.supabase.co
   VITE_SUPABASE_ANON_KEY=twoj_anon_key
   ```
   - URL i klucz znajdziesz w Settings → API w panelu Supabase

## Rejestracja i logowanie

Aplikacja używa Supabase Auth do autentykacji użytkowników.

### Funkcjonalności:
- **Rejestracja** (`/register`) - użytkownicy mogą tworzyć konta
- **Logowanie** (`/login`) - logowanie z email i hasłem
- **Reset hasła** - możliwość resetowania hasła przez email
- **Protected routes** - panel klienta oraz zaawansowane funkcje wymagają zalogowania (dashboard jest dostępny bez logowania)
- **Automatyczne tworzenie rekordu klienta** - przy rejestracji automatycznie tworzony jest rekord w tabeli clients

### Wymagania:
- Supabase Auth musi być włączone w panelu Supabase
- Email confirmation może być włączone (domyślnie wyłączone w development)

## Konfiguracja n8n

Aby włączyć integrację z n8n dla automatyzacji workflow:

1. **Utwórz workflow w n8n**: 
   - Zaloguj się do swojego n8n
   - Utwórz nowy workflow z Webhook node
   - Skopiuj URL webhooka

2. **Skonfiguruj zmienne środowiskowe**:
   - W pliku `.env` dodaj:
   ```
   VITE_N8N_ENABLED=true
   VITE_N8N_WEBHOOK_URL=https://twoj-n8n.com/webhook/xxx
   ```

3. **Dostępne eventy**:
   - `client.created` - gdy dodany zostanie nowy klient
   - `client.updated` - gdy klient zostanie zaktualizowany
   - `client.deleted` - gdy klient zostanie usunięty
   - `client.status.changed` - gdy zmieni się status klienta
   - `sms.sent` - gdy zostanie wysłany SMS

4. **Przykładowy payload webhooka**:
   ```json
   {
     "event": "client.created",
     "data": {
       "client": {
         "id": "uuid",
         "name": "Jan Kowalski",
         "email": "jan@example.com",
         "phone": "500 123 456",
         "status": "new",
         "date": "2025-12-17"
       }
     },
     "timestamp": "2025-12-17T14:00:00.000Z"
   }
   ```

5. **Przykładowe workflow**: Zobacz [docs/n8n-workflow-example.md](docs/n8n-workflow-example.md) dla przykładów workflow

## Konfiguracja SMSAPI.pl

Aby włączyć wysyłanie prawdziwych SMS-ów przez SMSAPI.pl:

1. **Załóż konto w SMSAPI.pl**: Zarejestruj się na [https://www.smsapi.pl/](https://www.smsapi.pl/)

2. **Wygeneruj token API**: 
   - Zaloguj się do panelu SMSAPI.pl
   - Przejdź do: Konto → Ustawienia → Tokeny OAuth
   - Wygeneruj nowy token

3. **Skonfiguruj zmienne środowiskowe**:
   - Utwórz plik `.env` w głównym katalogu projektu
   - Dodaj następujące zmienne:
   ```
   VITE_SMSAPI_TOKEN=twój_token_tutaj
   VITE_SMSAPI_USE_MOCK=false
   ```

4. **Tryb mock (dla testów)**:
   - Aby używać mock serwisu SMS (bez wysyłania prawdziwych SMS-ów), ustaw:
   ```
   VITE_SMSAPI_USE_MOCK=true
   ```
   - Lub po prostu nie ustawiaj `VITE_SMSAPI_TOKEN`

## Uruchomienie

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
