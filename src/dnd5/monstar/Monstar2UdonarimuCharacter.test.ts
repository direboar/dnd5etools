import {Monstar,Ability,TreatsAndAction,Size} from "./Monstar"
import {Monstar2UdonarimuCharacter} from "./Monstar2UdonarimuCharacter"
import {UdonariumCharacter2XML} from "../../utils/UdonariumCharacter2XML"

// test('hello', () => {
//     const converter = new Monstar2UdonarimuCharacter()
    
//     const monster = new Monstar()
//     monster.name = "名前"
//     monster.size = Size.Large

//     monster.hitPoint = 40
//     monster.AC = 10
//     monster.speed = "speed"

//     monster.STR = new Ability(11,"+1","+2")
//     monster.DEX = new Ability(11,"+1","+2")
//     monster.INT = new Ability(11,"+1","+2")
//     monster.CON = new Ability(11,"+1","+2")
//     monster.WIS = new Ability(11,"+1","+2")
//     monster.CHA = new Ability(11,"+1","+2")

//     const traits1 = new TreatsAndAction("特徴１")
//     traits1.contents.push("111")
//     traits1.contents.push("222")
//     monster.treats.push(traits1)

//     const traits2 = new TreatsAndAction("特徴2")
//     traits2.contents.push("aaa")
//     traits2.contents.push("bbb")
//     monster.treats.push(traits2)

//     const action1 = new TreatsAndAction("アクション１")
//     action1.contents.push("aaa")
//     action1.contents.push("bbb")
//     monster.actions.push(action1)

//     const action2 = new TreatsAndAction("アクション２")
//     action2.contents.push("111")
//     action2.contents.push("222")
//     monster.actions.push(action2)

//     const character = converter.convert(monster)
//     // console.log(JSON.stringify(character))

//     const xml = new UdonariumCharacter2XML().buildXml(character)
//     console.log(xml)

// })

// test('formatName', () => {
//     const converter = new Monstar2UdonarimuCharacter()
//     expect(converter.formatName('Acolyt')).toBe('Acolyt　　　　　')
//     expect(converter.formatName('Acolyte')).toBe('Acolyte　　　　')
//     expect(converter.formatName('Acolytee')).toBe('Acolytee　　　　')
// })
