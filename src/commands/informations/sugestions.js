const { sendVideo } = require("../../utils/message");
const fs = require("fs");
function sendSugestionToBotOwner(sock, pushName, quoted, sender, sugestion) {
  const text = `
📣 VOCÊ TEM UMA NOVA SUGESTÃO 📣

👤 Usuário: ${pushName}
🪀 Número: wa.me/${sender.split("@")[0]}

🚀 Sugestão: ${sugestion}
`;
  const logo = fs.readFileSync("./assets/logo.mp4");
  sendVideo(sock, "559887583208@s.whatsapp.net", quoted, logo, {caption: text, gifPlayback: true});
}

module.exports = sendSugestionToBotOwner;
