import {Monstar2UdonarimuCharacter} from "./Monstar2UdonarimuCharacter"
import {ScrapingMonsterJsonParser} from "./ScrapingMonsterJsonParser"
import {UdonariumCharacter2XML} from "../../utils/UdonariumCharacter2XML"
import {CharacterZipFlieCreator} from "../../utils/CharacterZipFlieCreator"

test('hello', async() => {

    // const filePath = "./files/srd_5e_monsters.json"
    // const monstars = new ScrapingMonsterJsonParser().parse(filePath)

    // const monstar2UdonarimuCharacter = new Monstar2UdonarimuCharacter()
    // const udonariumCharacter = monstar2UdonarimuCharacter.convert(monstars[0])

    // const builder = new UdonariumCharacter2XML()
    // const xml = builder.buildXml(udonariumCharacter)
    // const zipCreator = new CharacterZipFlieCreator(udonariumCharacter,monstars[0].imageUrl)
    // await zipCreator.createZipFile()

    // const converter = new Monstar2UdonarimuCharacter()
    
    // const monster = new Monstar()
    // monster.name = "名前"
    // monster.size = Size.Large

    // monster.hitPoint = 40
    // monster.AC = 10
    // monster.speed = "speed"

    // monster.STR = new Ability(11,"+1","+2")
    // monster.DEX = new Ability(11,"+1","+2")
    // monster.INT = new Ability(11,"+1","+2")
    // monster.CON = new Ability(11,"+1","+2")
    // monster.WIS = new Ability(11,"+1","+2")
    // monster.CHA = new Ability(11,"+1","+2")

    // const traits1 = new TreatsAndAction("特徴１")
    // traits1.contents.push("111")
    // traits1.contents.push("222")
    // monster.treats.push(traits1)

    // const traits2 = new TreatsAndAction("特徴2")
    // traits2.contents.push("aaa")
    // traits2.contents.push("bbb")
    // monster.treats.push(traits2)

    // const action1 = new TreatsAndAction("アクション１")
    // action1.contents.push("aaa")
    // action1.contents.push("bbb")
    // monster.actions.push(action1)

    // const action2 = new TreatsAndAction("アクション２")
    // action2.contents.push("111")
    // action2.contents.push("222")
    // monster.actions.push(action2)

    // const character = converter.convert(monster)
    // // console.log(JSON.stringify(character))

    // const xml = new UdonariumCharacterBuilder().buildXml(character)
    // console.log(xml)

})

