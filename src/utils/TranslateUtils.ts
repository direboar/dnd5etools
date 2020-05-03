import axios from 'axios'

//型ファイルがない
const conf = require('config');

class TranslateUtils {

    public async translate(text: string, source = "en", target = "ja"): Promise<string> {
        console.log(conf.translate)
        if(!conf.translate.enable){
            return "翻訳は無効です"
        }
        try{
            const url = conf.translate.url
            const response = await axios.post(url, {
                text: text,
                source: source,
                target: target
            })
            return response.data.text
        }catch(error){
            console.log(`error :  ${error}`);
            throw error;
        }
    }

}


function main(){
    const util = new TranslateUtils()
    util.translate("hello").then(text=>{
        console.log(text)
    })
}

main()

export {TranslateUtils}