const { getFileBufferFromWhatsapp, getMediaMessageContent, getBuffer } = require("../../utils/media");
const { sendImage, sendVideo } = require("../../utils/message");
const webpToMp4 = require("../../utils/webpToMp4");
const fs = require("fs");

async function stkToMedia(sticker, sock, messageFrom, quoted, mediaType, messageInfo) {
  try {
    const buffer = await getFileBufferFromWhatsapp(sticker, "sticker");

    const isAnimated = getMediaMessageContent(messageInfo, mediaType).isAnimated;

    const tempFolderPath = "./src/temp/";
    const inputFile = `${tempFolderPath}media.webp`;

    fs.writeFileSync(inputFile, buffer);

    if (isAnimated) {
      const { resultado } = await webpToMp4(inputFile); // mp4 url to download

      const mp4Buffer = await getBuffer(resultado);

      await sendVideo(sock, messageFrom, quoted, mp4Buffer, {
        gifPlayback: true,
      });

    } else {
      await sendImage(sock, messageFrom, quoted, buffer);
    }

    fs.unlinkSync(`${tempFolderPath}media.webp`);
  } catch {
    sendText(sock, messageFrom, quoted,
      "Não foi possível concluir o comando, pois ocorreu um erro interno."
    );
  }
}

module.exports = stkToMedia;
