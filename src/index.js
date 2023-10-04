const connectToWhatsApp = require("./connection/connection.js");

const menu = require("./commands/menu.js");

const makeSticker = require("./commands/stickers/makeSticker.js");
const stkToMedia = require("./commands/stickers/stickerToMedia.js");

const profile = require("./commands/informations/profile.js");

const { sendText, getMessageText, sendImage } = require("./utils/message.js");

const selectQuote = require("./configs/personalizedQuotes.js");

const {
  isQuotedImage,
  isQuotedVideo,
  isQuotedSticker,
  getMediaMessageContent,
} = require("./utils/media.js");

const clc = require("cli-color");
const fs = require("fs");

const prefix = ".";

async function processCommand(sock, messageInfo, messageType) {
  const from = messageInfo.key.remoteJid;
  const textOfMessage = getMessageText(messageInfo, messageType);
  const isCmd = textOfMessage.startsWith(prefix);
  const command = isCmd? textOfMessage.slice(1).split(/ +/).shift().toLowerCase() : null;
  const isGroup = from.endsWith("@g.us");
  const sender = isGroup ? messageInfo.key.participant : from;
  const pushName = messageInfo?.pushName || "";
  const groupMetadata = isGroup ? await sock.groupMetadata(from) : "";
  const groupName = isGroup ? groupMetadata.subject : "";
  const quoted = messageInfo.quoted ? messageInfo.quoted : messageInfo;
  const userDevice = messageInfo.key.id.length > 21 ? 'Android' : messageInfo.key.id.substring(0, 2) == '3A' ? 'IOS' : 'WhatsApp web';

  const personalizedQuote = selectQuote(from, pushName, sender);

  const mediaMessage = getMediaMessageContent(messageInfo, messageType);

  sock.sendPresenceUpdate("recording", from);

  if (isCmd) {
    console.log(`${clc.redBright(`[+] Comando no ${isGroup ? "Grupo " + groupName : "Privado"}`)}`);
    console.log(`${clc.redBright("[+] Comando: ")}${command}`);
    console.log(`${clc.redBright("[+] Usuário: ")}${pushName}`);
    console.log(`${clc.redBright("[+] Data: ")}${new Date()} \n`);

    switch (command) {

      case "menu":
        const logo = fs.readFileSync("./assets/logo.jpg");
        const menuText = menu(pushName, isGroup, groupName, prefix);
        sendImage(sock, from, personalizedQuote.status_selo, logo, menuText);

        break;
      case "s":
      case "sticker":
      case "fig":
      case "stk":
        if (
          !isQuotedImage(messageType, messageInfo) &&
          !isQuotedVideo(messageType, messageInfo)
        ) {
          return sendText(
            sock,
            from,
            quoted,
            `❗ Marque uma imagem ou envie na legenda da imagem o comando ${prefix}${command}`
          );
        }

        try {
          await makeSticker(mediaMessage, sock, from, quoted, pushName);
        } catch {
          sendText(sock, from, quoted, "❌ ocorreu um erro");
        }

        break;
      case "toimg":
        if (!isQuotedSticker(messageType, messageInfo)) {
          return sendText(sock, from, quoted, "marque uma figurinha");
        }

        try {
          await stkToMedia(
            mediaMessage,
            sock,
            from,
            personalizedQuote.status_selo,
            messageType,
            messageInfo
          );
        } catch {
          sendText(sock, from, quoted, "❌ ocorreu um erro");
        }

        break;
      case "togif":
        if (!isQuotedSticker(messageType, messageInfo)) {
          return sendText(sock, from, quoted, "❗ marque uma figurinha");
        }

        try {
          await stkToMedia(
            mediaMessage,
            sock,
            from,
            personalizedQuote.status_selo,
            messageType,
            messageInfo
          );
        } catch {
          sendText(sock, from, quoted, "❌ ocorreu um erro");
        }

        break;
      case "perfil":
        await profile(sock, from, sender, quoted, pushName, userDevice)
      default:
        break;
    }
  }
}

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
