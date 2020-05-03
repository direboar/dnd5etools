import axios from 'axios'

//型ファイルがない
const conf = require('config');

class TranslateUtils {

    public async translate(text: string, source = "en", target = "ja"): Promise<string> {
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

export {TranslateUtils}