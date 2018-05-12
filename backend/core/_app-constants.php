<?php
/** * Constants
 *
 * PHP version 5
 *
 * @category PHP
 * @package  Smsblog
 * @author   Raymond Lim <raymond@lilplaytime.com>
 * @license  http://smsblog.lilplaytime.com None
 * @version  SVN: 1.0
 * @link     http://smsblog.lilplaytime.com
*/
date_default_timezone_set('America/Los_Angeles');
$getcwd = getcwd();
// Windows or Unix separators
$DIR_SEP = (strpos($getcwd, "\\") != 0) ? "\\" : "/";
define("DIR_SEP", $DIR_SEP);
define("ABSPATH", $getcwd . $DIR_SEP);

define("APP_NAME", "smsblog");

define ("LOGS_DIR", dirname( ABSPATH ) . DIR_SEP .'_logs');
define ("LOG_PREFIX", 'smsblog');

define("MINUTES_PER_HOUR", 60);
define("HOURS_PER_DAY", 24);
define("MID_DAY_HOUR", 12);
define("SECONDS_PER_DAY", 60*60*24);

define("DEFAULT_LIMIT_SIZE", 50);
define("DEFAULT_MONTHS_TO_SHOW", 3);
define("DEFAULT_SAMPLE_SIZE", 15);
define("DEFAULT_WEIGHT_FACTOR", .7);

define("BLOG_LIMIT_DEFAULT", 100);

define ("COOKIE_USER", "cSmsblogUser");
define ("SESSION_USER_ID", "sUserId");
define ("SESSION_USER_FULLNAME", "sUserFullname");

define ("FILTER_ALL", 0);
define ("FILTER_TAGGED", 1);
define ("FILTER_UNTAGGED", 2);

define ("CALENDAR_SUMMARY_LENGTH", 75);
define ("CALENDAR_UNTAGGED_SUMMARY_LENGTH", 75);
define ("GOAL_WEIGHT", 135);

define('POSTS', 'sms_entries');
define('USERS', 'sms_users');
define('SLEEPSTATS', 'sms_sleepstats');

define('BOOKMARKS', 'bookmark_tracker');

define("SESSION_GH_ACCESS_TOKEN", "gh_access_token");
define('SESSION_GOOGLE_TOKEN', 'google_token');