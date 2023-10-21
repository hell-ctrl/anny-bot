const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
            + 'VERSION:3.0\n' 
            + 'FN:Meu Dono\n' // full name
            + 'ORG:Anny Bot;\n' // the organization of the contact
            + 'TEL;type=CELL;type=VOICE;waid=559887583208:+55 98 8758-3208\n' // WhatsApp ID + phone number
            + 'END:VCARD'

module.exports = vcard