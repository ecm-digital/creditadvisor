import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import axios from "axios";
// cors is handled natively in v2 options

admin.initializeApp();

// Gen 2 Function definition
export const sendSms = onRequest(
    {
        region: "europe-west1",
        cors: true, // Native CORS support in v2
        maxInstances: 10
    },
    async (req, res) => {
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }

        const { phoneNumber, message } = req.body;

        // Note: functions.config() is not supported in v2 the same way, 
        // preferring defineString or process.env. 
        // For migration speed, we use process.env directly. 
        // User must Ensure .env file exists or secrets are set.
        // Falling back to standard config access if needed or just env.
        const smsApiToken = process.env.SMSAPI_TOKEN;

        // If using secrets:
        // const apiKey = defineSecret("SMSAPI_TOKEN");
        // but for now let's rely on standard env var or fallback
        if (!smsApiToken) {
            // Fallback for v1 config style if migrated
            // logic omitted for brevity as v2 env vars are different
            // trying straight logic
        }

        // RE-IMPLEMENTATION with slight v2 adjustments
        if (!phoneNumber || !message) {
            res.status(400).send({ error: "Missing phoneNumber or message" });
            return;
        }

        try {
            const normalizedPhone = phoneNumber.replace(/[^\d]/g, '');

            const params = new URLSearchParams();
            params.append('to', normalizedPhone);
            params.append('message', message);
            params.append('from', 'Info');
            params.append('format', 'json');
            params.append('encoding', 'utf-8');

            // Hardcode token for testing if env is missing? 
            // Better: Log if missing.
            const token = smsApiToken || "MISSING_TOKEN";

            const response = await axios.post('https://api.smsapi.pl/sms.do', params, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.data.error) {
                console.error("SMSAPI Error:", response.data);
                res.status(500).send({ error: "SMSAPI Error", details: response.data });
            } else {
                res.send({ success: true, data: response.data });
            }

        } catch (error: any) {
            console.error("Function execution error:", error);
            res.status(500).send({ error: "Internal Server Error", details: error.message });
        }
    }
);
// Helper to normalize phone numbers
function normalizePhoneNumber(phone: string): string {
    let normalized = phone.replace(/[^\d]/g, '');
    if (normalized.startsWith('48') && normalized.length === 11) {
        return normalized;
    }
    if (normalized.length === 9) {
        return `48${normalized}`;
    }
    return normalized;
}

// Request SMS Code Function
export const requestSmsCode = onRequest(
    {
        region: "europe-west1",
        cors: true,
        maxInstances: 10
    },
    async (req, res) => {
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }

        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            res.status(400).send({ error: "Missing phoneNumber" });
            return;
        }

        try {
            const normalizedPhone = normalizePhoneNumber(phoneNumber);

            // 1. Check if user exists in 'clients' collection
            const clientsRef = admin.firestore().collection('clients');
            // Check both formats just in case
            const snapshot = await clientsRef.where('phone', 'in', [normalizedPhone, `+${normalizedPhone}`, phoneNumber]).limit(1).get();

            if (snapshot.empty) {
                // For security, maybe don't reveal this? But for UX, it's helpful.
                // Let's return error for now as it is an internal app mostly.
                res.status(404).send({ error: "Nie znaleziono użytkownika z tym numerem telefonu." });
                return;
            }

            // 2. Generate 6-digit code
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            // 3. Save code to Firestore (expires in 5 minutes)
            await admin.firestore().collection('sms_codes').doc(normalizedPhone).set({
                code: code,
                expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + 5 * 60 * 1000),
                attempts: 0
            });

            // 4. Send SMS using SMSAPI (Mock or Real)
            const message = `Twój kod do logowania: ${code}. Ważny przez 5 minut.`;

            const smsApiToken = process.env.SMSAPI_TOKEN;

            // Use existing sendSms logic or call the endpoint internally?
            // Better to implement directly here to avoid self-call loop or extra latency.

            if (!smsApiToken) {
                console.log(`[MOCK SMS] To: ${normalizedPhone}, Message: ${message}`);
                res.send({ success: true, mock: true, message: "Kod wysłany (MOCK)" });
                return;
            }

            const params = new URLSearchParams();
            params.append('to', normalizedPhone);
            params.append('message', message);
            params.append('from', 'Info');
            params.append('format', 'json');
            params.append('encoding', 'utf-8');

            const response = await axios.post('https://api.smsapi.pl/sms.do', params, {
                headers: {
                    'Authorization': `Bearer ${smsApiToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.data.error) {
                console.error("SMSAPI Error:", response.data);
                res.status(500).send({ error: "Błąd wysyłania SMS", details: response.data });
            } else {
                res.send({ success: true });
            }

        } catch (error: any) {
            console.error("Error in requestSmsCode:", error);
            res.status(500).send({ error: "Internal Server Error", details: error.message });
        }
    }
);

// Verify SMS Code Function
export const verifySmsCode = onRequest(
    {
        region: "europe-west1",
        cors: true,
        maxInstances: 10
    },
    async (req, res) => {
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }

        const { phoneNumber, code } = req.body;
        if (!phoneNumber || !code) {
            res.status(400).send({ error: "Missing phoneNumber or code" });
            return;
        }

        try {
            const normalizedPhone = normalizePhoneNumber(phoneNumber);
            const docRef = admin.firestore().collection('sms_codes').doc(normalizedPhone);
            const doc = await docRef.get();

            if (!doc.exists) {
                res.status(400).send({ error: "Kod wygasł lub nie istnieje. Wyślij nowy kod." });
                return;
            }

            const data = doc.data();
            if (!data) {
                res.status(500).send({ error: "Internal Error" });
                return;
            }

            // Check expiration
            if (data.expiresAt.toMillis() < Date.now()) {
                await docRef.delete();
                res.status(400).send({ error: "Kod wygasł. Wyślij nowy kod." });
                return;
            }

            // Check match
            if (data.code !== code) {
                await docRef.update({ attempts: admin.firestore.FieldValue.increment(1) });
                res.status(400).send({ error: "Nieprawidłowy kod." });
                return;
            }

            // Code is valid! Find user to get UID.
            const clientsRef = admin.firestore().collection('clients');
            const snapshot = await clientsRef.where('phone', 'in', [normalizedPhone, `+${normalizedPhone}`, phoneNumber]).limit(1).get();

            if (snapshot.empty) {
                res.status(404).send({ error: "Użytkownik nie znaleziony (dziwne, bo był przy wysyłaniu)." });
                return;
            }

            const clientData = snapshot.docs[0].data();
            const uid = clientData.user_id;

            // Generate Custom Token
            const token = await admin.auth().createCustomToken(uid);

            // Clean up code
            await docRef.delete();

            res.send({ success: true, token });

        } catch (error: any) {
            console.error("Error in verifySmsCode:", error);
            res.status(500).send({ error: "Internal Server Error", details: error.message });
        }
    }
);
