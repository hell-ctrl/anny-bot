const connectToWhatsAp = require("./connection/connection.js");
const {getFileBuffer} = require("./lib/functions.js")
const config = require("./config.json");
const _ = require("lodash");
const fs = require("fs");
const { exec } = require("child_process");

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

    var textOfMessage = "";

    if (messageType == "conversation") textOfMessage = messageInfo.message.conversation
    if (messageType == "imageMessage") textOfMessage = messageInfo.message.imageMessage.caption
    if (messageType == "videoMessage") textOfMessage = messageInfo.message.videoMessage.caption
    if (messageType == "extendedTextMessage") textOfMessage = messageInfo.message.extendedTextMessage.text


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
    const quoted = messageInfo.quoted ? messageInfo.quoted : messageInfo;
    const isBot = messageInfo.key.fromMe;


    var isQuotedImage = false;
    if (messageType == "extendedTextMessage" || (messageType == "imageMessage" && 
        messageInfo.message?.imageMessage?.caption?.length != 0)) isQuotedImage = true

    const getImageUrlFromMessage =  messageInfo.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage || messageInfo.message.imageMessage;
    // Enviar diferentes tipos de mensagens
    const sendText = (text) =>
      sock.sendMessage(from, { text: text }, { quoted });


    await sock.sendPresenceUpdate("recording", sender);
   

    //incio dos comandos
    if (isCmd) {
      switch (command) {
        case "oi":
          sendText("oi");
          break;
        case "s":
        case "sticker":
        case "f":
        case "fig":
          case "stk":
            if (!isQuotedImage) return sendText(`Marque uma imagem ou envie na legenda da imagem o comando ${prefix}${command}`);
            const a = await getFileBuffer(getImageUrlFromMessage, "image")
          
            // Gera um nome aleatório para o arquivo webp
            const randomName = `sticker${Math.random().toString(36).substring(2, 10)}.webp`;
          
            fs.writeFileSync(`./${randomName}`, a);
          
            // Lê o arquivo webp gerado e o envia como um sticker
            const b = fs.readFileSync(`./nn.webp`);
            await sock.sendMessage(from, {sticker: b}, {quoted});
          
            break;
          
        default:
          break;
      }
    }
  });
}

startAnny();
