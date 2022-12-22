# PinyinQuiz
中国語の単語クイズを出題します。

## Usage
`node index.js <question file>`

### 問題ファイルの記法
テキストファイルに`単語:ピンイン`のように書くことで問を作成します。
 - 複数の問は改行で区切ってください
 - ピンインを省略(`単語`のように)するとピンインを自動生成します
 - サンプルの問題ファイルが`sample_question.txt`にあります。

### ピンインの解答方法
 - ピンインを入力する際は、声調を数字で表現してください。
 - 軽声は声調を`0`として入力してください。
 - `ü`を入力する場合は`v`としてください。
 - 例: `xuésheng`->`xue2sheng0`, `lǚxíng`->`lv3xing2`

## Environment
テスト環境
 - Ubuntu 20.04.4 LTS (Windows 11 WSL2)
 - Node.js v16.16.0

## Dependencies
 - node-pinyin@0.2.3
 - readline-sync@1.4.10
