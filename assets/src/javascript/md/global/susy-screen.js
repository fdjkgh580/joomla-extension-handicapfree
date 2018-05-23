$(function (){
    $.vmodel.create({
        selector: '.susy-screen',
        model: '--global/susyScreen',
        isautoload: false,
        method: function (){
            var vs = this;
            this.autoload = ['init'];
            this.init = function (){
                vs.get()
            }
            this.current = function (){
                var className = vs.root.find("div:visible").attr("class");
                return className;
            }
            // 監聽不同版面觸發不同事件
            this.listen = function (param){
                _bindResize(param);

                $(window).on("resize", function (){
                    _bindResize(param);
                })
            }

            // 取得目前版面並觸發對應的 callable
            var _bindResize = function (param){
                var layout = vs.current();

                if (param[layout]) param[layout].call(this);
            }
        }
    });
    
})