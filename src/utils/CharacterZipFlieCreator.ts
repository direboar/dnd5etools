import * as fs from 'fs'
import * as crypto from 'crypto'
import axios from 'axios'
import streams from 'memory-streams'

import { UdonariumCharacter } from "./UdonariumCharacter"
import {UdonariumCharacter2XML} from "./UdonariumCharacter2XML"
//型ファイルがおかしそう
const archiver = require("archiver");

class CharacterZipFlieCreator {

    private udonariumCharacter : UdonariumCharacter
    private imageUrl : string 
    private imageBinary: Buffer | null = null
    private imageHashSHA256 : string | null = null
    private outdir : string 


    constructor(udonariumCharacter: UdonariumCharacter,imageUrl : string,outdir : string = "./out/") {
        this.udonariumCharacter = udonariumCharacter;
        this.imageUrl = imageUrl;
        this.outdir = outdir;
    }

    public async createZipFile(){
        //1.urlからimageファイルを作成
        const imageHashSHA256 = await this.loadImage(this.imageUrl)
        
        //2.imageHashを設定
        this.udonariumCharacter.imageHashSHA256 = imageHashSHA256

        //3.xmlに変換
        const xml = new UdonariumCharacter2XML().buildXml(this.udonariumCharacter)

        //4.zip生成
        await this.saveFiles(xml);
        await this.compress();
    }

    public loadImage(imageUrl: string) {
        this.imageUrl = imageUrl
        return new Promise<string>((resolve: (value?: string) => void, reject: (reason?: any) => void) => {
            axios({
                method: "get",
                url: imageUrl,
                responseType: "stream",
            }).then((response) => {
                const responseStream = response.data
                const writeStream = new streams.WritableStream();

                const data: Array<Uint8Array> = []
                // const shasum = crypto.createHash('sha256');
                responseStream.on('readable', () => {
                    let chunk;
                    while (null !== (chunk = responseStream.read())) {
                        data.push(chunk);
                    }
                });
                responseStream.on('end', (chunk: any) => {
                    this.imageBinary = Buffer.concat(data);
                    // console.log(buffer.buffer)
                    const imageHashSHA256 = this.getImageHashSHA256();
                    if(imageHashSHA256){
                        resolve(imageHashSHA256);
                    }else{
                        resolve()
                    }
                })
                responseStream.pipe(writeStream)
            }).catch((error)=>{
                reject(error)
            });
        });
    }

    public getImageHashSHA256(): string | null {
        if(this.imageHashSHA256){
            return this.imageHashSHA256
        }
        if (this.imageBinary) {
            const shasum = crypto.createHash('sha256');
            shasum.update(this.imageBinary)
            return shasum.digest('hex');
        } else {
            return null
        }
    }

    private saveFiles(xml : string) {
        //1.xmlを出力
        fs.writeFileSync(`${this.outdir}${this.getXmlFileName()}`, xml, "utf-8");

        //2.imageを出力
        if(this.imageBinary){
            fs.writeFileSync(`${this.outdir}${this.getImageFileName()}`, this.imageBinary);
        }
    }

    private async compress() {
        var output = fs.createWriteStream(`${this.outdir}${this.getZipFileName()}`);
        const archive = archiver("zip", {
            zlib: { level: 9 }, // Sets the compression level.
        });
        archive.pipe(output);

        archive.append(fs.createReadStream(`${this.outdir}${this.getXmlFileName()}`), {
            name: this.getXmlFileName(),
        });

        // archive.append(fs.createReadStream(`./out/${this.getImageFileName()}`, { encoding : null }), {
        archive.append(fs.createReadStream(`${this.outdir}${this.getImageFileName()}`,{}), {
            name: this.getImageFileName(),
        });

        await archive.finalize();
    }

    public getZipFileName(): string {
        return this.formatFileName(this.udonariumCharacter.common.name,'zip');
    }
    public getXmlFileName(): string {
        return this.formatFileName(this.udonariumCharacter.common.name,'xml');
    }
    public getImageFileName(): string | null{
        const imageHashSHA256 = this.getImageHashSHA256()
        if(imageHashSHA256){
            return this.formatFileName(imageHashSHA256,this.getExt());
        }else{
            return null
        }
    }
    private formatFileName(org : string,ext: string) : string {
        return `${org.replace(/\//g,"").trim()}.${ext}`
    }
    private getExt(): string {
        if(this.imageUrl){
            const index = this.imageUrl.lastIndexOf(".")
            return this.imageUrl.substr(index + 1)
        }else{
            return ""
        }
    }

}

export { CharacterZipFlieCreator }