/**
 * 這裡暫時不做 onclick 設計，是因為 Joomla 在 .subhead-collapse 內的按鈕，
 * 點擊後依序觸發的是  
 * 
 * Joomla.submitbutton(task)
 * Joomla.submitform(task, ...)
 * $("form").submit();
 * $("button").on("click")
 * 
 * 因為最後才觸發，將會增加困難的邏輯。
1 */
 $(function (){
    $.vmodel.create({
        selector: '.subhead-collapse',
        model: '--button',
        isautoload: false,
        method: function (){
            var vs = this;
            this.autoload = ['init'];
            this.init = function (){
                
            }
        }
    });
    
})