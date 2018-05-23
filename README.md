# frontpack
將  Susy 3 整合在 webpack 的完整架構，下載後可直接快速開發。

## 說明
預設有三個版面
- mobile
- pad
- desktop 

關於 webpack 建立 Susy 3 環境可以參考[這裡](http://jsnwork.kiiuo.com/archives/2803/css-susy3-%E5%AE%89%E8%A3%9D%E6%95%99%E5%AD%B81%EF%BC%8C%E9%80%8F%E9%81%8E-webpack-%E5%BE%9E%E9%A0%AD%E9%96%8B%E5%A7%8B%E5%BB%BA%E7%AB%8B%E6%9E%B6%E6%A7%8B/)；Susy 3 部屬架構可以參考[這裡](http://jsnwork.kiiuo.com/archives/2806/css-susy3-%E9%83%A8%E5%B1%AC%E6%9E%B6%E6%A7%8B/)。

## 開始使用
透過 npm 下載開發套件
````
npm install
````

因為預設已經開啟 webpack 監聽功能，我們直接使用
````
npm run build
````

打開 index.html 就可以看到 Susy 成果了。檢視 console.log 可以了解預設文件的觸發位置。



## 工具

如果要得知目前的版面是 mobile 或是 desktop
````javascript
var r = $.vmodel.get("global/susyScreen").current();
console.log("目前版面是：" + r);
````
如果要在不同版面觸發不同事件
````javascript
$.vmodel.get("global/susyScreen").listen({
    mobile: function (){
        console.log('目前是 mobile');
    },
    pad: function (){
        console.log('目前是 pad');
    },
    desktop: function (){
        console.log('目前是 desktop');
    }
});
````
