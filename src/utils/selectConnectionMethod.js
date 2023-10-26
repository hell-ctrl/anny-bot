const inquirer = require("inquirer");
const fs = require("fs");
const banner = require("./banner.js");

console.log(banner.string);

const questions = [
  {
    type: "list",
    name: "usePairingCode",
    message: "Selecione o método de conexão:",
    choices: [
      { name: "Conectar via Qr-Code", value: false },
      { name: "Conectar via Número (novo método)", value: true },
    ],
    default: false,
  },
];

async function selectConectionMethod() {
  const answers = await inquirer.prompt(questions);
  const usePairingCode = answers.usePairingCode;
  
  const connectionInfoSring = JSON.stringify({ usePairingCode });
  fs.writeFileSync("./src/connection/connectionInfo.json", connectionInfoSring);
}

selectConectionMethod();