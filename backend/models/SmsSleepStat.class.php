<?php
defined('ABSPATH') OR exit('No direct script access allowed');
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
