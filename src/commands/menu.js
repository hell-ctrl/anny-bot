const { botName } = require("../configs/info.json")

function menu(pushName, isGroup, groupName, prefix) {
    return `
╔══════════════ ⍨
║ 🤖 Bot: ${botName}
║ 📌 Prefixo:「 ${prefix} 」
║ 👤 Usuário: ${pushName} ${isGroup ? `\n║ 👥 Grupo: ${groupName}`: ""}
╚╦═════════════ ⍨
╭╜
│❗ INFORMATIVO ❗
│
│ ➤ ${prefix}criador
│ ➥ número do criador do bot
│ ➤ ${prefix}infobot
│ ➥ informações do bot
│ ➤ ${prefix}sugestao (sugestão)
│ ➥ me envie uma sugestão 
│ ➤ ${prefix}perfil
│ ➥ informaçoes do seu perfil
│
├══════════════ ⍨
│  🚀 DONO 🚀
│
│ ➤ ${prefix}editar_arquivo
│ ➥ edita um arquivo do bot.
│
├══════════════ ⍨
│ ✨ FIGURINHAS ✨
│
│ ➤ ${prefix}fig
│ ➥ cria uma fig de uma imagem/video
│ ➤ ${prefix}toimg
│ ➥ tranforma uma figurinha em imagem.
│ ➤ ${prefix}togif
│ ➥ tranforma uma figurinha em gif.
│
├══════════════ ⍨
│ 🌐 DOWNLOADS 🌐 
│
│ ➤ ${prefix}play_video (nome)
│ ➥ baixa um vídeo do youtube.
│ ➤ ${prefix}play_audio (nome)
│ ➥ baixa um áudio do youtube.
│ ➤ ${prefix}ig_dl (url)
│ ➥ baixa vídeo do instagram.
│ ➤ ${prefix}tkk_dl (url)
│ ➥ baixa vídeo do tico teco.
│
╰══════════════ ⍨
`
}

module.exports = menu;