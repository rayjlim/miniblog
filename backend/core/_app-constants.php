<?php
/**
 * Constants
 *
 * PHP version 7
 *
 * @category PHP
 * @package  Miniblog
 */
date_default_timezone_set('America/Los_Angeles');
$getcwd = getcwd();
// Windows or Unix separators
$DIR_SEP = (strpos($getcwd, "\\") != 0) ? "\\" : "/";
define("DIR_SEP", $DIR_SEP);
define("ABSPATH", $getcwd . $DIR_SEP);

define("LOGS_DIR", ABSPATH . DIR_SEP .'_logs');
define("LOG_PREFIX", 'miniblog');

define("MINUTES_PER_HOUR", 60);
define("HOURS_PER_DAY", 24);
define("MID_DAY_HOUR", 12);
define("SECONDS_PER_DAY", 60*60*24);

define("DEFAULT_MONTHS_TO_SHOW", 3);
define("RESULT_LIMIT_DEFAULT", 100);

define("FILTER_ALL", 0);
define("FILTER_TAGGED", 1);
define("FILTER_UNTAGGED", 2);

define('POSTS', 'sms_entries');
define('USERS', 'sms_users');

define("FULL_DATETIME_FORMAT", "Y-m-d G:i:s");
define("YEAR_MONTH_FORMAT", "Y-m");
define("YEAR_MONTH_DAY_FORMAT", "Y-m-d");
