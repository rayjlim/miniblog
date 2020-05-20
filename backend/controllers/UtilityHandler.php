<?php
defined('ABSPATH') OR exit('No direct script access allowed');
use \Lpt\DevHelp;
use \Lpt\Logger;

class UtilityHandler extends AbstractController
{
    var $dao = null;
    
    function __construct($app, $_smsSleepStatsDAO, $_resource) {
        $this->dao = $_smsSleepStatsDAO;
        $this->resource = $_resource;
        parent::__construct($app);
    }

    public function handleMorpheuz() {
        return function () {
            Logger::log("handleMorpheuz called");
            DevHelp::debugMsg(__FILE__);
            $data = $this->app->request->getBody();
            Logger::log("data". $data);
            $jsonObj = json_decode($data);
            if($jsonObj){
                $object = new MorpheuzParser($jsonObj->data);
                $smsSleepStat = $object->exportSmsSleepStat();
                $id = $this->dao->insert($smsSleepStat);
                // $id = 'Morpheuz Parser broken for v45';
                Logger::log("Parsed data: ".$id);
            }else{
                Logger::log("INVALID data:");

            }
        };
    }

    public function getSleepStats() {
        return function () {
            $entries = $this->dao->queryAll();
            $this->app->response()->header('Content-Type', 'application/json');
            $this->resource->echoOut('{"entries": ' . json_encode($entries) . '}');
        };
    }

    function showSleepStats() {
        return function () {
            $userId = $this->resource->getSession(SESSION_USER_ID);
            $this->app->render('sleep_track.twig');
        };
    }   
}
