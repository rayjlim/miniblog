<?php
defined('ABSPATH') OR exit('No direct script access allowed');
 // R::debug(TRUE);
class SmsEntriesRedbeanDAO implements SmsEntriesDAO
{
    public function load($id)
    {
        $post = R::load(POSTS, $id);
        return $post->export();
    }
    
    /**
     * Delete record from table
     *
     * @param smsEntrie primary key
     * @LPT_V2
     */
    public function delete($id)
    {
        $postBean = R::load(POSTS, $id);
        R::trash($postBean);
        return 1;
    }
    
    /**
     * Insert record to table
     *
     * @param SmsEntriesMySql smsEntrie
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
     * Update record in table
     *
     * @param SmsEntriesMySql smsEntrie
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
     * @LPT_V2
     */
    public function queryGraphData($userId, $graphParams)
    {
        $sqlParam = '';
        if ($graphParams->startDate != '') {
            $sqlParam.= ' and date > \'' . $graphParams->startDate . '\'';
        }
        if ($graphParams->endDate != '') {
            $sqlParam.= ' and date <= \'' . $graphParams->endDate . '\'';
        }
        
        //TODO: CREATE QUERY DEPENDANT IF LIMIT BASED ON COUNT OR DATE RANGE
        $tagParam = "'%" . $graphParams->label . "%'";
        $posts = R::findAll(POSTS, ' user_id = ? and content like ' . $tagParam . ' ' . $sqlParam . ' order by date desc limit  ' . $graphParams->resultLimit, [$userId]);
        
        $sequencedArray = array_values(array_map("getExportValues", $posts));
        
        return $sequencedArray;
    }
    
    /**
     * @LPT_V2
     */
    public function queryBlogList($userId, $listParams)
    {
        $sqlParam = $this->listParamsToSqlParam($listParams);
        $posts = R::findAll(POSTS, ' user_id = ?  ' . $sqlParam . ' order by date desc limit ?', [$userId, $listParams->resultsLimit]);
        $sequencedArray = array_values(array_map("getExportValues", $posts));
        
        return $sequencedArray;
    }

    public function getSameDayEntries($userId, $date)
    {
        $whereClause = ' where user_id = ? and MONTH(date) = ' . $date->format('m') . ' and Day(date) = ' . $date->format('d')
            . ' and content not like "#s%"'
            . ' and content not like "#x%"'
            . ' and content not like "@w%"'
            . ' and content not like "#a%"';
        $posts = R::findAll(POSTS, $whereClause . ' order by date desc ', [$userId]);
        // $posts = R::findAll(POSTS, ' where user_id = 0 and MONTH(date) =   1 and DAY(date) =   25 order by date desc ');
        $sequencedArray = array_values(array_map("getExportValues", $posts));
        
        return $sequencedArray;
    }

    public function getYearMonths($userId)
    {
        $whereClause = ' where user_id = ? GROUP BY Year(sms_entries.date), Month(sms_entries.date), id';
        $posts = R::findAll(POSTS, $whereClause . ' ORDER BY date desc ', [$userId]);
        $sequencedArray = array_values(array_map("getExportValues", $posts));
        
        $onlyDate = array_map("pickDate", $sequencedArray);
        $filtered = array_unique($onlyDate);
        return $filtered;
    }

    public function listParamsToSqlParam($listParams)
    {
        $sqlParam = '';
        if ($listParams->searchParam != '') {
            $sqlParam.= ' and content LIKE \'%' . $listParams->searchParam . '%\'';
        }
        
        if (count($listParams->tags) != 0) {
            //todo: change to support array
            $sqlParam.= ' and content LIKE \'%#' . $this->tags[0] . '%\'';
        }
        
        if ($listParams->startDate != '') {
            $sqlParam.= ' and date >= \'' . $listParams->startDate . '\'';
        }
        if ($listParams->endDate != '') {
            $sqlParam.= ' and date <= \'' . $listParams->endDate . '\'';
        }
        
        if ($listParams->filterType == FILTER_UNTAGGED) {
            $sqlParam.= ' and content not LIKE \'%#%\'';
            $sqlParam.= ' and content not LIKE \'%@%\'';
        }
        
        if ($listParams->filterType == FILTER_TAGGED) {
            $sqlParam.= 'and (content LIKE \'%#%\'' . ' or content LIKE \'%@%\')';
        }
        return $sqlParam;
    }

    public function queryLastTagEntry($userId, $label)
    {
        $posts = R::findAll(POSTS, ' user_id = ? and content like \'%' . $label . '%\' order by date desc limit 1', [$userId]);
        
        $sequencedArray = array_values(array_map("getExportValues", $posts));
        return $sequencedArray[0];
    }
}

function pickDate($n)
{
    return(substr($n['date'], 0, 7));
}
