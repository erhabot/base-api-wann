const axios = require("axios");

function serialize(wann, m) {
  m.isGroup = m.key.remoteJid.endsWith("@g.us");
  try {
    const berak = Object.keys(m.message)[0];
    m.type = berak;
  } catch {
    m.type = null;
  }
  try {
    const context = m.message[m.type].contextInfo.quotedMessage;
    if (context["ephemeralMessage"]) {
      m.quotedMsg = context.ephemeralMessage.message;
    } else {
      m.quotedMsg = context;
    }
    m.isquotedMsg = true;
    m.quotedMsg.sender = m.message[m.type].contextInfo.participant;
    m.quotedMsg.fromMe =
      m.quotedMsg.sender === wann.user.id.split(":")[0] + "@s.whatsapp.net"
        ? true
        : false;
    m.quotedMsg.type = Object.keys(m.quotedMsg)[0];
    let ane = m.quotedMsg;
    m.quotedMsg.chats =
      ane.type === "conversation" && ane.conversation
        ? ane.conversation
        : ane.type == "imageMessage" && ane.imageMessage.caption
        ? ane.imageMessage.caption
        : ane.type == "documentMessage" && ane.documentMessage.caption
        ? ane.documentMessage.caption
        : ane.type == "videoMessage" && ane.videoMessage.caption
        ? ane.videoMessage.caption
        : ane.type == "extendedTextMessage" && ane.extendedTextMessage.text
        ? ane.extendedTextMessage.text
        : ane.type == "buttonsMessage" && ane.buttonsMessage.contentText
        ? ane.buttonsMessage.contentText
        : "";
    m.quotedMsg.id = m.message[m.type].contextInfo.stanzaId;
  } catch {
    m.quotedMsg = null;
    m.isquotedMsg = false;
  }

  try {
    const mention = m.message[m.type].contextInfo.mentionedJid;
    m.mentioned = mention;
  } catch {
    m.mentioned = [];
  }

  if (m.isGroup) {
    m.sender = m.participant;
  } else {
    m.sender = m.key.remoteJid;
  }
  if (m.key.fromMe) {
    m.sender = wann.user.id.split(":")[0] + "@s.whatsapp.net";
  }

  m.from = m.key.remoteJid;
  m.now = m.messageTimestamp;
  m.fromMe = m.key.fromMe;

  return m;
}

function runtime(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);
  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

function toUpper(query) {
  const arr = query.split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return arr.join(" ");
}

async function getBuffer(url, options) {
  try {
    options ? options : {};
    const res = await axios({
      method: "get",
      url,
      headers: {
        DNT: 1,
        "Upgrade-Insecure-Request": 1,
      },
      ...options,
      responseType: "arraybuffer",
    });
    return res.data;
  } catch (e) {
    console.log(`Error : ${e}`);
  }
}

function shuffle(array, jumlah) {
  const dataAcak = array.sort(() => 0.5 - Math.random()).slice(0, jumlah);
  return dataAcak;
}

module.exports = {
  serialize,
  runtime,
  toUpper,
  getBuffer,
  shuffle,
};
