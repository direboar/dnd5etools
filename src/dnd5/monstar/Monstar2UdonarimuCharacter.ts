import { UdonariumCharacter, Common, Detail, DetailItem, NormalResource, NoteResource, NumberResource, ChatPallette, ContainerItem } from "../../utils/UdonariumCharacter"
import { Monstar, Size, TreatsAndAction, Attack, Skill } from "./Monstar"
import { TranslateUtils } from "../../utils/TranslateUtils"

class Monstar2UdonarimuCharacter {

    private translateUtils = new TranslateUtils()

    public async convert(monstar: Monstar): Promise<UdonariumCharacter> {
        const udonariumCharacter = new UdonariumCharacter();
        udonariumCharacter.common = new Common(this.formatName(monstar.name), monstar.size)

        const data = new Detail("データ")
        data.addDetailItem(new NormalResource("ヒット・ポイント", monstar.hitPoint.toString()));
        data.addDetailItem(new NormalResource("イニシアチブ", monstar.DEX.modifier));
        data.addDetailItem(new NormalResource("AC", monstar.AC.toString()));
        data.addDetailItem(new NormalResource("サイズ", Size[monstar.size].toString()));
        data.addDetailItem(new NoteResource("移動速度", this.formatForNote(monstar.speed)));
        data.addDetailItem(new NoteResource("言語", this.formatForNote(monstar.language)));
        data.addDetailItem(new NoteResource("感覚", this.formatForNote(monstar.sence)));
        data.addDetailItem(new NormalResource("脅威度", monstar.challenges));
        data.addDetailItem(new NormalResource("種別", monstar.type));
        data.addDetailItem(new NormalResource("属性", monstar.alignment));
        // data.addDetailItem(new NoteResource("技能", this.formatForNote(monstar.skills)));
        udonariumCharacter.addDetail(data)

        const abilityAndSavingThrow = new Detail("能力/セーブ")
        udonariumCharacter.addDetail(abilityAndSavingThrow)
        const ability = new ContainerItem("能力値");
        abilityAndSavingThrow.addDetailItem(ability)
        ability.addDetailItem(new NormalResource("【筋力】", monstar.STR.value.toString()));
        ability.addDetailItem(new NormalResource("【敏捷力】", monstar.DEX.value.toString()));
        ability.addDetailItem(new NormalResource("【耐久力】", monstar.CON.value.toString()));
        ability.addDetailItem(new NormalResource("【知力】", monstar.INT.value.toString()));
        ability.addDetailItem(new NormalResource("【判断力】", monstar.WIS.value.toString()));
        ability.addDetailItem(new NormalResource("【魅力】", monstar.CHA.value.toString()));

        const save = new ContainerItem("セービングスロー")
        abilityAndSavingThrow.addDetailItem(save)
        save.addDetailItem(new NormalResource("【筋】セーヴ", monstar.STR.save.toString()));
        save.addDetailItem(new NormalResource("【敏】セーヴ", monstar.DEX.save.toString()));
        save.addDetailItem(new NormalResource("【耐】セーヴ", monstar.CON.save.toString()));
        save.addDetailItem(new NormalResource("【知】セーヴ", monstar.INT.save.toString()));
        save.addDetailItem(new NormalResource("【判】セーヴ", monstar.WIS.save.toString()));
        save.addDetailItem(new NormalResource("【魅】セーヴ", monstar.CHA.save.toString()));

        const skill = new Detail("技能判定")
        udonariumCharacter.addDetail(skill)
        //FIXME
        skill.addDetailItem(new NormalResource("〈威圧〉", monstar.getSkill(Skill.Intimidation)));//INTIMIDATION
        skill.addDetailItem(new NormalResource("〈医術〉", monstar.getSkill(Skill.Medicine)));//MEDICINE
        skill.addDetailItem(new NormalResource("〈運動〉", monstar.getSkill(Skill.Athletics)));//ATHLETICS
        skill.addDetailItem(new NormalResource("〈隠密〉", monstar.getSkill(Skill.Stealth)));//STEALTH
        skill.addDetailItem(new NormalResource("〈軽業〉", monstar.getSkill(Skill.Acrobatics)));//ACROBATICS
        skill.addDetailItem(new NormalResource("〈看破〉", monstar.getSkill(Skill.Insight)));//INSIGHT
        skill.addDetailItem(new NormalResource("〈芸能〉", monstar.getSkill(Skill.Performance)));//PERFORMANCE
        skill.addDetailItem(new NormalResource("〈自然〉", monstar.getSkill(Skill.Nature)));//NATURE
        skill.addDetailItem(new NormalResource("〈宗教〉", monstar.getSkill(Skill.Religion)));//RELIGION
        skill.addDetailItem(new NormalResource("〈生存〉", monstar.getSkill(Skill.Survival)));//SURVIVAL
        skill.addDetailItem(new NormalResource("〈説得〉", monstar.getSkill(Skill.Persuasion)));//PERSUASION
        skill.addDetailItem(new NormalResource("〈捜査〉", monstar.getSkill(Skill.Investigation)));//INVESTIGATION
        skill.addDetailItem(new NormalResource("〈知覚〉", monstar.getSkill(Skill.Perception)));//PERCEPTION
        skill.addDetailItem(new NormalResource("〈手先の早業〉", monstar.getSkill(Skill.Sleight)));//Sleight
        skill.addDetailItem(new NormalResource("〈動物使い〉", monstar.getSkill(Skill.AnimalHandling)));//ANIMAL HANDLING	
        skill.addDetailItem(new NormalResource("〈ペテン〉", monstar.getSkill(Skill.Deception)));//DECEPTION
        skill.addDetailItem(new NormalResource("〈魔法学〉", monstar.getSkill(Skill.Arcana)));//ARCANA
        skill.addDetailItem(new NormalResource("〈歴史〉", monstar.getSkill(Skill.History)));//HISTORY
// console.log(`${monster.name} : ${} )
        const actionTreats = new Detail("アクション・特徴等")
        udonariumCharacter.addDetail(actionTreats)

        const traits = new ContainerItem("特徴");
        actionTreats.addDetailItem(traits)
        for (const trait of monstar.treats) {
            const treatHeader = new ContainerItem(trait.name);
            traits.addDetailItem(treatHeader)
            const text = this.formatActionTreatText(trait)
            const translated = await this.translate(text)
            treatHeader.addDetailItem(new NoteResource("原文", text))
            treatHeader.addDetailItem(new NoteResource("訳", translated))
        }

        const actions = new ContainerItem("アクション");
        actionTreats.addDetailItem(actions)
        for (const action of monstar.actions) {
            const actionHeader = new ContainerItem(action.name);
            actions.addDetailItem(actionHeader)
            const text = this.formatActionTreatText(action)
            const translated = await this.translate(text)
            actionHeader.addDetailItem(new NoteResource("原文", text))
            actionHeader.addDetailItem(new NoteResource("訳", translated))
        }

        if (monstar.regendaryAction) {
            const regendaryAction = new ContainerItem("レジェンダリー・アクション");
            actionTreats.addDetailItem(regendaryAction)

            const regendaryHeader = new ContainerItem("レジェンダリー・アクション");
            regendaryAction.addDetailItem(regendaryHeader)

            const translated = await this.translate(monstar.regendaryAction.header)
            regendaryHeader.addDetailItem(new NoteResource("原文", monstar.regendaryAction.header))
            regendaryHeader.addDetailItem(new NoteResource("訳", translated))

            for (const action of monstar.regendaryAction.regendaryActionDetails) {
                const actionHeader = new ContainerItem(action.name);
                regendaryAction.addDetailItem(actionHeader)
                const text = this.formatActionTreatText(action)
                const translated = await this.translate(text)
                actionHeader.addDetailItem(new NoteResource("原文", text))
                actionHeader.addDetailItem(new NoteResource("訳", translated))
            }
        }

        const chatPallette = new ChatPallette("DungeonsAndDoragons", this.chatpalette(monstar))
        udonariumCharacter.chatpallette = chatPallette

        return udonariumCharacter;
    }

