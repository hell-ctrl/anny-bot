const fs = require("fs");
const { exec } = require("child_process");
const { getFileBuffer } = require("../../utils/media.js");

async function makeSticker(mediaKey, sock, from, quoted) {
  let mediaType = "image";
  if (mediaKey.seconds) {
    mediaType = "video";
  }

  const buffer = await getFileBuffer(mediaKey, mediaType);

  const randomName = `${Math.random()
    .toString(36)
    .substring(2, 10)}.webp`;

  const tempFolderPath = './src/temp/';
  const inputFile = `${tempFolderPath}${randomName}`;
  const outputFile = `${tempFolderPath}sticker.webp`;

  fs.writeFileSync(inputFile, buffer);

  exec(`ffmpeg -i ${inputFile} -c:v libwebp -filter:v fps=fps=15 -loop 0 -an -lossless 1 -preset default -s 200:200 ${outputFile}`, err => {
    if (err) {
      console.error("Erro ao criar o sticker:", err);
    } else {
      const _image = fs.readFileSync(outputFile);

      sock.sendMessage(from, { sticker: _image }, { quoted });

      fs.unlinkSync(inputFile);
      fs.unlinkSync(outputFile);
    }
  });
}

module.exports = makeSticker;
