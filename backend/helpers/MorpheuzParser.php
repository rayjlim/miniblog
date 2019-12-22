<?php
use \Lpt\DevHelp;

const RESTLESS_THRESHOLD = 1000;
const DEEP_THRESHOLD = 120;
const SECONDS_PER_MIN = 60;
class MorpheuzParser
{
    public $urlString;
    public $graph;
    public $graphStr;
    public $totalSleepCount;
    public $restlessSleepCount;
    public $deepSleepCount;
    public $lightSleepCount;
    public $ignoreSleepCount;
    
    public $sleepStart;
    public $startOffset=0;

    /**
    * Constructor
    *
    * Take the RAW html and parse out the different pieces
    *
    * @param string $_urlString The data from Morpheuz
    */
    public function __construct($_urlString)
    {
        $this->urlString = $_urlString;
        $this->parse();
    }

    public function parse()
    {
        $this->_getGraphData();
        $this->totalSleepCount = $this->_calculateTotalSleep($this->graph);
        $this->restlessSleepCount = $this->_calculateRestless($this->graph);
        $this->deepSleepCount = $this->_calculateDeep($this->graph);
        $this->lightSleepCount = $this->_calculateLight($this->graph);
        $this->ignoreSleepCount = $this->_calculateIgnored($this->graph);
        $this->sleepStart = $this->_convertSleep($this->urlString);
    }

    /**
    //first entries that are Restless are not counted, because assumed not yet asleep
    //last entry is not counted because assumed I'm awake to press the button
    */
    public function _getGraphData()
    {
        $url = $this->urlString;
        parse_str($url, $output);

        // $pattern = '/graphx=([abcdef0-9])*/';
        // preg_match($pattern, $url, $matches, PREG_OFFSET_CAPTURE);

        // $this->graphStr = substr($matches[0][0],7);
        $this->graphStr = $output['graphx'];
        // $this->vers = $output['vers'];

        $output = str_split($this->graphStr, 3);
        $list = array_map("hexToDec", $output);

        foreach ($list as $key => $value) {
            if ($value < RESTLESS_THRESHOLD) {
                // echo $key;
                break;
            } else {
                array_shift($list);
                $this->startOffset++;
            }
        }
         
        unset($list[count($list)-1]);
        $this->graph=$list;
        return ;
    }

    public function getFormattedStartTime()
    {
        return date('Y-m-d H:i', $this->sleepStart + $this->_calculateOffset());
    }
    public function getFormattedEndTime()
    {
        $sleepAndIgnoredTimeTotal = ($this->totalSleepCount) * SECONDS_PER_MIN * 10 ;
        return date('Y-m-d H:i', $this->sleepStart + $this->_calculateOffset() +
            $sleepAndIgnoredTimeTotal);
    }
    public function exportSmsSleepStat()
    {
        $obj = new SmsSleepStat();
        $obj->urlString = $this->urlString;
        $obj->totalSleepCount= $this->totalSleepCount;
        $obj->restlessSleepCount= $this->restlessSleepCount;
        $obj->deepSleepCount= $this->deepSleepCount;
        $obj->lightSleepCount= $this->lightSleepCount;
        $obj->ignoreSleepCount= $this->ignoreSleepCount;
    
        $obj->sleepStart= $this->sleepStart;
        $obj->startOffset= $this->startOffset;
        return $obj;
    }

    private function _calculateOffset()
    {
        return $this->startOffset * SECONDS_PER_MIN * 10;
    }
    private function _convertSleep($url)
    {
        $pattern = '/base=([\d]*)/';
        preg_match($pattern, $url, $matches, PREG_OFFSET_CAPTURE);
        $timestamp = substr($matches[0][0], 5);

        return $timestamp/1000;
    }


    public function _calculateTotalSleep($data)
    {
        return count(array_filter($data, "nonMax"));
    }
    public function _calculateRestless($data)
    {
        return count(array_filter($data, "isRestless"));
    }
    public function _calculateDeep($data)
    {
        return count(array_filter($data, "isDeep"));
    }
    public function _calculateLight($data)
    {
        return count(array_filter($data, "isLight"));
    }
    public function _calculateIgnored($data)
    {
        return count(array_filter($data, "isIgnored"));
    }
}

function nonMax($var)
{
    return($var < 4095); // fff in hex is awake
}

function isRestless($var)
{
    return($var >= RESTLESS_THRESHOLD);
}

function isDeep($var)
{
    return($var < DEEP_THRESHOLD && $var > -1);
}

function isLight($var)
{
    return($var >= DEEP_THRESHOLD && $var < RESTLESS_THRESHOLD);
}
function isIgnored($var)
{
    return($var == -2);
}

function hexToDec($var)
{
    return hexdec($var);
}
