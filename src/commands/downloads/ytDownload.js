const { sendImage, sendVideo, sendAudio, sendText, sendReaction } = require("../../utils/message");
const ytDl = require("ytdl-core");
const ytSearch = require("yt-search");
const fs = require("fs");
const { promisify } = require("util");
const execAsync = promisify(require("child_process").exec);
const { getBuffer } = require("../../utils/media");

async function ytDownload(sock, messageFrom, quoted, query, messageInfo, command) {
  try {
    await sendReaction(sock, messageFrom, messageInfo, "⌛");
    const videoResult = await ytSearch(query);
    const video = videoResult.videos[0];

    const videoInfo = `
╭══════════════ ⍨
│ 🧧 *YOUTUBE* 🧧
│ ➤ 🏷️ Título: *${video.title}*
│ ➤ 🕒 Duração: *${video.timestamp}*
│ ➤ 📅 Postado: *${video.ago}*
│ ➤ 🎬 Canal: *${video.author.name}*
╰═════════════ ⍨
  `;

    const thumbnail = await getBuffer(video.thumbnail);

    sendImage(sock, messageFrom, quoted, thumbnail, videoInfo);

    const videoUrl = video.url;
    const videoStream = ytDl(videoUrl, { filter: "audioandvideo" });

    videoStream.on("info", () => {
      const tempFolderPath = "./src/temp/";
      const videoPath = `${tempFolderPath}video.mp4`;
      const audioPath = `${tempFolderPath}audio.mp3`;

      const videoWriteStream = fs.createWriteStream(videoPath);
      videoStream.pipe(videoWriteStream);

      videoWriteStream.on("finish", async () => {
        if (command === "play_video") {
          await sendVideo(sock, messageFrom, quoted, fs.readFileSync(videoPath));
          fs.unlinkSync(videoPath);
        } else if (command === "play_audio") {
          await execAsync(`ffmpeg -i ${videoPath} ${audioPath}`);
          await sendAudio(sock, messageFrom, quoted, audioPath);
        
          fs.unlinkSync(videoPath);
          fs.unlinkSync(audioPath);
        }
      });
    });
  } catch {
    sendText(sock, messageFrom, quoted, "Não foi possível baixar seu vídeo.");
  }
}

module.exports = ytDownload;
