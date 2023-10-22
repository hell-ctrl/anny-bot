const fs = require("fs");
const { sendText } = require("../../utils/message");

async function editBotFiles(sock, messageFrom, quoted, query) {
  try {
    const filePath = query.split("|")[0];
    const newFileContent = query.split("|")[1].replace("\n", "");
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);

    if (!fs.existsSync(filePath)) {
      return await sendText(sock, messageFrom, quoted, "Esse arquivo não existe :/");
    }

    if (!newFileContent) {
        return await sendText(sock, messageFrom, quoted, "Não vou adivinhar o que você quer mudar :|");
    }

    fs.writeFileSync(filePath, newFileContent);
    await sendText(sock, messageFrom, quoted, `O arquivo ${fileName} foi atualizado com sucesso ;)`);
  } catch {
    await sendText(sock, messageFrom, quoted, "Ocorreu um erro :/");
  }
}

module.exports = editBotFiles;
