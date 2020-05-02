"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const crypto = __importStar(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const memory_streams_1 = __importDefault(require("memory-streams"));
const UdonariumCharacter2XML_1 = require("./UdonariumCharacter2XML");
//型ファイルがおかしそう
const archiver = require("archiver");
class CharacterZipFlieCreator {
    constructor(udonariumCharacter, imageUrl) {
        this.imageBinary = null;
        this.imageHashSHA256 = null;
        this.udonariumCharacter = udonariumCharacter;
        this.imageUrl = imageUrl;
    }
    async createZipFile() {
        //1.urlからimageファイルを作成
        const imageHashSHA256 = await this.loadImage(this.imageUrl);
        //2.imageHashを設定
        this.udonariumCharacter.imageHashSHA256 = imageHashSHA256;
        //3.xmlに変換
        const xml = new UdonariumCharacter2XML_1.UdonariumCharacter2XML().buildXml(this.udonariumCharacter);
        //4.zip生成
        await this.saveFiles(xml);
        await this.compress();
    }
    loadImage(imageUrl) {
        this.imageUrl = imageUrl;
        return new Promise((resolve, reject) => {
            axios_1.default({
                method: "get",
                url: imageUrl,
                responseType: "stream",
            }).then((response) => {
                const responseStream = response.data;
                const writeStream = new memory_streams_1.default.WritableStream();
                const data = [];
                // const shasum = crypto.createHash('sha256');
                responseStream.on('readable', () => {
                    let chunk;
                    while (null !== (chunk = responseStream.read())) {
                        data.push(chunk);
                    }
                });
                responseStream.on('close', (chunk) => {
                    this.imageBinary = Buffer.concat(data);
                    // console.log(buffer.buffer)
                    const imageHashSHA256 = this.getImageHashSHA256();
                    if (imageHashSHA256) {
                        resolve(imageHashSHA256);
                    }
                    else {
                        resolve();
                    }
                });
                responseStream.pipe(writeStream);
            });
        });
    }
    getImageHashSHA256() {
        if (this.imageHashSHA256) {
            return this.imageHashSHA256;
        }
        if (this.imageBinary) {
            const shasum = crypto.createHash('sha256');
            shasum.update(this.imageBinary);
            return shasum.digest('hex');
        }
        else {
            return null;
        }
    }
    saveFiles(xml) {
        //1.xmlを出力
        fs.writeFileSync(`./out/${this.getXmlFileName()}`, xml, "utf-8");
        //2.imageを出力
        if (this.imageBinary) {
            fs.writeFileSync(`./out/${this.getImageFileName()}`, this.imageBinary);
        }
    }
    async compress() {
        var output = fs.createWriteStream(`./out/${this.getZipFileName()}`);
        const archive = archiver("zip", {
            zlib: { level: 9 },
        });
        archive.pipe(output);
        archive.append(fs.createReadStream(`./out/${this.getXmlFileName()}`), {
            name: this.getXmlFileName(),
        });
        // archive.append(fs.createReadStream(`./out/${this.getImageFileName()}`, { encoding : null }), {
        archive.append(fs.createReadStream(`./out/${this.getImageFileName()}`, {}), {
            name: this.getImageFileName(),
        });
        await archive.finalize();
    }
    getZipFileName() {
        var _a;
        return `${(_a = this.udonariumCharacter.common) === null || _a === void 0 ? void 0 : _a.name}.zip`;
    }
    getXmlFileName() {
        var _a;
        return `${(_a = this.udonariumCharacter.common) === null || _a === void 0 ? void 0 : _a.name}.xml`;
    }
    getImageFileName() {
        return `${this.getImageHashSHA256()}.${this.getExt()}`;
    }
    getExt() {
        if (this.imageUrl) {
            const index = this.imageUrl.lastIndexOf(".");
            return this.imageUrl.substr(index + 1);
        }
        else {
            return "";
        }
    }
}
exports.CharacterZipFlieCreator = CharacterZipFlieCreator;
//# sourceMappingURL=CharacterZipFlieCreator.js.map