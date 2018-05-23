$(function (){
    $.vmodel.create({
        selector: 'form[name=adminForm]',
        model: '--form',
        isautoload: false,
        method: function (){
            var vs = this;
            this.autoload = ['init', 'submit'];
            this.init = function (){
                // 預設上鎖
                vs.disable();
            }

            this.submit = function (){
                vs.root.on("submit", function (){

                    // 要求切換到編輯器
                    var result = $.vmodel.get("editor").enforce();
                    if (result === false) return false;

                    // 送出前務必確保沒有問題。清空舊訊息，可以被重新渲染
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