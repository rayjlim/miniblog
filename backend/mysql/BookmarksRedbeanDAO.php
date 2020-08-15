<?php
defined('ABSPATH') or exit('No direct script access allowed');

class BookmarksRedbeanDAO implements SmsSleepStatsDAO
{
    public function load($id)
    {
        $bookmarks = R::load(BOOKMARKS, $id);
        return $bookmarks->export();
    }

    public function queryAll()
    {
        $bookmarks = R::findAll(BOOKMARKS);
        $sequencedArray = array_values(array_map("getExportValues", $bookmarks));
        return $sequencedArray;
    }

    public function getPaths()
    {
        $sqlParam = 'select distinct path from ' . BOOKMARKS . ' order by path';
        $rows = R::getAll($sqlParam);
        return $rows;
    }

    public function queryGraphData($graphParams)
    {
        $sqlParam = '';
        if ($graphParams->path && $graphParams->path != '') {
            $sqlParam .= 'path = \'' . $graphParams->path . '\' ';
            $sqlParam .= 'AND createdOn > DATE_SUB(NOW(), INTERVAL ' . $graphParams->daterange . ' MONTH) ';

            $posts = R::findAll(BOOKMARKS, $sqlParam);
            $curry1 = array_map("getExportValues", $posts);
            $sequencedArray = array_values($curry1);
            $final = array_map("reduceTime", $sequencedArray);
            return $final;
        } else {
            $sqlParam .= 'select id, sum(count) as count, createdOn, sum(averageAge) as averageAge from
                ' . BOOKMARKS;
            $sqlParam .= ' WHERE createdOn > DATE_SUB(NOW(), INTERVAL ' . $graphParams->daterange . ' MONTH) ';
            $sqlParam .= '  group by createdOn ';
            $rows = R::getAll($sqlParam);
            $posts = R::convertToBeans('bookmark', $rows);
            $curry1 = array_map("getExportValues", $posts);
            $curry2 = array_map("minusBigNumberFromAge", $curry1);
            $sequencedArray = array_values($curry2);
            $final = array_map("reduceTime", $sequencedArray);
            return $final;
        }
    }

    public function delete($id)
    {
        return null;
    }

    public function insert($bookmark)
    {
        return null;
    }
}

/**
 * this function is just make the numbers more manageable for display
 */
function minusBigNumberFromAge($item)
{
    $item['averageAge'] = $item['averageAge'] - 266411210028800000; //65411110001100000
    $item['count'] = $item['count'] / 5;
    return $item;
}

/**
 * find the number of days between createdOn and averageAge
 * average age is in Windows timeformat
 */
function reduceTime($n)
{
    $createdTimestamp = strtotime($n['createdOn']);
    $seconds = (floor($createdTimestamp - ($n['averageAge']  / 1000000 - 11644473600))); // 11644473600
    $n['daysAge'] = floor($seconds / (60 * 60 * 24));
    return $n;
}
