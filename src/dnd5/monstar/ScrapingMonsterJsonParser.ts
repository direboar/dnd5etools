import { Monstar, Ability, TreatsAndAction, Size, RegendaryAction, Attack, Skill } from "./Monstar"
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
        // const skills: string = monstarJson["Skills"]

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
        // const skills = this.parseCommaSepalatedValue(monstarJson["Skills"])
        // console.log(Array.from(skills.keys()))
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
        // monstar.skills = skills

        const savingThrows = this.parseCommaSepalatedValue(monstarJson["Saving Throws"])

        monstar.STR = new Ability(STR, STR_mod, this.calcSavingThrow("STR", STR_mod, savingThrows)) //FIXME saving throw.
        monstar.DEX = new Ability(DEX, DEX_mod, this.calcSavingThrow("DEX", DEX_mod, savingThrows))
        monstar.CON = new Ability(CON, CON_mod, this.calcSavingThrow("CON", CON_mod, savingThrows))
        monstar.INT = new Ability(INT, INT_mod, this.calcSavingThrow("INT", INT_mod, savingThrows))
        monstar.WIS = new Ability(WIS, WIS_mod, this.calcSavingThrow("WIS", WIS_mod, savingThrows))
        monstar.CHA = new Ability(CHA, CHA_mod, this.calcSavingThrow("CHA", CHA_mod, savingThrows))

        //parse skill.
        const parsedSkill = this.parseCommaSepalatedValue(monstarJson["Skills"])

        monstar.skills.set(Skill.Acrobatics, this.calcSkill(Skill.Acrobatics, monstar, parsedSkill))
        monstar.skills.set(Skill.Arcana, this.calcSkill(Skill.Arcana, monstar, parsedSkill))
        monstar.skills.set(Skill.Athletics, this.calcSkill(Skill.Athletics, monstar, parsedSkill))
        monstar.skills.set(Skill.Deception, this.calcSkill(Skill.Deception, monstar, parsedSkill))
        monstar.skills.set(Skill.History, this.calcSkill(Skill.History, monstar, parsedSkill))
        monstar.skills.set(Skill.Insight, this.calcSkill(Skill.Insight, monstar, parsedSkill))
        monstar.skills.set(Skill.Intimidation, this.calcSkill(Skill.Intimidation, monstar, parsedSkill))
        monstar.skills.set(Skill.Investigation, this.calcSkill(Skill.Investigation, monstar, parsedSkill))
        monstar.skills.set(Skill.Medicine, this.calcSkill(Skill.Medicine, monstar, parsedSkill))
        monstar.skills.set(Skill.Nature, this.calcSkill(Skill.Nature, monstar, parsedSkill))
        monstar.skills.set(Skill.Perception, this.calcSkill(Skill.Perception, monstar, parsedSkill))
        monstar.skills.set(Skill.Performance, this.calcSkill(Skill.Performance, monstar, parsedSkill))
        monstar.skills.set(Skill.Persuasion, this.calcSkill(Skill.Persuasion, monstar, parsedSkill))
        monstar.skills.set(Skill.Religion, this.calcSkill(Skill.Religion, monstar, parsedSkill))
        monstar.skills.set(Skill.Sleight, this.calcSkill(Skill.Sleight, monstar, parsedSkill))
        monstar.skills.set(Skill.Stealth, this.calcSkill(Skill.Stealth, monstar, parsedSkill))
        monstar.skills.set(Skill.Survival, this.calcSkill(Skill.Survival, monstar, parsedSkill))
        monstar.skills.set(Skill.AnimalHandling, this.calcSkill(Skill.AnimalHandling, monstar, parsedSkill))

        traits.forEach(trait => {
            monstar.treats.push(trait)
        })
        actions.forEach(action => {
            monstar.actions.push(action)
        })

        monstar.regendaryAction = this.parseRegendaryAction(monstarJson["Legendary Actions"])
        monstar.attacks = this.parseAttacks(monstarJson.Actions)

        return monstar
    }

    private getSize(meta: string): Size {
        if (meta.indexOf("Small") >= 0) {
            return Size.Small
        } else if (meta.indexOf("Tiny") >= 0) {
            return Size.Tiny
        } else if (meta.indexOf("Medium") >= 0) {
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
    private parseTraitsAndAction(content: string): Array<TreatsAndAction> {
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
                    // 文章中にハイフンが入ると、charactersが複数回呼び出されることがある。
                    // そのため、charactersが複数回呼び出された場合、前回格納した文字列にappendする処理を追加する。
                    const name = parseState.currentItem.name;
                    parseState.currentItem.name += chars
                } else {
                    parseState.currentItem.contents.push(chars);
                }
            }
        });

        parser.parseString(wrapperXML);
        return retVal;
    }

    //能力もしくはアクションを解析
    private parseRegendaryAction(content: string): RegendaryAction | null {

        if (!content) {
            return null
        }

        const header = content.substring(content.indexOf("<p>") + 3, content.indexOf("</p>"))
        const body = content.substring(content.indexOf("</p>") + 4)
        const actions = this.parseTraitsAndAction(body)
        return new RegendaryAction(header, actions)
    }

    private parseCommaSepalatedValue(value: string): Map<string, string> {
        const retVal = new Map<string, string>()
        if (value) {
            const savingThrows = value.split(",")
            savingThrows.forEach(savingThrow => {
                const lastIndex = savingThrow.lastIndexOf(" ")
                retVal.set(savingThrow.substring(0,lastIndex).trim(), savingThrow.substring(lastIndex).trim())
            })
        }
        return retVal
    }

    private calcSavingThrow(type: string, mod: string, savingThrow: Map<string, string>) {
        return savingThrow.get(type) ? savingThrow.get(type) : mod
    }

    //Monstarには既に能力値修正が追加済みとする。
    private calcSkill(skill: Skill, monstar: Monstar, skills: Map<string, string>): string {
        const proficiedSkill = skills.get(skill.toString())
        const retVal = proficiedSkill ? proficiedSkill : this.calcAbilityOf(skill, monstar)
        if (!retVal) {
            throw new Error()
        }
        return retVal
    }

    private calcAbilityOf(skill: Skill, monstar: Monstar) {
        if (skill === Skill.History) return monstar.INT.modifier
        if (skill === Skill.Perception) return monstar.WIS.modifier
        if (skill === Skill.Medicine) return monstar.WIS.modifier
        if (skill === Skill.Religion) return monstar.INT.modifier
        if (skill === Skill.Stealth) return monstar.DEX.modifier
        if (skill === Skill.Persuasion) return monstar.CHA.modifier
        if (skill === Skill.Insight) return monstar.WIS.modifier
        if (skill === Skill.Deception) return monstar.CHA.modifier
        if (skill === Skill.Arcana) return monstar.INT.modifier
        if (skill === Skill.Athletics) return monstar.STR.modifier
        if (skill === Skill.Acrobatics) return monstar.DEX.modifier
        if (skill === Skill.Survival) return monstar.WIS.modifier
        if (skill === Skill.Investigation) return monstar.INT.modifier
        if (skill === Skill.Nature) return monstar.INT.modifier
        if (skill === Skill.Intimidation) return monstar.CHA.modifier
        if (skill === Skill.Performance) return monstar.CHA.modifier
        if (skill === Skill.Sleight) return monstar.DEX.modifier
        if (skill === Skill.AnimalHandling) return monstar.WIS.modifier
        throw new Error('unreached')
    }
    // <p><em><strong>Hand Crossbow.</strong></em> <em>Ranged Weapon Attack:</em> +4 to hit, range 30/120 ft., one target. Hit: 5 (1d6 + 2) piercing damage, and the target must succeed on a DC 13 Constitution saving throw or be poisoned for 1 hour. If the saving throw fails by 5 or more, the target is also unconscious while poisoned in this way. The target wakes up if it takes damage or if another creature takes an action to shake it awake.</p>    
    //Hit: 5 (1d6 + 2) piercing damage, and the target must succeed on a DC 13 Constitution saving throw or be poisoned for 1 hour. If the saving throw fails by 5 or more, the target is also unconscious while poisoned in this way. The target wakes up if it takes damage or if another creature takes an action to shake it awake.
    parseAttacks(actions: string): Array<Attack> {
// console.log(actions)        (Hag Form Only). 
    // const regex = /<p><em><strong>(?<name>[\w \.()]+\.)<\/strong><\/em> ((<em>)?[\w| ]+Attack:(<\/em>)?|(<em>)?Melee or <em>Ranged .+ Attack:<\/em>(<\/em>)?) (?<attackRole>[+-][0-9]+) to hit[^<]+(<em>)?Hit:(<\/em>)?(?<damage>[^<]+)?<\/p>/g;
    const regex = /<p><em><strong>(?<name>[\w \.()]+\.)<\/strong><\/em>(\([\w ]+\).)? ((<em>)?[\w| ]+Attack:(<\/em>)?|(<em>)?Melee or <em>Ranged .+ Attack:<\/em>(<\/em>)?) (?<attackRole>[+-][0-9]+) to hit[^<]+(<em>)?Hit:(<\/em>)?(?<damage>[^<]+)?<\/p>/g;
    const retVal = []
        if (actions) {
            const matches = actions.matchAll(regex);
            for (const match of matches) {
// console.log(match)            
                if (match.groups) {
                    const attack = new Attack(match.groups.name, match.groups.attackRole)
                    //ダメージの戦闘にある 10(1d6+4) の固定値部分と () を削除する
                    const damageRegex = /[0-9]+ \((?<damage>[0-9d+ ]+)\)[\w ]* damage( plus [0-9]+ \((?<extradamage>[0-9d+ ]+)\)[\w ]* damage)?(?<rest>.+)/m
                    // const damageRegex = /[0-9]+ \((?<damage>[0-9d+ ]+)\) \w* damage( plus [0-9]+ \((?<extradamage>[0-9d+ ]+)\) \w* damage)?(?<rest>.+)/m
                    // const damageRegex = /[0-9]+ \((?<damage>[0-9d+ ]+)\) \w* damage(?<rest>.+)/m
                    // const damageRegex = /[0-9]+ \w* \((?<damage>[0-9d+ ]+)\) damage( plus [0-9]+ \w* damage)?.(?<rest>.+)/m
                    const parsed = match.groups.damage.match(damageRegex);
                    //ダメージに含まれる空白はダイスボットが認識しないので、空白を除去する
                    if(parsed && parsed.groups){
                        const damage = parsed.groups.damage.replace(/ +/g,"")
                        const extradamage = parsed.groups.extradamage ? parsed.groups.extradamage.replace(/ +/g,"") : null
                        attack.damageRole = `${damage}${extradamage ? "+"+extradamage : ""} : ${match.groups.damage}` 
                    } else {
                        attack.damageRole = match.groups.damage
                    }
                    retVal.push(attack)
                }
            }
        }
        return retVal
    }

}



export { ScrapingMonsterJsonParser }