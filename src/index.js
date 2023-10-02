const connectToWhatsApp = require("./connection/connection.js");

const makeSticker = require("./commands/stickers/makeSticker.js");
const stkToMedia = require("./commands/stickers/stickerToMedia.js");

const { sendText, sendImage, getMessageText } = require("./utils/message.js");
const { isQuotedImage, isQuotedVideo, isQuotedSticker, getMediaMessageContent } = require("./utils/media.js");

const clc = require("cli-color");

const prefix = ".";

async function processCommand(sock, messageInfo, messageType) {
  const from = messageInfo.key.remoteJid;
  const textOfMessage = getMessageText(messageInfo, messageType);
  const isCmd = textOfMessage.startsWith(prefix);
  const command = isCmd ? textOfMessage.slice(1).split(/ +/).shift().toLowerCase() : null;
  const isGroup = from.endsWith("@g.us");
  const sender = isGroup ? messageInfo.key.participant : from;
  const pushName = messageInfo?.pushName || "";
  const groupMetadata = isGroup ? await sock.groupMetadata(from) : "";
  const groupName = isGroup ? groupMetadata.subject : "";
  const quoted = messageInfo.quoted ? messageInfo.quoted : messageInfo;

  sock.sendPresenceUpdate("recording", from);

  if (isCmd) {
    console.log(`${clc.redBright(`[+] Comando no ${isGroup ? "Grupo: " + groupName : "Privado"}`)}`);
    console.log(`${clc.redBright("[+] Comando: ")}${command}`);
    console.log(`${clc.redBright("[+] Usuário: ")}${pushName}`);
    console.log(`${clc.redBright("[+] Data: ")}${new Date()} \n`);
  
    switch (command) {
      case "s":
      case "sticker":
      case "f":
      case "fig":
      case "stk":
        if (!isQuotedImage(messageType, messageInfo) && !isQuotedVideo(messageType, messageInfo)) {
          return sendText(sock, from, quoted,`Marque uma imagem ou envie na legenda da imagem o comando ${prefix}${command}`);
        }
        await makeSticker(getMediaMessageContent(messageInfo, messageType), sock, from, quoted, pushName);

        break;
      case "toimg":
        if (!isQuotedSticker(messageType, messageInfo)) {
          return sendText(sock, from, quoted, "marque uma figurinha");
        } 
        await stkToMedia(getMediaMessageContent(messageInfo, messageType), sock, from, quoted, messageType, messageInfo);

        break;
      case "togif":
        if (!isQuotedSticker(messageType, messageInfo)) {
          return sendText(sock, from, quoted, "marque uma figurinha");
        } 
        await stkToMedia(getMediaMessageContent(messageInfo, messageType), sock, from, quoted, messageType, messageInfo);

        break;
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

    const messageType = Object.keys(messageInfo.message)[0];

    if (messageInfo.key && messageInfo.key.remoteJid == "status@broadcast") return;

    await processCommand(sock, messageInfo, messageType);
  });
}

startAnny();
