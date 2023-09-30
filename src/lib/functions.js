const cfonts = require("cfonts");
const _ = require("lodash");


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


module.exports = { banner };
