const { sendImage, sendVideo, sendAudio } = require("../../utils/message");
const ytDl = require("ytdl-core");
const ytSearch = require("yt-search");
const fs = require("fs");
const { exec } = require("child_process");
const { getBuffer } = require("../../utils/media");

async function ytDownload(sock, messageFrom, quoted, query, command) {
  const videoResult = await ytSearch(query);
  const videoUrl = videoResult.videos[0].url;

  const videoText = `
╭══════════════ ⍨
│ 🧧 *YOUTUBE* 🧧
│✾ 🏷️ Título: ${videoResult.videos[0].title}
│✾ 🕒 Duração: ${videoResult.videos[0].timestamp}
│✾ 📅 Postado: ${videoResult.videos[0].ago}
│✾ 🎬 Canal: ${videoResult.videos[0].author.name}
╰═════════════ ⍨
`;

  const thumbnail = await getBuffer(videoResult.videos[0].thumbnail);

  sendImage(sock, messageFrom, quoted, thumbnail, videoText);

  const videoStream = ytDl(videoUrl, { filter: "audioandvideo" });

  videoStream.on("info", () => {
    const tempFolderPath = "./src/temp/";
    const videoWriteStream = fs.createWriteStream(`${tempFolderPath}video.mp4`);
    videoStream.pipe(videoWriteStream);

    videoWriteStream.on("finish", async () => {
      if (command == "play_video") {
        await sendVideo(sock, messageFrom, quoted, fs.readFileSync(`${tempFolderPath}video.mp4`));
        fs.unlinkSync(`${tempFolderPath}video.mp4`);
      } else if (command == "play_audio") {
        exec(`ffmpeg -i ${tempFolderPath}video.mp4 ${tempFolderPath}audio.mp3`, async () => {
          await sendAudio(sock, messageFrom, quoted, `${tempFolderPath}audio.mp3`);
          fs.unlinkSync(`${tempFolderPath}video.mp4`)
          fs.unlinkSync(`${tempFolderPath}audio.mp3`);
        });
      }
    });
  });
}

module.exports = ytDownload;
