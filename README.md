# 編輯器無障礙檢查

## 安裝方式
- Joomla > 後台管理 > 擴充套件 > 管理 > 安裝
- 由網址安裝
- 貼上網址使用最新「 https://github.com/fdjkgh580/joomla-extension-handicapfree/archive/master.zip 」或是使用版本號 「 https://github.com/fdjkgh580/joomla-extension-handicapfree/archive/0.1.0.zip 」

## 設定
- Joomla > 後台管理 > 擴充套件 > 外掛 > 搜尋「plgSystemHandicapfree」
- 啟用外掛
- 點擊 plgSystemHandicapfree 進入設定
- 在「斷行分隔要啟用比對的網址」貼上要比對的網址。例如希望在「內容 > 文章 > 新增文章」啟用外掛，那麼因為新增文章的網址是「 http://domain/joomla-dev/administrator/index.php?option=com_content&view=article&layout=edit 」，所以我們將網址貼上。在修改文章時網址會出現 「......&id=3」，但因為是比對出現次數，前方的網址字串符合我們的設定網址，所以在修改文章時同樣會啟用外掛。
- 想在不同編輯器啟用外掛，就貼上不同的比對網址。注意，使用 Enter 鍵斷行即可。

## 送出後自動處理
### ````<img>````
- 使用 ````<figure>```` 包圍
- 若外層是 ````<p>````、````<div>```` 則會脫離放置緊鄰的下個元素
- 僅保留屬性 src、alt

### ````<table>````
- ````<table>```` 移除所有屬性
- ````<th>```` 自動添加屬性 scope="col"，移除所有屬性除了 scope、colspan、rowspan
- ````<td>```` 自動添加屬性 scope="col"，移除所有屬性除了 colspan、rowspan

### ````<a>```` ````<figure>````
- 若空白內容，則移除元素
 
## 編輯時的檢測
- 若 ````<a>```` 使用微軟檔案，如 .docx 則需要添加對應名稱的 PDF 文件
- 若 ````<a>```` 出現超過 1 次以上的連結網址，會出現警告要求合併
- 檢查 ````<table>```` 中是否包含 ````<th>````
