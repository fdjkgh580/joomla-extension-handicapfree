$(function (){
    $.vmodel.create({
        selector: 'form',
        model: '--form',
        isautoload: false,
        method: function (){
            var vs = this;
            this.autoload = ['init', 'submit'];
            this.init = function (){
                // 預設上鎖
                vs.disable();

                // 添加一個辨識要啟用的 input
                vs.addCheckValue();
            }

            // 在 form 表單添加隱藏元素，送出後由後端辨識是否有這個隱藏值，若有的畫，將會運行相關後端處理
            this.addCheckValue = function (){
                vs.root.prepend('<input type="hidden" name="jform[enable_handicapfree]" value="true">');
            }

            // 為了避免手動關閉錯誤訊息，送出前務必確保沒有問題。
            this.submit = function (){
                vs.root.on("submit", function (){

                    // 若停止監聽，將直接送出表單
                    var isStop = $.vmodel.get("listen").store.isStop;
                    if (isStop === true) return true;

                    // 要求切換到編輯器
                    var result = $.vmodel.get("editor").enforce();
                    if (result === false) return false;

                    // 清空舊訊息，可以被重新渲染
                    $.vmodel.get("message").clean();
                    var result = $.vmodel.get("listen").checkOnce();

                    // alert('成功送出')
                    return result == true ? true : false;
                });
            }

            this.isDisable = function (){
                return vs.root.hasClass('disable');
            }

            this.disable = function (){
                vs.root.addClass('disable');
            }
            this.enable = function (){
                vs.root.removeClass('disable');
            }
        }
    });
    
})