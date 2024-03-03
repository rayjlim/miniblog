<?php

namespace App\core;

defined('ABSPATH') or exit('No direct script access allowed');

use App\dao\Resource;

class Logger
{
    public static function log(string $message, array $options = array()): void
    {
        $defaults = array(
            'logFilePrefix' => LOG_PREFIX
          );
        $config = array_merge($defaults, $options);

        $iResource = new Resource();
        $date = $iResource->getDateTime();
        // $filename = LOGS_DIR . DIR_SEP . LOG_PREFIX . "-" . $date->format(YEAR_MONTH_FORMAT) . ".txt";
        $filename = LOGS_DIR . DIR_SEP . $config['logFilePrefix'] . "-" . $date->format(YEAR_MONTH_FORMAT) . ".txt";
        $fileData = $date->format(FULL_DATETIME_FORMAT) . "    " . $message . "\n";
        $iResource->writeFile($filename, $fileData);
    }
}
