function selectQuote(from, pushName, sender) {
  return {
    status_selo: {
      key: {
        fromMe: false,
        participant: `0@s.whatsapp.net`,
        ...(from ? { remoteJid: "status@broadcast" } : {}),
      },
      message: {
        imageMessage: {
          url: "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc",
          mimetype: "image/jpeg",
          caption: "👾 Anny Bot",
          fileSha256: "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=",
          fileLength: "28777",
          height: 1080,
          width: 1079,
          mediaKey: "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=",
          fileEncSha256: "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=",
          directPath:
            "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69",
          mediaKeyTimestamp: "1610993486",
        },
      },
    },

    contato_selo: {
      key: {
        fromMe: false,
        participant: `0@s.whatsapp.net`,
        ...(from ? { remoteJid: `status@broadcast` } : {}),
      },
      message: {
        contactMessage: {
          displayName: `${pushName}`,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;AKAME,;;;\nFN:AKAME,\nitem1.TEL;waid=${
            sender.split("@")[0]
          }:${sender.split("@")[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
          sendEphemeral: true,
        },
      },
    },

    document_selo: {
      key: { participant: "0@s.whatsapp.net" },
      message: { documentMessage: { title: `👾 Usuario: ${pushName}` } },
    },

    catalogo_selo: {
      key: {
        fromMe: false,
        participant: `0@s.whatsapp.net`,
        ...(from ? { remoteJid: "status@broadcast" } : {}),
      },
      message: {
        productMessage: {
          product: {
            productImage: { mimetype: "image/jpeg" },
            title: `👾 Usuario: ${pushName}`,
            description: "ngab",
            currencyCode: "IDR",
            priceAmount1000: "50000.000",
            retailerId: "Anny Bot",
            productImageCount: 0,
          },
          businessOwnerJid: `0@s.whatsapp.net`,
        },
      },
    },

    localizao_selo: {
      key: { participant: "0@s.whatsapp.net" },
      message: { liveLocationMessage: { caption: `👾 Usuario: ${pushName}` } },
    },

    gif_selo: {
      key: {
        fromMe: false,
        participant: `0@s.whatsapp.net`,
        ...(from ? { remoteJid: "status@broadcast" } : {}),
      },
      message: {
        videoMessage: {
          title: `👾 Usuario: ${pushName}`,
          h: `👾 Usuario: ${pushName}`,
          duration: "99999",
          gifPlayback: "true",
          caption: `👾 Usuario: ${pushName}`,
        },
      },
    },

    video_selo: {
      key: {
        fromMe: false,
        participant: `0@s.whatsapp.net`,
        ...(from ? { remoteJid: "status@broadcast" } : {}),
      },
      message: {
        videoMessage: {
          title: `👾 Usuario: ${pushName}`,
          h: `👾 Usuario: ${pushName}`,
          duration: "99999",
          caption: `👾 Usuario: ${pushName}`,
        },
      },
    },

    cart_selo: {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
      },
      message: {
        orderMessage: {
          itemCount: 99999,
          status: 200,
          surface: 200,
          message: `👾 Usuario ${pushName}`,
          orderTitle: "©Bot",
          sellerJid: "0@s.whatsapp.net",
        },
      },
      contextInfo: { forwardingScore: 999, isForwarded: true },
      sendEphemeral: true,
    },

    group_selo: {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "0@s.whatsapp.net",
      },
      message: {
        groupInviteMessage: {
          groupJid: "6288213840883-1616169743@g.us",
          inviteCode: "VERIFICADO",
          groupName: "BOT",
          caption: `👾 Anny Bot     Usuario: ${pushName} `,
        },
      },
    },

    audio_selo: {
      key: {
        fromMe: false,
        participant: `0@s.whatsapp.net`,
        ...(from ? { remoteJid: "556181496039-1613049930@g.us" } : {}),
      },
      message: {
        audioMessage: {
          mimetype: "audio/ogg; codecs=opus",
          seconds: "999",
          ptt: "true",
        },
      },
    },
  };
}

module.exports = selectQuote;