const { sendImage, sendVideo, sendAudio, sendText, sendReaction } = require("../../utils/message.js");
const ytDl = require("ytdl-core");
const ytSearch = require("yt-search");
const fs = require("fs");
const { promisify } = require("util");
const execAsync = promisify(require("child_process").exec);
const { getBuffer } = require("../../utils/media");

async function ytDownload(sock, messageFrom, quoted, query, messageInfo, command) {
  const regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;

  try {
    await sendReaction(sock, messageFrom, messageInfo, "⌛");

    if (query.startsWith("https://") && regex.test(query)) {
      await downloadAndSendVideo(sock, messageFrom, quoted, query, command);
    } else if (query.startsWith("https://") && !regex.test(query)) {
      await sendText(sock, messageFrom, quoted, "Isso não é uma url do youtube.");
    } else {
      const searchVideo = await ytSearch(query);
      const video = searchVideo.videos[0];

      await Promise.all([
        sendVideoInfo(sock, messageFrom, quoted, video),
        downloadAndSendVideo(sock, messageFrom, quoted, video.url, command)
      ]);
    }
  } catch {
    sendText(sock, messageFrom, quoted, "Não foi possível baixar seu vídeo.");
  }
}


async function sendVideoInfo(sock, messageFrom, quoted, video) {
  const thumbnail = await getBuffer(video.thumbnail);

  const videoInfo = `
╭══════════════ ⍨
│ 🧧 *YOUTUBE* 🧧
│ ➤ 🏷️ Título: *${video.title}*
│ ➤ 🕒 Duração: *${video.timestamp}*
│ ➤ 📅 Postado: *${video.ago}*
│ ➤ 🎬 Canal: *${video.author.name}*
╰═════════════ ⍨
    `;

  await sendImage(sock, messageFrom, quoted, thumbnail, videoInfo);
}


async function downloadAndSendVideo(sock, messageFrom, quoted, url, command) {
  const videoStream = ytDl(url, { filter: "audioandvideo" });

  videoStream.on("info", () => {
    const randomId = `${Math.random().toString(36).substring(2, 10)}`;
    const tempFolderPath = "./src/temp/";
    const videoPath = `${tempFolderPath}video_${randomId}.mp4`;
    const audioPath = `${tempFolderPath}audio_${randomId}.mp3`;

    const videoWriteStream = fs.createWriteStream(videoPath);
    videoStream.pipe(videoWriteStream);

    videoWriteStream.on("finish", async () => {
      if (command === "play_video") {
        await sendVideo(sock, messageFrom, quoted, fs.readFileSync(videoPath));
        fs.unlinkSync(videoPath);
      } else if (command === "play_audio") {
        await execAsync(`ffmpeg -i ${videoPath} -b:a 192K -vn ${audioPath}`);
        await sendAudio(sock, messageFrom, quoted, audioPath);

        fs.unlinkSync(videoPath);
        fs.unlinkSync(audioPath);
      }
    });
  });
}


module.exports = ytDownload;