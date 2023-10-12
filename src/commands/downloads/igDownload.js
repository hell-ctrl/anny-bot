const instagramDl = require("@sasmeee/igdl");
const { sendVideo, sendText } = require("../../utils/message.js");
const { getBuffer } = require("../../utils/media.js");

async function igDownload(sock, messageFrom, quoted, url) {
    const regex = /^(https?:\/\/)?(www\.)?instagram\.com\/[^/]+/

  if (!regex.test(url)) {
    return await sendText(sock, messageFrom, quoted, "Envie uma url válida!");
  };

  await sendText(sock, messageFrom, quoted, "Aguarde, estou fazendo o download.");

  const result = await instagramDl(url);

  const buffer = await getBuffer(result[0].download_link);

  await sendVideo(sock, messageFrom, quoted, buffer);

};

module.exports = igDownload;