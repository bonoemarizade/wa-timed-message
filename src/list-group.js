const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
    puppeteer: {
        headless: true,
        executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" // adjust if needed
    }
});

client.on("qr", qr => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("✅ Client is ready!");

    client.getChats().then(chats => {
        const groups = chats.filter(chat => chat.isGroup);

        groups.forEach(group => {
            console.log(`Group: ${group.name} | ID: ${group.id._serialized}`);
        });
    });
});

client.initialize();
