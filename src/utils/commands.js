const clc = require("cli-color");
const dateFormat = require("dateformat");

function printLogs(isGroup, sender, pushName, groupName, command) {
  console.log(`\n┌══════ « ${clc.bold(`Comando no ${isGroup ? "Grupo" : "Privado"}`)} » ══════➣`);
  console.log(`│ ⇝ ${isGroup ? `Grupo: ${clc.bold(groupName)}` : `Número: ${sender.split("@")[0]}`}`);
  console.log(`│ ⇝ Usuário: ${clc.bold(pushName)}`);
  console.log(`│ ⇝ Comando: ${clc.bold(command)}`);
  console.log(`│ ⇝ Data: ${clc.bold(dateFormat())}`);
  console.log("└══════════════════════════════════➣");
}

module.exports = { printLogs };
