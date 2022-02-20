<?php
defined('ABSPATH') OR exit('No direct script access allowed');

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
        return new ContentHelper(DAOFactory::getSmsEntriesDAO(), DAOFactory::getResourceDAO());
    }

    // controllers
    public static function CUDHandler($app)
    {
        return new CUDHandler(
            $app,
            DAOFactory::getSmsEntriesDAO(),
            DAOFactory::getResourceDAO(),
            DAOFactory::ContentHelper()
        );
    }
    public static function EntryHandler($app)
    {
        return new EntryHandler($app, DAOFactory::getSmsEntriesDAO(), DAOFactory::getResourceDAO());
    }
    public static function GraphHandler($app)
    {
        return new GraphHandler(
            $app,
            DAOFactory::getSmsEntriesDAO(),
            DAOFactory::getResourceDAO()
        );
    }
    public static function LogHandler($app)
    {
        return new LogHandler($app, DAOFactory::getResourceDAO());
    }

    public static function UploadHandler($app)
    {
        return new UploadHandler($app, DAOFactory::getResourceDAO());
    }

}
