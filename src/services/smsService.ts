/**
 * SMS Service for handling SMS notifications
 * Integration ready for: SMSAPI (https://www.smsapi.pl/)
 */

interface SmsResponse {
    success: boolean;
    messageId?: string;
    error?: string;
}

// Configuration
const API_URL = '/api/send-sms'; // This should point to your backend endpoint
const IS_DEV = import.meta.env.DEV; // Check if we are in development mode

export const smsService = {
    /**
     * Sends an SMS to a specific phone number
     * @param phoneNumber Recipient number (e.g., "48123456789")
     * @param message Message content
     */
    async sendSms(phoneNumber: string, message: string): Promise<SmsResponse> {
        // Normalize phone number (remove spaces, ensure prefix)
        const normalizedPhone = phoneNumber.replace(/\s/g, '');
        const finalNumber = normalizedPhone.startsWith('48') || normalizedPhone.startsWith('+48') 
            ? normalizedPhone 
            : `48${normalizedPhone}`;

        console.log(`[SMS Service] Preparing to send to ${finalNumber}: "${message}"`);

        // In a real app without a backend, we can't call SMSAPI directly due to CORS and security.
        // We must use a backend proxy.
        
        // MOCK IMPLEMENTATION (for frontend-only demo)
        if (true) { // Change to !IS_DEV to enable real sending in production
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log(`[SMS Service] MOCK SUCCESS: Message sent to ${finalNumber}`);
                    resolve({ success: true, messageId: 'mock-id-' + Date.now() });
                }, 800);
            });
        }

        // REAL IMPLEMENTATION (requires backend)
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: finalNumber,
                    message: message,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return { success: true, messageId: data.id };
        } catch (error) {
            console.error('[SMS Service] Error sending SMS:', error);
            return { success: false, error: 'Failed to send SMS' };
        }
    }
};

