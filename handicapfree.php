<?php
defined('_JEXEC') or die;
require_once 'vendor/autoload.php';

// 使用套件處理 HTML
use \Sunra\PhpSimple\HtmlDomParser;

// 載入方便的請求 
new \Jsnlib\Joomla\EasyRequest;


class plgSystemHandicapfree extends JPlugin
{
    use \Jsnlib\Joomla\EasyRequestTrait;

    public function __construct(&$subject, $config)
    {
        parent::__construct($subject, $config);
    }

    // 透過 JS 監聽編輯器
    private function addScriptHelper()
    {
        $t = uniqid();
        $document = JFactory::getDocument();
        $document->addScript(JURI::root() . "plugins/system/handicapfree/assets/dist/vendors.js?t={$t}");
        $document->addScript(JURI::root() . "plugins/system/handicapfree/assets/dist/index.js?t={$t}");
    }
 
    // 若是存文章，那麼 jform 會包含一個由 JS 產生出來的 enable_handicapfree
    private function ifSaveArticle($callback)
    {
        $jform = $this->post('jform', null, 'array');

        if (isset($jform['enable_handicapfree']) and $jform['enable_handicapfree'] === "true") 
        {
            $callback($jform);
        }
    }

    private function matchUrlMix()
    {
        // 比對目前網址與設定檔中出現的網址是否符合
        $plugin = JPluginHelper::getPlugin('system', 'handicapfree');
        $pluginParams = new JRegistry($plugin->params);
        $matchUrlMix = ($pluginParams->get('match-url'));

        // 分割斷行
        $matchUrlBox = preg_split('/\r\n|[\r\n]/', $matchUrlMix);

        return $matchUrlBox;
    }

    private function isFindUrlInConfig($currentUrl, $matchUrlBox)
    {
        $isFind = false;
        

        foreach ($matchUrlBox as $key => $searchUrl)
        {
            if (empty($searchUrl)) continue;
            
            $position = strpos($currentUrl, $searchUrl);

            // 網址比對的位置應該要在第一個
            if ($position === 0) 
            {
                $isFind = true;
                break;
            }
        }

        return $isFind;
    }

    /**
     * 添加 <th> scope
     * @param simplehtmldom_1_5\simple_html_dom $dom HTML 的整體文本
     */
    private function addThScope($dom)
    {
        foreach ($dom->find("table th") as $ele)
        {
            if (empty($ele->scope))
            {
                $ele->scope = "col";
            }
        }

        return $this->renderDOM($dom);
    }

    /**
     * <img> figure 包圍
     * @param  simplehtmldom_1_5\simple_html_dom_node $ele  元素物件
     * @return string                                       組合後的 HTML
     */
    private function wrapImgFigure($ele)
    {
        $imgHtml = $ele->outertext;
        return "<figure>{$imgHtml}</figure>";
    }

    /**
     * 放到上層的下個緊鄰元素
     * @param  simplehtmldom_1_5\simple_html_dom_node $ele  元素物件
     * @param  string $html                                 要插入的 HTML
     */
    private function parentNextElement($ele, $html)
    {
        $ele->parent()->outertext .= $html;
    }

    /**
     * 移除元素
     * @param  simplehtmldom_1_5\simple_html_dom_node $ele  元素物件
     */
    private function removeElement($ele)
    {
        $ele->outertext = '';
    }

    /**
     * 將元素替換
     * @param  object $ele        如 <img>
     * @param  string $newHtml    如 <figure><img></figure>
     */
    private function replaceElement($ele, $newHtml)
    {
        $ele->outertext = $newHtml;
    }

    /**
     * 添加 img figure
     * @param simplehtmldom_1_5\simple_html_dom $dom HTML 的整體文本
     */
    private function addImgFigure($dom)
    {
        foreach ($dom->find("img") as $ele)
        {
            $parentTag = $ele->parent()->tag;

            if ($parentTag == "figure") continue;

            // 建立新元素是 <img> figure 包圍
            $imgHtmlWrap = $this->wrapImgFigure($ele);

            // 若上層是 p 之類的元素，那要移出並放到下個緊鄰元素
            if (in_array($parentTag, ['p', 'div']))
            {
                // 刪除 <img>
                $this->removeElement($ele);

                // 放到上層的下個緊鄰元素
                $this->parentNextElement($ele, $imgHtmlWrap);
            }
            // 若上層空白
            else 
            {
                // 直接替換
                $this->replaceElement($ele, $imgHtmlWrap);
            }

        }

        return $this->renderDOM($dom);
    }

