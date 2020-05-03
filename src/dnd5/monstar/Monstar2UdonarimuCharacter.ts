import { UdonariumCharacter, Common, Detail, DetailItem, NormalResource, NoteResource, NumberResource, ChatPallette, ContainerItem } from "../../utils/UdonariumCharacter"
import { Monstar, Size, TreatsAndAction } from "./Monstar"
import { TranslateUtils } from "../../utils/TranslateUtils"

class Monstar2UdonarimuCharacter {

    private translateUtils = new TranslateUtils()
    
    public async convert(monster: Monstar): Promise<UdonariumCharacter> {
        const udonariumCharacter = new UdonariumCharacter();
        udonariumCharacter.common = new Common(this.formatName(monster.name), monster.size)

        const data = new Detail("データ")
        data.addDetailItem(new NormalResource("ヒット・ポイント", monster.hitPoint.toString()));
        data.addDetailItem(new NormalResource("イニシアチブ", monster.DEX.modifier));
        data.addDetailItem(new NormalResource("AC", monster.AC.toString()));
        data.addDetailItem(new NormalResource("サイズ", Size[monster.size].toString()));
        data.addDetailItem(new NoteResource("移動速度", this.formatForNote(monster.speed)));
        data.addDetailItem(new NoteResource("言語", this.formatForNote(monster.language)));
        data.addDetailItem(new NoteResource("感覚", this.formatForNote(monster.sence)));
        data.addDetailItem(new NormalResource("脅威度", monster.challenges));
        data.addDetailItem(new NormalResource("種別", monster.type));
        data.addDetailItem(new NormalResource("属性", monster.alignment));
        data.addDetailItem(new NoteResource("技能", this.formatForNote(monster.skills)));
        udonariumCharacter.addDetail(data)

        const abilityAndSavingThrow = new Detail("能力/セーブ")
        udonariumCharacter.addDetail(abilityAndSavingThrow)
        const ability = new ContainerItem("能力値");
        abilityAndSavingThrow.addDetailItem(ability)
        ability.addDetailItem(new NormalResource("【筋力】", monster.STR.value.toString()));
        ability.addDetailItem(new NormalResource("【敏捷力】", monster.DEX.value.toString()));
        ability.addDetailItem(new NormalResource("【耐久力】", monster.CON.value.toString()));
        ability.addDetailItem(new NormalResource("【知力】", monster.INT.value.toString()));
        ability.addDetailItem(new NormalResource("【判断力】", monster.WIS.value.toString()));
        ability.addDetailItem(new NormalResource("【魅力】", monster.CHA.value.toString()));

        const save = new ContainerItem("セービングスロー")
        abilityAndSavingThrow.addDetailItem(save)
        save.addDetailItem(new NormalResource("【筋】セーヴ", monster.STR.save.toString()));
        save.addDetailItem(new NormalResource("【敏】セーヴ", monster.DEX.save.toString()));
        save.addDetailItem(new NormalResource("【耐】セーヴ", monster.CON.save.toString()));
        save.addDetailItem(new NormalResource("【知】セーヴ", monster.INT.save.toString()));
        save.addDetailItem(new NormalResource("【判】セーヴ", monster.WIS.save.toString()));
        save.addDetailItem(new NormalResource("【魅】セーヴ", monster.CHA.save.toString()));

        const skill = new Detail("技能判定")
        udonariumCharacter.addDetail(skill)
        //FIXME
        skill.addDetailItem(new NormalResource("威圧", "+99"));
        skill.addDetailItem(new NormalResource("医術", "+99"));
        skill.addDetailItem(new NormalResource("運動", "+99"));
        skill.addDetailItem(new NormalResource("隠密", "+99"));
        skill.addDetailItem(new NormalResource("軽業", "+99"));
        skill.addDetailItem(new NormalResource("看破", "+99"));
        skill.addDetailItem(new NormalResource("芸能", "+99"));
        skill.addDetailItem(new NormalResource("自然", "+99"));
        skill.addDetailItem(new NormalResource("宗教", "+99"));
        skill.addDetailItem(new NormalResource("生存", "+99"));
        skill.addDetailItem(new NormalResource("説得", "+99"));
        skill.addDetailItem(new NormalResource("捜査", "+99"));
        skill.addDetailItem(new NormalResource("知覚", "+99"));
        skill.addDetailItem(new NormalResource("手先の早業", "+99"));
        skill.addDetailItem(new NormalResource("動物使い", "+99"));
        skill.addDetailItem(new NormalResource("ペテン", "+99"));
        skill.addDetailItem(new NormalResource("魔法学", "+99"));
        skill.addDetailItem(new NormalResource("歴史", "+99"));

        const actionTreats = new Detail("アクション・特徴等")
        udonariumCharacter.addDetail(actionTreats)

        const traits = new ContainerItem("特徴");
        actionTreats.addDetailItem(traits)
        for (const trait of monster.treats) {
            const treatHeader = new ContainerItem(trait.name);
            traits.addDetailItem(treatHeader)
            const text = this.formatActionTreatText(trait)
            const translated = await this.translate(text)
            treatHeader.addDetailItem(new NoteResource("原文", text))
            treatHeader.addDetailItem(new NoteResource("訳", translated))
        }

        const actions = new ContainerItem("アクション");
        actionTreats.addDetailItem(actions)
        for (const action of monster.actions) {
            const actionHeader = new ContainerItem(action.name);
            actions.addDetailItem(actionHeader)
            const text = this.formatActionTreatText(action)
            const translated = await this.translate(text)
            actionHeader.addDetailItem(new NoteResource("原文", text))
            actionHeader.addDetailItem(new NoteResource("訳", translated))
        }

        if (monster.regendaryAction) {
            const regendaryAction = new ContainerItem("レジェンダリー・アクション");
            actionTreats.addDetailItem(regendaryAction)

            const regendaryHeader = new ContainerItem("レジェンダリー・アクション");
            regendaryAction.addDetailItem(regendaryHeader)

            const translated = await this.translate(monster.regendaryAction.header)
            regendaryHeader.addDetailItem(new NoteResource("原文", monster.regendaryAction.header))
            regendaryHeader.addDetailItem(new NoteResource("訳", translated))

            for (const action of monster.regendaryAction.regendaryActionDetails) {
                const actionHeader = new ContainerItem(action.name);
                regendaryAction.addDetailItem(actionHeader)
                const text = this.formatActionTreatText(action)
                const translated = await this.translate(text)
                actionHeader.addDetailItem(new NoteResource("原文", text))
                actionHeader.addDetailItem(new NoteResource("訳", translated))
            }
        }

        // ability.addDetailItem(new NormalResource("【筋力】", monster.STR.value.toString()));
        // ability.addDetailItem(new NormalResource("【敏捷力】", monster.DEX.value.toString()));
        // ability.addDetailItem(new NormalResource("【耐久力】", monster.CON.value.toString()));
        // ability.addDetailItem(new NormalResource("【知力】", monster.INT.value.toString()));
        // ability.addDetailItem(new NormalResource("【判断力】", monster.WIS.value.toString()));
        // ability.addDetailItem(new NormalResource("【魅力】", monster.CHA.value.toString()));

        // const traits = new Detail("特徴")
        // monster.treats.forEach(trait => {
        //     const treatItem = new ContainerItem(trait.name);
        //     trait.contents.forEach((content, index) => {
        //         treatItem.addDetailItem(new NormalResource(index.toString(), content));
        //     })
        //     traits.addDetailItem(treatItem)
        // })
        // udonariumCharacter.addDetail(traits)

        // const actions = new Detail("アクション")
        // monster.actions.forEach(action => {
        //     const actionItem = new ContainerItem(action.name);
        //     action.contents.forEach((content, index) => {
        //         actionItem.addDetailItem(new NormalResource(index.toString(), content));
        //     })
        //     actions.addDetailItem(actionItem)
        // })
        // udonariumCharacter.addDetail(actions)

        // if (monster.regendaryAction) {
        //     const regendaryAction = new Detail("レジェンダリー・アクション")
        //     const regendaryActionItem = new NormalResource("レジェンダリー・アクション", monster.regendaryAction.header);
        //     regendaryAction.addDetailItem(regendaryActionItem)
        //     monster.regendaryAction.regendaryActionDetails.forEach(action => {
        //         const containerItem = new ContainerItem(action.name);
        //         action.contents.forEach((content, index) => {
        //             containerItem.addDetailItem(new NormalResource(index.toString(), content));
        //         })
        //         regendaryAction.addDetailItem(containerItem)
        //     })
        //     udonariumCharacter.addDetail(regendaryAction)
        // }

        const chatPallette = new ChatPallette("DungeonsAndDoragons", this.chatpalette())
        udonariumCharacter.chatpallette = chatPallette

        return udonariumCharacter;
    }

