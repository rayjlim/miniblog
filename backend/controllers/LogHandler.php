<?php
use \Lpt\DevHelp;
class LogHandler extends AbstractController
{
     var $resource = null;
    /**
     * Constructor
     *
     * Initialize dependancies
     *
     * @param object $_iDao Connection to database
     * @param object $_iResource Connection to database
     *
     * @return array of page params
     */
    function __construct($app, $resource) {
         $this->resource = $resource;
        parent::__construct($app);
    }
    public function getUrlHandler() {
        return function () {
            \Lpt\DevHelp::debugMsg('start logs list');
            
            $logfileName = '';
            $filelist = $this->readFilelist(LOGS_DIR);
            if (count($filelist) > 0) {
                \Lpt\DevHelp::debugMsg('reading first file');
                $logfileName = $filelist[count($filelist) - 1];
            }
            $this->readFileAndRender($logfileName, $filelist);
        };
    }
    
    public function getUrlHandlerWithParam() {
        return function ($logfileName) {
            \Lpt\DevHelp::debugMsg('start logs list with param');
            $filelist = $this->readFilelist(LOGS_DIR);
            $this->readFileAndRender($logfileName, $filelist);
        };
    }
    
    public function delete() {
        return function ($logfileName) {
           
            $this->resource->removefile(LOGS_DIR . DIR_SEP . $logfileName);
            
            $data['pageMessage'] = 'File Removed: ' . $logfileName;
            DevHelp::debugMsg($data['pageMessage']);
            
            //forward to xhr_action
            $_SESSION['page_message'] = $data['pageMessage'];
            
            if ($this->app->request()->isAjax()) {
                echo json_encode($data);
            } 
            else {
                DevHelp::redirectHelper($baseurl . 'logs/');
            }
        };
    }
    
    public function readFilelist($targetDir) {
       
        $filelist = $this->resource->readdir($targetDir);
        
        //NEED TO REMOVE NON EP CAL ENTRIES
        for ($i = count($filelist) - 1; $i >= 0; $i--) {
            if (strpos($filelist[$i], LOG_PREFIX) === FALSE) {
                unset($filelist[$i]);
            }
        }
        return array_values($filelist);
    }

    public function readFileAndRender($logfileName, $filelist) {
        
        // TODO VALIDATE LOGNAME PASSED IS IN CORRECT FORMAT (PREFIX____.TXT)
        $logfile = '';
        if ($logfileName != '') {
            \Lpt\DevHelp::debugMsg('$logfileName: ' . $logfileName);
            
            $logfile = $this->resource->readfile(LOGS_DIR . DIR_SEP . $logfileName);
        }
        $this->app->view()->appendData(["filelist" => $filelist]);
        $this->app->view()->appendData(["logfileName" => $logfileName]);
        $this->app->view()->appendData(["logfile" => $logfile]);
        $this->app->render('show_logs.twig');
    }
}