    // 重新渲染 DOM，當發生異動 DOM 搭配使用
    private function renderDOM($dom)
    {
        return HtmlDomParser::str_get_html((string)$dom);
    }

    /**
     * 移除元素的所有屬性
     * @param  simplehtmldom_1_5\simple_html_dom_node $element 元素
     * @param  array  $ignore  要忽略的屬性名稱
     */
    private function removeElementAllAttr($element, $ignore = [])
    {
        foreach ($element->getAllAttributes() as $attrName => $val)
        {
            if (in_array($attrName, $ignore)) continue;

            $element->removeAttribute($attrName);                  
        }
    }

    /**
     * 移除表格內的元素屬性
     * @param  simplehtmldom_1_5\simple_html_dom_node $table  表格元素
     * @param  string $find   尋找的元素名稱
     * @param  array  $ignore  要忽略的屬性名稱
     */
    private function removeTableChildAllAttr($table, $find, $ignore = [])
    {
        foreach ($table->find($find) as $tag)
        {
            $this->removeElementAllAttr($tag, $ignore);
        }
    }

    // 移除表格不需要的屬性
    private function removeTableAttr($dom)
    {
        // 批次取 <table>
        foreach ($dom->find("table") as $table)
        {
            // 移除 <table> 屬性
            $this->removeElementAllAttr($table);

            // 移除 <tr> 屬性
            $this->removeTableChildAllAttr($table, "tr");

            // 移除 <th> 屬性
            $this->removeTableChildAllAttr($table, "th", ['scope', 'colspan', 'rowspan']);

            // 移除 <td> 屬性
            $this->removeTableChildAllAttr($table, "td", ['colspan', 'rowspan']);
        }

        return $this->renderDOM($dom);
    }

    private function removeImgAttr($dom)
    {
        foreach ($dom->find("img") as $img)
        {
            $this->removeElementAllAttr($img, ['src', 'alt']);
        }

        return $this->renderDOM($dom);
    }

    // 移除空白元素
    private function removeEmptyElement($dom, $tags = [])
    {
        foreach ($tags as $tag)
        {
            foreach ($dom->find($tag) as $ele)
            {
                $innertext = (string) $ele->innertext;

                // 去除空白字元
                $innertext = preg_replace("/\s|&nbsp;|&ensp;|&emsp;/",'',$innertext);

                if ($innertext != "") continue;
                $ele->outertext = ''; 
            }
        }

        return $this->renderDOM($dom);
    }
 
    public function onAfterInitialise()
    {
        require_once JPATH_PLUGINS . '/system/handicapfree/vendor/autoload.php';

        // 當前網址
        $currentUrl = (string)JUri::getInstance();

        // 取得比對網址陣列
        $matchUrlBox = $this->matchUrlMix();

        // 是否比對到網址
        $isFind = $this->isFindUrlInConfig($currentUrl, $matchUrlBox);

        // 加入 JS 監聽編輯器
        if ($isFind === true)
        {
            $this->addScriptHelper();
        }

        // 若偵測到儲存文章，並符合啟用 handicapfree
        $this->ifSaveArticle(function ($jform)
        {
            // 檢查每個 jform 裡面的值並替換，可以確保不漏失 textarea。因為無法得知前端的 textarea 使用的名稱
            foreach ($jform as $key => $value)
            {
                // 取得文本並改寫
                $dom = HtmlDomParser::str_get_html($jform[$key]);

                if (empty($dom)) continue;

                $dom = $this->removeTableAttr($dom);
                $dom = $this->addThScope($dom);
                $dom = $this->removeImgAttr($dom);
                $dom = $this->addImgFigure($dom);
                $dom = $this->removeEmptyElement($dom, ['a', 'figure']);

                // 更動 $_POST 內容
                $this->updateJform($key, $dom);
            }

            // debug
            // $jform2 = $this->post('jform', null, 'array');
            // print_r($jform2); die;
        });

    }

    /**
     * 替換編輯器內文
     * @param string/int 對應 jform[key] 中的鍵
     * @param simplehtmldom_1_5\simple_html_dom $dom HTML 的整體文本
     */
    private function updateJform($key, $dom)
    {
        $defJform = $this->post('jform', null, 'array');

        // 僅修改單一項目，其餘不理會
        $defJform[$key] = $dom->outertext;

        $this->post->set('jform', $defJform);
    }

}