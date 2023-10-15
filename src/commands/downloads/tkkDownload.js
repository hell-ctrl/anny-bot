const { TiktokDL } = require("@tobyg74/tiktok-api-dl");
const { sendImage, sendVideo, sendText, sendReaction } = require("../../utils/message");
const { getBuffer } = require("../../utils/media");

async function tkkDownload(sock, messageFrom, quoted, messageInfo, url) {
  const regex = /^(https?:\/\/)?(www\.|vm\.)?tiktok\.com\/[@a-zA-Z0-9_.~=\/-?]+/i;

  if (!regex.test(url)) {
    return await sendText(sock, messageFrom, quoted, "Envie uma url válida!");
  }

  try {
    await sendReaction(sock, messageFrom, messageInfo, "⌛");
    const { result } = await TiktokDL(url, { version: "v1" });

    const videoInfo = `
╭══════════════ ⍨
│ 🧧 *TOKTOK* 🧧
│ ➤ 🏷️ Título: *${result.description}*
│ ➤ 🕒 Duração: *${result.duration}*
│ ➤ 👤 Autor: *${result.author.nickname}*
│ ➤ 🔰 ID: *${result.id}*
╰═════════════ ⍨
    `;

    const thumbnail = await getBuffer(result.cover[0]);
    await sendImage(sock, messageFrom, quoted, thumbnail, videoInfo);

    const video = await getBuffer(result.video[0]);
    await sendVideo(sock, messageFrom, quoted, video);

  } catch {
    sendText(sock, messageFrom, quoted, "Não foi possível baixar seu vídeo.");
  }
}

module.exports = tkkDownload;
