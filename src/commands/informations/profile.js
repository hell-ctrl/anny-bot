const fs = require("fs");
const { sendImage } = require("../../utils/message");
const { getBuffer } = require("../../utils/media");

function getRandomPercentage() {
  return Math.floor(Math.random() * 100);
}

function getRandomProgramValue() {
  return Math.floor(Math.random() * (10000 - 50 + 1)) + 50;
}

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


async function profile(sock, from, sender, quoted, pushName, userDevice, senderIsAdm, isGroup) {
  const userProfilePic = await getUserProfilePic(sock, sender);
  const bio = await getUserBio(sock, sender);

  const randomPutaPercentage = getRandomPercentage();
  const randomGostosuraPercentage = getRandomPercentage();
  const randomGadoPercentage = getRandomPercentage();
  const randomProgramValue = getRandomProgramValue();

  const text = `
👤「 INFORMAÇÕES PERFIL 」👤

🗣️ Usuário: *${pushName}*
📱 Dispositivo: *${userDevice}*
💭 Bio: *${bio}*
🏦 Instituição: *Anny Bank*
${isGroup? `⚙️ Administrador? ${senderIsAdm ? "*Sim ✅*" : "*Não ❌*"}\n` : ""}
⭐「 % PORCENTAGEM % 」⭐

😈 Nível de Puta: *${randomPutaPercentage}%*
🌜 Nível de Gostosura: *${randomGostosuraPercentage}%*
💋 Nível de Gado: *${randomGadoPercentage}%*
👅 Valor do Programa: *R$${randomProgramValue}*
`;

  await sendImage(sock, from, quoted, userProfilePic, text);
}

module.exports = profile;
