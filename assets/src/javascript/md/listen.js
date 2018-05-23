$(function (){
    $.vmodel.create({
        selector: 'body',
        model: '--listen',
        isautoload: false,
        method: function (){
            
            var vs = this;
            this.autoload = ['init', 'repeat'];
            this.init = function (){
                
            }


            
            // 檢查 table <th>
            this.eachTable = function (html, error){

                var $table = $(html).find("table");
                var status = false;
                var tableNum = $table.length; // table 總數量
                var faildTableIndex = false; // 發生錯誤的 table 編號

                if (tableNum == 0) return "noTable";

                $table.each(function (key, ele){
                    var thNum = $(this).find("th").length;

                    // 若找不到 <th>
                    if (thNum == 0){
                        faildTableIndex = key;
                        status = "needTh";
                        if (error) error(status, faildTableIndex);
                    }
                    else{
                        // faildTableIndex = false;
                        // status = 'success';
                    }
                })

            }

            // 檢查 table 
            var _table = function (htmlWrap){

                vs.eachTable(htmlWrap, function (status, faildTableIndex){
                    var n = faildTableIndex + 1;
                    $.vmodel.get("message").add('無障礙：第 '+ n + ' 個表格 (table) 務必要指定標題標籤 (th)');
                    $.vmodel.get("form").disable();
                });
            }

            function _getFileExtension(filename) {
                return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
            }

            function _getFileName(href){
                return href.substring(href.lastIndexOf('/')+1);  
            }

            // 需要的開放格式範例
            var _needOpenFileSample = function (path, ext){
                return path.replace(ext, 'pdf');
            }

            /**
             * 將連結分批存放
             * @param   htmlWrap 
             * @return  {closeFile, openFile}
             */
            var _putDiffBox = function (htmlWrap){
                var $a = $(htmlWrap).find("a");
                var aNum = $a.length;

                var closeFile = [];
                var openFile = [];
                
                // 將連結分批存放
                $a.each(function (){

                    var result = _diffOpenFile(htmlWrap, this);

                    // {完整路徑, 檔名, 副檔名}
                    var box = {
                        path: result[1], 
                        filename: result[2], 
                        ext: result[3]
                    };
                    
                    if (result[0] == "closeFile") {
                        closeFile.push(box);
                    }
                    else if (result[0] == "openFile") {
                        openFile.push(box);
                    }
                })

                return {
                    closeFile: closeFile,
                    openFile: openFile
                }
            }

            /**
             * 在 openFile 尋找可以對應的路徑
             * @param   box                closeFile 的元素
             * @param   needOpenFileSample 需要比對的開放格式範例，如 /xxx.pdf
             * @param   openFile           
             */
            var _isFindOpenFile = function (box, needOpenFileSample, openFile){
                // 預設無法在 openFile 找到對應
                var isMatchOnOpenfile = false;

                // 搜尋 openFile 中是否包含 box.path
                if ($(openFile).length > 0){
                    
                    // 逐一比對
                    $.each(openFile, function (key, boxOpen){
                        if (needOpenFileSample !== boxOpen.path) return true;

                        // 比對到了
                        isMatchOnOpenfile = true;
                        return false;
                    })
                }

                return isMatchOnOpenfile;
            }

            // 兩側比對，以 closeFile 比對 openFile
            var _checkFile = function (closeFile, openFile){
                
                var msgbox = [];

                // 批次取出 closeFile 文件
                $.each(closeFile, function (key, box){
                    // box: {path, filename, ext}
                    
                    // 應改成的範例名稱
                    var needOpenFileSample = _needOpenFileSample(box.path, box.ext);

                    // 在 openFile 尋找可以對應的路徑
                    var result = _isFindOpenFile(box, needOpenFileSample, openFile);
                    
                    // 若找到，就繼續比對下一筆 closeFile
                    if (result === true) return true;
                    
                    // 若未在 openFile 找到對應
                    msgbox.push('無障礙：請添加與 『 ' + box.path + ' 』 對應的文件 『 ' + needOpenFileSample + ' 』');
                })

                return msgbox;
            }


            var _openFile = function (htmlWrap){
                
                // 將連結分批存放
                var box = _putDiffBox(htmlWrap);

                // 兩側比對，以 closeFile 比對 openFile
                var msgbox = _checkFile(box.closeFile, box.openFile);

                // 將蒐集到所有添加訊息，一併送到 message
                $.each(msgbox, function (key, msg){
                    $.vmodel.get("message").add(msg);
                })
            }

            var _diffOpenFile = function (htmlWrap, usethis){

                var href = $(usethis).attr('href');
                var extName = _getFileExtension(href);
                var fileName = _getFileName(href);

                // 若是 office 文件
                if (extName == "doc" || extName == "docx" || extName == "xls" || extName == "xlsx"){
                    return ['closeFile', href, fileName, extName];
                }

                // [辨識分類, 完整路徑, 檔名, 副檔名]
                return ['openFile', href, fileName, extName];
            }

            // 重複監聽著...
            this.repeat = function (){

                setInterval(function (){
                    vs.checkOnce();
                }, 50);
            }

            // 單次觸發，交由外部指定
            this.checkOnce = function (){
                var htmlOrg = $.vmodel.get("editor").getHtml();
                var htmlWrap = "<div class='listen-html-org'>" + htmlOrg + "</div>";

                // 表格處理
                _table(htmlWrap);
                
                // 檢查是否有開放文件
                _openFile(htmlWrap);

                // 渲染訊息
                // 解鎖
                if ($.vmodel.get("message").isEmpty()){
                    $.vmodel.get("form").enable();
                    $.vmodel.get("message").hide(function (){
                        $.vmodel.get("message").clean();
                    });
                    return true;
                } 
                // 上鎖
                else {
                    $.vmodel.get("form").disable();
                    $.vmodel.get("message").render();
                    return false;
                }

            }
        }
    });
    
})

