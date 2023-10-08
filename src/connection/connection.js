const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");
const clc = require("cli-color");
const { banner } = require("./banner.js");

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState(
    "./src/connection/auth"
  );

  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === "open") {
        console.log(banner.string);
        console.log(`${clc.red("➜")} ${clc.yellowBright("conectado a anny")}`)
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}

module.exports = connectToWhatsApp;
