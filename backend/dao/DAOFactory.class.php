<?php
require_once 'backend/3rdparty/Facebook/autoload.php';

class DAOFactory
{

    // DAO
    static function getSmsEntriesDAO() {
        return new SmsEntriesRedbeanDAO();
    }
    static function getSmsUsersDAO() {
        return new SmsUsersRedbeanDAO();
    }
    static function getSmsSleepStatsDAO() {
        return new SmsSleepstatsRedbeanDAO();
    }
    static function getBookmarksDAO() {
        return new BookmarksRedbeanDAO();
    }
    static function getResourceDAO() {
        return new Resource();
    }
    static function getEmailDAO() {
        return new EmailDAO();
    }

    //helpers
    static function ContentHelper() {
        return new ContentHelper(DAOFactory::getSmsEntriesDAO(), DAOFactory::getResourceDAO());
    }
    static function EntryHelper() {
        return new EntryHelper(DAOFactory::getSmsEntriesDAO(), DAOFactory::getResourceDAO());
    }

    static function UserHelper() {
        return new UserHelper(DAOFactory::getSmsUsersDAO(), DAOFactory::getSmsEntriesDAO(),
            DAOFactory::getResourceDAO());
    }
    static function GraphHelper() {
        return new GraphHelper(DAOFactory::getResourceDAO()->getDateTime());
    }

    static function EmailHelper() {
        return new EmailHelper(DAOFactory::getSmsEntriesDAO(), DAOFactory::getResourceDAO(),
            DAOFactory::getEmailDAO());
    }

    // controllers
    static function CUDHandler($app) {
        return new CUDHandler($app, DAOFactory::getSmsEntriesDAO(), DAOFactory::getResourceDAO(),
            DAOFactory::ContentHelper());
    }
    static function EntryHandler($app) {
        return new EntryHandler($app, DAOFactory::getSmsEntriesDAO(), DAOFactory::getResourceDAO());
    }
    static function GraphHandler($app) {
        return new GraphHandler($app, DAOFactory::getSmsEntriesDAO(), DAOFactory::getResourceDAO(),
            DAOFactory::GraphHelper());
    }
    static function LogHandler($app) {
        return new LogHandler($app, DAOFactory::getResourceDAO());
    }
    static function UtilityHandler($app) {
        return new UtilityHandler($app, DAOFactory::getSmsSleepStatsDAO(),
            DAOFactory::getResourceDAO());
    }
    static function BookmarkHandler($app) {
        return new BookmarkHandler($app, DAOFactory::getBookmarksDAO(), DAOFactory::getResourceDAO());
    }
    static function UploadHandler($app) {
        return new UploadHandler($app, DAOFactory::getResourceDAO());
    }

    static function FacebookApi() {
        $fb = new Facebook\Facebook([
          'app_id' => FB_APP_ID, // Replace {app-id} with your app id
          'app_secret' => FB_APP_SECRET,
          'default_graph_version' => 'v2.2',
          ]);
        return $fb;
    }

    static function SecurityAgent() {
        return new SecurityAgent(DAOFactory::getSmsUsersDAO(), DAOFactory::getResourceDAO(),
            DAOFactory::FacebookApi());
    }
}
