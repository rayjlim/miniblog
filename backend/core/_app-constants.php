<?php
/**
 * Constants
 *
 * PHP version 8
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

define("LOGS_DIR", ABSPATH . '_logs');
define("LOG_PREFIX", 'miniblog');

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

define("UPLOAD_SIZE_LIMIT", 6000000);
