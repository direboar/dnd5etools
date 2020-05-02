"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const libxml = require("libxmljs");
class UdonariumCharacter2XML {
    buildXml(udonariumCharacter) {
        const document = this.convertToXML(udonariumCharacter);
        return document.toString();
    }
    convertToXML(character) {
        const doc = new libxml.Document();
        const characterElement = doc.node("character");
        const characterNode = characterElement
            .node("data")
            .attr({ name: "character" });
        if (!character.common) {
            throw new Error("Commonが未設定");
        }
        else if (!character.chatpallette) {
            throw new Error("Chatpalletteが未設定");
        }
        else {
            this.createImageNode(characterNode, character);
            this.createCommonNode(characterNode, character.common);
            this.createDetailsNode(characterNode, character.details);
            this.createChatPallette(characterElement, character.chatpallette);
            return doc;
        }
    }
    createImageNode(parent, character) {
        const node = parent.node("data").attr({ name: "image" });
        const imageNode = node.node("data").attr({ name: "imageIdentifier", type: "image" });
        if (character.imageHashSHA256) {
            imageNode.text(character.imageHashSHA256);
        }
        return node;
    }
    createCommonNode(parent, common) {
        const node = parent.node("data").attr({ name: "common" });
        //キャラクター名
        const name = common.name;
        //size
        const size = common.size;
        node.node("data").attr({ name: "name" }).text(name);
        node.node("data").attr({ name: "size" }).text(size);
        return node;
    }
    createDetailsNode(parent, details) {
        const node = parent.node("data").attr({ name: "detail" });
        details.forEach(detail => {
            this.createDetailNode(node, detail);
        });
        return node;
    }
    createDetailNode(parent, detail) {
        const node = parent.node("data").attr({ name: detail.label });
        detail.detailItems.forEach(detailItem => {
            detailItem.createNode(node);
        });
        return node;
    }
    createChatPallette(parent, chatPallette) {
        const node = parent.node("chat-palette")
            .attr({ dicebot: chatPallette.dicebot })
            .text(chatPallette.contents);
        return node;
    }
}
exports.UdonariumCharacter2XML = UdonariumCharacter2XML;
// const fs = require("fs");
// var libxml = require("libxmljs");
// const archiver = require("archiver");
// var axios = require("axios");
// const crypto = require('crypto');
// const srddata = fs.readFileSync("./files/srd_5e_monsters.json", "utf-8");
// const monsters = JSON.parse(srddata);
// (async () => {
//     monsters.forEach(async (monster) => {
//         getMonsterImageData(monster,(imageFileName)=>{
//             const doc = convertToXML(monster, imageFileName);
//             const name = formatMonstarFileName(monster.name);
//             const xmlFileName = `./out/${name}.xml`;
//             fs.writeFileSync(xmlFileName, doc.tostring(), "utf-8");
//             compress(`${name}.zip`, [`${name}.xml`, imageFileName]);
//         });
//     });
// })();
// function convertToXML(monsterJson, imageFileName) {
//     const doc = new libxml.Document();
//     const characterElement = doc.node("character");
//     const characterNode = characterElement
//         .node("data")
//         .attr({ name: "character" });
//     createImageNode(characterNode, imageFileName);
//     createCommonNode(characterNode, monsterJson);
//     createDetailNode(characterNode, monsterJson);
//     createChatPallette(characterElement, monsterJson);
//     return doc;
// }
// function createCommonNode(parent, monsterJson) {
//     const node = parent.node("data").attr({ name: "common" });
//     //キャラクター名
//     const name = monsterJson.name;
//     //size
//     const size = judgeSize(monsterJson.meta);
//     node.node("data").attr({ name: "name" }).text(name);
//     node.node("data").attr({ name: "size" }).text(size);
//     return node;
// }
// function createDetailNode(parent, monsterJson) {
//     const node = parent.node("data").attr({ name: "detail" });
//     createDataNode(node, monsterJson);
//     createAbilityNode(node, monsterJson);
//     createSavingThrowNode(node, monsterJson);
//     createTraitsNode(node, monsterJson);
//     createActionNode(node, monsterJson);
// }
// function createDataNode(parent, monsterJson) {
//     const node = parent.node("data").attr({ name: "データ" });
//     const hitPoint = monsterJson["Hit Points"]
//         .replace(/\([0-9 d+-]+\)/, "")
//         .trim();
//     const initiatibe = deleteBrackets(monsterJson["DEX_mod"]); //イニシアチブはdex能力値修正
//     const AC = monsterJson["Armor Class"];
//     const speed = monsterJson["Speed"];
//     node
//         .node("data")
//         .attr({ name: "ヒット・ポイント" })
//         .text(hitPoint)
//         .attr({ type: "numberResource", currentValue: hitPoint });
//     node.node("data").attr({ name: "イニシアチブ" }).text(initiatibe);
//     node.node("data").attr({ name: "AC" }).text(AC);
//     node.node("data").attr({ name: "移動速度" }).text(speed);
//     return node;
// }
// function createAbilityNode(parent, monsterJson) {
//     const node = parent.node("data").attr({ name: "能力値" });
//     const STR = monsterJson.STR;
//     const DEX = monsterJson.DEX;
//     const CON = monsterJson.CON;
//     const INT = monsterJson.INT;
//     const WIS = monsterJson.WIS;
//     const CHA = monsterJson.CHA;
//     node.node("data").attr({ name: "【筋力】" }).text(STR);
//     node.node("data").attr({ name: "【敏捷力】" }).text(DEX);
//     node.node("data").attr({ name: "【耐久力】" }).text(CON);
//     node.node("data").attr({ name: "【知力】" }).text(INT);
//     node.node("data").attr({ name: "【判断力】" }).text(WIS);
//     node.node("data").attr({ name: "【魅力】" }).text(CHA);
//     return node;
// }
// function createSavingThrowNode(parent, monsterJson) {
//     const node = parent.node("data").attr({ name: "セーヴィング・スロー" });
//     const STR_mod = deleteBrackets(monsterJson.STR_mod);
//     const DEX_mod = deleteBrackets(monsterJson.DEX_mod);
//     const CON_mod = deleteBrackets(monsterJson.CON_mod);
//     const INT_mod = deleteBrackets(monsterJson.INT_mod);
//     const WIS_mod = deleteBrackets(monsterJson.WIS_mod);
//     const CHA_mod = deleteBrackets(monsterJson.CHA_mod);
//     node.node("data").attr({ name: "【筋】セーヴ" }).text(STR_mod);
//     node.node("data").attr({ name: "【敏】セーヴ" }).text(DEX_mod);
//     node.node("data").attr({ name: "【耐】セーヴ" }).text(CON_mod);
//     node.node("data").attr({ name: "【知】セーヴ" }).text(INT_mod);
//     node.node("data").attr({ name: "【判】セーヴ" }).text(WIS_mod);
//     node.node("data").attr({ name: "【魅】セーヴ" }).text(CHA_mod);
//     return node;
// }
// function createTraitsNode(parent, monsterJson) {
//     const node = parent.node("data").attr({ name: "特徴" });
//     const actions = parseTraitsAndAction(monsterJson.Traits);
//     actions.forEach((action) => {
//         const dataNode = node.node("data").attr({ name: action.name });
//         let count = 1;
//         action.content.forEach((c) => {
//             dataNode
//                 .node("data")
//                 .attr({ name: count++ })
//                 .text(c);
//         });
//     });
//     return node;
// }
// function createActionNode(parent, monsterJson) {
//     const node = parent.node("data").attr({ name: "アクション" });
//     const actions = parseTraitsAndAction(monsterJson.Actions);
//     actions.forEach((action) => {
//         const dataNode = node.node("data").attr({ name: action.name });
//         let count = 1;
//         action.content.forEach((c) => {
//             dataNode
//                 .node("data")
//                 .attr({ name: count++ })
//                 .text(c);
//         });
//     });
//     return node;
// }
// function createImageNode(parent, imageFileName) {
//     const node = parent.node("data").attr({ name: "image" });
//     const withoutExt = getWithoutExt(imageFileName)
//     node
//         .node("data")
//         .attr({ name: "imageIdentifier", type: "iamge" })
//         .text(withoutExt);
//     return node;
// }
// //括弧を削除する
// function deleteBrackets(value) {
//     return value.replace(/[(|)]/g, "", "");
// }
// //モンスター名をファイルシステムにあうように修正。
// function formatMonstarFileName(value) {
//     return value.replace(/\//g, "_");
// }
// function judgeSize(meta) {
//     if (meta.indexOf("Medium") >= 0) {
//         return "1";
//     } else if (meta.indexOf("Large") >= 0) {
//         return "2";
//     } else if (meta.indexOf("Huge") >= 0) {
//         return "3";
//     } else {
//         return "1";
//     }
// }
// //能力もしくはアクションを解析
// function parseTraitsAndAction(content) {
//     const wrapperXML = `<wrapper>${content}</wrapper>`;
//     var parser = new libxml.SaxParser();
//     const parseState = {
//         isAbilitiName: false,
//         currentItem: {
//             name: "",
//             content: [],
//         },
//     };
//     const retVal = [];
//     parser.on("startElementNS", function (elem, attrs, prefix, uri, namespace) {
//         if (elem == "strong") {
//             parseState.isAbilitiName = true;
//             if(parseState.currentItem.name !== ""){
//                 retVal.push(parseState.currentItem);
//                 parseState.currentItem = {
//                     name: "",
//                     content: [],
//                 };
//             }
//         }
//     });
//     parser.on("endElementNS", function (elem, attrs, prefix, uri, namespace) {
//         if (elem == "strong") {
//             parseState.isAbilitiName = false;
//         }
//     });
//     parser.on("endDocument", function (elem, attrs, prefix, uri, namespace) {
//         if(parseState.currentItem.name !== ""){
//             retVal.push(parseState.currentItem);
//         }
//     });
//     parser.on("characters", function (chars) {
//         if (!chars.trim().length == 0) {
//             if (parseState.isAbilitiName) {
//                 parseState.currentItem.name = chars;
//             } else {
//                 parseState.currentItem.content.push(chars);
//             }
//         }
//     });
//     parser.parsestring(wrapperXML);
//     return retVal;
// }
// function createChatPallette(parent, monsterJson) {
//     const text = `▼能力値判定
// 1d20+(({【筋力】}-10)/2) {name}の【筋力】判定！
// 1d20+(({【敏捷力】}-10)/2) {name}の【敏捷力】判定！
// 1d20+(({【耐久力】}-10)/2) {name}の【耐久力】判定！
// 1d20+(({【知力】}-10)/2) {name}の【知力】判定！
// 1d20+(({【判断力】}-10)/2) {name}の【判断力】判定！
// 1d20+(({【魅力】}-10)/2) {name}の【魅力】判定！
// ▼技能判定
// ▼セーヴィング・スロー
// 1d20+{【筋】セーヴ} {name}の【筋力】セーヴィング・スロー！
// 1d20+{【敏】セーヴ} {name}の【敏捷力】セーヴィング・スロー！
// 1d20+{【耐】セーヴ} {name}の【耐久力】セーヴィング・スロー！
// 1d20+{【知】セーヴ} {name}の【知力】セーヴィング・スロー！
// 1d20+{【判】セーヴ} {name}の【判断力】セーヴィング・スロー！
// 1d20+{【魅】セーヴ} {name}の【魅力】セーヴィング・スロー！
// 1d20&gt;=10 {name}の死亡セーヴィング・スロー！
// ▼戦闘
// 1d20+(({【敏捷力】}-10)/2)  {name}のイニシアチブ判定！
// ▼攻撃1
// 1d20+xx　{name}の{攻撃1}攻撃！
// {攻撃1ダメージ} {name}の{攻撃1}{攻撃1D種別}ダメージ！ {攻撃1追加効果}
// ▼攻撃2
// 1d20+xx　{name}の{攻撃2}攻撃！
// {攻撃2ダメージ} {name}の{攻撃2}{攻撃2D種別}ダメージ！ {攻撃2追加効果}
// `;
//     const node = parent
//         .node("chat-palette")
//         .attr({ dicebot: "DungeonsAndDoragons" })
//         .text(text);
//     return node;
// }
// async function compress(zipFileName, filenames) {
//     var output = fs.createWriteStream(`./out/${zipFileName}`);
//     const archive = archiver("zip", {
//         zlib: { level: 9 }, // Sets the compression level.
//     });
//     archive.pipe(output);
//     filenames.forEach((fileName) => {
//     if (getExt(fileName) === "xml") {
//             archive.append(fs.createReadStream(`./out/${fileName}`), {
//                 name: fileName,
//             });
//         } else {
//             //read binary.
//             //https://stackoverflow.com/questions/33976205/nodejs-binary-fs-createreadstream-streamed-as-utf-8
//             archive.append(fs.createReadStream(`./out/${fileName}`, { encoding: null }), {
//                 name: fileName,
//             });
//         }
//     });
//     await archive.finalize();
// }
// async function getMonsterImageData(monsterJson,resolve) {
//     const url = monsterJson.img_url;
//     try {
//         const response = await axios({
//             method: "get",
//             url: url,
//             responseType: "stream",
//         });
//         const ext = getExt(url)
//         const filename = formatMonstarFileName(`${monsterJson.name}.${ext}`);
//         const responseStream = response.data
//         const writeStream = fs.createWriteStream(`./out/${filename}`)
//         const shasum = crypto.createHash('sha256');
//         responseStream.on('data', chunk => {
//             shasum.update(chunk)
//         });
//         responseStream.on('end', ()=>{
//             const hash = shasum.digest('hex')
//             fs.renameSync(`./out/${filename}`,`./out/${hash}.${ext}`)
//             resolve(`${hash}.${ext}`)
//         })
//         responseStream.pipe(writeStream)
//     } catch (e) {
//         console.log(e);
//     }
// }
// function getExt(fileName) {
//     const index = fileName.lastIndexOf(".")
//     return fileName.substr(index + 1)
// }
// function getWithoutExt(fileName) {
//     const index = fileName.lastIndexOf(".")
//     return fileName.substr(0, index)
// }
// // doc.node('character').attr({'location.name':'graveyard' ,'location.x':'800','location.y':'475','posZ':'0','rotate':'0','roll':'0'})
// // // var xmlDoc = libxml.parseXmlstring(xml);
// // console.log(doc.tostring())
// // var document = new JSDOM('<character>')
// // console.log(document);
// // var monster = {
// //     character : {
// //         'location.name' :'graveyard'
// //     },
// //     data :{
// //         name : 'character',
// //         data : {
// //             name : 'image',
// //             data : type='image'
// //         }
// //     }
// // }
//# sourceMappingURL=UdonariumCharacter2XML.js.map