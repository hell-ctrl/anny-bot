const { getFileBufferFromWhatsapp, getBuffer } = require("../../utils/media");
const { sendImage, sendVideo, sendText } = require("../../utils/message");
const webpToMp4 = require("./webpToMp4");
const fs = require("fs");

async function stkToMedia(sticker, sock, messageFrom, quoted) {
  try {
    const buffer = await getFileBufferFromWhatsapp(sticker, "sticker");

    const isAnimated = sticker.isAnimated;

    const randomId = `${Math.random().toString(36).substring(2, 10)}`;

    const tempFolderPath = "./src/temp/";
    const inputFile = `${tempFolderPath}media_${randomId}.webp`;

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

    fs.unlinkSync(inputFile);
  } catch {
    sendText(sock, messageFrom, quoted,
      "Não foi possível concluir o comando, pois ocorreu um erro interno."
    );
  }
}

module.exports = stkToMedia;
