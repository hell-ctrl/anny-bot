const fs = require("fs");
const { exec } = require("child_process");
const { getFileBuffer } = require("../../lib/functions");

async function makeSticker(image, sock, from, quoted) {
  const buffer = await getFileBuffer(image, "image");

  const randomName = `${Math.random()
    .toString(36)
    .substring(2, 10)}.webp`;

  const tempFolderPath = './src/temp/';
  const inputFile = `${tempFolderPath}${randomName}`;
  const outputFile = `${tempFolderPath}sticker.webp`;

  fs.writeFileSync(inputFile, buffer);

  exec(`ffmpeg -i ${inputFile} -c:v libwebp -lossless 1 ${outputFile}`, err => {
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
