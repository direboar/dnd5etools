# D&D5etools [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/TK11235/udonarium/blob/master/LICENSE)

D&D5版関連のユーティリティプログラムです。  
以下の機能を提供しています。  

- [モンスターキャラコマ作成機能](#モンスターキャラコマ作成機能)


# インストール

```bash
git colne https://github.com/direboar/dnd5etools.git
npm install
```

# 各機能の詳細
## モンスターキャラコマ作成機能

D&D5版 SRDのモンスターデータを元に、ユドナリウムのキャラクターデータを自動作成する機能です。  
詳細は、[リンク先ドキュメント](https://direboar.github.io/githubpage-test/dist/#/udonarium)を参照してください。

### プログラム実行方法

#### 設定ファイルの作成
./config/development.jsonファイルを作成してください。ファイルの内容は以下の通りにしてください。  

```json
{
}
```

#### プログラムの実行

```bash
npm run start
```

上記のコマンドを実行すると、outディレクトリにZIP形式のファイルが作成されます。  

### 自動翻訳機能

詳細画面の「特徴」「アクション」「レジェンダリーアクション」については、原文と対となるように日本語訳をつけることが可能です。  
日本語訳を行う場合の手順を説明します。  

#### 翻訳APIの作成
翻訳を行うためのAPIを、Google Apps Script上で作成します。  
Google Apps ScriptへのAPI作成手順は、[Qiita](https://t.co/yq5xXAislm)記事などを参考にしてください。  
作成するスクリプトの実装は以下の通りです。  

```javascript
function doPost(e) {
    var p = JSON.parse(e.postData.getDataAsString());
    var translatedText = LanguageApp.translate(p.text, p.source, p.target);
    var body;
    if (translatedText) {
        body = {
          code: 200,
          text: translatedText
        };
    } else {
        body = {
          code: 400,
          text: "Bad Request"
        };
    }
    var response = ContentService.createTextOutput();
    response.setMimeType(ContentService.MimeType.JSON);
    response.setContent(JSON.stringify(body));

    return response;
}
```

#### 自動翻訳の有効化
./config/development.jsonを編集し、以下のように設定してください。  
```json
{
    "translate" : {
        "enable" : false,
        "url" : "作成した翻訳APIのURLを指定します",
    }
}
```

### BasicRule以外のモンスターデータに関する自動翻訳の有効化  
basicRuleFilterの設定を変更することで、BasicRule以外のモンスターデータに関する自動翻訳を行うことができます。    
ただし、BasicRule以外のモンスターデータの一般配布は、HJ社の営業妨害行為になる可能性があるため、個人での利用にとどめてください。
### SRD以外のモンスターのコマ作成 
以下の内容は未検証です。  
このデータの入力データは、おそらく[このRubyスクリプト](https://gist.github.com/tkfu/bc5dc2c6cee4d1e582a3d369c3077bb5)で作成されています。  
D&D Beyondで有料コンテンツを購入されている場合、上記のスクリプトを参考にすれば、有料コンテンツデータのスクレイピングができると思います。  
OAuth認証の突破に関しては、[このへん](https://qiita.com/sqrtxx/items/ea76209825084c3938ce)が参考になりそうです。  

# License

[MIT License](https://github.com/TK11235/udonarium/blob/master/LICENSE)
