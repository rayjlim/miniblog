<?php
/**
 * Intreface DAO
 *
 * @author: http://phpdao.com
 * @date: 2011-02-25 14:02
 */
interface SmsSleepStatsDAO
{

    public function load($id);
    
    public function queryAll();

    public function delete($id);
    
    public function insert($smsUser);
    
}