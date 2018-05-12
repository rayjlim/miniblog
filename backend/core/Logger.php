<?php
/**
* Logger Class Doc Comment
*
* PHP Version 5.4
*
* @date     2007-11-28
* @category Personal
* @package  Lpt
* @author   Raymond Lim <rayjlim1@gmail.com>
* @license  lilplaytime http://www.lilplaytime.com
* @link     www.lilplaytime.com
* 
*/
namespace Lpt;
/**
* Logger
*
* Debugging helper
*
* @date     2007-11-28
* @category Personal
* @package  Lpt
* @author   Raymond Lim <rayjlim1@gmail.com>
* @license  lilplaytime http://www.lilplaytime.com
* @link     www.lilplaytime.com
*/ 

class Logger
{

    static function log($message)
    {
        if (! isset($_SESSION['logger'])) {
            $iResource = new \Resource ();
            $date = $iResource->getDateTime();
            $filename = LOGS_DIR.DIR_SEP.LOG_PREFIX."-" . $date->format("Y-m").".txt";
            $fileData = $date->format("Y-m-d G:i:s") . "    " . $message."\n";
            $iResource->writeFile($filename, $fileData);
            echo 'log written'.$filename.'\n';
        }
    }
}
