/**
 * n8n Service for workflow automation
 * Sends webhooks to n8n workflows and triggers automations
 */

interface WebhookPayload {
    event: string;
    data: any;
    timestamp: string;
}

interface N8nResponse {
    success: boolean;
    error?: string;
}

// Configuration
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || '';
const N8N_ENABLED = import.meta.env.VITE_N8N_ENABLED === 'true' && !!N8N_WEBHOOK_URL;

/**
 * Sends a webhook to n8n workflow
 */
async function sendWebhook(event: string, data: any): Promise<N8nResponse> {
    if (!N8N_ENABLED) {
        console.log('[n8n Service] n8n is disabled or not configured');
        return { success: false, error: 'n8n not configured' };
    }

    const payload: WebhookPayload = {
        event,
        data,
        timestamp: new Date().toISOString(),
    };

    try {
        console.log(`[n8n Service] Sending webhook for event: ${event}`);

        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[n8n Service] Webhook failed:', response.status, errorText);
            return {
                success: false,
                error: `HTTP ${response.status}: ${errorText}`,
            };
        }

        await response.json().catch(() => ({}));
        console.log('[n8n Service] Webhook sent successfully');
        return { success: true };
    } catch (error) {
        console.error('[n8n Service] Error sending webhook:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

export const n8nService = {
    /**
     * Notify n8n about a new client being added
     */
    async onClientCreated(client: any): Promise<void> {
        await sendWebhook('client.created', {
            client: {
                id: client.id,
                name: client.name,
                email: client.email,
                phone: client.phone,
                status: client.status,
                date: client.date,
            },
        });
    },

    /**
     * Notify n8n about a client being updated
     */
    async onClientUpdated(client: any, changes: any): Promise<void> {
        await sendWebhook('client.updated', {
            client: {
                id: client.id,
                name: client.name,
                email: client.email,
                phone: client.phone,
                status: client.status,
                date: client.date,
            },
            changes,
        });
    },

    /**
     * Notify n8n about a client being deleted
     */
    async onClientDeleted(clientId: string, clientName: string): Promise<void> {
        await sendWebhook('client.deleted', {
            clientId,
            clientName,
        });
    },

    /**
     * Notify n8n about an SMS being sent
     */
    async onSmsSent(client: any, message: string, result: any): Promise<void> {
        await sendWebhook('sms.sent', {
            client: {
                id: client.id,
                name: client.name,
                email: client.email,
                phone: client.phone,
            },
            message,
            result: {
                success: result.success,
                messageId: result.messageId,
                error: result.error,
            },
        });
    },

    /**
     * Notify n8n about a client status change
     */
    async onStatusChanged(client: any, oldStatus: string, newStatus: string): Promise<void> {
        await sendWebhook('client.status.changed', {
            client: {
                id: client.id,
                name: client.name,
                email: client.email,
                phone: client.phone,
            },
            oldStatus,
            newStatus,
        });
    },

    /**
     * Trigger a custom n8n workflow
     */
    async triggerWorkflow(workflowName: string, data: any): Promise<N8nResponse> {
        return await sendWebhook(`workflow.${workflowName}`, data);
    },

    /**
     * Check if n8n is configured
     */
    isConfigured(): boolean {
        return N8N_ENABLED;
    },

    /**
     * Get n8n configuration status
     */
    getStatus(): { enabled: boolean; webhookUrl: string } {
        return {
            enabled: N8N_ENABLED,
            webhookUrl: N8N_WEBHOOK_URL || 'Not configured',
        };
    },
};

