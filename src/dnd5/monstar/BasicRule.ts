import * as fs from 'fs'

//型ファイルがない
const conf = require('config');

class BasicRule{
    private static monstars : Array<string> = []

    public static load() {
        const srddata = fs.readFileSync("./config/basicrule.txt", "utf-8");
        srddata.split("\r\n").forEach(line=>{
            BasicRule.monstars.push(BasicRule.format(line))
        })
    }

    public static contains(monstarName: string) : boolean{
        if(conf.translate.basicRuleFilter){
            return BasicRule.monstars.indexOf(BasicRule.format(monstarName)) >= 0
        }else{
            return true
        }
    }

    private static format(mosntarName : string) : string{
        return mosntarName.replace(/ /g,"").toLowerCase()
    }

}

export{BasicRule}