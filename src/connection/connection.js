const { default: makeWASocket, fetchLatestBaileysVersion, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const pino = require("pino");
const NodeCache = require("node-cache");
const readline = require("readline");
const clc = require("cli-color");
const banner = require("../utils/banner");

const msgRetryCounterCache = new NodeCache();
const usePairingCode = process.argv.includes("--use-pairing-code")

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
});

const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function connectToWhatsApp() {
   let { state, saveCreds } = await useMultiFileAuthState("./src/connection/auth");
   let { version } = await fetchLatestBaileysVersion();

   const sock = makeWASocket({
      version,
      logger: pino({level: "silent"}),
      printQRInTerminal: !usePairingCode,
      mobile: false,
      browser: ["FireFox (linux)"],
      auth: state,
      msgRetryCounterCache,
   });

   if (usePairingCode && !sock.authState.creds.registered) {
      const phoneNumber = await question(`\nDigite seu número do WhatsApp:\nEx: ${clc.bold("559885512460")}\n/> `);
      const code = await sock.requestPairingCode(phoneNumber);
      console.log(`Seu código de conexão é: ${clc.bold(code)}\n`);
      console.log(`Abra seu WhatsApp, vá em ${clc.bold("Aparelhos Conectados > Conectar um novo Aparelho > Conectar usando Número.")}`)
   }

   sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === "open") {
        console.log(banner.string);
        console.log(`${clc.red("➜")} ${clc.yellowBright("conectado a anny")}`);
    }
  });

  sock.ev.on("creds.update", saveCreds);
  rl.close()
  return sock;
}

module.exports = connectToWhatsApp;
