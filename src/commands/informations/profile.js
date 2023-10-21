const fs = require("fs");
const { sendImage } = require("../../utils/message");
const { getBuffer } = require("../../utils/media");

async function getUserProfilePic(sock, sender) {
  try {
    const userProfilePicUrl = await sock.profilePictureUrl(sender, "image");
    return await getBuffer(userProfilePicUrl);
  } catch {
    return fs.readFileSync("./assets/profile.jpeg");
  }
}

async function getUserBio(sock, sender) {
  try {
    const statusData = await sock.fetchStatus(sender);
    return statusData.status;
  } catch {
    return "";
  }
}

async function profile(sock, messageFrom, sender, quoted, pushName, userDevice, senderIsAdm, isGroup) {
  const [userProfilePic, userBio] = await Promise.all([
    await getUserProfilePic(sock, sender),
    await getUserBio(sock, sender),
  ]);

  const text = `
👤「 INFORMAÇÕES PERFIL 」👤

🗣️ Usuário: *${pushName}*
📱 Dispositivo: *${userDevice}*
💭 Bio: *${userBio}*
🏦 Instituição: *Anny Bank*
${isGroup ? `⚙️ Administrador? ${senderIsAdm ? "*Sim ✅*" : "*Não ❌*"}\n` : ""}
⭐「 % PORCENTAGEM % 」⭐

😈 Nível de Puta: *${Math.floor(Math.random() * 100)}%*
🌜 Nível de Gostosura: *${Math.floor(Math.random() * 100)}%*
💋 Nível de Gado: *${Math.floor(Math.random() * 100)}%*
👅 Valor do Programa: *R${Math.floor(Math.random() * (10000 - 50 + 1)) + 50}*
`;

  await sendImage(sock, messageFrom, quoted, userProfilePic, text);
}

module.exports = profile;
