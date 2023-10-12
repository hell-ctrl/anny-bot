const axios = require("axios");
const fs = require("fs");
const cheerio = require("cheerio");
const FormData = require("form-data");

async function webpToMp4(path) {
  try {
    // Passo 1: Fazer a primeira requisição para obter o valor do arquivo
    const form1 = new FormData();
    form1.append("new-image-url", "");
    form1.append("new-image", fs.createReadStream(path));

    const response1 = await axios.post("https://s6.ezgif.com/webp-to-mp4", form1, {
      headers: {
        ...form1.getHeaders(),
      },
    });

    const $1 = cheerio.load(response1.data);
    const file = $1('input[name="file"]').attr("value");

    // Passo 2: Fazer a segunda requisição para converter o arquivo
    const form2 = new FormData();
    form2.append("file", file);
    form2.append("convert", "converter!");

    const response2 = await axios.post(`https://ezgif.com/webp-to-mp4/${file}`, form2, {
      headers: {
        ...form2.getHeaders(),
      },
    });

    const $2 = cheerio.load(response2.data);
    const resultado =
      "https:" + $2("div#output > p.outfile > video > source").attr("src");

    return {
      status: true,
      msg: "Criado By Alizin",
      resultado: resultado,
    };
  } catch (error) {
    return {
      status: false,
      msg: "Erro na conversão",
      error: error.message,
    };
  }
}

module.exports = webpToMp4;
