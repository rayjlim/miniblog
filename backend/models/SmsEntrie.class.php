<?php

/**
 * Object represents table 'sms_entries'
 *
 * @author: http://phpdao.com
 * @date: 2011-02-25 14:02
 */
use \Lpt\DevHelp;
class SmsEntrie
{
    
    var $id;
    var $content;
    var $date;
    var $userId;
    
    function __construct($date = '', $content = '') {
        $this->date = $date;
        $this->content = $content;
    }
    
    static function sanitizeContent($content) {
        $order = array("\r\n", "\n", "\r");
        
        // Processes \r\n's first so they aren't converted twice.
        $replace = '<br />';
        return stripslashes(str_replace($order, $replace, $content));
    }

    // formats
    /*
    standard: (no identifiers)
        foo bar baz

    hash tagged (#)
        140.0 #weight comments
        #news 
        #sleep 23:00
        #awake 09:23,8.00
        
        #pushups
            how to handle workout videos; dont count or record total count
        #situps
            
    */
}
 //close of Class

