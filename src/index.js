const connectToWhatsApp = require("./connection/connection.js");
const config = require("./config.json");
const makeSticker = require("./commands/stickers/makeSticker.js");
const clc = require("cli-color");

const prefix = config.prefix;

async function processCommand(sock, messageInfo, messageType) {
  const from = messageInfo.key.remoteJid;
  const textOfMessage = getMessageText(messageInfo, messageType);
  const isCmd = textOfMessage.startsWith(prefix);
  const command = isCmd ? textOfMessage.slice(1).split(/ +/).shift().toLowerCase() : null;
  const isGroup = from.endsWith("@g.us");
  const sender = isGroup ? messageInfo.key.participant : from;
  const pushname = messageInfo?.pushName || "";
  const groupMetadata = isGroup ? await sock.groupMetadata(from) : "";
  const groupName = isGroup ? groupMetadata.subject : "";
  const quoted = messageInfo.quoted ? messageInfo.quoted : messageInfo;

  sock.sendPresenceUpdate("recording", from);

  if (isCmd) {
    console.log(`${clc.redBright(`[+] Comando no ${isGroup ? "Grupo: " + groupName : "Privado"}`)}`);
    console.log(`${clc.redBright("[+] Comando: ")}${command}`);
    console.log(`${clc.redBright("[+] Usuário: ")}${pushname}`);
    console.log(`${clc.redBright("[+] Data: ")}${new Date()} \n`);

    switch (command) {
      case "s":
      case "sticker":
      case "f":
      case "fig":
      case "stk":
        if (!isQuotedImage(messageType, messageInfo)) {
          sendText(sock, from, quoted,`Marque uma imagem ou envie na legenda da imagem o comando ${prefix}${command}`);
        } else {
          await makeSticker(getImageFromMessage(messageInfo, messageInfo), sock, from, quoted);
        }
        break;
      default:
        break;
    }
  }
}

function getMessageText(messageInfo, messageType) {
  let textOfMessage = "";

  if (messageType === "conversation") {
    textOfMessage = messageInfo.message.conversation;
  } else if (messageType === "imageMessage") {
    textOfMessage = messageInfo.message.imageMessage.caption;
  } else if (messageType === "videoMessage") {
    textOfMessage = messageInfo.message.videoMessage.caption;
  } else if (messageType === "extendedTextMessage") {
    textOfMessage = messageInfo.message.extendedTextMessage.text;
  }

  return textOfMessage;
}

function isQuotedImage(messageType, messageInfo) {
  return (
    (messageType == "extendedTextMessage" || (messageType == "imageMessage" && 
        messageInfo.message?.imageMessage?.caption?.length != 0))
  );
}

function getImageFromMessage(messageInfo) {
  return (
    messageInfo.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ||
    messageInfo.message.imageMessage
  );
}

function sendText(sock, from, quoted,text) {
  sock.sendMessage(from, { text: text }, { quoted });
}

async function startAnny() {
  const sock = await connectToWhatsApp();

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const messageInfo = messages[0];

    const messageType = Object.keys(messageInfo.message)[0];

    if (!messageInfo.message) return;

    if (messageInfo.key && messageInfo.key.remoteJid == "status@broadcast") return;

    await processCommand(sock, messageInfo, messageType);
  });
}

startAnny();
