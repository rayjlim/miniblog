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
        $whereClause = ' where MONTH(date) = ' . $date->format('m')
            . ' and Day(date) = ' . $date->format('d')
            . ' and content not like "#s%"'
            . ' and content not like "#x%"'
            . ' and content not like "@w%"'
            . ' and content not like "#a%"';
        $posts = R::findAll(POSTS, $whereClause . ' order by date desc ', []);
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
            . 'where user_id = 1 '
            . 'order by YEAR(date) desc, month(date) desc' );
        return array_map("dao\groupYearMonth", $posts);
    }

    // ;
    public function listParamsToSqlParam($listParams)
    {
        $sqlParam = '';
        if ($listParams->searchParam != '') {
            $sqlParam.= ' and content LIKE \'%' . $listParams->searchParam . '%\'';
        }

        if ($listParams->excludeTags != '') {
            $sqlParam.= ' and content NOT LIKE \'%' . $listParams->excludeTags . '%\'';
        }

        // if (count($listParams->tags) != 0) {
        //     $sqlParam.= ' and content LIKE \'%#' . $this->tags[0] . '%\'';
        // }

        if ($listParams->startDate != '') {
            $sqlParam.= ' and date >= \'' . $listParams->startDate . '\'';
        }
        if ($listParams->endDate != '') {
            $sqlParam.= ' and date <= \'' . $listParams->endDate . '\'';
        }

        if ($listParams->filterType == FILTER_UNTAGGED) {
            $sqlParam.= ' and content not LIKE \'%#%\'';
            $sqlParam.= ' and content not LIKE \'@%\'';
        }

        if ($listParams->filterType == FILTER_TAGGED) {
            $sqlParam.= ' and (content LIKE \'%#%\' or content LIKE \'@%\')'
                . ' and content NOT LIKE \'%##%\'';
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


