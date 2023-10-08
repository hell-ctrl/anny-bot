const { getFileBufferFromWhatsapp, getMediaMessageContent, getBuffer } = require("../../utils/media");
const { sendImage, sendVideo } = require("../../utils/message");
const webpToMp4 = require("../../utils/webpToMp4");

const fs = require("fs");

async function stkToMedia(sticker, sock, from, quoted, mediaType, messageInfo) {
  const buffer = await getFileBufferFromWhatsapp(sticker, "sticker");

  const isAnimated = getMediaMessageContent(messageInfo, mediaType).isAnimated;

  const tempFolderPath = "./src/temp/";
  const inputFile = `${tempFolderPath}media.webp`;

  fs.writeFileSync(inputFile, buffer);

  if (isAnimated) {
    const { resultado } = await webpToMp4(inputFile); // mp4 url to download

    const mp4Buffer = await getBuffer(resultado);

    sendVideo(sock, from, quoted, mp4Buffer, { gifPlayback: true })

  } else {
    sendImage(sock, from, quoted, buffer);
  }

  fs.unlinkSync(`${tempFolderPath}media.webp`)
}

module.exports = stkToMedia;
