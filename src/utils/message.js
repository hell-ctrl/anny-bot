async function sendText(sock, to, quoted, text) {
  await sock.sendMessage(to, { text: text }, { quoted });
}

async function sendImage(sock, to, quoted, image, caption = "") {
  await sock.sendMessage(to, { image: image, caption }, { quoted });
}

async function sendVideo(sock, to, quoted, video, opitions) {
  await sock.sendMessage(to, { video: video, ...opitions}, { quoted });
}

async function sendSticker(sock, to, quoted, sticker) {
  await sock.sendMessage(to, { sticker: sticker }, { quoted });
}

async function sendAudio(sock, to, quoted, audioUrl) {
  await sock.sendMessage(to, { audio: { url: audioUrl }, mimetype: "audio/mp4"}, { quoted })
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

module.exports = {
  sendText,
  sendImage,
  sendVideo,
  sendSticker,
  sendAudio,
  getMessageText,
};
