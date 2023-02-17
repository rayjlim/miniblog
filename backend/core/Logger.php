<?php
namespace Lpt;

defined('ABSPATH') or exit('No direct script access allowed');
class Logger
{
    public static function log($message)
    {
            $iResource = new \Resource();
            $date = $iResource->getDateTime();
            $filename = LOGS_DIR.DIR_SEP.LOG_PREFIX."-" . $date->format(YEAR_MONTH_FORMAT).".txt";
            $fileData = $date->format(FULL_DATETIME_FORMAT) . "    " . $message."\n";
            $iResource->writeFile($filename, $fileData);
    }
}
