# Przykładowe workflow n8n dla Credit Advisor App

## Podstawowy workflow - Powiadomienie o nowym kliencie

### Krok 1: Webhook Node
- **Node Type**: Webhook
- **HTTP Method**: POST
- **Path**: `/webhook/new-client` (lub dowolny)
- **Response Mode**: Respond to Webhook

### Krok 2: IF Node (opcjonalnie)
Sprawdź typ eventu:
- **Condition**: `{{ $json.event }}` equals `client.created`

### Krok 3: Email Node (przykład)
Wyślij email z informacją o nowym kliencie:
- **To**: Twój email
- **Subject**: Nowy klient: {{ $json.data.client.name }}
- **Message**: 
```
Nowy klient został dodany:
- Imię: {{ $json.data.client.name }}
- Email: {{ $json.data.client.email }}
- Telefon: {{ $json.data.client.phone }}
- Status: {{ $json.data.client.status }}
```

## Workflow - Automatyczny SMS przy zmianie statusu

### Krok 1: Webhook Node
- **Path**: `/webhook/status-change`

### Krok 2: IF Node
- **Condition**: `{{ $json.event }}` equals `client.status.changed`

### Krok 3: HTTP Request Node (SMSAPI.pl)
- **Method**: POST
- **URL**: `https://api.smsapi.pl/sms.do`
- **Headers**:
  - `Authorization`: `Bearer YOUR_SMSAPI_TOKEN`
  - `Content-Type`: `application/x-www-form-urlencoded`
- **Body**:
  ```
  to={{ $json.data.client.phone }}
  message=Dzień dobry {{ $json.data.client.name }}, status Twojego wniosku został zmieniony na: {{ $json.data.newStatus }}
  format=json
  ```

## Workflow - Powiadomienie Slack/Discord

### Krok 1: Webhook Node
- **Path**: `/webhook/notifications`

### Krok 2: Slack/Discord Node
- **Channel**: #credit-advisor
- **Message**: 
```
🆕 Nowy klient: {{ $json.data.client.name }}
📧 Email: {{ $json.data.client.email }}
📱 Telefon: {{ $json.data.client.phone }}
```

## Dostępne eventy

### `client.created`
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

### `client.updated`
```json
{
  "event": "client.updated",
  "data": {
    "client": { ... },
    "changes": {
      "name": "Nowe imię",
      "email": "nowy@email.com"
    }
  },
  "timestamp": "2025-12-17T14:00:00.000Z"
}
```

### `client.deleted`
```json
{
  "event": "client.deleted",
  "data": {
    "clientId": "uuid",
    "clientName": "Jan Kowalski"
  },
  "timestamp": "2025-12-17T14:00:00.000Z"
}
```

### `client.status.changed`
```json
{
  "event": "client.status.changed",
  "data": {
    "client": { ... },
    "oldStatus": "new",
    "newStatus": "contacted"
  },
  "timestamp": "2025-12-17T14:00:00.000Z"
}
```

### `sms.sent`
```json
{
  "event": "sms.sent",
  "data": {
    "client": { ... },
    "message": "Treść wiadomości",
    "result": {
      "success": true,
      "messageId": "12345",
      "error": null
    }
  },
  "timestamp": "2025-12-17T14:00:00.000Z"
}
```

## Konfiguracja w aplikacji

W pliku `.env`:
```
VITE_N8N_ENABLED=true
VITE_N8N_WEBHOOK_URL=https://twoj-n8n.com/webhook/xxx
```

## Testowanie

Możesz przetestować webhook używając curl:

```bash
curl -X POST https://twoj-n8n.com/webhook/xxx \
  -H "Content-Type: application/json" \
  -d '{
    "event": "client.created",
    "data": {
      "client": {
        "id": "test-123",
        "name": "Test Client",
        "email": "test@example.com",
        "phone": "500 123 456",
        "status": "new",
        "date": "2025-12-17"
      }
    },
    "timestamp": "2025-12-17T14:00:00.000Z"
  }'
```

