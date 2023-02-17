<?php
defined('ABSPATH') or exit('No direct script access allowed');
use \Lpt\DevHelp;

/**
 * @OA\Schema(
 *   schema="SmsEntrie",
 *   type="object",
 * )
 */
class SmsEntrie
{
     /**
      * The entry id
      *
      * @var           integer
      * @OA\Property()
      */
    public $id;
         /**
          * The entry content
          *
          * @var           string
          * @OA\Property()
          */
    public $content;
         /**
          * The entry date
          *
          * @var           date
          * @OA\Property()
          */
    public $date;
         /**
          * The entry creator id
          *
          * @var           integer
          * @OA\Property()
          */
    public $userId;
    
    public function __construct($date = '', $content = '')
    {
        $this->date = $date;
        $this->content = $content;
    }
    
    public static function sanitizeContent($content)
    {
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
