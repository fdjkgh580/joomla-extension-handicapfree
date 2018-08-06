// 載入 SCSS
import '../scss/index.scss';
 
// 載入 jQuery Plugin
import '../../../node_modules/vmodel.js/dist/jquery.vmodel.min.js';
import '../../../node_modules/jquery.transit/jquery.transit.js';


// 若要全域使用加入這塊
window.$ = $
window.jQuery = $



// 載入會使用到的 JS 程式碼
// import './md/global/susy-screen.js';
import './md/listen.js';
import './md/editor.js';
import './md/message.js';
import './md/form.js';
import './md/button.js';



$(function (){

    console.log('載入無障礙偵測');

    $.vmodel.get("editor", true);
    $.vmodel.get("listen", true);
    $.vmodel.get("message", true);
    $.vmodel.get("form", true);
    $.vmodel.get("button", true);
    
})
