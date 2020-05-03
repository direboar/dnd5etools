import { UdonariumCharacter, Common, Detail, DetailItem, NormalResource, NoteResource, NumberResource,ContainerItem, ChatPallette } from "./UdonariumCharacter"
import {UdonariumCharacter2XML} from "./UdonariumCharacter2XML"
import {CharacterZipFlieCreator} from "./CharacterZipFlieCreator"

test('testBuildXml', () => {
    
    const character = createCharacter()
    const actual = new UdonariumCharacter2XML().buildXml(character)
console.log(actual)

});

test('testCharacterZipFIleCreator', async() => {
    const creator = new CharacterZipFlieCreator(createCharacter(),"https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/71/1000/1000/636252733510786769.jpeg")

    // const ret = await creator.loadImage("https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/71/1000/1000/636252733510786769.jpeg")

    // const hash = creator.getImageHashSHA256()
    // expect("f5815537cdd20f4b41e946f1c07a62158c9ec93611b991ec6a6c3e716f75d08c").toBe(hash)

    await creator.createZipFile()
})

function createCharacter() : UdonariumCharacter{
    const charcter = new UdonariumCharacter();
    charcter.imageHashSHA256 = "AAAAAAAA"
    charcter.common = new Common("名前",2)
    
    const detail = new Detail("詳細1")
    detail.addDetailItem(new NormalResource("リソース1","Content1"))
    detail.addDetailItem(new NoteResource("Note11","ノート\r\nだよ"))
    detail.addDetailItem(new NumberResource("HP1",100,200))
    charcter.addDetail(detail)

    const detai2 = new Detail("詳細2")
    detai2.addDetailItem(new NormalResource("リソース2","Content2"))
    detai2.addDetailItem(new NoteResource("Note12","ノート\r\nだよ"))
    detai2.addDetailItem(new NumberResource("HP2",100,200))

    const nestItem = new ContainerItem("container")
    nestItem.addDetailItem(new NormalResource("リソース2","Content2"))
    nestItem.addDetailItem(new NoteResource("Note12","ノート\r\nだよ"))
    nestItem.addDetailItem(new NumberResource("HP2",100,200))
    detai2.addDetailItem(nestItem)

    charcter.addDetail(detai2)

    const chatPalletteText = `▼能力値判定`;
    const chatPallette = new ChatPallette("DungeonsAndDoragons",chatPalletteText)
    charcter.chatpallette = chatPallette
    return charcter
}