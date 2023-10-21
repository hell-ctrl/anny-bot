const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const fetch = require("node-fetch");

function isQuotedImage(messageType, messageInfo) {
  const isExtendedTextMessage = messageType === "extendedTextMessage";
  let isImg = false;

  if (isExtendedTextMessage) {
    if (messageInfo.message.extendedTextMessage.contextInfo.quotedMessage?.imageMessage) {
      isImg = true;
    }
  } else if (messageInfo.message.imageMessage) {
    isImg = true;
  }

  const hasCaption = messageInfo.message?.imageMessage?.caption || false;
  return (isExtendedTextMessage || hasCaption) && isImg;
}

function isQuotedVideo(messageType, messageInfo) {
  const isExtendedTextMessage = messageType === "extendedTextMessage";
  let isVideo = false;

  if (isExtendedTextMessage) {
    if (messageInfo.message.extendedTextMessage.contextInfo.quotedMessage?.videoMessage) {
      isVideo = true;
    }
  } else if (messageInfo.message.videoMessage) {
    isVideo = true;
  }

  const hasCaption = messageInfo.message?.videoMessage?.caption || false;
  return (isExtendedTextMessage || hasCaption) && isVideo;
}

function isQuotedSticker(messageType, messageInfo) {
  const isExtendedTextMessage = messageType === "extendedTextMessage";
  const isSticker = messageInfo.message?.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage || false;
  return isExtendedTextMessage && isSticker;
}

function getMediaMessageContent(messageInfo, messageType) {
  const mediaQuoted = messageInfo.message.extendedTextMessage?.contextInfo?.quotedMessage;

  if (mediaQuoted) {
    return (
      mediaQuoted.imageMessage ||
      mediaQuoted.videoMessage ||
      mediaQuoted.stickerMessage
    );
  }

  return messageInfo.message[messageType];
}

const getFileBufferFromWhatsapp = async (mediaKey, mediaType) => {
  const stream = await downloadContentFromMessage(mediaKey, mediaType);
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
};

const getBuffer = async (url) => {
  let response = await fetch(url, {
    method: "get",
    body: null,
  });

  let media = await response.buffer();
  return media;
};

module.exports = {
  isQuotedImage,
  isQuotedVideo,
  isQuotedSticker,
  getMediaMessageContent,
  getFileBufferFromWhatsapp,
  getBuffer
};
