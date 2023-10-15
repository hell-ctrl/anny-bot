const fs = require("fs");
const { promisify } = require("util");
const execAsync = promisify(require("child_process").exec);
const { getFileBufferFromWhatsapp } = require("../../utils/media.js");
const { sendSticker, sendText } = require("../../utils/message.js");
const addStickerMetaData = require("./addStickerMetaData.js");

async function makeSticker(mediaKey, sock, messageFrom, quoted, pushName) {
  try {
    let mediaType = "seconds" in mediaKey ? "video" : "image";

    if (mediaType == "video" && mediaKey.seconds > 10) {
      return sendText(sock, messageFrom,  quoted,
        "Opa, o vídeo deve ser de 10s ou menos."
      );
    }

    const buffer = await getFileBufferFromWhatsapp(mediaKey, mediaType);

    const randomId = `${Math.random().toString(36).substring(2, 10)}`;

    const tempFolderPath = "./src/temp/";
    const inputFile = `${tempFolderPath}${randomId}.webp`;
    const outputFile = `${tempFolderPath}sticker_${randomId}.webp`;

    const stickerMetaData = {
      packname: "彡🤖 ᴄʀɪᴀᴅᴀ ᴘᴏʀ:\n↳ Anny Bot\n\n彡📱 ɴᴜ́ᴍᴇʀᴏ ᴅᴏ ʙᴏᴛ:\n↳ +55 98 8758-3208",
      author: `彡👑 ᴅᴏɴᴏ:\n↳ mneto_nx\n\n彡👤 ᴜsᴜᴀ́ʀɪᴏ:\n↳ ${pushName}`,
    };

    fs.writeFileSync(inputFile, buffer);

    await execAsync(`ffmpeg -i ${inputFile} -c:v libwebp -filter:v fps=fps=15 -loop 0 -an -lossless 1 -preset default -s 200:200 ${outputFile}`)
     
    const mediaWithMetaDataPath = await addStickerMetaData(outputFile, stickerMetaData);
    const media = fs.readFileSync(mediaWithMetaDataPath);

    await sendSticker(sock, messageFrom, quoted, media);

    fs.unlinkSync(inputFile);
    fs.unlinkSync(outputFile);
    fs.unlinkSync(`${tempFolderPath}nsticker.webp`);
  
  } catch {
    sendText(sock, messageFrom, quoted, "Não foi possível criar sua figurinha.");
  }
}

module.exports = makeSticker;
