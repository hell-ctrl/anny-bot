const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const cfonts = require("cfonts");
const _ = require("lodash");

const getFileBuffer = async (mediakey, MediaType) => {
  const stream = await downloadContentFromMessage(mediakey, MediaType);
  let buffer = Buffer.from([]);
  for await (let chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }
  return buffer;
};

const banner = cfonts.render("Anny", {
  font: "tiny",
  align: "center",
  colors: _.shuffle(["red", "cyan", "yellow", "gray"]),
  background: "transparent",
  letterSpacing: 2,
  lineHeight: 2,
  space: true,
  maxLength: "0",
  gradient: false,
  independentGradient: false,
  transitionGradient: false,
  env: "node",
});


module.exports = { banner, getFileBuffer };
