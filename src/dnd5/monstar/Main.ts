import {Monstar2UdonarimuCharacter} from "./Monstar2UdonarimuCharacter"
import {ScrapingMonsterJsonParser} from "./ScrapingMonsterJsonParser"
import {CharacterZipFlieCreator} from "../../utils/CharacterZipFlieCreator"
import { Monstar } from "./Monstar"

class Main{
    public async main(filePath : string = "./files/srd_5e_monsters.json"){
        const monstars = new ScrapingMonsterJsonParser().parse(filePath)
    
        const monstar2UdonarimuCharacter = new Monstar2UdonarimuCharacter()
        for (const monstar of monstars) {
            const udonariumCharacter = monstar2UdonarimuCharacter.convert(monstar)
            const zipCreator = new CharacterZipFlieCreator(udonariumCharacter,monstar.imageUrl)
            await zipCreator.createZipFile()
        }
    }
}

new Main().main()

