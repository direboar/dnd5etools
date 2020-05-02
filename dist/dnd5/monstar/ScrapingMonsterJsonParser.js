"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Monstar_1 = require("./Monstar");
const fs = __importStar(require("fs"));
const libxml = require("libxmljs");
class ParseState {
    constructor() {
        this.isAbilitiName = false;
        this.currentItem = null;
    }
}
class ScrapingMonsterJsonParser {
    parse(filePath) {
        const srddata = fs.readFileSync(filePath, "utf-8");
        const monstars = JSON.parse(srddata);
        return monstars.map((monstarJson) => {
            return this.parseMonstar(monstarJson);
        });
    }
    parseMonstar(monstarJson) {
        //キャラクター名
        const name = monstarJson.name;
        //size
        const size = this.judgeSize(monstarJson.meta);
        const hitPoint = monstarJson["Hit Points"]
            .replace(/\([0-9 d+-]+\)/, "")
            .trim();
        const AC = monstarJson["Armor Class"];
        const speed = monstarJson["Speed"];
        const imageUrl = monstarJson["img_url"];
        const STR = monstarJson.STR;
        const DEX = monstarJson.DEX;
        const CON = monstarJson.CON;
        const INT = monstarJson.INT;
        const WIS = monstarJson.WIS;
        const CHA = monstarJson.CHA;
        const STR_mod = this.deleteBrackets(monstarJson.STR_mod);
        const DEX_mod = this.deleteBrackets(monstarJson.DEX_mod);
        const CON_mod = this.deleteBrackets(monstarJson.CON_mod);
        const INT_mod = this.deleteBrackets(monstarJson.INT_mod);
        const WIS_mod = this.deleteBrackets(monstarJson.WIS_mod);
        const CHA_mod = this.deleteBrackets(monstarJson.CHA_mod);
        const traits = this.parseTraitsAndAction(monstarJson.Traits);
        const actions = this.parseTraitsAndAction(monstarJson.Actions);
        const monstar = new Monstar_1.Monstar();
        monstar.name = name;
        monstar.size = size;
        monstar.hitPoint = Number.parseInt(hitPoint);
        monstar.AC = Number.parseInt(AC);
        monstar.speed = speed;
        monstar.imageUrl = imageUrl;
        monstar.STR = new Monstar_1.Ability(STR, STR_mod, STR_mod); //FIXME saving throw.
        monstar.DEX = new Monstar_1.Ability(DEX, DEX_mod, DEX_mod);
        monstar.CON = new Monstar_1.Ability(CON, CON_mod, CON_mod);
        monstar.INT = new Monstar_1.Ability(INT, INT_mod, INT_mod);
        monstar.WIS = new Monstar_1.Ability(WIS, WIS_mod, WIS_mod);
        monstar.CHA = new Monstar_1.Ability(CHA, CHA_mod, CHA_mod);
        traits.forEach(trait => {
            monstar.treats.push(trait);
        });
        actions.forEach(action => {
            monstar.actions.push(action);
        });
        return monstar;
    }
    judgeSize(meta) {
        if (meta.indexOf("Medium") >= 0) {
            return Monstar_1.Size.Medium;
        }
        else if (meta.indexOf("Large") >= 0) {
            return Monstar_1.Size.Large;
        }
        else if (meta.indexOf("Huge") >= 0) {
            return Monstar_1.Size.Huge;
        }
        else {
            return Monstar_1.Size.Medium;
        }
    }
    deleteBrackets(value) {
        return value.replace(/[(|)]/g, "");
    }
    //能力もしくはアクションを解析
    parseTraitsAndAction(content) {
        const wrapperXML = `<wrapper>${content}</wrapper>`;
        var parser = new libxml.SaxParser();
        const parseState = new ParseState();
        const retVal = [];
        parser.on("startElementNS", function (elem, attrs, prefix, uri, namespace) {
            if (elem == "strong") {
                parseState.isAbilitiName = true;
                if (parseState.currentItem !== null) {
                    retVal.push(parseState.currentItem);
                    parseState.currentItem = new Monstar_1.TreatsAndAction();
                }
                else {
                    parseState.currentItem = new Monstar_1.TreatsAndAction();
                }
            }
        });
        parser.on("endElementNS", function (elem, attrs, prefix, uri, namespace) {
            if (elem == "strong") {
                parseState.isAbilitiName = false;
            }
        });
        parser.on("endDocument", function (elem, attrs, prefix, uri, namespace) {
            if (parseState.currentItem !== null) {
                retVal.push(parseState.currentItem);
            }
        });
        parser.on("characters", function (chars) {
            if (!(chars.trim().length == 0) && (parseState.currentItem !== null)) {
                if (parseState.isAbilitiName) {
                    parseState.currentItem.name = chars;
                }
                else {
                    parseState.currentItem.contents.push(chars);
                }
            }
        });
        parser.parseString(wrapperXML);
        return retVal;
    }
}
exports.ScrapingMonsterJsonParser = ScrapingMonsterJsonParser;
//# sourceMappingURL=ScrapingMonsterJsonParser.js.map