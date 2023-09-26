const cfonts = require("cfonts");
const mimetype = require("mime-types");
const _ = require("lodash");

// const getBuffer = async (url) => {
//   let response = await fetch(url, {
//     method: "get",
//     body: null,
//   });

//   let media = await response.buffer();
//   return media;
// };

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

module.exports = { banner, getExtension, getRandom };
