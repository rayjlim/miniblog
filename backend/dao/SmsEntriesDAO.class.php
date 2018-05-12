<?php
/**
 * Intreface DAO
 *
 * @author: http://phpdao.com
 * @date: 2011-02-25 14:02
 */
interface SmsEntriesDAO{

    /**
     * Get Domain object by primry key
     *
     * @param String $id primary key
     * @Return SmsEntries 
     */
    public function load($id);
    
    /**
     * Get all records from table
     */
    public function queryAll($userId);
    
    /**
     * Delete record from table
     * @param smsEntrie primary key
     */
    public function delete($id);
    
    /**
     * Insert record to table
     *
     * @param SmsEntries smsEntrie
     */
    public function insert($smsEntrie);
    
    /**
     * Update record in table
     *
     * @param SmsEntries smsEntrie
     */
    public function update($smsEntrie); 

    public function queryGraphData($userId, $graphParams);
    public function queryBlogList($userId, $listParams);
    public function queryTagChain($userId, $label, $resultLimit);
    public function queryLastTagEntry($userId, $label);

}
