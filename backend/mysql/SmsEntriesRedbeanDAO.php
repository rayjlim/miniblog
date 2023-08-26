<?php
namespace dao;

defined('ABSPATH') or exit('No direct script access allowed');
use \RedBeanPHP\R as R;

// R::debug(TRUE);
function groupYearMonth(array $row): string
{
    return $row["Year"] . "-" . $row["Month"];
}
class SmsEntriesRedbeanDAO implements SmsEntriesDAO
{
    public function load($id)
    {
        $post = R::load(POSTS, $id);
        return $post->export();
    }

    /**
     * Delete Journal record from table
     *
     * @param  id primary key
     * @LPT_V2
     */
    public function delete($id)
    {
        $postBean = R::load(POSTS, $id);
        R::trash($postBean);
        return 1;
    }

    /**
     * Insert Journal record
     *
     * @param  SmsEntriesMySql smsEntrie
     * @LPT_V2
     */
    public function insert($smsEntrie)
    {
        $postBean = R::xdispense(POSTS);
        $postBean->content = $smsEntrie->content;
        $postBean->date = $smsEntrie->date;
        $postBean->user_id = $smsEntrie->userId;
        $id = R::store($postBean);
        return $id;
    }

    /**
     * Update Journal Entry
     *
     * @param  SmsEntriesMySql smsEntrie
     * @LPT_V2
     */
    public function update($smsEntrie)
    {
        $postBean = R::load(POSTS, $smsEntrie['id']);
        $postBean->content = $smsEntrie['content'];
        $postBean->date = $smsEntrie['date'];
        R::store($postBean);
    }

    /**
     * List Journal Entries
     *
     * @param  listParams search options
     * @LPT_V2
     */
    public function list($listParams)
    {
        $sqlParam = $this->listParamsToSqlParam($listParams);
        $posts = R::findAll(POSTS, '1 = 1 ' . $sqlParam . ' order by date desc limit ?', [$listParams->resultsLimit]);
        $sequencedArray = array_values(array_map("getExportValues", $posts));

        return $sequencedArray;
    }

    /**
     * Get Entries that are from the same day of the year
     *
     * @param  date Target date
     * @LPT_V2
     */
    public function getSameDayEntries($date)
    {
        $whereClause = ' WHERE MONTH(date) = ' . $date->format('m')
            . ' AND DAY(date) = ' . $date->format('d')
            . ' AND content NOT LIKE "#s%"'
            . ' AND content NOT LIKE "#x%"'
            . ' AND content NOT LIKE "@w%"'
            . ' AND content NOT LIKE "#a%"';
        $posts = R::findAll(POSTS, $whereClause . ' ORDER BY date DESC', []);
        // $posts = R::findAll(POSTS, ' where user_id = 0 and MONTH(date) =   1 and DAY(date) =   25 order by date desc ');
        $sequencedArray = array_values(array_map("getExportValues", $posts));

        return $sequencedArray;
    }

    /**
     * Get Year and Months list of all entries
     *
     * @param  none
     * @LPT_V2
     */
    public function getYearMonths()
    {
        $posts = R::getAll('SELECT DISTINCT YEAR(date) AS "Year", '
            . 'MONTH(date) AS "Month" '
            . 'FROM sms_entries '
            . 'WHERE user_id = 1 '
            . 'ORDER BY YEAR(date) DESC, MONTH(date) DESC');
        return array_map("dao\groupYearMonth", $posts);
    }

    // ;
    public function listParamsToSqlParam($listParams)
    {
        $sqlParam = '';
        if ($listParams->searchParam != '') {
            $sqlParam.= ' AND content LIKE \'%' . $listParams->searchParam . '%\'';
        }

        if ($listParams->excludeTags != '') {
            $sqlParam.= ' AND content NOT LIKE \'%' . $listParams->excludeTags . '%\'';
        }

        // if (count($listParams->tags) != 0) {
        //     $sqlParam.= ' AND content LIKE \'%#' . $this->tags[0] . '%\'';
        // }

        if ($listParams->startDate != '') {
            $sqlParam.= ' AND date >= \'' . $listParams->startDate . '\'';
        }
        if ($listParams->endDate != '') {
            $sqlParam.= ' AND date <= \'' . $listParams->endDate . '\'';
        }

        if ($listParams->filterType == FILTER_UNTAGGED) {
            $sqlParam.= ' AND content NOT LIKE \'%#%\'';
            $sqlParam.= ' AND content NOT LIKE \'@%\'';
        }

        if ($listParams->filterType == FILTER_TAGGED) {
            $sqlParam.= ' AND (content LIKE \'%#%\' or content LIKE \'@%\')'
                . ' AND content NOT LIKE \'%##%\'';
        }
        // echo $sqlParam;
        // exit;
        return $sqlParam;
    }
}

function pickDate($n)
{
    return(substr($n['date'], 0, 7));
}
