<?php
namespace dao;

defined('ABSPATH') or exit('No direct script access allowed');
use \RedBeanPHP\R as R;
use \models\SmsEntrie;
use \models\ListParams;

// R::debug(TRUE);
function groupYearMonth(array $row): string
{
    return $row["Year"] . "-" . $row["Month"];
}
class SmsEntriesRedbeanDAO implements SmsEntriesDAO
{
    public function load(int $id): array
    {
        $post = R::load(POSTS, $id);
        return $post->export();
    }

    public function delete(int $id): int
    {
        $postBean = R::load(POSTS, $id);
        R::trash($postBean);
        return 1;
    }

    public function insert(SmsEntrie $smsEntrie): int
    {
        $postBean = R::xdispense(POSTS);
        $postBean->content = $smsEntrie->content;
        $postBean->date = $smsEntrie->date;
        $postBean->user_id = $smsEntrie->userId;
        $id = R::store($postBean);
        return $id;
    }

    public function update(SmsEntrie $smsEntrie): void
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
    public function list(ListParams $listParams): array
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
    public function getSameDayEntries(object $date): array
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
    public function getYearMonths(): array
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
