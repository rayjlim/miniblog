<?php
namespace dao;

defined('ABSPATH') or exit('No direct script access allowed');

use \SmsEntriesRedbeanDAO;
use \SmsUsersRedbeanDAO;

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
    public static function ContentHelper()
    {
        return new \ContentHelper(DAOFactory::getSmsEntriesDAO(), DAOFactory::getResourceDAO());
    }

    // controllers
    public static function getCUDHandler()
    {
        return new \controllers\CUDHandler(
            DAOFactory::getSmsEntriesDAO(),
            DAOFactory::getResourceDAO(),
            DAOFactory::ContentHelper()
        );
    }

    public static function getEntryHandler()
    {
        return new \controllers\EntryHandler(DAOFactory::getSmsEntriesDAO(), DAOFactory::getResourceDAO());
    }

    public static function getGraphHandler($app)
    {
        return new \controllers\GraphHandler(
            $app,
            DAOFactory::getSmsEntriesDAO(),
            DAOFactory::getResourceDAO()
        );
    }

    public static function getLogHandler()
    {
        return new \controllers\LogHandler(DAOFactory::getResourceDAO());
    }

    public static function getUploadHandler()
    {
        return new \controllers\UploadHandler(DAOFactory::getResourceDAO());
    }
}
