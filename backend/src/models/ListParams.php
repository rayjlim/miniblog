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
    public string $excludeTags = '';
    public string $location = '';

    public function loadParams($queryParams)
    {
        $lookingFor = ['searchParam', 'tags', 'startDate', 'endDate', 'resultsLimit', 'filterType', 'location'];
        foreach ($lookingFor as $target) {
            if (getValue($queryParams, $target) != false) {
                $this->$target = trim($queryParams[$target]);
            }
        }

        if (getValue($queryParams, 'date') != false) {
            $this->startDate = $queryParams['date'];
            $this->endDate = $queryParams['date'];
        }

        if (getValue($queryParams, 'month') != false) {
            $this->startDate = $queryParams['month'] . '-1';
            $this->endDate = $queryParams['month'] . '-31';
        }
    }
}


/**
 *  0 = all
 *  1 = only tags
 *  2 = only untagged
 */
