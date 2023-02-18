<?php
namespace dao;

defined('ABSPATH') or exit('No direct script access allowed');

use \controllers\CUDHandler;
use \controllers\EntryHandler;
use \controllers\GraphHandler;
use \controllers\LogHandler;
use \controllers\UploadHandler;

use \dao\SmsEntriesRedbeanDAO;
use \dao\SmsUsersRedbeanDAO;
use \helpers\ContentHelper;

class DAOFactory
{
    // DAO
    public static function getSmsEntriesDAO()
    {
        return new SmsEntriesRedbeanDAO();
    }

    public static function getSmsUsersDAO()
    {
        return new SmsUsersRedbeanDAO();
    }

    public static function getResourceDAO()
    {
        return new Resource();
    }

    //helpers
    public static function getContentHelper()
    {
        return new ContentHelper(DAOFactory::getSmsEntriesDAO(), DAOFactory::getResourceDAO());
    }

    // controllers
    public static function getCUDHandler()
    {
        return new CUDHandler(
            DAOFactory::getSmsEntriesDAO(),
            DAOFactory::getResourceDAO(),
            DAOFactory::getContentHelper()
        );
    }

    public static function getEntryHandler()
    {
        return new EntryHandler(DAOFactory::getSmsEntriesDAO(), DAOFactory::getResourceDAO());
    }

    public static function getGraphHandler($app)
    {
        return new GraphHandler(
            $app,
            DAOFactory::getSmsEntriesDAO(),
            DAOFactory::getResourceDAO()
        );
    }

    public static function getLogHandler()
    {
        return new LogHandler(DAOFactory::getResourceDAO());
    }

    public static function getUploadHandler()
    {
        return new UploadHandler(DAOFactory::getResourceDAO());
    }
}
