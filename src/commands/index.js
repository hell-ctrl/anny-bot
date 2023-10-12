const menu = require("./menu.js");
const ownerContact = require("../configs/ownerContact.js");
const info = require("../configs/info.json");

const makeSticker = require("./stickers/makeSticker.js");
const stkToMedia = require("./stickers/stickerToMedia.js");

const profile = require("./informations/profile.js");
const infoBot = require("./informations/infoBot.js");
const sendSugestionToBotOwner = require("./informations/sugestions.js");

const ytDownload = require("./downloads/ytdownload.js");

const { sendText, getMessageText, sendVideo } = require("../utils/message.js");
const { isQuotedImage, isQuotedVideo, isQuotedSticker, getMediaMessageContent } = require("../utils/media.js");

const selectQuote = require("../configs/personalizedQuotes.js");
  
const clc = require("cli-color");
const fs = require("fs");
const _ = require("lodash");

const botStartTime = new Date();

const prefixs = [".", "/", "!"];
let prefix = "";

async function processCommand(sock, messageInfo, messageType) {
  const messageFrom = messageInfo.key.remoteJid;
  const textOfMessage = getMessageText(messageInfo, messageType);
  const isCmd = prefixs.includes(textOfMessage[0]) && textOfMessage.length > 1 ? prefix = textOfMessage[0] : false;
  const command = isCmd? textOfMessage.slice(1).split(/ +/).shift().toLowerCase() : null;
  const isGroup = messageFrom.endsWith("@g.us");
  const sender = isGroup ? messageInfo.key.participant : messageFrom;
  const pushName = messageInfo?.pushName || "";
  const groupMetadata = isGroup ? await sock.groupMetadata(messageFrom) : "";
  const groupMembers = isGroup ? groupMetadata.participants : [];
  const groupAdmins = isGroup ? _.map(_.filter(groupMembers, "admin"), "id")  : [];
  const groupName = isGroup ? groupMetadata.subject : "";
  const senderIsAdm = isGroup && groupAdmins.includes(sender);
  const botIsAdm = isGroup && groupAdmins.includes(`${info.botNumber}@s.whatsapp.net`);
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
        const menuText = menu(pushName, isGroup, groupName, prefix);
        await sendVideo(sock, messageFrom, personalizedQuote.status_selo, logo, {caption: menuText, gifPlayback: true});
        break;

      case "criador":
        await sock.sendMessage(messageFrom, 
          { contacts: { displayName: 'meu dono', contacts: [{ ownerContact }] } }
        )
        await sendText(sock, messageFrom, personalizedQuote.contato_selo, `Olá ${pushName} este é número do meu criador`);
        break

      case "infobot":
        await infoBot(sock, messageFrom, personalizedQuote.status_selo, prefixs, botStartTime, isGroup, botIsAdm);
        break;

      case "sugestao":
        if (args.length == 0) return await sendText(sock, messageFrom, quoted, "Você precisa escrever uma sugestão!");
        await sendText(sock, messageFrom, quoted, `Olá ${pushName}, sua sugestão foi enviada para o meu criador.`);
        await sendSugestionToBotOwner(sock, pushName, personalizedQuote.status_selo, sender, args.join(" "));
        break;

      case "perfil":
        await profile(sock, messageFrom, sender, quoted, pushName, userDevice, senderIsAdm, isGroup);
        break;

      case "s":
      case "sticker":
      case "fig":
      case "stk":
        if (!isQuotedImage(messageType, messageInfo) && !isQuotedVideo(messageType, messageInfo)) {
          return await sendText(sock, messageFrom, quoted,
            `${info.commands.stickers.image_no_quoted} ${prefix}${command}`
          );
        }

        try {
          await makeSticker(mediaMessage, sock, messageFrom, quoted, pushName);
        } catch {
          await sendText(sock, messageFrom, quoted, info.commands.error);
        }
        break;

      case "toimg":
        if (!isQuotedSticker(messageType, messageInfo)) {
          return await sendText(sock, messageFrom, quoted, info.commands.stickers.sticker_no_quoted);
        }

        try {
          await stkToMedia(mediaMessage, sock, messageFrom, personalizedQuote.status_selo, messageType, messageInfo);
        } catch {
          await sendText(sock, messageFrom, quoted, info.commands.error);
        }
        break;

      case "togif":
        if (!isQuotedSticker(messageType, messageInfo)) {
          return await sendText(sock, messageFrom, quoted, info.commands.stickers.sticker_no_quoted);
        }

        try {
          await stkToMedia(mediaMessage, sock, messageFrom, personalizedQuote.status_selo, messageType, messageInfo);
        } catch {
          await sendText(sock, messageFrom, quoted, info.commands.error);
        }
        break;

      case "play_video":
        if (args.length == 0) return await sendText(sock, messageFrom, quoted, info.commands.play_no_query);

        try {
          await ytDownload(sock, messageFrom, personalizedQuote.video_selo, args.join(" "), command);
        } catch {
          await sendText(sock, messageFrom, quoted, info.commands.error);
        }
        break;

      case "play_audio":
        if (args.length == 0) return await sendText(sock, messageFrom, quoted, info.commands.play_no_query);

        try {
          await ytDownload(sock, messageFrom, personalizedQuote.audio_selo, args.join(" "), command);
        } catch {
          await sendText(sock, messageFrom, quoted, info.commands.error);
        }
        break;
      
      default:
        await sendText(sock, messageFrom, quoted, `Olá ${pushName} o comando ${command} não existe ❌`);
        break;
    }
  }
}

module.exports = processCommand;