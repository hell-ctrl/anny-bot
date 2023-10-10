const fs = require("fs");
const { sendVideo } = require("../../utils/message");

function infoBot(sock, messageFrom, quoted, prefixs, pushName, botStartTime, isGroup, botIsAdm) {
    const logo = fs.readFileSync("./assets/logo.mp4");
    const elapsedTimeInSeconds = Math.floor((new Date() - botStartTime) / 1000); // Calcula elapsedTime dentro da função
    const elapsedTimeFormatted = timeOn(elapsedTimeInSeconds); // Formata o tempo

    const text = `
╭══════════════ ⪩
│き⃟ℹ️ 𝐈𝐍𝐅𝐎-𝐁𝐎𝐓 ❈⃟ℹ️
│✾ ⋟ Bot: Anny Bot
${isGroup ? `│✾ ⋟ Administrador? ${botIsAdm ? "Sim" : "Não"}` : "│✾ ⋟ Pv? 🤔"}
│✾ ⋟ Prefixos:「 ${prefixs.join("   ")} 」
│✾ ⋟ Criador: wa.me/559887583208
│✾ ⋟ Usuário: ${pushName}
│✾ ⋟ Tempo online: ${elapsedTimeFormatted}
│✾ ⋟ Github: http://bit.ly/45n6Own
╰═════════════ ⪨
`;
    sendVideo(sock, messageFrom, quoted, logo, { caption: text, gifPlayback: true });
}

function timeOn(elapsedTimeInSeconds) {
  const hours = Math.floor(elapsedTimeInSeconds / 3600);
  const minutes = Math.floor((elapsedTimeInSeconds % 3600) / 60);
  const seconds = elapsedTimeInSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

module.exports = infoBot;
