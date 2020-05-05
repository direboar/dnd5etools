import { Monstar2UdonarimuCharacter } from "./Monstar2UdonarimuCharacter"
import { ScrapingMonsterJsonParser } from "./ScrapingMonsterJsonParser"
import { CharacterZipFlieCreator } from "../../utils/CharacterZipFlieCreator"

import { BasicRule } from "./BasicRule"

import * as fs from 'fs'
//型ファイルがない
var fsExtra = require('fs-extra');

class Main {
    public async main(filePath = "./files/srd_5e_monsters.json", outdir = "./out/") {
        this.initOutDir(outdir)
        BasicRule.load()
        const monstars = new ScrapingMonsterJsonParser().parse(filePath)

        const monstar2UdonarimuCharacter = new Monstar2UdonarimuCharacter()
        for (const monstar of monstars) {
            try {
                const udonariumCharacter = await monstar2UdonarimuCharacter.convert(monstar)
                const zipCreator = new CharacterZipFlieCreator(udonariumCharacter, monstar.imageUrl, outdir)
                await zipCreator.createZipFile()
            } catch (error) {
                console.error(error)
            }
        }
    }

    private initOutDir(dir: string): void {
        fsExtra.removeSync(dir);
        fs.mkdirSync(dir)
    }

}

new Main().main()

