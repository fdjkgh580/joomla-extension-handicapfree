$(function (){
    $.vmodel.create({
        selector: 'body',
        model: '--message',
        isautoload: false,
        method: function (){
            var vs = this;
            this.autoload = ['init'];

            // 紀錄目前顯示或隱藏
            var _showOrHide = false;
            
            // 訊息蒐集盒
            var _msgbox = [];

            var _msgHtmlStr = null;

            this.init = function (){
            }

            // 添加訊息
            this.add = function (text){
                _msgbox.push(text);
            }

            this.clean = function (){
                Joomla.removeMessages();

                // 需要還原
                _msgHtmlStr = null;
            }

            var _set = function (val){
                Joomla.renderMessages({
                    'warning': val
                });
            }

            this.isEmpty = function (){
                return $(_msgbox).length == 0 ? true: false;
            }

            this.show = function (){
                // 已經顯示了
                if (_showOrHide == "show") return false;

                _showOrHide = "show";
            }

            var _isFirstHide = false;

            this.hide = function (callback){

                // 已經隱藏了
                if (_showOrHide == "hide") return false;

                _showOrHide = "hide";


                // 初次隱藏時因為沒有內容，所以要立刻隱藏而不使用動畫
                if (_isFirstHide === false) {
                    _isFirstHide = true;
                }

                else {
                    if (callback) callback();
                }
                
            }

            this.render = function (text){

                // 顯示
                vs.show();

                // 組合訊息
                var mix = _mixMessage();

                // 要顯示的訊息與上次相同則不理會
                if (mix === _msgHtmlStr){
                }
                // 若與上次不同則渲染
                else {
                    // console.log('渲染')
                    _msgHtmlStr = mix;
                    _set(_msgbox);
                }

                // 清空訊息蒐集盒                
                _msgbox = [];

            }

            // 混和字串
            var _mixMessage = function (){
                var mix = '';

                $.each(_msgbox, function (key, msg){
                    mix += msg;
                })

                return mix;
            }
        }
    });
    
})


