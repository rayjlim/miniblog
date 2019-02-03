<?php
/** * Constants
 *
 * PHP version 5
 *
 * @category PHP
 * @package  Smsblog
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
define("DEFAULT_MONTHS_TO_SHOW", 2);
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

define('VIRTUES', array(
    '1. Temperance: Eat not to dullness; drink not to elevation. ',
    '2. Silence: Speak not but what may benefit others or yourself; avoid trifling conversation. ',
    '3. Order: Let all your things have their places; let each part of your business have its time. ',
    '4. Resolution: Resolve to perform what you ought; perform without fail what you resolve. ',
    '5. Frugality: Make no expense but to do good to others or yourself; i.e., waste nothing. ',
    '6. Industry: Lose no time; be always employed in something useful; cut off all unnecessary actions. ',
    '7. Sincerity: Use no hurtful deceit; think innocently and justly, and, if you speak, speak accordingly. ',
    '8. Justice: Wrong none by doing injuries, or omitting the benefits that are your duty. ',
    '9. Moderation: Avoid extremes; forbear resenting injuries so much as you think they deserve. ',
    '10. Cleanliness: Tolerate no uncleanliness in body, clothes, or habitation. ',
    '11. Tranquillity: Be not disturbed at trifles, or at accidents common or unavoidable. ',
    '12. Chastity: Rarely use venery but for health or offspring, never to dullness, weakness, or the injury of your own or another\'s peace or reputation. ',
    '13. Humility: Imitate Jesus and Socrates. '
));

define('MANTRAS', array(
    'Determination - “In the heart of the strong shines a relentless ray of resolve... It cannot be stopped, it cannot be controlled, and it will not fail.”',
    'Don\'t be afraid of your dreams',
    'Be more optimistic for more productivity',
    'Love should be authentic. Real, unconditional',
    'Be humble, work hard. Put your back against the wall and move forward',
    'the only easy day was yesterday #persevere',
    'Keep loses in perspective, fail forward = reflect on what can be improved',
    'Set a goal, ready, aim, fire, next',
    'Don\'t wait to try new things, spend time on things that matter',
    'Clear: Mind Like Water',
    'make it up, make it Happen',
    'Set your goals; Play the part',
    'Make it easy on yourself; Make it matter',
    'Do it, Do it Right, Do it Right Now',
    'You teach people how to treat you',
    '**Know your calling**',
    '**Take responsibility for the energy you put out**',
    'The present is the greatest gift',
    'Progress not perfection',
    'Productivity => producing',
    'Influence comes from trust, proximity, admiration, believe to care for them',
    'Public speaking/persuasion requires presence, clarity, distinction between old/new argument',
    'Not dead, can’t quit',
    'Learn at all times at all costs',
    "Be consistent in your beliefs of what you truly value.",
    "Getting better is the goal, every problem is a chance to get better",
    "Small daily change",
    "Do work based on our beliefs",
    "Instead of do what makes you happy, do what make you great",
    "Live Life, Give Love, Make a difference",
    "If I am not using it don\'t need it",
    "Get there, believe",
    "Results, not excuses",
    "Only i am stopping me from being successful",
    "A man reveals his character even in the simplest things he does",
    "a year from now you'll wish you had started today",
    "one day at a time, no regrets and move on"
));

define('QUESTIONOTDAY', array(
    "What is in your heart? What is your passion?",

    "What do you wish you had more time to do?",
"What do you think you spend too much time doing?",
"Who do you need to get in touch with because it 's been too long?",
"What is something new you recently tried and enjoyed?",
"What will you have wanted to accomplish by the time you are 100?",
"Describe something you achieved that you didn 't think was possible.",
"What gives you hope?",
"What is a new habit you want to take up?",
"What life advice would you offer to a newborn infant?",
"When did you last cry...alone...in front of someone else?",
"What matters to you and why?",
"What holds you back from doing the things you really want to do?",
"What is your greatest fear?",
"What is your greatest accomplishment?",
"What is something you know you do differently than most people?",
"What is your next great adventure?",
"What 's one thing that could happen today that would make it great?",
"What inspires you?",
"What are the little things you stop to appreciate and enjoy?",
"What does home mean to you?",
"What do you want to do before you die?",
"How do you show your love?"
));