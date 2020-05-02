import { UdonariumCharacter, Common, Detail, DetailItem, NormalResource, NoteResource, NumberResource, Chatpallette, ContainerItem } from "../../utils/UdonariumCharacter"
import { Monstar, Size } from "./Monstar"

class Monstar2UdonarimuCharacter {

    public convert(monster: Monstar): UdonariumCharacter {
        const udonariumCharacter = new UdonariumCharacter();
        udonariumCharacter.common = new Common(monster.name, monster.size)

        const data = new Detail("データ")
        data.addDetailItem(new NormalResource("ヒット・ポイント", monster.hitPoint.toString()));
        data.addDetailItem(new NormalResource("イニシアチブ", monster.DEX.modifier));
        data.addDetailItem(new NormalResource("AC", monster.AC.toString()));
        data.addDetailItem(new NormalResource("サイズ", Size[monster.size].toString()));
        data.addDetailItem(new NormalResource("移動速度", monster.speed));
        data.addDetailItem(new NormalResource("言語", monster.language));
        data.addDetailItem(new NormalResource("感覚", monster.sence));
        data.addDetailItem(new NormalResource("脅威度", monster.challenges));
        data.addDetailItem(new NormalResource("種別", monster.type));
        data.addDetailItem(new NormalResource("属性", monster.alignment));
        data.addDetailItem(new NormalResource("技能", monster.skills));
        udonariumCharacter.addDetail(data)

        const ability = new Detail("能力値")
        ability.addDetailItem(new NormalResource("【筋力】", monster.STR.value.toString()));
        ability.addDetailItem(new NormalResource("【敏捷力】", monster.DEX.value.toString()));
        ability.addDetailItem(new NormalResource("【耐久力】", monster.CON.value.toString()));
        ability.addDetailItem(new NormalResource("【知力】", monster.INT.value.toString()));
        ability.addDetailItem(new NormalResource("【判断力】", monster.WIS.value.toString()));
        ability.addDetailItem(new NormalResource("【魅力】", monster.CHA.value.toString()));
        udonariumCharacter.addDetail(ability)

        const save = new Detail("セービングスロー")
        save.addDetailItem(new NormalResource("【筋】セーヴ", monster.STR.save.toString()));
        save.addDetailItem(new NormalResource("【敏】セーヴ", monster.DEX.save.toString()));
        save.addDetailItem(new NormalResource("【耐】セーヴ", monster.CON.save.toString()));
        save.addDetailItem(new NormalResource("【知】セーヴ", monster.INT.save.toString()));
        save.addDetailItem(new NormalResource("【判】セーヴ", monster.WIS.save.toString()));
        save.addDetailItem(new NormalResource("【魅】セーヴ", monster.CHA.save.toString()));
        udonariumCharacter.addDetail(save)

        const traits = new Detail("特徴")
        monster.treats.forEach(trait => {
            const treatItem = new ContainerItem(trait.name);
            trait.contents.forEach((content, index) => {
                treatItem.addDetailItem(new NormalResource(index.toString(), content));
            })
            traits.addDetailItem(treatItem)
        })
        udonariumCharacter.addDetail(traits)

        const actions = new Detail("アクション")
        monster.actions.forEach(action => {
            const actionItem = new ContainerItem(action.name);
            action.contents.forEach((content, index) => {
                actionItem.addDetailItem(new NormalResource(index.toString(), content));
            })
            actions.addDetailItem(actionItem)
        })
        udonariumCharacter.addDetail(actions)

        if(monster.regendaryAction){
            const regendaryAction = new Detail("レジェンダリー・アクション")
            const regendaryActionItem = new NormalResource("レジェンダリー・アクション",monster.regendaryAction.header);
            regendaryAction.addDetailItem(regendaryActionItem)
            monster.regendaryAction.regendaryActionDetails.forEach(action => {
                const containerItem = new ContainerItem(action.name);
                action.contents.forEach((content, index) => {
                    containerItem.addDetailItem(new NormalResource(index.toString(), content));
                })
                regendaryAction.addDetailItem(containerItem)
            })
            udonariumCharacter.addDetail(regendaryAction)
        }
        
        // monster.actions.forEach(action => {
        //     const actionItem = new ContainerItem(action.name);
        //     action.contents.forEach((content, index) => {
        //         actionItem.addDetailItem(new NormalResource(index.toString(), content));
        //     })
        //     actions.addDetailItem(actionItem)
        // })
        // udonariumCharacter.addDetail(actions)

        const chatPallette = new Chatpallette("DungeonsAndDoragons", this.chatpalette())
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
}

export { Monstar2UdonarimuCharacter }
