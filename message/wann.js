"use strict";
const { getContentType } = require("@whiskeysockets/baileys");
const chalk = require("chalk");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta").locale("id");
const rh = require("api-wann");
const util = require("util");
const { exec } = require("child_process");

const { color } = require("../lib/func");
const { runtime, toUpper, getBuffer } = require("../lib/function");

let mess = JSON.parse(fs.readFileSync("./message/mess.json"));

module.exports = async (wann, m) => {
  try {
    const { ownerNumber, botName } = require("../config.json");
    const from = m.key.remoteJid;
    const pushName = m.pushName;
    const reply = m.reply;
    const isBroadcast = m.broadcast ? true : false;
    const isBaileys = m.isBaileys ? true : false;
    const isFromMe = m.fromMe ? true : false;
    const isGroup = m.isGroup ? true : false;
    let sender = isGroup ? m.key.participant : m.key.remoteJid;
    sender = sender.includes(":")
      ? sender.split(":")[0] + "@s.whatsapp.net"
      : sender;
    const senderNumber = sender.split("@")[0];
    const isOwner = ownerNumber + "@s.whatsapp.net" === sender ? true : false;
    const botNumber = await wann.decodeJid(wann.user.id);
    const body =
      (m.mtype === "conversation" && m.message.conversation) ||
      (m.mtype === "imageMessage" && m.message.imageMessage.caption) ||
      (m.mtype === "documentMessage" && m.message.documentMessage.caption) ||
      (m.mtype === "videoMessage" && m.message.videoMessage.caption) ||
      (m.mtype === "extendedTextMessage" &&
        m.message.extendedTextMessage.text) ||
      (m.mtype === "buttonsResponseMessage" &&
        m.message.buttonsResponseMessage.selectedButtonId) ||
      (m.mtype === "templateButtonReplyMessage" &&
        m.message.templateButtonReplyMessage.selectedId)
        ? (m.mtype === "conversation" && m.message.conversation) ||
          (m.mtype === "imageMessage" && m.message.imageMessage.caption) ||
          (m.mtype === "documentMessage" &&
            m.message.documentMessage.caption) ||
          (m.mtype === "videoMessage" && m.message.videoMessage.caption) ||
          (m.mtype === "extendedTextMessage" &&
            m.message.extendedTextMessage.text) ||
          (m.mtype === "buttonsResponseMessage" &&
            m.message.buttonsResponseMessage.selectedButtonId) ||
          (m.mtype === "templateButtonReplyMessage" &&
            m.message.templateButtonReplyMessage.selectedId)
        : "";
    const budy = typeof m.text === "string" ? m.text : "";
    const prefixRegex = /^[°zZ#@+,.?=''():√%!¢£¥€π¤ΠΦ_&<™©®Δ^βα~¦|/\\©^]/;
    const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : ".";
    const args = body.trim().split(/ +/).slice(1);
    let q = args.join(" ");
    const isCmd = body.startsWith(prefix);
    const command = isCmd
      ? body.slice(prefix.length).trim().split(" ").shift().toLowerCase()
      : "";
    const gaya = "```";

    // QUOTED
    const type = getContentType(m.message);
    const isImage = type == "imageMessage";
    const isVideo = type == "videoMessage";
    const isAudio = type == "audioMessage";
    const isSticker = type == "stickerMessage";
    const isContact = type == "contactMessage";
    const isLocation = type == "locationMessage";
    const isQuoted = type == "extendedTextMessage";

    const quotedType =
      getContentType(
        m.message?.extendedTextMessage?.contextInfo?.quotedMessage
      ) || null;
    const isQuotedImage = isQuoted && quotedType == "imageMessage";
    const isQuotedVideo = isQuoted && quotedType == "videoMessage";
    const isQuotedAudio = isQuoted && quotedType == "audioMessage";
    const isQuotedSticker = isQuoted && quotedType == "stickerMessage";
    const isQuotedContact = isQuoted && quotedType == "contactMessage";
    const isQuotedLocation = isQuoted && quotedType == "locationMessage";

    const time = moment().tz("Asia/Jakarta").format("HH:mm:ss");
    const groupMetadata = isGroup ? await wann.groupMetadata(from) : null;
    const groupName = groupMetadata?.subject || "";

    // TERMINAL CMD
    if (!isGroup && isCmd)
      console.log(
        chalk.greenBright(`[ ${botName} ]`),
        chalk.yellowBright(`${time}`),
        color(`${prefix + command} [${args.length}]`, "white"),
        chalk.greenBright(`from ${senderNumber}`)
      );
    if (isGroup && isCmd)
      console.log(
        chalk.greenBright(`[ ${botName} ]`),
        chalk.yellowBright(`${time}`),
        color(`${prefix + command} [${args.length}]`, "white"),
        chalk.greenBright(`from ${senderNumber}`),
        color("in", "white"),
        chalk.yellowBright(groupName)
      );

    // COMMAND
    switch (command) {
      case "menu":
      case "menuall":
      case "help":
      case "fitur":
        let menu = {
          main: ["help", "remini", "ai", "quickchat", "ttp"],
          islami: [
            "jadwalshalat",
            "niatshalat",
            "surah",
            "doaharian",
            "hadist",
            "kisahnabi",
          ],
          unduh: ["tiktok", "igstory", "threads"],
          owner: ["runtime", "eval", "exec"],
          other: [
            "jadwalbola",
            "infogempa",
            "covidworld",
            "covidindo",
            "covidcountry",
            "comicslogo",
            "runnerlogo",
            "starwarslogo",
            "stylelogo",
            "waterlogo",
            "styletext",
          ],
        };
        let teksMenu = `Halo kak @${
          m.sender.split`@`[0]
        }, ini menu masih sedikit.\n\n*Total :* ${Object.values(menu)
          .map((a) => a.length)
          .reduce((total, num) => total + num, 0)}\n\n`;
        Object.entries(menu)
          .map(([type, command]) => {
            teksMenu += `┌──⭓ *${toUpper(type)} Menu*\n`;
            teksMenu += `│⎚ ${command
              .map((a) => `${prefix + a}`)
              .join("\n│⎚ ")}\n`;
            teksMenu += "└───────⭓\n\n";
          })
          .join("\n\n");
        await wann.sendMessage(
          from,
          { text: teksMenu, mentions: [m.sender] },
          { quoted: m }
        );
        break;
      case "hd":
      case "hdr":
      case "remini":
        if (isImage || isQuotedImage) {
          let media = await wann.downloadMediaMessage(
            "image",
            "./media/remini.jpg"
          );
          let link = await rh.TelegraPh(media);
          reply(mess.wait);
          await rh
            .remini(link.result.link)
            .then(async (res) => {
              await wann.sendMessage(
                from,
                { image: { url: res.data.result }, caption: "¯\\_(ツ)_/¯" },
                { quoted: m }
              );
            })
            .catch((err) => {
              console.error(chalk.redBright("Error:"), err);
              reply(mess.error.api);
            });
          await fs.unlinkSync("./media/remini.jpg");
        } else {
          reply(
            `Kirim gambar dengan caption ${
              prefix + command
            } atau tag media yang sudah dikirim`
          );
        }
        break;
      case "jadwalbola":
        await rh
          .sepakBola()
          .then((res) => {
            let txt = `${res.result[0]}\n\n`;
            txt += `${res.result[1]}\n\n`;
            txt += `${res.result[2]}\n\n`;
            txt += `${res.result[3]}\n\n`;
            txt += `${res.result[4]}\n\n`;
            txt += `${res.result[5]}\n\n`;
            txt += `${res.result[6]}\n\n`;
            txt += `${res.result[7]}\n\n`;
            txt += `${res.result[8]}\n\n`;
            txt += `${res.result[9]}\n\n`;
            txt += `${res.result[10]}\n\n`;
            txt += `${res.result[11]}\n\n`;
            txt += `${res.result[12]}\n\n`;
            txt += `${res.result[13]}\n\n`;
            txt += `${res.result[14]}\n\n`;
            txt += `${res.result[15]}\n\n`;
            txt += `${res.result[16]}\n\n`;
            txt += `${res.result[17]}\n\n`;
            txt += `${res.result[18]}\n\n`;
            txt += `${res.result[19]}`;
            reply(txt);
          })
          .catch((err) => {
            console.error(chalk.redBright("Error:"), err);
            reply(mess.error.api);
          });
        break;
      case "infogempa":
      case "gempa":
        await rh
          .infoGempa()
          .then((res) => {
            let txt = "*Info Gempa*\n\n";
            for (let i = 0; i < res.result.length; i++) {
              txt += `Waktu : ${res.result[i].waktu}\n`;
              txt += `Lintang : ${res.result[i].lintang}\n`;
              txt += `Magnitudo : ${res.result[i].magnitudo}\n`;
              txt += `Kedalaman : ${res.result[i].kedalaman}\n`;
              txt += `Wilayah : ${res.result[i].wilayah}\n`;
              txt += `Wilayah dirasakan : ${res.result[i].wilayah_dirasakan}\n`;
              txt += `Gambar Map : ${res.result[i].img_map}\n`;
              txt += `Google Map : ${res.result[i].google_map}\n\n`;
            }
            reply(txt);
          })
          .catch((err) => {
            console.error(chalk.redBright("Error:"), err);
            reply(mess.error.api);
          });
        break;
      case "covidworld":
        await rh
          .covidWorld()
          .then((res) => {
            let txt = "*Covid World*\n\n";
            txt += `Total Cases : ${res.result.total_cases}\n`;
            txt += `Recovered : ${res.result.recovered}\n`;
            txt += `Deaths : ${res.result.deaths}\n`;
            txt += `Active Cases : ${res.result.active_cases}\n`;
            txt += `Closed Cases : ${res.result.closed_cases}\n`;
            txt += `Last Update : ${res.result.last_update}`;
            reply(txt);
          })
          .catch((err) => {
            console.error(chalk.redBright("Error:"), err);
            reply(mess.error.api);
          });
        break;
      case "covidindo":
        await rh
          .covidIndo()
          .then((res) => {
            let txt = "*Covid Indo*\n\n";
            txt += `Total Cases : ${res.result.total_cases}\n`;
            txt += `Recovered : ${res.result.recovered}\n`;
            txt += `Deaths : ${res.result.deaths}\n`;
            txt += `Last Update : ${res.result.last_update}\n`;
            txt += `Info : ${res.result.info}`;
            reply(txt);
          })
          .catch((err) => {
            console.error(chalk.redBright("Error:"), err);
            reply(mess.error.api);
          });
        break;
      case "covidcountry":
        if (!q) return reply(`Contoh: ${prefix + command} Indonesia`);
        var query = q.toLowerCase();
        await rh
          .covidCountry(query)
          .then((res) => {
            let txt = `*Covid ${toUpper(query)}*\n\n`;
            txt += `Total Cases : ${res.result.total_cases}\n`;
            txt += `Recovered : ${res.result.recovered}\n`;
            txt += `Deaths : ${res.result.deaths}\n`;
            txt += `Last Update : ${res.result.last_update}\n`;
            txt += `Info : ${res.result.info}`;
            reply(txt);
          })
          .catch((err) => {
            console.error(chalk.redBright("Error:"), err);
            reply(mess.error.api);
          });
        break;
      case "ttp":
        if (!q) return reply(`Contoh: ${prefix + command} ${botName}`);
        var response = await rh.ttp(q);
        const linkTTP = response.result.link;
        let bufTTP = await getBuffer(linkTTP);
        fs.writeFileSync(`./media/${sender}.png`, bufTTP);
        var media = `./media/${sender}.png`;
        await ffmpeg(`${media}`)
          .input(media)
          .on("start", function (cmd) {})
          .on("error", function (err) {
            fs.unlinkSync(media);
            reply(mess.error.api);
          })
          .on("end", function () {
            exec(
              `webpmux -set exif ./media/data.exif ./media/${sender}.webp -o ./media/${sender}.webp`,
              async (error) => {
                if (error) return reply(mess.error.api);
                wann.sendMessage(
                  from,
                  { sticker: fs.readFileSync(`./media/${sender}.webp`) },
                  { quoted: m }
                );
                fs.unlinkSync(media);
                fs.unlinkSync(`./media/${sender}.webp`);
              }
            );
          })
          .addOutputOptions([
            `-vcodec`,
            `libwebp`,
            `-vf`,
            `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
          ])
          .toFormat("webp")
          .save(`./media/${sender}.webp`);
        break;
      case "comicslogo":
        if (!q) return reply(`Contoh: ${prefix + command} ${botName}`);
        await rh.comicsLogo(q).then((res) => {
          wann.sendMessage(
            from,
            { image: { url: res.result.data }, caption: "¯\\_(ツ)_/¯" },
            { quoted: m }
          );
        });
        break;
      case "runnerlogo":
        if (!q) return reply(`Contoh: ${prefix + command} ${botName}`);
        await rh.runnerLogo(q).then((res) => {
          wann.sendMessage(
            from,
            { image: { url: res.result.data }, caption: "¯\\_(ツ)_/¯" },
            { quoted: m }
          );
        });
        break;
      case "starwarslogo":
        if (!q) return reply(`Contoh: ${prefix + command} ${botName}`);
        await rh.starWarsLogo(q).then((res) => {
          wann.sendMessage(
            from,
            { image: { url: res.result.data }, caption: "¯\\_(ツ)_/¯" },
            { quoted: m }
          );
        });
        break;
      case "stylelogo":
        if (!q) return reply(`Contoh: ${prefix + command} ${botName}`);
        await rh.styleLogo(q).then((res) => {
          wann.sendMessage(
            from,
            { image: { url: res.result.data }, caption: "¯\\_(ツ)_/¯" },
            { quoted: m }
          );
        });
        break;
      case "waterlogo":
        if (!q) return reply(`Contoh: ${prefix + command} ${botName}`);
        await rh.waterLogo(q).then((res) => {
          wann.sendMessage(
            from,
            { image: { url: res.result.data }, caption: "¯\\_(ツ)_/¯" },
            { quoted: m }
          );
        });
        break;
      case "styletext":
        if (!q) return reply(`Contoh: ${prefix + command} ${botName}`);
        await rh.styleText(q).then((res) => {
          let txt = `Style Text ${q.toUpperCase()}\n\n`;
          for (let i = 0; i < res.result.length; i++) {
            txt += `${res.result[i].text}\n`;
          }
          reply(txt);
        });
        break;
      // UNDUH
      case "tiktok":
      case "tt":
      case "ttdl":
        if (!q)
          return reply(
            `Contoh: ${prefix + command} https://vt.tiktok.com/ZSeCw9xb2/`
          );
        await rh.tiktok(q).then(async (res) => {
          reply(mess.wait);
          let caption = `${res.result.title}\n`;
          caption += `${res.result.author}`;
          await wann.sendMessage(
            from,
            { video: { url: res.result.nowm }, caption },
            { quoted: m }
          );
        });
        break;
      case "igs":
      case "igstory":
        if (!q)
          return reply(
            `Contoh: ${
              prefix + command
            } https://www.instagram.com/stories/windaadeliaa/3392075791793122848?utm_source=ig_story_item_share&igsh=bXc3ZzRycXZ2Ynln`
          );
        if (!q.includes("https://www.instagram.com/stories/"))
          return reply(
            `Contoh: ${
              prefix + command
            } https://www.instagram.com/stories/windaadeliaa/3392075791793122848?utm_source=ig_story_item_share&igsh=bXc3ZzRycXZ2Ynln`
          );
        try {
          var data = await rh.igStory(q);
          var url = data.result.url;
          reply(mess.wait);
          await wann.sendMessage(from, { video: { url } }, { quoted: m });
        } catch (e) {
          return reply("Hanya support video !");
        }
        break;
      case "threads":
        if (!q)
          return reply(
            `Contoh: ${
              prefix + command
            } https://www.threads.net/@al_barizi/post/C8CNZyTyDBy`
          );
        if (!q.includes("https://www.threads.net/"))
          return reply(
            `Contoh: ${
              prefix + command
            } https://www.threads.net/@al_barizi/post/C8CNZyTyDBy`
          );
        var data = await rh.threads(q);
        var imageUrl = data.result[0];
        if (imageUrl) {
          reply(mess.wait);
          await wann.sendMessage(
            from,
            { image: { url: imageUrl }, caption: "¯\\_(ツ)_/¯" },
            { quoted: m }
          );
        } else {
          reply(mess.wait);
          await wann.sendMessage(
            from,
            { video: { url: data.result.download_url } },
            { quoted: m }
          );
        }
        break;
      //
      case "qc":
      case "bubblechat":
      case "quickchat":
        if (isQuoted) {
          let text = `${m.quoted.text}`;
          let name = `${encodeURIComponent(m.quoted.sender.split("@")[0])}`;
          try {
            var avatar = await wann.profilePictureUrl(m.quoted.sender, "image");
          } catch {
            var avatar =
              "https://ui-avatars.com/api/?name=" +
              name +
              "&format=png&bold=true&size=512&length=1&background=random&color=#FFFFFF&w=32&q=75&rounded=true";
          }
          let qcImage;
          await rh
            .quote(text, name, avatar)
            .then((res) => {
              qcImage = res.result.link;
            })
            .catch((err) => {
              throw new Error(err.message);
            });
          let qcPng = await getBuffer(qcImage);
          fs.writeFileSync(`./media/${sender}.png`, qcPng);
          var media = `./media/${sender}.png`;
          await ffmpeg(`${media}`)
            .input(media)
            .on("start", function (cmd) {})
            .on("error", function (err) {
              fs.unlinkSync(media);
              reply(mess.error.api);
            })
            .on("end", function () {
              exec(
                `webpmux -set exif ./media/data.exif ./media/${sender}.webp -o ./media/${sender}.webp`,
                async (error) => {
                  if (error) return reply(mess.error.api);
                  wann.sendMessage(
                    from,
                    { sticker: fs.readFileSync(`./media/${sender}.webp`) },
                    { quoted: m }
                  );
                  fs.unlinkSync(media);
                  fs.unlinkSync(`./media/${sender}.webp`);
                }
              );
            })
            .addOutputOptions([
              `-vcodec`,
              `libwebp`,
              `-vf`,
              `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
            ])
            .toFormat("webp")
            .save(`./media/${sender}.webp`);
        } else {
          try {
            var avatar = await wann.profilePictureUrl(sender, "image");
          } catch {
            var avatar =
              "https://ui-avatars.com/api/?name=" +
              pushName +
              "&format=png&bold=true&size=512&length=1&background=random&color=#FFFFFF&w=32&q=75&rounded=true";
          }
          let qcImage;
          await rh
            .quote(q, pushName, avatar)
            .then((res) => {
              qcImage = res.result.link;
            })
            .catch((err) => {
              throw new Error(err.message);
            });
          let qcPng = await getBuffer(qcImage);
          fs.writeFileSync(`./media/${sender}.png`, qcPng);
          var media = `./media/${sender}.png`;
          await ffmpeg(`${media}`)
            .input(media)
            .on("start", function (cmd) {})
            .on("error", function (err) {
              fs.unlinkSync(media);
              reply(mess.error.api);
            })
            .on("end", function () {
              exec(
                `webpmux -set exif ./media/data.exif ./media/${sender}.webp -o ./media/${sender}.webp`,
                async (error) => {
                  if (error) return reply(mess.error.api);
                  wann.sendMessage(
                    from,
                    { sticker: fs.readFileSync(`./media/${sender}.webp`) },
                    { quoted: m }
                  );
                  fs.unlinkSync(media);
                  fs.unlinkSync(`./media/${sender}.webp`);
                }
              );
            })
            .addOutputOptions([
              `-vcodec`,
              `libwebp`,
              `-vf`,
              `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
            ])
            .toFormat("webp")
            .save(`./media/${sender}.webp`);
        }
        break;
      // ISLAMI
      case "jadwalshalat":
        if (!q) return reply(`Contoh: ${prefix + command} Medan`);
        await rh
          .jadwalShalat(q)
          .then((res) => {
            let txt = `${gaya}Lokasi  : ${res.result.lokasi}${gaya}\n`;
            txt += `${gaya}Daerah  : ${res.result.daerah}${gaya}\n`;
            txt += `${gaya}Imsak   : ${res.result.jadwal.imsak}${gaya}\n`;
            txt += `${gaya}Subuh   : ${res.result.jadwal.subuh}${gaya}\n`;
            txt += `${gaya}Terbit  : ${res.result.jadwal.terbit}${gaya}\n`;
            txt += `${gaya}Dhuha   : ${res.result.jadwal.dhuha}${gaya}\n`;
            txt += `${gaya}Dzuhur  : ${res.result.jadwal.dzuhur}${gaya}\n`;
            txt += `${gaya}Ashar   : ${res.result.jadwal.ashar}${gaya}\n`;
            txt += `${gaya}Maghrib : ${res.result.jadwal.maghrib}${gaya}\n`;
            txt += `${gaya}Isya    : ${res.result.jadwal.isya}${gaya}`;
            reply(txt);
          })
          .catch((err) => {
            console.error(chalk.redBright("Error:"), err);
            reply(mess.error.api);
          });
        break;
      case "niatshalat":
        if (!q) return reply(`Contoh: ${prefix + command} Subuh`);
        await rh
          .niatShalat(q)
          .then((res) => {
            let txt = `*Niat Shalat ${res.result.shalat}*\n\n`;
            txt += `${res.result.arabic}\n\n`;
            txt += `_${res.result.latin}_\n\n`;
            txt += `${res.result.translation}`;
            reply(txt);
          })
          .catch((err) => {
            console.error(chalk.redBright("Error:"), err);
            reply(mess.error.api);
          });
        break;
      case "surah":
        if (!Number(q)) return reply(`Contoh: ${prefix + command} 1`);
        if (Number(q) < 1) return reply(`Contoh: ${prefix + command} 1`);
        if (Number(q) > 114) return reply(`Contoh: ${prefix + command} 1`);
        await rh
          .surah(q)
          .then((res) => {
            let txt = `\n`;
            for (let i of res.surah) {
              txt += `${i.arab}\n`;
              txt += `_${i.latin}_\n`;
              txt += `${i.indo}\n\n`;
            }
            reply(txt);
          })
          .catch((err) => {
            console.error(chalk.redBright("Error:"), err);
            reply(mess.error.api);
          });
        break;
      case "doaharian":
        if (!Number(q))
          return reply(
            `Doa harian yang tersedia:\n${mess.doaHarian.list}\n\nContoh: ${
              prefix + command
            } 1`
          );
        if (Number(q) < 1)
          return reply(
            `Doa harian yang tersedia:\n${mess.doaHarian.list}\n\nContoh: ${
              prefix + command
            } 1`
          );
        if (Number(q) > 35)
          return reply(
            `Doa harian yang tersedia:\n${mess.doaHarian.list}\n\nContoh: ${
              prefix + command
            } 1`
          );
        await rh
          .doaHarian(q)
          .then((res) => {
            let txt = `*${res.result.title}*\n\n`;
            txt += `${res.result.arabic}\n`;
            txt += `_${res.result.latin}_\n\n`;
            txt += `${res.result.translation}`;
            reply(txt);
          })
          .catch((err) => {
            console.error(chalk.redBright("Error:"), err);
            reply(mess.error.api);
          });
        break;
      case "hadist":
        if (!q)
          return reply(
            mess.imamHadist.list +
              "\n\nContoh: " +
              prefix +
              command +
              " Bukhari 1"
          );
        const namaImam = q.split(" ")[0];
        const noHadist = q.split(" ")[1];
        if (!Number(noHadist))
          return reply(
            mess.imamHadist.list +
              "\n\nContoh: " +
              prefix +
              command +
              " Bukhari 1"
          );
        await rh
          .hadist(namaImam, noHadist)
          .then((res) => {
            let txt = `*${res.result.title.split(" sent.")[0]}*\n\n`;
            txt += `${res.result.arab}\n\n`;
            txt += `${res.result.id}`;
            reply(txt);
          })
          .catch((err) => {
            console.error(chalk.redBright("Error:"), err);
            reply(mess.error.api);
          });
        break;
      case "kisahnabi":
        if (!q) return reply(`Contoh: ${prefix + command} Muhammad`);
        await rh
          .kisahNabi(q)
          .then((res) => {
            let txt = `*${res.result.no_urut}. ${res.result.name}*\n\n`;
            txt += `${res.result.description}`;
            reply(txt);
          })
          .catch((err) => {
            console.error(chalk.redBright("Error:"), err);
            reply(mess.error.api);
          });
        break;
      // OPENAI
      case "ai":
        if (!q) return reply(`Contoh: ${prefix + command} Halo`);
        reply("Sedang mengetik..");
        await rh
          .GPT4(q)
          .then((res) => {
            reply(res.result);
          })
          .catch((err) => {
            console.error(chalk.redBright("Error:"), err);
            reply(mess.error.api);
          });
        break;
      // OWNER
      case "runtime":
        if (!isOwner && !fromMe) return;
        reply(`${runtime(process.uptime())}`);
        break;

      default:
        // EVAL
        if (budy.startsWith(">")) {
          if (!isOwner) return;
          console.log(
            chalk.greenBright("[ EVAL ]"),
            chalk.yellowBright(moment().format("DD/MM/YY HH:mm:ss")),
            chalk.greenBright(`Dari Owner aowkoakwoak`)
          );
          try {
            let evaled = await eval(budy.slice(2));
            if (typeof evaled !== "string")
              evaled = require("util").inspect(evaled);
            reply(`${evaled}`);
          } catch (err) {
            reply(`${err}`);
          }
        }
        // EXEC
        if (budy.startsWith("$")) {
          if (!isOwner) return;
          console.log(
            chalk.greenBright("[ EXEC ]"),
            chalk.yellowBright(moment().format("DD/MM/YY HH:mm:ss")),
            chalk.greenBright(`Dari Owner aowkoakwoak`)
          );
          exec(budy.slice(2), (err, stdout) => {
            if (err) return reply(`${err}`);
            if (stdout) return reply(stdout);
          });
        }
      // BATAS
    }
  } catch (err) {
    console.log(util.format(err));
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(`Update ${__filename}`);
  delete require.cache[file];
  require(file);
});
