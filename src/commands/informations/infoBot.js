const { botName, botOwner} = require("../../configs/info.json");
const fs = require("fs");
const { sendVideo } = require("../../utils/message");

async function infoBot(sock, messageFrom, quoted, prefixs, botStartTime, isGroup, botIsAdm) {
    const logo = fs.readFileSync("./assets/logo.mp4");
    const elapsedTimeInSeconds = Math.floor((new Date() - botStartTime) / 1000);
    const elapsedTimeFormatted = timeOn(elapsedTimeInSeconds); 

    const text = `
╭══════════════ ⍨
│ ❗ INFORMAÇÕES ❗
│ ➤ Bot: ${botName} ${isGroup ? `\n│ ➤ Administrador? ${botIsAdm ? "Sim" : "Não"}` : ""}
│ ➤ Prefixos:「 ${prefixs.join("   ")} 」
│ ➤ Criador: wa.me/${botOwner}
│ ➤ Tempo online: ${elapsedTimeFormatted}
│ ➤ Github: http://bit.ly/45n6Own
╰══════════════ ⍨
`;
    await sendVideo(sock, messageFrom, quoted, logo, { caption: text, gifPlayback: true });
}

function timeOn(elapsedTimeInSeconds) {
  const hours = Math.floor(elapsedTimeInSeconds / 3600);
  const minutes = Math.floor((elapsedTimeInSeconds % 3600) / 60);
  const seconds = elapsedTimeInSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

module.exports = infoBot;
