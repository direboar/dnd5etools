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

    //djinni
    text = "<p><em><strong>Multiattack.</strong></em> The djinni makes three scimitar attacks. </p><p><em><strong>Scimitar.</strong></em> <em>Melee Weapon Attack:</em> +9 to hit, reach 5 ft., one target. <em>Hit:</em> 12 (2d6 + 5) slashing damage plus 3 (1d6) lightning or thunder damage (djinni's choice). </p><p><em><strong>Create Whirlwind.</strong></em> A 5-foot-radius, 30-foot-tall cylinder of swirling air magically forms on a point the djinni can see within 120 feet of it. The whirlwind lasts as long as the djinni maintains concentration (as if concentrating on a spell). Any creature but the djinni that enters the whirlwind must succeed on a DC 18 Strength saving throw or be restrained by it. The djinni can move the whirlwind up to 60 feet as an action, and creatures restrained by the whirlwind move with it. The whirlwind ends if the djinni loses sight of it.</p><p>A creature can use its action to free a creature restrained by the whirlwind, including itself, by succeeding on a DC 18 Strength check. If the check succeeds, the creature is no longer restrained and moves to the nearest space outside the whirlwind.</p>"
    ret = parser.parseAttacks(text)
    expect(ret.length).toBe(1)
    expect(ret[0].name).toBe('Scimitar.')
    expect(ret[0].attackRole).toBe('+9')
    expect(ret[0].damageRole).toBe("2d6+5+1d6 :  12 (2d6 + 5) slashing damage plus 3 (1d6) lightning or thunder damage (djinni's choice). ")

    //TODO 以下パースできない、、
    //will-owisp
    text = "<p><em><strong>Shock.</strong></em> Melee Spell Attack: +4 to hit, reach 5 ft., one creature. <em>Hit:</em> 9 (2d8) lightning damage. </p><p><em><strong>Invisibility.</strong></em> The will-o'-wisp and its light magically become invisible until it attacks or uses its Consume Life, or until its concentration ends (as if concentrating on a spell).</p>"
    ret = parser.parseAttacks(text)
    expect(ret.length).toBe(1)
    expect(ret[0].name).toBe('Shock.')
    expect(ret[0].attackRole).toBe('+4')
    expect(ret[0].damageRole).toBe("2d8 :  9 (2d8) lightning damage. ")
//archmage
    text = "<p><em><strong>Dagger.</strong></em> <em>Melee or <em>Ranged Weapon Attack:</em></em> +6 to hit, reach 5 ft. or range 20/60 ft., one target. <em>Hit:</em> 4 (1d4 + 2) piercing damage.</p>"
    ret = parser.parseAttacks(text)
    // console.log(ret)
    expect(ret.length).toBe(1)
    expect(ret[0].name).toBe('Dagger.')
    expect(ret[0].attackRole).toBe('+6')
    expect(ret[0].damageRole).toBe("1d4+2 :  4 (1d4 + 2) piercing damage.")
