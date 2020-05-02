import { Monstar, Ability, TreatsAndAction, Size, RegendaryAction } from "./Monstar"
import * as fs from 'fs'
const libxml = require("libxmljs");

class ParseState {
    public isAbilitiName: boolean = false
    public currentItem: TreatsAndAction | null = null
}

class ScrapingMonsterJsonParser {

    public parse(filePath: string): Array<Monstar> {
        const srddata = fs.readFileSync(filePath, "utf-8");
        const monstars = JSON.parse(srddata);

        return monstars.map((monstarJson: any) => {
            return this.parseMonstar(monstarJson)
        })
    }

    private parseMonstar(monstarJson: any): Monstar {

        //キャラクター名
        const name = monstarJson.name;

        //size
        const size = this.getSize(monstarJson.meta);
        const type = this.getType(monstarJson.meta);
        const alignment = this.getAlignment(monstarJson.meta);
        const hitPoint: string = monstarJson["Hit Points"]
            .replace(/\([0-9 d+-]+\)/, "")
            .trim();
        const AC: string = monstarJson["Armor Class"];
        const speed: string = monstarJson["Speed"];
        const imageUrl: string = monstarJson["img_url"]
        const sence: string = monstarJson["Senses"]
        const language: string = monstarJson["Languages"]
        const challenges: string = monstarJson["Challenge"]
        const skills: string = monstarJson["Skills"]

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

        const traits = this.parseTraitsAndAction(monstarJson.Traits)
        const actions = this.parseTraitsAndAction(monstarJson.Actions)

        const monstar = new Monstar()
        monstar.name = name
        monstar.size = size
        monstar.type = type
        monstar.alignment = alignment
        monstar.hitPoint = Number.parseInt(hitPoint)
        monstar.AC = Number.parseInt(AC)
        monstar.speed = speed
        monstar.imageUrl = imageUrl
        monstar.sence = sence
        monstar.language = language
        monstar.challenges = challenges
        monstar.skills = skills

        const savingThrows = this.parseSavingThrow(monstarJson["Saving Throws"])

        monstar.STR = new Ability(STR, STR_mod, this.calcSavingThrow("STR", STR_mod, savingThrows)) //FIXME saving throw.
        monstar.DEX = new Ability(DEX, DEX_mod, this.calcSavingThrow("DEX", DEX_mod, savingThrows))
        monstar.CON = new Ability(CON, CON_mod, this.calcSavingThrow("CON", CON_mod, savingThrows))
        monstar.INT = new Ability(INT, INT_mod, this.calcSavingThrow("INT", INT_mod, savingThrows))
        monstar.WIS = new Ability(WIS, WIS_mod, this.calcSavingThrow("WIS", WIS_mod, savingThrows))
        monstar.CHA = new Ability(CHA, CHA_mod, this.calcSavingThrow("CHA", CHA_mod, savingThrows))

        traits.forEach(trait => {
            monstar.treats.push(trait)
        })
        actions.forEach(action => {
            monstar.actions.push(action)
        })

        monstar.regendaryAction = this.parseRegendaryAction(monstarJson["Legendary Actions"])
        return monstar
    }

    private getSize(meta: string): Size {
        if (meta.indexOf("Small") >= 0) {
            return Size.Small
        }else if (meta.indexOf("Tiny") >= 0) {
            return Size.Tiny
        }else if (meta.indexOf("Medium") >= 0) {
            return Size.Medium
        } else if (meta.indexOf("Large") >= 0) {
            return Size.Large
        } else if (meta.indexOf("Huge") >= 0) {
            return Size.Huge
        } else if (meta.indexOf("Gargantuan") >= 0) {
            return Size.Gargantuan
        } else {
            throw new Error(meta)
        }
    }

    private getType(meta: string): string {
        return meta.split(",")[0].trim().split(" ")[1];
    }

    private getAlignment(meta: string): string {
        return meta.split(",")[1].trim();
    }

    private deleteBrackets(value: string): string {
        return value.replace(/[(|)]/g, "");
    }

    //能力もしくはアクションを解析
    private parseTraitsAndAction(content: string) : Array<TreatsAndAction>{
        const wrapperXML = `<wrapper>${content}</wrapper>`;
        var parser = new libxml.SaxParser();

        const parseState: ParseState = new ParseState()
        const retVal: Array<TreatsAndAction> = [];

        parser.on("startElementNS", function (elem: string, attrs: any, prefix: any, uri: any, namespace: any) {
            if (elem == "strong") {
                parseState.isAbilitiName = true;
                if (parseState.currentItem !== null) {
                    retVal.push(parseState.currentItem);
                    parseState.currentItem = new TreatsAndAction()
                } else {
                    parseState.currentItem = new TreatsAndAction()
                }
            }
        });
        parser.on("endElementNS", function (elem: string, attrs: any, prefix: any, uri: any, namespace: any) {
            if (elem == "strong") {
                parseState.isAbilitiName = false;
            }
        });
        parser.on("endDocument", function (elem: any, attrs: any, prefix: any, uri: any, namespace: any) {
            if (parseState.currentItem !== null) {
                retVal.push(parseState.currentItem);
            }
        });

        parser.on("characters", function (chars: string) {
            if (!(chars.trim().length == 0) && (parseState.currentItem !== null)) {
                if (parseState.isAbilitiName) {
                    parseState.currentItem.name = chars;
                } else {
                    parseState.currentItem.contents.push(chars);
                }
            }
        });

        parser.parseString(wrapperXML);
        return retVal;
    }

    //能力もしくはアクションを解析
    private parseRegendaryAction(content: string) : RegendaryAction | null {

        if(!content){
            return null
        }

        const header = content.substring(content.indexOf("<p>")+3,content.indexOf("</p>"))
        const body = content.substring(content.indexOf("</p>")+4)
        const actions = this.parseTraitsAndAction(body)
        return new RegendaryAction(header,actions)
    }

    private parseSavingThrow(value: string): Map<string, string> {
        const retVal = new Map<string, string>()
        if (value) {
            const savingThrows = value.split(",")
            savingThrows.forEach(savingThrow => {
                const kv = savingThrow.trim().split(" ")
                retVal.set(kv[0], kv[1])
                
            })
        }
        return retVal
    }

    private calcSavingThrow(type: string, mod: string, savingThrow: Map<string, string>) {
        return savingThrow.get(type) ? savingThrow.get(type) : mod
    }
}

export { ScrapingMonsterJsonParser }