<?php
namespace App\helpers;

defined('ABSPATH') or exit('No direct script access allowed');

use App\controllers\CUDHandler;
use App\controllers\EntryHandler;
use App\controllers\GraphHandler;
use App\controllers\LogHandler;
use App\controllers\UploadHandler;
use App\controllers\Settings;

use App\mysql\SmsUsersRedbeanDAO;


class DependFactory
{
    public function makeSmsEntriesDAO()
    {
        return new \App\mysql\SmsEntriesRedbeanDAO();
    }

    public static function makeResource()
    {
        return new \App\dao\Resource();
    }

    // // DAO
    // public static function getSmsUsersDAO()
    // {
    //     return new SmsUsersRedbeanDAO();
    // }

}
