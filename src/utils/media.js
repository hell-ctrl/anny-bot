const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

function isQuotedImage(messageType, messageInfo) {
  const isExtendedTextMessage = messageType === "extendedTextMessage";
  const hasCaption = messageInfo.message?.imageMessage?.caption || false;
  return isExtendedTextMessage || hasCaption;
}

function isQuotedVideo(messageType, messageInfo) {
  const isExtendedTextMessage = messageType === "extendedTextMessage";
  const hasCaption = messageInfo.message?.videoMessage?.caption || false;
  return isExtendedTextMessage || hasCaption;
}

function isQuotedSticker(messageType) {
  return messageType === "extendedTextMessage";
}

function getMediaMessageContent(messageInfo, mediaType) {
  const quotedMessageContent = messageInfo.message.extendedTextMessage?.contextInfo?.quotedMessage;

  if (quotedMessageContent) {
    return (quotedMessageContent.imageMessage ||
    quotedMessageContent.videoMessage ||
    quotedMessageContent.stickerMessage
    )
  }

  return messageInfo.message[mediaType]

}

const getFileBuffer = async (mediaKey, mediaType) => {
  const stream = await downloadContentFromMessage(mediaKey, mediaType);
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
};

module.exports = { isQuotedImage, isQuotedVideo, isQuotedSticker, getMediaMessageContent, getFileBuffer };
