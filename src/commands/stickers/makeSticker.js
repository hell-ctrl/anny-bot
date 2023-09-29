const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const exec = require("child_process");
const { getBuffer } = require("../../lib/functions");

async function makeSticker(image, sock, from, quoted) {
  const buffer = await getBuffer(image.url);
  const buffer2 = Buffer.from(buffer)
  console.log(image.url)

  let randomName = `sticker${Math.random(10)}.webp`;

  fs.writeFileSync(`./${randomName}`, buffer2);

  ffmpeg(`./${randomName}`)
    .on("error", console.error)
    .on("end", () =>
      exec(`webpmux -set exif ./data/${randomName} -o ./${randomName}`, () => {
        sock.sendMessage(
          from,
          {
            sticker: fs.readFileSync(`./${randomName}`),
          },
          { quoted }
        );

        fs.unlinkSync(`./${randomName}`)
      })
    );
}

module.exports = makeSticker;
