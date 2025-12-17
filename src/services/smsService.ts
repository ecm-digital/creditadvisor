/**
 * SMS Service for handling SMS notifications
 * Integration with SMSAPI.pl (https://www.smsapi.pl/)
 */

interface SmsResponse {
    success: boolean;
    messageId?: string;
    error?: string;
}

interface SmsApiResponse {
    list?: Array<{
        id: string;
        points: number;
        number: string;
        status: string;
        error?: string;
    }>;
    error?: string;
    message?: string;
}

// Configuration
// Use proxy in development to avoid CORS issues
const IS_DEV = import.meta.env.DEV;
const SMSAPI_URL = IS_DEV 
    ? '/api/smsapi/sms.do'  // Use Vite proxy in development
    : 'https://api.smsapi.pl/sms.do';  // Direct call in production (if CORS allows)
const SMSAPI_TOKEN = import.meta.env.VITE_SMSAPI_TOKEN || '';
const USE_MOCK = import.meta.env.VITE_SMSAPI_USE_MOCK === 'true' || !SMSAPI_TOKEN;

/**
 * Normalizes phone number to SMSAPI format
 * @param phoneNumber Phone number in various formats
 * @returns Normalized phone number (e.g., "48123456789")
 */
function normalizePhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters except +
    let normalized = phoneNumber.replace(/[^\d+]/g, '');
    
    // Remove + if present
    normalized = normalized.replace(/^\+/, '');
    
    // Ensure Polish country code (48)
    if (!normalized.startsWith('48')) {
        normalized = `48${normalized}`;
    }
    
    return normalized;
}

/**
 * Converts SMSAPI error codes to user-friendly messages
 */
function getErrorMessage(error: string | number): string {
    const errorStr = String(error);
    
    // Common SMSAPI error codes
    const errorMessages: Record<string, string> = {
        '98': 'Konto jest ograniczone. Możesz wysyłać SMS-y tylko na numer użyty podczas rejestracji. Skontaktuj się z obsługą SMSAPI.pl, aby zdjąć to ograniczenie.',
        '101': 'Niepoprawne lub brak danych autoryzacji. Sprawdź token API.',
        '11': 'Wiadomość jest za długa lub brak wiadomości.',
        '13': 'Brak prawidłowych numerów telefonów. Sprawdź format numeru.',
        '14': 'Nieprawidłowa nazwa nadawcy. Sprawdź ustawienia w panelu SMSAPI.',
        '103': 'Brak środków na koncie. Doładuj konto w panelu SMSAPI.',
    };

    // Check if error is a known code
    if (errorMessages[errorStr]) {
        return errorMessages[errorStr];
    }

    // If error contains a code, try to extract it
    const codeMatch = errorStr.match(/^(\d+)/);
    if (codeMatch && errorMessages[codeMatch[1]]) {
        return errorMessages[codeMatch[1]];
    }

    // Return original error if no translation found
    return typeof error === 'string' ? error : `Błąd ${error}`;
}

export const smsService = {
    /**
     * Sends an SMS to a specific phone number using SMSAPI.pl
     * @param phoneNumber Recipient number (e.g., "500 123 456" or "48500123456")
     * @param message Message content
     */
    async sendSms(phoneNumber: string, message: string): Promise<SmsResponse> {
        const normalizedPhone = normalizePhoneNumber(phoneNumber);
        
        console.log(`[SMS Service] Preparing to send to ${normalizedPhone}: "${message.substring(0, 50)}..."`);

        // MOCK IMPLEMENTATION (for development/testing)
        if (USE_MOCK) {
            console.warn('[SMS Service] Using MOCK mode. Set VITE_SMSAPI_TOKEN to enable real SMS sending.');
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log(`[SMS Service] MOCK SUCCESS: Message sent to ${normalizedPhone}`);
                    resolve({ 
                        success: true, 
                        messageId: 'mock-' + Date.now() 
                    });
                }, 800);
            });
        }

        // REAL IMPLEMENTATION - SMSAPI.pl integration
        try {
            // SMSAPI.pl requires form-data format
            const formData = new URLSearchParams();
            formData.append('to', normalizedPhone);
            formData.append('message', message);
            formData.append('format', 'json');
            formData.append('encoding', 'utf-8');

            console.log('[SMS Service] Sending request to SMSAPI.pl...');
            console.log('[SMS Service] Token present:', !!SMSAPI_TOKEN);
            console.log('[SMS Service] Phone:', normalizedPhone);
            console.log('[SMS Service] Message length:', message.length);

            const response = await fetch(SMSAPI_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SMSAPI_TOKEN}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            console.log('[SMS Service] Response status:', response.status);
            console.log('[SMS Service] Response headers:', Object.fromEntries(response.headers.entries()));

            const responseText = await response.text();
            console.log('[SMS Service] Response body:', responseText);

            if (!response.ok) {
                console.error('[SMS Service] API Error:', response.status, responseText);
                
                // Try to parse error if it's JSON
                let errorMessage = `Błąd HTTP ${response.status}: Błąd podczas wysyłania SMS`;
                try {
                    const errorData = JSON.parse(responseText);
                    const rawError = errorData.message || errorData.error || errorData.error_code || responseText;
                    errorMessage = getErrorMessage(rawError);
                } catch {
                    // SMSAPI.pl may return plain text errors
                    if (responseText) {
                        errorMessage = getErrorMessage(responseText);
                    }
                }
                
                return { 
                    success: false, 
                    error: errorMessage 
                };
            }

            let data: SmsApiResponse;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('[SMS Service] Failed to parse JSON response:', responseText);
                return {
                    success: false,
                    error: `Nieprawidłowa odpowiedź z API: ${responseText.substring(0, 100)}`
                };
            }
            
            // Check for errors in response
            if (data.error) {
                console.error('[SMS Service] API returned error:', data.error);
                const errorMessage = getErrorMessage(data.error);
                return { 
                    success: false, 
                    error: errorMessage 
                };
            }

            // Check response list for errors
            if (data.list && data.list.length > 0) {
                const firstItem = data.list[0];
                
                if (firstItem.error) {
                    console.error('[SMS Service] SMS sending failed:', firstItem.error);
                    const errorMessage = getErrorMessage(firstItem.error);
                    return { 
                        success: false, 
                        error: errorMessage 
                    };
                }
                
                if (firstItem.status === 'QUEUE' || firstItem.status === 'SENT') {
                    console.log('[SMS Service] SMS sent successfully:', firstItem.id);
                    return { 
                        success: true, 
                        messageId: firstItem.id 
                    };
                }
            }

            // Fallback success if no errors detected
            return { 
                success: true, 
                messageId: data.list?.[0]?.id || 'unknown' 
            };

        } catch (error) {
            console.error('[SMS Service] Network/Parse Error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
            return { 
                success: false, 
                error: `Błąd połączenia: ${errorMessage}` 
            };
        }
    },

    /**
     * Checks if SMS service is configured and ready
     */
    isConfigured(): boolean {
        return !USE_MOCK && !!SMSAPI_TOKEN;
    },

    /**
     * Gets current configuration status
     */
    getStatus(): { configured: boolean; mode: 'mock' | 'production' } {
        return {
            configured: this.isConfigured(),
            mode: USE_MOCK ? 'mock' : 'production'
        };
    }
};








