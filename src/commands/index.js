const menu = require("./menu.js");
const ownerContact = require("../configs/ownerContact.js");
const info = require("../configs/info.json");

const makeSticker = require("./stickers/createSticker.js");
const stkToMedia = require("./stickers/stickerToMedia.js");

const profile = require("./informations/profile.js");
const infoBot = require("./informations/infoBot.js");
const sendSugestionToBotOwner = require("./informations/sugestions.js");

const ytDownload = require("./downloads/ytDownload.js");
const igDownload = require("./downloads/igDownload.js");
const tkkDownload = require("./downloads/tkkDownload.js");

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
  const pushName = messageInfo?.pushName || "";

  const isGroup = messageFrom.endsWith("@g.us");
  const groupMetadata = isGroup ? await sock.groupMetadata(messageFrom) : "";
  const groupMembers = isGroup ? groupMetadata.participants : [];
  const groupAdmins = isGroup ? _.map(_.filter(groupMembers, "admin"), "id")  : [];
  const groupName = isGroup ? groupMetadata.subject : "";
  const sender = isGroup ? messageInfo.key.participant : messageFrom;
  const senderIsAdm = isGroup && groupAdmins.includes(sender);
  const botIsAdm = isGroup && groupAdmins.includes(`${info.botNumber}@s.whatsapp.net`);

  const quoted = messageInfo.quoted ? messageInfo.quoted : messageInfo;
  const userDevice = messageInfo.key.id.length > 21 ? 'Android' : messageInfo.key.id.substring(0, 2) == '3A' ? 'IOS' : 'WhatsApp web';
  const args = textOfMessage.trim().split(/ +/).splice(1);

  const personalizedQuote = selectQuote(messageFrom, pushName, sender);

  const mediaMessage = getMediaMessageContent(messageInfo, messageType);

  //sock.sendPresenceUpdate("recording", messageFrom);

  if (isCmd) {
    console.log(`${clc.redBright(`[+] Comando no ${isGroup ? "Grupo " + groupName : "Privado"}`)}`);
    console.log(`${clc.redBright("[+] Comando: ")}${command}`);
    console.log(`${clc.redBright("[+] Usuário: ")}${pushName}`);
    console.log(`${clc.redBright("[+] Data: ")}${new Date()} \n`);

    switch (command) {

      case "menu":
        const logo = fs.readFileSync("./assets/logo.mp4");
        const menuText = menu(pushName, isGroup, groupName, prefix);
        await sendVideo(sock, messageFrom, quoted, logo, {caption: menuText, gifPlayback: true});
        break;

      case "criador":
        await sock.sendMessage(messageFrom, 
          { contacts: { displayName: 'meu dono', contacts: [{ ownerContact }] } }
        )
        await sendText(sock, messageFrom, quoted, `Olá ${pushName} este é número do meu criador`);
        break

      case "infobot":
        await infoBot(sock, messageFrom, quoted, prefixs, botStartTime, isGroup, botIsAdm);
        break;

      case "sugestao":
        if (args.length == 0) return await sendText(sock, messageFrom, quoted, "Você precisa escrever uma sugestão!");
        await sendText(sock, messageFrom, quoted, `Olá ${pushName}, sua sugestão foi enviada para o meu criador.`);
        await sendSugestionToBotOwner(sock, pushName, personalizedQuote.status_selo, sender, args.join(" "));
        break;

      case "perfil":
        await profile(sock, messageFrom, sender, quoted, pushName, userDevice, senderIsAdm, isGroup);
        break;

      case "fig":
        if (!isQuotedImage(messageType, messageInfo) && !isQuotedVideo(messageType, messageInfo)) {
          return await sendText(sock, messageFrom, quoted,
            `Marque uma imagem ou envie na legenda da imagem o comando ${prefix}${command}`
          );
        };  
        await makeSticker(mediaMessage, sock, messageFrom, quoted, pushName);
        break;

      case "toimg":
        if (!isQuotedSticker(messageType, messageInfo)) {
          return await sendText(sock, messageFrom, quoted, "Você precisa marcar uma figurinha.");
        };
        await stkToMedia(mediaMessage, sock, messageFrom, quoted, messageType, messageInfo);
        break;

      case "togif":
        if (!isQuotedSticker(messageType, messageInfo)) {
          return await sendText(sock, messageFrom, quoted, "Você precisa marcar uma figurinha.");
        };
        await stkToMedia(mediaMessage, sock, messageFrom, quoted, messageType, messageInfo);
        break;

      case "play_video":
        if (args.length == 0) {
          return await sendText(sock, messageFrom, quoted, "Eu não irei adivinhar o nome do vídeo que você quer baixar.");
        };
        await ytDownload(sock, messageFrom, quoted, args.join(" "), messageInfo, command);
        break;

      case "play_audio":
        if (args.length == 0) {
          return await sendText(sock, messageFrom, quoted, "Eu não irei adivinhar o nome do áudio que você quer baixar.");
        };
        await ytDownload(sock, messageFrom, quoted, args.join(" "), messageInfo, command);
        break;
      
      case "ig_down":
        if (args.length == 0) {
          return await sendText(sock, messageFrom, quoted, "Eu não irei adivinhar o link que você quer baixar.");
        };
        await igDownload(sock, messageFrom, quoted, messageInfo, args.join(""));
        break;

      case "tkk_down":
        if (args.length == 0) {
          return await sendText(sock, messageFrom, quoted, "Eu não irei adivinhar o vídeo que você quer baixar.");
        };

        await tkkDownload(sock, messageFrom, quoted, messageInfo, args.join(""));
        break;
      
      default:
        await sendText(sock, messageFrom, quoted, `Olá ${pushName} o comando ${command} não existe!`);
        break;
    }
  }
}

module.exports = processCommand;