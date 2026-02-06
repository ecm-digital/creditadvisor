"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nukeDatabase = exports.verifySmsCode = exports.requestSmsCode = exports.sendSms = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const axios_1 = require("axios");
// cors is handled natively in v2 options
admin.initializeApp();
// Gen 2 Function definition
exports.sendSms = (0, https_1.onRequest)({
    region: "europe-west1",
    cors: true,
    maxInstances: 10,
    invoker: 'public'
}, async (req, res) => {
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
        params.append('from', 'Blachlinski');
        params.append('format', 'json');
        params.append('encoding', 'utf-8');
        // Hardcode token for testing if env is missing? 
        // Better: Log if missing.
        const token = smsApiToken || "MISSING_TOKEN";
        const response = await axios_1.default.post('https://api.smsapi.pl/sms.do', params, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        if (response.data.error) {
            console.error("SMSAPI Error:", response.data);
            res.status(500).send({ error: "SMSAPI Error", details: response.data });
        }
        else {
            res.send({ success: true, data: response.data });
        }
    }
    catch (error) {
        console.error("Function execution error:", error);
        res.status(500).send({ error: "Internal Server Error", details: error.message });
    }
});
// Helper to normalize phone numbers
function normalizePhoneNumber(phone) {
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
exports.requestSmsCode = (0, https_1.onRequest)({
    region: "europe-west1",
    cors: true,
    maxInstances: 10,
    invoker: 'public'
}, async (req, res) => {
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
        console.log(`[RequestSmsCode] Phone: ${phoneNumber}, Normalized: ${normalizedPhone}`);
        // 1. Check if user exists in 'clients' collection
        const clientsRef = admin.firestore().collection('clients');
        // Check both formats just in case
        const searchTerms = [normalizedPhone, `+${normalizedPhone}`, phoneNumber];
        console.log(`[RequestSmsCode] Searching for:`, searchTerms);
        const snapshot = await clientsRef.where('phone', 'in', searchTerms).limit(1).get();
        if (snapshot.empty) {
            console.warn(`[RequestSmsCode] No user found for ${phoneNumber}`);
            // For security, maybe don't reveal this? But for UX, it's helpful.
            // Let's return error for now as it is an internal app mostly.
            res.status(404).send({ error: "Nie znaleziono użytkownika z tym numerem telefonu." });
            return;
        }
        console.log(`[RequestSmsCode] Found user!`);
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
        params.append('from', 'Blachlinski');
        params.append('format', 'json');
        params.append('encoding', 'utf-8');
        const response = await axios_1.default.post('https://api.smsapi.pl/sms.do', params, {
            headers: {
                'Authorization': `Bearer ${smsApiToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        if (response.data.error) {
            console.error("SMSAPI Error:", response.data);
            res.status(500).send({ error: "Błąd wysyłania SMS", details: response.data });
        }
        else {
            res.send({ success: true });
        }
    }
    catch (error) {
        console.error("Error in requestSmsCode:", error);
        res.status(500).send({ error: "Internal Server Error", details: error.message });
    }
});
// Verify SMS Code Function
exports.verifySmsCode = (0, https_1.onRequest)({
    region: "europe-west1",
    cors: true,
    maxInstances: 10,
    invoker: 'public'
}, async (req, res) => {
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
        // Generate Custom Token with client role
        const token = await admin.auth().createCustomToken(uid, { role: 'client' });
        // Clean up code
        await docRef.delete();
        res.send({ success: true, token });
    }
    catch (error) {
        console.error("Error in verifySmsCode:", error);
        res.status(500).send({ error: "Internal Server Error", details: error.message });
    }
});
// NUCLEAR RESET FUNCTION
exports.nukeDatabase = (0, https_1.onRequest)({
    region: "europe-west1",
    cors: true,
    maxInstances: 1,
    invoker: 'public'
}, async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    try {
        console.log('STARTING NUCLEAR RESET...');
        // 1. Delete All Auth Users
        const listUsersResult = await admin.auth().listUsers(1000);
        const uids = listUsersResult.users.map(user => user.uid);
        if (uids.length > 0) {
            await admin.auth().deleteUsers(uids);
            console.log(`Deleted ${uids.length} users from Auth.`);
        }
        // 2. Delete All Clients from Firestore
        const clientsSnapshot = await admin.firestore().collection('clients').get();
        const batch = admin.firestore().batch();
        clientsSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        // 3. Delete All SMS Codes
        const codesSnapshot = await admin.firestore().collection('sms_codes').get();
        codesSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        console.log(`Deleted ${clientsSnapshot.size} clients and ${codesSnapshot.size} codes from Firestore.`);
        res.send({ success: true, message: "System wyczyszczony do zera (Nuclear Option)." });
    }
    catch (error) {
        console.error("Nuclear Reset Error:", error);
        res.status(500).send({ error: error.message });
    }
});
//# sourceMappingURL=index.js.map