//Bugbear    
    text = "<p><em><strong>Morningstar.</strong></em> <em>Melee Weapon Attack:</em> +4 to hit, reach 5 ft., one target. <em>Hit:</em> 11 (2d8 + 2) piercing damage. </p><p><em><strong>Javelin.</strong></em> <em>Melee or Ranged Weapon Attack:</em> +4 to hit, reach 5 ft. or range 30/120 ft., one target. <em>Hit:</em> 9 (2d6 + 2) piercing damage in melee or 5 (1d6 + 2) piercing damage at range.</p>"
    ret = parser.parseAttacks(text)
    // console.log(ret)
    expect(ret.length).toBe(2)
    expect(ret[0].name).toBe('Morningstar.')
    expect(ret[0].attackRole).toBe('+4')
    expect(ret[0].damageRole).toBe("2d8+2 :  11 (2d8 + 2) piercing damage. ")
    expect(ret[1].name).toBe('Javelin.')
    expect(ret[1].attackRole).toBe('+4')
    expect(ret[1].damageRole).toBe("2d6+2 :  9 (2d6 + 2) piercing damage in melee or 5 (1d6 + 2) piercing damage at range.")

    //drow error.
    // text = "<p><em><strong>Shortsword.</strong></em> <em>Melee Weapon Attack:</em> +4 to hit, reach 5 ft., one target. <em>Hit:</em> 5 (1d6 + 2) piercing damage.</p><p><em><strong>Hand Crossbow.</strong></em> <em>Ranged Weapon Attack:</em> +4 to hit, range 30/120 ft., one target. Hit: 5 (1d6 + 2) piercing damage.</p>"
    text = "<p><em><strong>Shortsword.</strong></em> <em>Melee Weapon Attack:</em> +4 to hit, reach 5 ft., one target. <em>Hit:</em> 5 (1d6 + 2) piercing damage.</p><p><em><strong>Hand Crossbow.</strong></em> <em>Ranged Weapon Attack:</em> +4 to hit, range 30/120 ft., one target. Hit: 5 (1d6 + 2) piercing damage, and the target must succeed on a DC 13 Constitution saving throw or be poisoned for 1 hour. If the saving throw fails by 5 or more, the target is also unconscious while poisoned in this way. The target wakes up if it takes damage or if another creature takes an action to shake it awake.</p>"
    ret = parser.parseAttacks(text)
    expect(ret.length).toBe(2)
    expect(ret[0].name).toBe('Shortsword.')
    expect(ret[0].attackRole).toBe('+4')
    expect(ret[0].damageRole).toBe("1d6+2 :  5 (1d6 + 2) piercing damage.")
    expect(ret[1].name).toBe('Hand Crossbow.')
    expect(ret[1].attackRole).toBe('+4')
    expect(ret[1].damageRole).toBe("1d6+2 :  5 (1d6 + 2) piercing damage, and the target must succeed on a DC 13 Constitution saving throw or be poisoned for 1 hour. If the saving throw fails by 5 or more, the target is also unconscious while poisoned in this way. The target wakes up if it takes damage or if another creature takes an action to shake it awake.")
    
    text = "<p><em><strong>Claws.</strong></em>(Hag Form Only). <em>Melee Weapon Attack:</em> +7 to hit, reach 5 ft., one target. <em>Hit:</em> 13 (2d8 + 4) slashing damage. </p><p><em><strong>Change Shape.</strong></em> The hag magically polymorphs into a Small or Medium female humanoid, or back into her true form. Her statistics are the same in each form. Any equipment she is wearing or carrying isn't transformed. She reverts to her true form if she dies. </p><p><em><strong>Etherealness.</strong></em> The hag magically enters the Ethereal Plane from the Material Plane, or vice versa. To do so, the hag must have a heartstone in her possession. </p><p><em><strong>Nightmare Haunting (1/Day).</strong></em> While on the Ethereal Plane, the hag magically touches a sleeping humanoid on the Material Plane. A protection from evil and good spell cast on the target prevents this contact, as does a magic circle. As long as the contact persists, the target has dreadful visions. If these visions last for at least 1 hour, the target gains no benefit from its rest, and its hit point maximum is reduced by 5 (1d10). If this effect reduces the target's hit point maximum to 0, the target dies, and if the target was evil, its soul is trapped in the hag's soul bag. The reduction to the target's hit point maximum lasts until removed by the greater restoration spell or similar magic.</p>"
    // text = "<p><em><strong>Claws.</strong></em>(Hag Form Only). <em>Melee Weapon Attack:</em> +7 to hit, reach 5 ft., one target. <em>Hit:</em> 13 (2d8 + 4) slashing damage. </p><p><em><strong>Change Shape.</strong></em> The hag magically polymorphs into a Small or Medium female humanoid, or back into her true form. Her statistics are the same in each form. Any equipment she is wearing or carrying isn't transformed. She reverts to her true form if she dies. </p><p><em><strong>Etherealness.</strong></em> The hag magically enters the Ethereal Plane from the Material Plane, or vice versa. To do so, the hag must have a heartstone in her possession. </p><p><em><strong>Nightmare Haunting (1/Day).</strong></em> While on the Ethereal Plane, the hag magically touches a sleeping humanoid on the Material Plane. A protection from evil and good spell cast on the target prevents this contact, as does a magic circle. As long as the contact persists, the target has dreadful visions. If these visions last for at least 1 hour, the target gains no benefit from its rest, and its hit point maximum is reduced by 5 (1d10). If this effect reduces the target's hit point maximum to 0, the target dies, and if the target was evil, its soul is trapped in the hag's soul bag. The reduction to the target's hit point maximum lasts until removed by the greater restoration spell or similar magic.</p>"
    ret = parser.parseAttacks(text)
    expect(ret.length).toBe(1)
    expect(ret[0].name).toBe('Claws.')
    expect(ret[0].attackRole).toBe('+7')
    expect(ret[0].damageRole).toBe("2d8+4 :  13 (2d8 + 4) slashing damage. ")
    // console.log(ret)
    
})
// "Actions": "<p><em><strong>Shortsword.</strong></em> <em>Melee Weapon Attack:</em> +4 to hit, reach 5 ft., one target. <em>Hit:</em> 5 (1d6 + 2) piercing damage.</p><p><em><strong>Hand Crossbow.</strong></em> <em>Ranged Weapon Attack:</em> +4 to hit, range 30/120 ft., one target. Hit: 5 (1d6 + 2) piercing damage, and the target must succeed on a DC 13 Constitution saving throw or be poisoned for 1 hour. If the saving throw fails by 5 or more, the target is also unconscious while poisoned in this way. The target wakes up if it takes damage or if another creature takes an action to shake it awake.</p>",

