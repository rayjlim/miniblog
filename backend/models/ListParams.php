<?php
defined('ABSPATH') or exit('No direct script access allowed');

class ListParams extends BaseModel
{
    public $userId = null;
    public $searchParam = '';
    public $tags = array();
    public $startDate = '';
    public $endDate = '';
    public $filterType = FILTER_ALL;
    public $resultsLimit = RESULT_LIMIT_DEFAULT;
    public $monthsBackToShow = 3;
    public $exclude = '';

    public $gotoYearMonth;

    public function loadParams($request)
    {
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

        if ($oListParams->startDate === '' && $oListParams->searchParam === '') {
            $oListParams->monthsBackToShow = getValue($request, 'monthsBackToShow') ? $request['monthsBackToShow'] : DEFAULT_MONTHS_TO_SHOW;
            // echo "oListParams->monthsBackToShow: " . $oListParams->monthsBackToShow . "--";
            $strDescription = '-' . $oListParams->monthsBackToShow . ' months';
            $oListParams->startDate = date('Y-m-d', strtotime($strDescription));
        }

        return $oListParams;
    }
}


/**
 *  0 = all
 *  1 = only tags
 *  2 = only untagged
 */
