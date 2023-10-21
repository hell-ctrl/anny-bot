const connectToWhatsApp = require("./connection/connection.js");
const processCommand = require("./commands/index.js");

async function startAnny() {
  const sock = await connectToWhatsApp();

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const messageInfo = messages[0];

    if (!messageInfo.message) return;

    await sock.readMessages([messageInfo.key.id]);

    const messageType = Object.keys(messageInfo.message)[0];

    if (messageInfo.key && messageInfo.key.remoteJid == "status@broadcast") return;

    await processCommand(sock, messageInfo, messageType);
  });
}

startAnny();