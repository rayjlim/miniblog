<?php

defined('ABSPATH') OR exit('No direct script access allowed');
use \Lpt\DevHelp;

/**
 * EntryHelper Class Doc Comment
 *
 * @category Class
 * @package  Smsblog
 */
class ContentHelper implements ContentHelperInterface
{
    public $iDao = null;
    public $iResource = null;
    
    /**
     * Constructor
     *
     * Initialize dependancies
     *
     * @param object $_iDao Connection to database
     * @param object $_iResource Connection to database
     *
     * @return array of page params
     */
    public function __construct($_iDao, $_iResource)
    {
        $this->iDao = $_iDao;
        $this->iResource = $_iResource;
    }
    
    public function processEntry(SmsEntrie $smsEntry)
    {
        $smsEntry->content = SmsEntrie::sanitizeContent($smsEntry->content);
        $smsEntry = $this->checkDateShortForms($smsEntry);
        
        $smsEntry = $this->checkSleepTag($smsEntry);
        $smsEntry = $this->checkAwakeTag($smsEntry);
        return $smsEntry;
    }
    
    public function checkDateShortForms(SmsEntrie $smsEntry)
    {
        $fullDatePattern = '/^[\d]{8}\s/';
        
        // 20130401 is April 1, 2013
        $shortDatePattern = '/^[\d]{4}\s/';
        
        // 0211 is February 11
        $yesterdayTagPattern = '/#[Yy]\s/';
        
        // #y is yesterday
        
        DevHelp::debugMsg("after short code check content");
        $finalValues = array();
        
        //check for date or #y tag as param
        if (preg_match($fullDatePattern, $smsEntry->content) != 0) {
            
            //full date is passed as a param of the message
            DevHelp::debugMsg("fullDatePattern");
            $entryDate = new DateTime(substr($smsEntry->content, 0, 4) . '-' . substr($smsEntry->content, 4, 2) . '-' . substr($smsEntry->content, 6, 2));
            
            $smsEntry->date = $entryDate->format("Y-m-d G:i:s");
            $smsEntry->content = substr($smsEntry->content, 9);
        } elseif (preg_match($yesterdayTagPattern, $smsEntry->content) != 0) {
            DevHelp::debugMsg("yesterday tag pattern");
            $entryDate = new DateTime($smsEntry->date);
            $entryDate->sub(new DateInterval('P1D'));
            $smsEntry->date = $entryDate->format("Y-m-d G:i:s");
            $smsEntry->content = preg_replace($yesterdayTagPattern, '', $smsEntry->content);
        } elseif (preg_match($shortDatePattern, $smsEntry->content) != 0) {
            DevHelp::debugMsg("shortDatePattern");
            $entryDate = new DateTime(substr($smsEntry->date, 0, 4) . '-' . substr($smsEntry->content, 0, 2) . '-' . substr($smsEntry->content, 2, 2));
            $smsEntry->date = $entryDate->format("Y-m-d G:i:s");
            $smsEntry->content = substr($smsEntry->content, 5);
        }
        
        // TODO IMPLEMENT NUMBERTAGDATEPATTERN
        // $numberTagDatepattern = '/#[\d]*[Yy]\s/';
        // #2y is 2 days ago
        return $smsEntry;
    }
    
    /**/
    public function checkSleepTag(SmsEntrie $smsEntry)
    {
        if (stripos($smsEntry->content, '#sleep') > - 1) {
            $dateTime = $this->iResource->getDateTime();
            
            // TODO: accept form of #sleep 30 my comment => -30 min
            $comment = substr($smsEntry->content, 7);
            $useTimeoffset = is_numeric($comment);
            if ($useTimeoffset) {
                $dateTime = $dateTime->sub(new DateInterval('PT' . $comment . 'M'));
                $comment = '';
            }
            $isAfterMidnight = $dateTime->format("H") < MID_DAY_HOUR;
            if ($isAfterMidnight) {
                $yesterday = $dateTime->sub(new DateInterval('P1D'));
                $smsEntry->date = $yesterday->format("Y-m-d");
            }
            $smsEntry->content = '#sleep ' . trim($dateTime->format('H:i') . ' ' . $comment);
        }
        return $smsEntry;
    }
    public function checkAwakeTag(SmsEntrie $smsEntry)
    {
        if (stripos($smsEntry->content, '#awake') > - 1) {
            //get yesterdays sleep time
            $entryFound = $this->iDao->queryLastTagEntry($smsEntry->userId, '#sleep');
            $smsEntry->content = $this->calculateWakeValue($entryFound['content'], $smsEntry->content, $this->iResource->getDateTime());
        }
        return $smsEntry;
    }
    public function calculateWakeValue($sleepContent, $wakeContent, $currentTime)
    {
        $sleepContent = trim(str_ireplace('#sleep', '', $sleepContent));
        $sleepWholeValue = $this->convertStringToWholeValue($sleepContent);
        
        // NOT USING THE WAKE PATTERN AT THIS TIME
        $wakeDateTimePattern = '/^#awake ([\d]?[\d]):([\d]{2})/';
        $wakeDiffPattern = '/^#awake ([\d]?[\d])/';
        $content = '';
        if (preg_match($wakeDateTimePattern, $wakeContent, $matches) != 0) {
            
            //full date is passed as a param of the message
            DevHelp::debugMsg("wakeDateTimePattern");
            DevHelp::debugMsg('regex match ' . $matches[1] . ':' . $matches[2]);
            $wakeHour = $matches[1];
            $wakeMinute = $matches[2];
            $content = substr($wakeContent, 13);
        } elseif (preg_match($wakeDiffPattern, $wakeContent, $matches) != 0) {
            $wakeHour = $currentTime->format("H");
            $wakeMinute = $currentTime->format("i") - $matches[1];
            if ($wakeMinute < 0) {
                $wakeMinute = $wakeMinute + MINUTES_PER_HOUR;
                $wakeHour--;
            }
            $content = substr($wakeContent, 9);
        } else {
            $wakeHour = $currentTime->format("H");
            $wakeMinute = $currentTime->format("i");
            $content = ($wakeContent != '#awake') ? substr($wakeContent, 6) : '';
        }
        
        DevHelp::debugMsg('time: ' . $wakeHour . ':' . $wakeMinute);
        $wakeWholeValue = $wakeHour + ($wakeMinute / MINUTES_PER_HOUR);
        if ($sleepWholeValue > MID_DAY_HOUR) {
            $sleepWholeValue-= HOURS_PER_DAY;
        }
        $sleepTotal = $wakeWholeValue - $sleepWholeValue;
        
        DevHelp::debugMsg('$sleepTotal ' . $sleepTotal);
        return '#awake ' . $this->number_pad($wakeHour, 2) . ':' . $this->number_pad($wakeMinute, 2) . ',' . number_format($sleepTotal, 2) . $content;
    }
    
    public function convertStringToWholeValue($stringContent)
    {
        $tokens = explode(":", $stringContent);
        $hourVal = intval($tokens[0]);
        $minuteVal = $tokens[1] / MINUTES_PER_HOUR;
        return floatval($hourVal) + floatval($minuteVal);
    }
    
    public function number_pad($number, $n)
    {
        return str_pad((int)$number, $n, "0", STR_PAD_LEFT);
    }
}
