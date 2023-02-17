<?php
/**
 * Model for ORM List Params
 *
 * PHP version 8
 *
 * @category PHP
 * @package  Miniblog
 * @author   Raymond Lim <rayjlim@yahoo.com>
 * @license  MIT License
 * @link     https://github.com/rayjlim/miniblog/
 */
namespace models;

defined('ABSPATH') or exit('No direct script access allowed');

class ListParams
{
    public $userId = null;
    public $searchParam = '';
    public $tags = array();
    public $startDate = '';
    public $endDate = '';
    public $filterType = FILTER_ALL;
    public $resultsLimit = RESULT_LIMIT_DEFAULT;
    public $monthsBackToShow = 3;
    public $excludeTags = '';

    public function loadParams($request)
    {
        $lookingFor = ['searchParam', 'tags', 'startDate', 'endDate', 'resultsLimit', 'filterType'];
        foreach ($lookingFor as $target) {
            if (getValue($request, $target) != '') {
                $this->$target = trim($request[$target]);
            }
        }

        if (getValue($request, 'date') != '') {
            $this->startDate = $request['date'];
            $this->endDate = $request['date'];
        }

        if (getValue($request, 'month') != '') {
            $this->startDate = $request['month'] . '-1';
            $this->endDate = $request['month'] . '-31';
        }

        if ($this->startDate === '' && $this->searchParam === '') {
            $this->monthsBackToShow = getValue($request, 'monthsBackToShow') ? $request['monthsBackToShow'] : DEFAULT_MONTHS_TO_SHOW;
            // echo "this->monthsBackToShow: " . $this->monthsBackToShow . "--";
            $strDescription = '-' . $this->monthsBackToShow . ' months';
            $this->startDate = date(YEAR_MONTH_DAY_FORMAT, strtotime($strDescription));
        }
    }
}


/**
 *  0 = all
 *  1 = only tags
 *  2 = only untagged
 */
