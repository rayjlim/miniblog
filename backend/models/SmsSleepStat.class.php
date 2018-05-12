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
    var $id;

    var $urlString = '';
    var $totalSleepCount;
    var $restlessSleepCount;
    var $deepSleepCount;
    var $lightSleepCount;
    var $ignoreSleepCount;
    
    var $sleepStart;
    var $startOffset=0;
}
 //close of Class

