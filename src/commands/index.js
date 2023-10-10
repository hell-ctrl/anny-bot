const menu = require("./menu.js");
const ownerContact = require("../configs/ownerContact.js");

const makeSticker = require("./stickers/makeSticker.js");
const stkToMedia = require("./stickers/stickerToMedia.js");

const profile = require("./informations/profile.js");
const infoBot = require("./informations/infoBot.js");
const sendSugestionToBotOwner = require("./informations/sugestions.js");

const { sendText, getMessageText, sendVideo } = require("../utils/message.js");
const { isQuotedImage, isQuotedVideo, isQuotedSticker, getMediaMessageContent } = require("../utils/media.js");

const selectQuote = require("../configs/personalizedQuotes.js");
  
const clc = require("cli-color");
const fs = require("fs");
const _ = require("lodash");

const botStartTime = new Date()

const prefixs = [".", "/", "!"];
let prefix = "";

async function processCommand(sock, messageInfo, messageType) {
  const messageFrom = messageInfo.key.remoteJid;
  const textOfMessage = getMessageText(messageInfo, messageType);
  const isCmd = prefixs.includes(textOfMessage[0])? prefix = textOfMessage[0] : "";
  const command = isCmd? textOfMessage.slice(1).split(/ +/).shift().toLowerCase() : null;
  const isGroup = messageFrom.endsWith("@g.us");
  const sender = isGroup ? messageInfo.key.participant : messageFrom;
  const pushName = messageInfo?.pushName || "";
  const groupMetadata = isGroup ? await sock.groupMetadata(messageFrom) : "";
  const groupMembers = isGroup ? groupMetadata.participants : [];
  const groupAdmins = isGroup ? _.map(_.filter(groupMembers, "admin"), "id")  : [];
  const groupName = isGroup ? groupMetadata.subject : "";
  const senderIsAdm = isGroup && groupAdmins.includes(sender);
  const botIsAdm = isGroup && groupAdmins.includes("559887583208@s.whatsapp.net");
  const quoted = messageInfo.quoted ? messageInfo.quoted : messageInfo;
  const userDevice = messageInfo.key.id.length > 21 ? 'Android' : messageInfo.key.id.substring(0, 2) == '3A' ? 'IOS' : 'WhatsApp web';
  const args = textOfMessage.trim().split(/ +/).splice(1);

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
        const logo = fs.readFileSync("./assets/logo.mp4");
        const menuText = menu(pushName, prefix);
        sendVideo(sock, messageFrom, personalizedQuote.status_selo, logo, {caption: menuText, gifPlayback: true});
        break;

      case "criador":
        await sock.sendMessage(messageFrom, 
          { contacts: { displayName: 'meu dono', contacts: [{ ownerContact }] } }
        )
        sendText(sock, messageFrom, personalizedQuote.contato_selo, `Olá ${pushName} este é número do meu criador`);
        break

      case "infobot":
        infoBot(sock, messageFrom, personalizedQuote.status_selo, prefixs, pushName, botStartTime, isGroup, botIsAdm);
        break;

      case "sugestao":
        if (args.length == 0) return sendText(sock, messageFrom, quoted, "Você precisa escrever uma sugestão!");
        sendText(sock, messageFrom, quoted, `Olá ${pushName}, sua sugestão foi enviada para o meu criador.`);
        sendSugestionToBotOwner(sock, pushName, personalizedQuote.status_selo, sender, args.join(" "));
        break;
    
      case "s":
      case "sticker":
      case "fig":
      case "stk":
        if (!isQuotedImage(messageType, messageInfo) && !isQuotedVideo(messageType, messageInfo)) {
          return sendText(sock, messageFrom, quoted,
            `❗ Marque uma imagem ou envie na legenda da imagem o comando ${prefix}${command}`
          );
        }

        try {
          await makeSticker(mediaMessage, sock, messageFrom, quoted, pushName);
        } catch {
          sendText(sock, messageFrom, quoted, "❌ ocorreu um erro");
        }
        break;

      case "toimg":
        if (!isQuotedSticker(messageType, messageInfo)) {
          return sendText(sock, messageFrom, quoted, "❗ marque uma figurinha");
        }

        try {
          await stkToMedia(mediaMessage, sock, messageFrom, personalizedQuote.status_selo, messageType, messageInfo);
        } catch {
          sendText(sock, messageFrom, quoted, "❌ ocorreu um erro");
        }
        break;

      case "togif":
        if (!isQuotedSticker(messageType, messageInfo)) {
          return sendText(sock, messageFrom, quoted, "❗ marque uma figurinha");
        }

        try {
          await stkToMedia(mediaMessage, sock, messageFrom, personalizedQuote.status_selo, messageType, messageInfo);
        } catch {
          sendText(sock, messageFrom, quoted, "❌ ocorreu um erro");
        }
        break;

      case "perfil":
        await profile(sock, messageFrom, sender, quoted, pushName, userDevice, senderIsAdm, isGroup);
        break;
      
      default:
        sendText(sock, messageFrom, quoted, `Olá ${pushName} o comando ${command} não existe ❌`);
        break;
    }
  }
}

module.exports = processCommand;