    private chatpalette(): string {
        return `▼能力値判定
1d20+(({【筋力】}-10)/2) {name}の【筋力】判定！
1d20+(({【敏捷力】}-10)/2) {name}の【敏捷力】判定！
1d20+(({【耐久力】}-10)/2) {name}の【耐久力】判定！
1d20+(({【知力】}-10)/2) {name}の【知力】判定！
1d20+(({【判断力】}-10)/2) {name}の【判断力】判定！
1d20+(({【魅力】}-10)/2) {name}の【魅力】判定！
     
▼技能判定

▼セーヴィング・スロー
1d20+{【筋】セーヴ} {name}の【筋力】セーヴィング・スロー！
1d20+{【敏】セーヴ} {name}の【敏捷力】セーヴィング・スロー！
1d20+{【耐】セーヴ} {name}の【耐久力】セーヴィング・スロー！
1d20+{【知】セーヴ} {name}の【知力】セーヴィング・スロー！
1d20+{【判】セーヴ} {name}の【判断力】セーヴィング・スロー！
1d20+{【魅】セーヴ} {name}の【魅力】セーヴィング・スロー！
1d20<=10 {name}の死亡セーヴィング・スロー！

▼戦闘
1d20+(({【敏捷力】}-10)/2)  {name}のイニシアチブ判定！

▼攻撃1
1d20+xx　{name}の{攻撃1}攻撃！
{攻撃1ダメージ} {name}の{攻撃1}{攻撃1D種別}ダメージ！ {攻撃1追加効果}
▼攻撃2
1d20+xx　{name}の{攻撃2}攻撃！
{攻撃2ダメージ} {name}の{攻撃2}{攻撃2D種別}ダメージ！ {攻撃2追加効果}`;
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
        const fillspace = Math.ceil((15 - name.length) / 2)
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

    private async translate(text: string) : Promise<string> {
        const ret = await this.translateUtils.translate(text)
        return ret
    }
}



export { Monstar2UdonarimuCharacter }
