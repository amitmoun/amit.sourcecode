
/**
 * Logs a chat question to a Google Form.
 * This is a lightweight alternative to Google Sheets API that requires no authentication.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a simplified Google Form with 2 Short Answer questions:
 *    - Question 1: "User Query"
 *    - Question 2: "Timestamp"
 * 2. Get the "pre-filled link" to find the entry IDs (e.g., entry.123456).
 * 3. Add the FORM_ID and ENTRY_IDS to your .env.local file.
 */
export async function logToGoogleForm(message) {
    const FORM_ID = process.env.GOOGLE_FORM_ID; // e.g., 1FAIpQLS...
    const ENTRY_ID_QUERY = process.env.GOOGLE_FORM_ENTRY_QUERY; // e.g., entry.123456
    const ENTRY_ID_TIMESTAMP = process.env.GOOGLE_FORM_ENTRY_TIMESTAMP; // e.g. entry.987654

    if (!FORM_ID || !ENTRY_ID_QUERY) {
        console.warn("Google Form logging skipped: Missing environment variables.");
        return;
    }

    const formUrl = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;

    // Create form data payload
    const formData = new URLSearchParams();
    formData.append(ENTRY_ID_QUERY, message);
    if (ENTRY_ID_TIMESTAMP) {
        formData.append(ENTRY_ID_TIMESTAMP, new Date().toISOString());
    }

    try {
        await fetch(formUrl, {
            method: 'POST',
            mode: 'no-cors', // Google Forms doesn't return JSON, so we treat it as opaque
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString()
        });
        console.log("Logged query to Google Form:", message);
    } catch (error) {
        console.error("Failed to log to Google Form:", error);
    }
}
