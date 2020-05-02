"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UdonariumCharacter_1 = require("./UdonariumCharacter");
const UdonariumCharacter2XML_1 = require("./UdonariumCharacter2XML");
test('hello', () => {
    const charcter = new UdonariumCharacter_1.UdonariumCharacter();
    charcter.imageHashSHA256 = "AAAAAAAA";
    charcter.common = new UdonariumCharacter_1.Common("名前", 2);
    const detail = new UdonariumCharacter_1.Detail("詳細1");
    detail.addDetailItem(new UdonariumCharacter_1.NormalResource("リソース1", "Content1"));
    detail.addDetailItem(new UdonariumCharacter_1.NoteResource("Note11", "ノート\r\nだよ"));
    detail.addDetailItem(new UdonariumCharacter_1.NumberResource("HP1", 100, 200));
    charcter.addDetail(detail);
    const detai2 = new UdonariumCharacter_1.Detail("詳細2");
    detai2.addDetailItem(new UdonariumCharacter_1.NormalResource("リソース2", "Content2"));
    detai2.addDetailItem(new UdonariumCharacter_1.NoteResource("Note12", "ノート\r\nだよ"));
    detai2.addDetailItem(new UdonariumCharacter_1.NumberResource("HP2", 100, 200));
    const nestItem = new UdonariumCharacter_1.ContainerItem("container");
    nestItem.addDetailItem(new UdonariumCharacter_1.NormalResource("リソース2", "Content2"));
    nestItem.addDetailItem(new UdonariumCharacter_1.NoteResource("Note12", "ノート\r\nだよ"));
    nestItem.addDetailItem(new UdonariumCharacter_1.NumberResource("HP2", 100, 200));
    detai2.addDetailItem(nestItem);
    charcter.addDetail(detai2);
    const chatPalletteText = `▼能力値判定`;
    const chatPallette = new UdonariumCharacter_1.Chatpallette("DungeonsAndDoragons", chatPalletteText);
    charcter.chatpallette = chatPallette;
    const actual = new UdonariumCharacter2XML_1.UdonariumCharacter2XML().buildXml(charcter);
    console.log(actual);
    //     const expected = `<?xml version="1.0" encoding="UTF-8"?>
    // <character>
    //   <data name="character">
    //     <data name="image">
    //       <data name="imageIdentifier" type="image">AAAAAAAA</data>
    //     </data>
    //     <data name="common">
    //       <data name="name">名前</data>
    //       <data name="size">2</data>
    //     </data>
    //     <data name="detail">
    //       <data name="詳細1">
    //         <data name="リソース1">Content1</data>
    //         <data name="Note11" type="note">ノート&#13;
    // だよ</data>
    //         <data name="HP1" type="numberResource" currentValue="100">200</data>
    //       </data>
    //       <data name="詳細2">
    //         <data name="リソース2">Content2</data>
    //         <data name="Note12" type="note">ノート&#13;
    // だよ</data>
    //         <data name="HP2" type="numberResource" currentValue="100">200</data>
    //       </data>
    //     </data>
    //   </data>
    //   <chat-palette dicebot="DungeonsAndDoragons">▼能力値判定</chat-palette>
    // </character>`
    // console.log(expected)
    // console.log(actual)
    //     expect(expected).toBe(actual)
});
//# sourceMappingURL=UdonariumCharacter2XML.test.js.map