    private chatpalette(monstar: Monstar): string {
        return `▼能力値判定
1d20+(({【筋力】}-10)/2) {name}の【筋力】判定！
1d20+(({【敏捷力】}-10)/2) {name}の【敏捷力】判定！
1d20+(({【耐久力】}-10)/2) {name}の【耐久力】判定！
1d20+(({【知力】}-10)/2) {name}の【知力】判定！
1d20+(({【判断力】}-10)/2) {name}の【判断力】判定！
1d20+(({【魅力】}-10)/2) {name}の【魅力】判定！
     
▼技能判定
1d20{〈威圧〉} {name}の〈威圧〉判定！
1d20{〈医術〉} {name}の〈医術〉判定！
1d20{〈運動〉} {name}の〈運動〉判定！
1d20{〈隠密〉} {name}の〈隠密〉判定！
1d20{〈軽業〉} {name}の〈軽業〉判定！
1d20{〈看破〉} {name}の〈看破〉判定！
1d20{〈芸能〉} {name}の〈芸能〉判定！
1d20{〈自然〉} {name}の〈自然〉判定！
1d20{〈宗教〉} {name}の〈宗教〉判定！
1d20{〈生存〉} {name}の〈生存〉判定！
1d20{〈説得〉} {name}の〈説得〉判定！
1d20{〈捜査〉} {name}の〈捜査〉判定！
1d20{〈知覚〉} {name}の〈知覚〉判定！
1d20{〈手先の早業〉} {name}の〈手先の早業〉判定！
1d20{〈動物使い〉} {name}の〈動物使い〉判定！
1d20{〈ペテン〉} {name}の〈ペテン〉判定！
1d20{〈魔法学〉} {name}の〈魔法学〉判定！
1d20{〈歴史〉} {name}の〈歴史〉判定！

▼セーヴィング・スロー
1d20{【筋】セーヴ} {name}の【筋力】セーヴィング・スロー！
1d20{【敏】セーヴ} {name}の【敏捷力】セーヴィング・スロー！
1d20{【耐】セーヴ} {name}の【耐久力】セーヴィング・スロー！
1d20{【知】セーヴ} {name}の【知力】セーヴィング・スロー！
1d20{【判】セーヴ} {name}の【判断力】セーヴィング・スロー！
1d20{【魅】セーヴ} {name}の【魅力】セーヴィング・スロー！
1d20<=10 {name}の死亡セーヴィング・スロー！

▼戦闘
1d20+(({【敏捷力】}-10)/2)  {name}のイニシアチブ判定！
` +
            monstar.attacks.reduce((accumulator : string, attack) => {
                return `${accumulator}
                ▼${attack.name}
1d20${attack.attackRole}　{name}の${attack.name}攻撃！
${attack.damageRole}
`
            },"")
    }
    private formatForNote(text: string) {
        if (text) {
            return text.replace(/(, *)/g, "\r\n")
        } else {
            return text
        }
    }

    private formatName(name: string): string {
        //見た目のため、名前の後ろに全角の空白を１０個つける
        const fillspace = Math.ceil((16 - name.length) / 2)
        let retVal = name
        for (let index = 0; index < fillspace; index++) {
            retVal += "　"
        }
        return retVal
    }

    private formatActionTreatText(treatsAndAction: TreatsAndAction): string {
        let ret = ""
        treatsAndAction.contents.forEach((content, index) => {
            ret += content
            if (index + 1 !== treatsAndAction.contents.length) {
                ret += "\r\n"
            }
        })
        return ret
    }

    private async translate(text: string): Promise<string> {
        const ret = await this.translateUtils.translate(text)
        return ret
    }
}



export { Monstar2UdonarimuCharacter }
