<?php
/**
 * ListParams Class Doc Comment
 *
 * @category Class
 * @package  Smsblog2
 * @license  http://www.lilplaytime.com None
 * @link     http://www.lilplaytime.com
 */
class ListParams extends BaseModel
{
    var $userId = null;
    var $searchParam = '';
    var $tags = Array();
    var $startDate = '';
    var $endDate = '';
    var $filterType = FILTER_ALL;
    var $resultsLimit = BLOG_LIMIT_DEFAULT;
    var $monthsBackToShow = 3;
    
    var $gotoYearMonth;
    
    function loadParams($request) {
        
        $oListParams = new ListParams();
        $lookingFor = ['searchParam', 'tags', 'startDate', 'endDate', 'resultsLimit', 'filterType'];
        foreach ($lookingFor as $target) {
            if (getValue($request, $target) != '') {
                $oListParams->$target = trim($request[$target]);
            }
        }
        
        if (getValue($request, 'gotoYearMonth') != '') {
            $oListParams->gotoYearMonth = date($request['gotoYearMonth'] . '-1');
        }
        
        if (getValue($request, 'date') != '') {
            $oListParams->startDate = $request['date'];
            $oListParams->endDate = $request['date'];
        }
        
        if (getValue($request, 'month') != '') {
            $oListParams->startDate = $request['month'] . '-1';
            $oListParams->endDate = $request['month'] . '-31';
        }
        
        $oListParams->monthsBackToShow = getValue($request, 'monthsBackToShow') ? $request['monthsBackToShow'] : DEFAULT_MONTHS_TO_SHOW;
        return $oListParams;
    }
}


/**
 *  0 = all
 *  1 = only tags
 *  2 = only untagged
 */
