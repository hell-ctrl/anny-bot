const cfonts = require("cfonts");
const _ = require("lodash");
const { botName } = require("../configs/info.json");


const banner = cfonts.render(botName, {
  font: "tiny",
  align: "center",
  colors: _.shuffle(["red", "cyan", "yellow", "green"]),
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


module.exports = banner;
