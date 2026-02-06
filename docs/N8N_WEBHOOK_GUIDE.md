# n8n Webhook Integration - Setup Guide

## Overview
This application sends webhooks to n8n workflows for automation. You can receive notifications about:
- New loan applications submitted
- Application status changes
- Document uploads
- Client actions

## Setup Instructions

### 1. Configure n8n Webhook URL

In your `.env` file, set:
```bash
VITE_N8N_ENABLED=true
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/loan-application
```

### 2. Create n8n Workflow

Create a new n8n workflow with a **Webhook** trigger node:

1. Add a **Webhook** node
2. Set **Method**: `POST`
3. Set **Path**: `/loan-application` (or your custom path)
4. Set **Response Mode**: `Immediately`

### 3. Available Webhook Events

The application sends the following events:

#### `application.submitted`
Triggered when a client submits a loan application.

**Payload example:**
```json
{
  "event": "application.submitted",
  "timestamp": "2026-02-06T15:50:00Z",
  "data": {
    "application": {
      "userId": "abc123",
      "email": "client@example.com",
      "phone": "+48123456789",
      "purpose": "buy",
      "amount": 450000,
      "period": 30,
      "incomeSource": "uop",
      "monthlyIncome": 8500,
      "selectedBankName": "Santander",
      "selectedInstallment": 2830,
      "status": "submitted",
      "submittedAt": "2026-02-06T15:50:00Z"
    }
  }
}
```

#### `application.status.changed`
Triggered when an advisor changes the application status.

**Payload example:**
```json
{
  "event": "application.status.changed",
  "timestamp": "2026-02-06T16:00:00Z",
  "data": {
    "application": {
      "userId": "abc123",
      "email": "client@example.com",
      "phone": "+48123456789",
      "amount": 450000,
      "selectedBankName": "Santander"
    },
    "oldStatus": "submitted",
    "newStatus": "in_review"
  }
}
```

#### `document.uploaded`
Triggered when a client uploads a document.

**Payload example:**
```json
{
  "event": "document.uploaded",
  "timestamp": "2026-02-06T15:45:00Z",
  "data": {
    "userId": "abc123",
    "document": {
      "id": "1738854300000",
      "displayName": "zaswiadczenie.pdf",
      "type": "income",
      "size": 1024567,
      "uploadedAt": "2026-02-06T15:45:00Z"
    }
  }
}
```

### 4. Example n8n Workflow Actions

Based on the webhook event, you can:

**For `application.submitted`:**
- Send email notification to advisor
- Send SMS to client confirming submission
- Create task in project management tool
- Update CRM system
- Post to Slack/Discord channel

**For `document.uploaded`:**
- Notify advisor that new document is available
- Trigger document verification process
- Archive document to external storage

**For `application.status.changed`:**
- Send SMS/email to client about status update
- Update external systems
- Trigger next steps in the workflow

### 5. Example n8n Workflow Structure

```
1. Webhook Trigger (receives POST)
   ↓
2. Switch Node (based on event type)
   ↓
3a. [application.submitted] → Send Email → SMS Node → Slack
   ↓
3b. [document.uploaded] → Notify Advisor → Log to DB
   ↓
3c. [application.status.changed] → Send SMS → Update CRM
```

### 6. Testing the Integration

1. Enable n8n in `.env`: `VITE_N8N_ENABLED=true`
2. Set your webhook URL
3. Activate your n8n workflow
4. Submit a test application in the app
5. Check n8n workflow execution logs

### 7. Error Handling

- Webhooks are **non-critical** - if n8n is down, the app continues to work
- Errors are logged to console but don't affect user experience
- You can monitor webhook failures in browser DevTools console

### 8. Production Considerations

- Use HTTPS for webhook URLs
- Consider adding authentication headers if needed
- Monitor n8n uptime
- Set up retry logic in n8n for critical notifications

## Troubleshooting

**Webhook not firing?**
1. Check `VITE_N8N_ENABLED=true` in `.env`
2. Verify webhook URL is correct
3. Check browser console for errors
4. Ensure n8n workflow is activated

**Getting CORS errors?**
- n8n webhook nodes handle CORS automatically
- If using a custom endpoint, enable CORS on your server

**Payload not correct?**
- Check the event type in n8n workflow
- Verify the webhook trigger is set to POST
- Look at the "Response Mode" setting

## Security Notes

- Don't commit `.env` file to git (already in `.gitignore`)
- Consider webhook signature verification for production
- Use environment-specific webhook URLs (dev/staging/prod)
