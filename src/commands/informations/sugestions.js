const { botOwner } = require("../../configs/info.json");
const { sendVideo } = require("../../utils/message");
const fs = require("fs");

async function sendSugestionToBotOwner(sock, pushName, quoted, sender, sugestion) {
  const text = `
📣 NOVA SUGESTÃO 📣

👤 Usuário: ${pushName}
🪀 Número: wa.me/${sender.split("@")[0]}

🚀 Sugestão: ${sugestion}
`;
  const logo = fs.readFileSync("./assets/logo.mp4");
  await sendVideo(sock, `${botOwner}@s.whatsapp.net`, quoted, logo, {caption: text, gifPlayback: true});
}

module.exports = sendSugestionToBotOwner;
