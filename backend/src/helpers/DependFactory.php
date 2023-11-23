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
use App\helpers\ContentHelper;

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
    // public static function getSmsEntriesDAO()
    // {
    //     return new SmsEntriesRedbeanDAO();
    // }

    // public static function getSmsUsersDAO()
    // {
    //     return new SmsUsersRedbeanDAO();
    // }

    // public static function makeResource()
    // {
    //     return new Resource();
    // }

    // //helpers
    // public static function getContentHelper()
    // {
    //     return new ContentHelper(DAOFactory::getSmsEntriesDAO(), DAOFactory::getResourceDAO());
    // }

    // // controllers
    // public static function getCUDHandler()
    // {
    //     return new CUDHandler(
    //         DAOFactory::getSmsEntriesDAO(),
    //         DAOFactory::getResourceDAO(),
    //         DAOFactory::getContentHelper()
    //     );
    // }

    // // public static function getEntryHandler()
    // // {
    // //     return new EntryHandler(DAOFactory::getSmsEntriesDAO(), DAOFactory::getResourceDAO());
    // // }

    // public static function getGraphHandler($app)
    // {
    //     return new GraphHandler(
    //         $app,
    //         DAOFactory::getSmsEntriesDAO(),
    //         DAOFactory::getResourceDAO()
    //     );
    // }

    // public static function getLogHandler()
    // {
    //     return new LogHandler(DAOFactory::getResourceDAO());
    // }

    // public static function getUploadHandler()
    // {
    //     return new UploadHandler(DAOFactory::getResourceDAO());
    // }

    // public static function getSettings()
    // {
    //     return new Settings();
    // }
}
