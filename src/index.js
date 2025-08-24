const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { google } = require("googleapis");
const cron = require("node-cron");

const sheets = google.sheets("v4");
const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const SPREADSHEET_ID = "1AGLfx-TEwiCXkmP1GrkI9uBl0z8oiB-Fuc7NPpHNoSw";
const RANGE = "Duty!A:D";

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "my-whatsapp-session",
        dataPath: "./sessions"
    }),
    puppeteer: {
        headless: true,
        executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" //adjust this
    },
});

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
    console.log("✅ WhatsApp client is ready!");

    // Get today's duty
    cron.schedule("0 16 * * *", () => sendDutyMessage(), { timezone: "Asia/Jakarta" });
    cron.schedule("0 18 * * *", () => sendDutyMessage(), { timezone: "Asia/Jakarta" });
    cron.schedule("0 20 * * *", () => sendDutyMessage(), { timezone: "Asia/Jakarta" });
});

async function sendDutyMessage() {
    try {
        console.log("Try to Send Message...");

        const authClient = await auth.getClient();
        const res = await sheets.spreadsheets.values.get({
            auth: authClient,
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE,
        });

        const rows = res.data.values;
        if (!rows || rows.length === 0) {
            console.log("No data found in sheet.");
            return;
        }

        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const duty = rows.find((r) => r[0] === today);

        if (!duty) {
            console.log("No duty entry for today.");
            return;
        }

        const phones = duty.slice(1).filter((p) => p && p.trim() !== ""); // skip empty
        console.log("Phones:", phones);

        const groupId = "120363386948376927@g.us";
        const mentions = phones.map(num => `${num}@c.us`);
        const messageText = `Hello, ${phones.map(num => `@${num}`).join(' ')}`;

        await client.sendMessage(groupId, messageText, {
            mentions: mentions
        });
        console.log("✅ Message sent with multiple mentions!");
    }
    catch (err) {
        console.error("❌ Error sending duty message:", err);
    }
}

client.initialize();