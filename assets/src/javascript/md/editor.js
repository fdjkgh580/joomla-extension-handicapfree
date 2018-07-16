$(function (){
    $.vmodel.create({
        selector: 'body',
        model: '--editor',
        isautoload: false,
        method: function (){
            var vs = this;
            this.autoload = ['init'];
            this.init = function (){
                
            }

            // 要求切換到編輯器
            this.enforce = function (){
                var current = vs.currEditor();

                if (current === "tinyMCE") {
                    // 因為 submit 換自動切換為編輯模式
                    return true;
                }
                else if (current === "JCE") {
                    if (!vs.root.find("[href='#wf-editor-wysiwyg']").parent().hasClass('active')){
                        Joomla.renderMessages({
                            'warning': ['無障礙：請切換編輯器標籤為 Editor']
                        })
                        $.vmodel.get("listen").triggerGlobalClass("lock");
                        return false;
                    }
                    return true;
                }
                else {
                    return false;
                }
            }

            // 取得編輯器的 HTML
            this.getHtml = function (){
                var content = false;
                var current = vs.currEditor();

                if (current === "tinyMCE") {
                    var content = tinyMCE.activeEditor.getContent();
                }
                else if (current === "JCE") {
                    var JCEiframe = vs.root.find(".mceIframeContainer").find("iframe");
                    var content = JCEiframe.contents().find("body").html();
                }
                else if (current === false) {
                    console.log('找不到編輯器');
                }

                return content;
            }

            // 取得當前的編輯器
            this.currEditor = function (){
                var num = $(".js-editor-tinymce").length;
                if (num > 0) {
                    return 'tinyMCE';
                }

                var num = $(".wf-editor-container").length;
                if (num > 0) {
                    return 'JCE';
                }

                return false;
            }

           
        }
    });
    
})