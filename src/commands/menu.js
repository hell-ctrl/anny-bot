function menu(pushName, prefix) {
    return `
╭══════════════ ⪩
│き⃟ℹ️ 𝐈𝐍𝐅𝐎-𝐁𝐎𝐓/𝐔𝐒𝐄𝐑 ❈⃟ℹ️
│✾ ⋟ Bot: Anny Bot
│✾ ⋟ Prefixo:「 ${prefix} 」
│✾ ⋟ Usuário: ${pushName}
╰╦═════════════ ⪨
╭┤ き⃟☯️ 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐕𝐎𝐒 ❈⃟⃟☯️
┃│✾ ⋟ ${prefix}criador
┃│✾ ➥ número do criador do bot
┃│✾ ⋟ ${prefix}infobot
┃│✾ ➥ informações do bot
┃│✾ ⋟ ${prefix}sugestao (sugestão)
┃│✾ ➥ me envie uma sugestão 
┃│✾ ⋟ ${prefix}perfil
┃│✾ ➥ informaçoes do seu perfil
┃╰══ ⪨
╰═════════════ ⪨
`
}

module.exports = menu;