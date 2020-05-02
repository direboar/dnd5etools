"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UdonariumCharacter_1 = require("../../utils/UdonariumCharacter");
class Monstar2UdonarimuCharacter {
    convert(monster) {
        const udonariumCharacter = new UdonariumCharacter_1.UdonariumCharacter();
        udonariumCharacter.common = new UdonariumCharacter_1.Common(monster.name, monster.size);
        const data = new UdonariumCharacter_1.Detail("データ");
        data.addDetailItem(new UdonariumCharacter_1.NormalResource("ヒット・ポイント", monster.hitPoint.toString()));
        data.addDetailItem(new UdonariumCharacter_1.NormalResource("イニシアチブ", monster.INT.modifier));
        data.addDetailItem(new UdonariumCharacter_1.NormalResource("AC", monster.AC.toString()));
        data.addDetailItem(new UdonariumCharacter_1.NormalResource("移動速度", monster.speed));
        udonariumCharacter.addDetail(data);
        const ability = new UdonariumCharacter_1.Detail("能力値");
        ability.addDetailItem(new UdonariumCharacter_1.NormalResource("【筋力】", monster.STR.value.toString()));
        ability.addDetailItem(new UdonariumCharacter_1.NormalResource("【敏捷力】", monster.DEX.value.toString()));
        ability.addDetailItem(new UdonariumCharacter_1.NormalResource("【耐久力】", monster.CON.value.toString()));
        ability.addDetailItem(new UdonariumCharacter_1.NormalResource("【知力】", monster.INT.value.toString()));
        ability.addDetailItem(new UdonariumCharacter_1.NormalResource("【判断力】", monster.WIS.value.toString()));
        ability.addDetailItem(new UdonariumCharacter_1.NormalResource("【魅力】", monster.CHA.value.toString()));
        udonariumCharacter.addDetail(ability);
        const save = new UdonariumCharacter_1.Detail("セービングスロー");
        save.addDetailItem(new UdonariumCharacter_1.NormalResource("【筋】セーヴ", monster.STR.save.toString()));
        save.addDetailItem(new UdonariumCharacter_1.NormalResource("【敏】セーヴ", monster.DEX.save.toString()));
        save.addDetailItem(new UdonariumCharacter_1.NormalResource("【耐】セーヴ", monster.CON.save.toString()));
        save.addDetailItem(new UdonariumCharacter_1.NormalResource("【知】セーヴ", monster.INT.save.toString()));
        save.addDetailItem(new UdonariumCharacter_1.NormalResource("【判】セーヴ", monster.WIS.save.toString()));
        save.addDetailItem(new UdonariumCharacter_1.NormalResource("【魅】セーヴ", monster.CHA.save.toString()));
        udonariumCharacter.addDetail(save);
        const traits = new UdonariumCharacter_1.Detail("特徴");
        monster.treats.forEach(trait => {
            const treatItem = new UdonariumCharacter_1.ContainerItem(trait.name);
            trait.contents.forEach((content, index) => {
                treatItem.addDetailItem(new UdonariumCharacter_1.NormalResource(index.toString(), content));
            });
            traits.addDetailItem(treatItem);
        });
        udonariumCharacter.addDetail(traits);
        const actions = new UdonariumCharacter_1.Detail("アクション");
        monster.actions.forEach(action => {
            const actionItem = new UdonariumCharacter_1.ContainerItem(action.name);
            action.contents.forEach((content, index) => {
                actionItem.addDetailItem(new UdonariumCharacter_1.NormalResource(index.toString(), content));
            });
            traits.addDetailItem(actionItem);
        });
        udonariumCharacter.addDetail(actions);
        const chatPallette = new UdonariumCharacter_1.Chatpallette("DungeonsAndDoragons", this.chatpalette());
        udonariumCharacter.chatpallette = chatPallette;
        return udonariumCharacter;
    }
    chatpalette() {
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
1d20&gt;=10 {name}の死亡セーヴィング・スロー！

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
exports.Monstar2UdonarimuCharacter = Monstar2UdonarimuCharacter;
// -<data name="能力値">
// <data name="【筋力】">21</data>
// <data name="【敏捷力】">9</data>
// <data name="【耐久力】">15</data>
// <data name="【知力】">18</data>
// <data name="【判断力】">15</data>
// <data name="【魅力】">18</data>
// </data>
//# sourceMappingURL=Monstar2UdonarimuCharacter.js.map