test('testParseAttack', () => {
    const parser = new ScrapingMonsterJsonParser()
    let text = '<p><em><strong>Scimitar.</strong></em> <em>Melee Weapon Attack:</em> +3 to hit, reach 5 ft., one target. <em>Hit:</em> 4 (1d6 + 1) slashing damage. </p><p><em><strong>Light Crossbow.</strong></em> <em>Ranged Weapon Attack:</em> +3 to hit, range 80 ft./320 ft., one target. <em>Hit:</em> 5 (1d8 + 1) piercing damage.</p>'
    let ret = parser.parseAttacks(text)
    expect(ret.length).toBe(2)
    expect(ret[0].name).toBe('Scimitar.')
    expect(ret[0].attackRole).toBe('+3')
    expect(ret[0].damageRole).toBe('1d6+1 :  4 (1d6 + 1) slashing damage. ')
    expect(ret[1].name).toBe('Light Crossbow.')
    expect(ret[1].attackRole).toBe('+3')
    expect(ret[1].damageRole).toBe('1d8+1 :  5 (1d8 + 1) piercing damage.')

    text = '<p><em><strong>Multiattack.</strong></em> The balor makes two attacks: one with its longsword and one with its whip. </p><p><em><strong>Longsword.</strong></em> <em>Melee Weapon Attack:</em> +14 to hit, reach 10 ft., one target. <em>Hit:</em> 21 (3d8 + 8) slashing damage plus 13 (3d8) lightning damage. If the balor scores a critical hit, it rolls damage dice three times, instead of twice. </p><p><em><strong>Whip.</strong></em> <em>Melee Weapon Attack:</em> +14 to hit, reach 30 ft., one target. <em>Hit:</em> 15 (2d6 + 8) slashing damage plus 10 (3d6) fire damage, and the target must succeed on a DC 20 Strength saving throw or be pulled up to 25 feet toward the balor. </p><p><em><strong>Teleport.</strong></em> The balor magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see.</p>'
    ret = parser.parseAttacks(text)
    expect(ret.length).toBe(2)
    expect(ret[0].name).toBe('Longsword.')
    expect(ret[0].attackRole).toBe('+14')
    expect(ret[0].damageRole).toBe('3d8+8+3d8 :  21 (3d8 + 8) slashing damage plus 13 (3d8) lightning damage. If the balor scores a critical hit, it rolls damage dice three times, instead of twice. ')
    expect(ret[1].name).toBe('Whip.')
    expect(ret[1].attackRole).toBe('+14')
    expect(ret[1].damageRole).toBe('2d6+8+3d6 :  15 (2d6 + 8) slashing damage plus 10 (3d6) fire damage, and the target must succeed on a DC 20 Strength saving throw or be pulled up to 25 feet toward the balor. ')

    // console.log(parser.parseAttacks(text))
    text = "<p><em><strong>Multiattack. (Vampire Form Only).</strong></em> The vampire makes two attacks, only one of which can be a bite attack. </p><p><em><strong>Unarmed Strike (Vampire Form Only).</strong></em> <em>Melee Weapon Attack:</em> +9 to hit, reach 5 ft., one creature. <em>Hit:</em> 8 (1d8 + 4) bludgeoning damage. Instead of dealing damage, the vampire can grapple the target (escape DC 18). </p><p><em><strong>Bite. (Bat or Vampire Form Only).</strong></em> <em>Melee Weapon Attack:</em> +9 to hit, reach 5 ft., one willing creature, or a creature that is grappled by the vampire, incapacitated, or restrained. <em>Hit:</em> 7 (1d6 + 4) piercing damage plus 10 (3d6) necrotic damage. The target's hit point maximum is reduced by an amount equal to the necrotic damage taken, and the vampire regains hit points equal to that amount. The reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0. A humanoid slain in this way and then buried in the ground rises the following night as a vampire spawn under the vampire's control. </p><p><em><strong>Charm.</strong></em> The vampire targets one humanoid it can see within 30 feet of it. If the target can see the vampire, the target must succeed on a DC 17 Wisdom saving throw against this magic or be charmed by the vampire. The charmed target regards the vampire as a trusted friend to be heeded and protected. Although the target isn't under the vampire's control, it takes the vampire's requests or actions in the most favorable way it can, and it is a willing target for the vampire's bite attack.</p><p>Each time the vampire or the vampire's companions do anything harmful to the target, it can repeat the saving throw, ending the effect on itself on a success. Otherwise, the effect lasts 24 hours or until the vampire is destroyed, is on a different plane of existence than the target, or takes a bonus action to end the effect. </p><p><em><strong>Children of the Night (1/Day).</strong></em> The vampire magically calls 2d4 swarms of bats or rats (swarm of bats, swarm of rats), provided that the sun isn't up. While outdoors, the vampire can call 3d6 wolves (wolf) instead. The called creatures arrive in 1d4 rounds, acting as allies of the vampire and obeying its spoken commands. The beasts remain for 1 hour, until the vampire dies, or until the vampire dismisses them as a bonus action.</p>"
    ret = parser.parseAttacks(text)

    expect(ret.length).toBe(2)
    expect(ret[0].name).toBe('Unarmed Strike (Vampire Form Only).')
    expect(ret[0].attackRole).toBe('+9')
    expect(ret[0].damageRole).toBe('1d8+4 :  8 (1d8 + 4) bludgeoning damage. Instead of dealing damage, the vampire can grapple the target (escape DC 18). ')
    expect(ret[1].name).toBe('Bite. (Bat or Vampire Form Only).')
    expect(ret[1].attackRole).toBe('+9')
    expect(ret[1].damageRole).toBe("1d6+4+3d6 :  7 (1d6 + 4) piercing damage plus 10 (3d6) necrotic damage. The target's hit point maximum is reduced by an amount equal to the necrotic damage taken, and the vampire regains hit points equal to that amount. The reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0. A humanoid slain in this way and then buried in the ground rises the following night as a vampire spawn under the vampire's control. ")

    //druid.
    text = "<p><em><strong>Quarterstaff.</strong></em> <em>Melee Weapon Attack:</em> +2 to hit (+4 to hit with shillelagh), reach 5 ft., one target. <em>Hit:</em> 3 (1d6) bludgeoning damage, 4 (1d8) bludgeoning damage if wielded with two hands, or 6 (1d8 + 2) bludgeoning damage with shillelagh.</p>"
    ret = parser.parseAttacks(text)
    expect(ret.length).toBe(1)
    expect(ret[0].name).toBe('Quarterstaff.')
    expect(ret[0].attackRole).toBe('+2')
    expect(ret[0].damageRole).toBe('1d6 :  3 (1d6) bludgeoning damage, 4 (1d8) bludgeoning damage if wielded with two hands, or 6 (1d8 + 2) bludgeoning damage with shillelagh.')

})