// test('x',()=>{
//     const damageRegex = /[0-9]+ \((?<damage>[0-9d+ ]+)\)[\w ]* damage( plus [0-9]+ \((?<extradamage>[0-9d+ ]+)\)[\w ]* damage)?(?<rest>.+)/m
//     // const damageRegex = /[0-9]+ \((?<damage>[0-9d+ ]+)\) \w* damage( plus [0-9]+ \((?<extradamage>[0-9d+ ]+)\) \w* damage)?(?<rest>.+)/m
//     const parsed = "<p><em><strong>Shortsword.</strong></em> <em>Melee Weapon Attack:</em> +4 to hit, reach 5 ft., one target. <em>Hit:</em> 5 (1d6 + 2) piercing damage.</p><p><em><strong>Hand Crossbow.</strong></em> <em>Ranged Weapon Attack:</em> +4 to hit, range 30/120 ft., one target. Hit: 5 (1d6 + 2) piercing damage, and the target must succeed on a DC 13 Constitution saving throw or be poisoned for 1 hour. If the saving throw fails by 5 or more, the target is also unconscious while poisoned in this way. The target wakes up if it takes damage or if another creature takes an action to shake it awake.</p>".match(damageRegex);
//     console.log(parsed)
    
// })    
// text = "<p><em><strong>Shortsword.</strong></em> <em>Melee Weapon Attack:</em> +4 to hit, reach 5 ft., one target. <em>Hit:</em> 5 (1d6 + 2) piercing damage.</p><p><em><strong>Hand Crossbow.</strong></em> <em>Ranged Weapon Attack:</em> +4 to hit, range 30/120 ft., one target. Hit: 5 (1d6 + 2) piercing damage, and the target must succeed on a DC 13 Constitution saving throw or be poisoned for 1 hour. If the saving throw fails by 5 or more, the target is also unconscious while poisoned in this way. The target wakes up if it takes damage or if another creature takes an action to shake it awake.</p>"
