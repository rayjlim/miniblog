<?php

defined('ABSPATH') or exit('No direct script access allowed');
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
     * @param object $_iDao      Connection to database
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
        return $smsEntry;
    }
}
