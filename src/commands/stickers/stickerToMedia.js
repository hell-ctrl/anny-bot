const { getFileBuffer, getMediaMessageContent } = require("../../utils/media");
const { sendImage, sendVideo } = require("../../utils/message");
const { exec } = require("child_process");
const fs = require("fs");

async function stkToMedia(sticker, sock, from, quoted, mediaType, messageInfo) {
  const buffer = await getFileBuffer(sticker, "sticker");

  const isAnimated = getMediaMessageContent(messageInfo, mediaType).isAnimated;

  const tempFolderPath = "./src/temp/";
  const inputFile = `${tempFolderPath}media.webp`;

  fs.writeFileSync(inputFile, buffer);

  if (isAnimated) {
    exec(`python3 ./src/utils/getWebpFrames.py`, () => {
      exec(
        `ffmpeg -framerate 15 -i ${tempFolderPath}frame_%04d.png -c:v libx264 -pix_fmt yuv420p ${tempFolderPath}media.mp4`,
        () => {
          const media = fs.readFileSync(`${tempFolderPath}media.mp4`);

          sendVideo(sock, from, quoted, media);

          fs.readdir(tempFolderPath, (err, files) => {
            files.forEach((file) => {
              const filePath = `${tempFolderPath}${file}`;

              if (file.startsWith("frame")) {
                fs.unlinkSync(filePath);
              }
              if (file == "media.mp4") {
                fs.unlinkSync(filePath);
              }
              if (file == "media.webp") {
                fs.unlinkSync(filePath);
              }
            });
          });
        }
      );
    });
  } else {
    sendImage(sock, from, quoted, buffer);
    fs.unlinkSync(`${tempFolderPath}media.webp`)
  }
}

module.exports = stkToMedia;
