<?php
use \Lpt\DevHelp;

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
            \Lpt\Logger::log("handleMorpheuz called");
            DevHelp::debugMsg(__FILE__);
            $data = $this->app->request->getBody();
            \Lpt\Logger::log("data". $data);
            $jsonObj = json_decode($data);
            if($jsonObj){
                $object = new MorpheuzParser($jsonObj->data);
                $smsSleepStat = $object->exportSmsSleepStat();
                $id = $this->dao->insert($smsSleepStat);
                // $id = 'Morpheuz Parser broken for v45';
                \Lpt\Logger::log("Parsed data: ".$id);
            }else{
                \Lpt\Logger::log("INVALID data:");

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

    function showMain() {
        return function () {
            $this->app->render('main.twig');
        };
    }    
}
