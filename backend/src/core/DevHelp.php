<?php
namespace App\core;

defined('ABSPATH') or exit('No direct script access allowed');

class DevHelp
{
    /**
     * debugger_msg
     *
     * @param string $msg message output
     */
    public static function debugMsg($msg): void
    {
        if ((isset($_SESSION['debug']) &&  $_SESSION['debug']) && !isset($_REQUEST["xhr"])) {
            echo $msg.'<br>';
        }
    }

}

if (isset($_REQUEST['debug'])) {
    $_SESSION['debug'] = $_REQUEST['debug'] == 'on'
        ? true
        : false;
}
