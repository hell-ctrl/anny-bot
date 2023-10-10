function sendText(sock, to, quoted, text) {
  sock.sendMessage(to, { text: text }, { quoted });
}

function sendImage(sock, to, quoted, image, caption = "") {
  sock.sendMessage(to, { image: image, caption }, { quoted });
}

function sendVideo(sock, to, quoted, video, opitions) {
  sock.sendMessage(to, { video: video, ...opitions}, { quoted });
}

function sendSticker(sock, to, quoted, sticker) {
  sock.sendMessage(to, { sticker: sticker }, { quoted });
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
  getMessageText,
};
