<?php

/**
 * Object represents table 'sms_entries'
 *
 * @author: http://phpdao.com
 * @date: 2011-02-25 14:02
 */
use \Lpt\DevHelp;

class SmsSleepStat
{
    public $id;

    public $urlString = '';
    public $totalSleepCount;
    public $restlessSleepCount;
    public $deepSleepCount;
    public $lightSleepCount;
    public $ignoreSleepCount;
    
    public $sleepStart;
    public $startOffset=0;
}
 //close of Class
