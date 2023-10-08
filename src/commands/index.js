const menu = require("./menu.js");

const makeSticker = require("./stickers/makeSticker.js");
const stkToMedia = require("./stickers/stickerToMedia.js");

const profile = require("./informations/profile.js");

const { sendText, getMessageText, sendImage } = require("../utils/message.js");

const selectQuote = require("../configs/personalizedQuotes.js");


const {
    isQuotedImage,
    isQuotedVideo,
    isQuotedSticker,
    getMediaMessageContent,
  } = require("../utils/media.js");
  

const clc = require("cli-color");
const fs = require("fs");

const prefix = ".";

async function processCommand(sock, messageInfo, messageType) {
  const messageFrom = messageInfo.key.remoteJid;
  const textOfMessage = getMessageText(messageInfo, messageType);
  const isCmd = textOfMessage.startsWith(prefix);
  const command = isCmd? textOfMessage.slice(1).split(/ +/).shift().toLowerCase() : null;
  const isGroup = messageFrom.endsWith("@g.us");
  const sender = isGroup ? messageInfo.key.participant : messageFrom;
  const pushName = messageInfo?.pushName || "";
  const groupMetadata = isGroup ? await sock.groupMetadata(messageFrom) : "";
  const groupName = isGroup ? groupMetadata.subject : "";
  const quoted = messageInfo.quoted ? messageInfo.quoted : messageInfo;
  const userDevice = messageInfo.key.id.length > 21 ? 'Android' : messageInfo.key.id.substring(0, 2) == '3A' ? 'IOS' : 'WhatsApp web';

  const personalizedQuote = selectQuote(messageFrom, pushName, sender);

  const mediaMessage = getMediaMessageContent(messageInfo, messageType);

  sock.sendPresenceUpdate("recording", messageFrom);

  if (isCmd) {
    console.log(`${clc.redBright(`[+] Comando no ${isGroup ? "Grupo " + groupName : "Privado"}`)}`);
    console.log(`${clc.redBright("[+] Comando: ")}${command}`);
    console.log(`${clc.redBright("[+] Usuário: ")}${pushName}`);
    console.log(`${clc.redBright("[+] Data: ")}${new Date()} \n`);

    switch (command) {

      case "menu":
        const logo = fs.readFileSync("./assets/logo.jpg");
        const menuText = menu(pushName, isGroup, groupName, prefix);
        sendImage(sock, messageFrom, personalizedQuote.status_selo, logo, menuText);

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
            messageFrom,
            quoted,
            `❗ Marque uma imagem ou envie na legenda da imagem o comando ${prefix}${command}`
          );
        }

        try {
          await makeSticker(mediaMessage, sock, from, quoted, pushName);
        } catch {
          sendText(sock, messageFrom, quoted, "❌ ocorreu um erro");
        }

        break;
      case "toimg":
        if (!isQuotedSticker(messageType, messageInfo)) {
          return sendText(sock, messageFrom, quoted, "marque uma figurinha");
        }

        try {
          await stkToMedia(
            mediaMessage,
            sock,
            messageFrom,
            personalizedQuote.status_selo,
            messageType,
            messageInfo
          );
        } catch(e) {
          sendText(sock, messageFrom, quoted, "❌ ocorreu um erro");
          console.log(e)
        }

        break;
      case "togif":
        if (!isQuotedSticker(messageType, messageInfo)) {
          return sendText(sock, messageFrom, quoted, "❗ marque uma figurinha");
        }

        try {
          await stkToMedia(
            mediaMessage,
            sock,
            messageFrom,
            personalizedQuote.status_selo,
            messageType,
            messageInfo
          );
        } catch {
          sendText(sock, messageFrom, quoted, "❌ ocorreu um erro");
        }

        break;
      case "perfil":
        await profile(sock, messageFrom, sender, quoted, pushName, userDevice)
      default:
        break;
    }
  }
}

module.exports = processCommand;