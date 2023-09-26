const connectToWhatsAp = require("./connection/connection.js");
const config = require("./config.json");
const _ = require("lodash");

prefix = config.prefix;

// Contato do dono
const vcard =
  "BEGIN:VCARD\n" +
  "VERSION:3.0\n" +
  "FN:mneto\n" + // Nome completo
  "ORG:Lwa Company;\n" + // A organização do contato
  "TEL;type=CELL;type=VOICE;waid=559887583208:+55 98 8758-3208\n" + // WhatsApp ID + Número de telefone
  "END:VCARD"; // Fim do contato

async function startAnny() {
  const sock = await connectToWhatsAp();

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const messageInfo = messages[0];
    if (!messageInfo.message) return;

    if (messageInfo.key && messageInfo.key.remoteJid == "status@broadcast")
      return;

    const messageType = Object.keys(messageInfo.message)[0];
    const from = messageInfo.key.remoteJid;

    const textOfMessage =
      messageType === "conversation"
        ? messageInfo.message.conversation
        : messageType == "imageMessage"
        ? messageInfo.message.imageMessage.caption
        : messageType == "videoMessage"
        ? messageInfo.message.videoMessage.caption
        : messageType == "extendedTextMessage"
        ? messageInfo.message.extendedTextMessage.text
        : "";

    const args = textOfMessage.trim().split(/ +/).splice(1);
    const isCmd = textOfMessage.startsWith(prefix);
    const command = isCmd? textOfMessage.slice(1).split(/ +/).shift().toLowerCase() : null;
    const isGroup = from.endsWith("@g.us");
    const sender = isGroup ? messageInfo.key.participant : from;
    const pushname = messageInfo?.pushName || "";
    const groupMetadata = isGroup ? await sock.groupMetadata(from) : "";
    const groupName = isGroup ? groupMetadata.subject : "";
    const groupDesc = isGroup ? groupMetadata.desc : "";
    const groupMembers = isGroup ? groupMetadata.participants : "";
    const groupAdmins = isGroup? _.map(_.filter(groupMembers, "admin"), "id") : "";

    // Consts dono/adm etc...
    const quoted = messageInfo.quoted ? messageInfo.quoted : messageInfo;
    const isBot = messageInfo.key.fromMe;
    const enviar = async (text) =>
      sock.sendMessage(from, { text: text }, { quoted });

    //incio dos comandos
    if (isCmd) {
      switch (command) {
        case "oi":
          enviar("oi");
          break;
        default:
          break;
      }
    }
  });
}

startAnny();
