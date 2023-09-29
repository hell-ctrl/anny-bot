const { downloadContentFromMessage } = require("@whiskeysockets/baileys")
const cfonts = require("cfonts");
const mimetype = require("mime-types");
const _ = require("lodash");
const fetch = require("node-fetch")

const getBuffer = async (url) => {
 let response = await fetch(url, {
    method: "get",
     body: null,
  });

   let media = await response.buffer();
  return media;
};


const getFileBuffer = async (mediakey, MediaType) => { 
  const stream = await downloadContentFromMessage(mediakey, MediaType)

  console.log(stream)
  
  let buffer = Buffer.from([])
  for await(let chunk of stream) {
  buffer = Buffer.concat([buffer, chunk])
  }
  return buffer
}

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

const getExtension = async (type) => {
  return await mimetype.extension(type);
};

const getRandom = (value) => {
  return _.random(value, 10000);
};

module.exports = { banner, getExtension, getRandom, getBuffer, getFileBuffer };
