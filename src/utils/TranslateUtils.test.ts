import {TranslateUtils} from "./TranslateUtils"

test('testTranslateUtils', async() => {
    
    const utils  = new TranslateUtils()
    const actual = await utils.translate(" Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 18 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours. ")
console.log(actual)

});
