<?php
namespace Lpt;

defined('ABSPATH') or exit('No direct script access allowed');

class DevHelp
{
    /**
     *  debugger_msg
     *
     * @param string $msg message output
     *
     * @return None
     */
    public static function debugMsg($msg)
    {
        if ((isset($_SESSION['debug']) &&  $_SESSION['debug']) && !isset($_REQUEST["xhr"])) {
            echo $msg.'<br>';
        }
    }
    /**
     *  redirectHelper
     *
     * @param string $url target location
     *
     * @return None
     */
    public static function redirectHelper($url)
    {
        if (isset($_SESSION['debug']) && $_SESSION['debug']) {
            echo '<a href="'.$url.'">Follow Redirect '.$url.'</a>';
        } else {
            header("Location: $url");
        }
        exit;
    }
}

if (isset($_REQUEST['debug'])) {
    $_SESSION['debug'] = $_REQUEST['debug'] == 'on'
        ? true
        : false;
}
