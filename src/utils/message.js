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
  await sock.sendMessage(to, { audio: { url: audioUrl }, mimetype: "audio/mp4" }, { quoted })
}

async function sendReaction(sock, to, messageInfo, emoji) {
  await sock.sendMessage(to, { react: { text: emoji, key: messageInfo.key }})
}

function getMessageText(messageInfo, messageType) {
  const messageTypes = {
    conversation: messageInfo?.message?.conversation,
    imageMessage: messageInfo?.message?.imageMessage?.caption,
    videoMessage: messageInfo?.message?.videoMessage?.caption,
    extendedTextMessage: messageInfo?.message?.extendedTextMessage?.text
  }

  return messageTypes[messageType] || "";
}

module.exports = {
  sendText,
  sendImage,
  sendVideo,
  sendSticker,
  sendAudio,
  sendReaction,
  getMessageText,
};
