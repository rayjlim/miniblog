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
namespace App\models;

defined('ABSPATH') or exit('No direct script access allowed');
function getValue($array, $key)
{
    return $array[$key] ?? false;
}

class ListParams
{
    public int $userId = -1;
    public string $searchParam = '';
    public array $tags = [];
    public string $startDate = '';
    public string $endDate = '';
    public int $filterType = FILTER_ALL;
    public int $resultsLimit = RESULT_LIMIT_DEFAULT;
    public int $monthsBackToShow = 3;
    public string $excludeTags = '';

    public function loadParams($request)
    {
        $lookingFor = ['searchParam', 'tags', 'startDate', 'endDate', 'resultsLimit', 'filterType'];
        foreach ($lookingFor as $target) {
            if (getValue($request, $target) != false) {
                $this->$target = trim($request[$target]);
            }
        }

        if (getValue($request, 'date') != false) {
            $this->startDate = $request['date'];
            $this->endDate = $request['date'];
        }

        if (getValue($request, 'month') != false) {
            $this->startDate = $request['month'] . '-1';
            $this->endDate = $request['month'] . '-31';
        }
    }
}


/**
 *  0 = all
 *  1 = only tags
 *  2 = only untagged
 */
