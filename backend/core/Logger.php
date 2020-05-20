<?php
namespace Lpt;
defined('ABSPATH') OR exit('No direct script access allowed');
class Logger
{
    public static function log($message)
    {
       
            $iResource = new \Resource();
            $date = $iResource->getDateTime();
            $filename = LOGS_DIR.DIR_SEP.LOG_PREFIX."-" . $date->format("Y-m").".txt";
            $fileData = $date->format("Y-m-d G:i:s") . "    " . $message."\n";
            $iResource->writeFile($filename, $fileData);
            // echo 'log written'.$filename.'\n';
        
    }
}