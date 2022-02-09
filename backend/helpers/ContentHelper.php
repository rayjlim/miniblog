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
}
