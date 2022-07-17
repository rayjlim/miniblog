<?php
defined('ABSPATH') or exit('No direct script access allowed');

use \Lpt\DevHelp;

class LogHandler
{
    var $resource = null;
    /**
     * Constructor
     *
     * Initialize dependancies
     *
     * @param object $_iResource Connection to database
     *
     * @return array of page params
     */
    function __construct($resource)
    {
        $this->resource = $resource;
    }

    public function getUrlHandler()
    {
        return function ($logFileName = '') {
            \Lpt\DevHelp::debugMsg('start logs list');
            $filelist = $this->readFilelist(LOGS_DIR);
            if ($logFileName == '') {
                \Lpt\DevHelp::debugMsg('reading first file');
                $logFileName = end($filelist);
            }

            $this->readFileAndRender($logFileName, $filelist);        };
    }

    public function delete()
    {
        return function ($logFileName) {
            $this->resource->removefile(LOGS_DIR . DIR_SEP . $logFileName);
            $data['pageMessage'] = 'File Removed: ' . $logFileName;
            DevHelp::debugMsg($data['pageMessage']);
            echo json_encode($data);
        };
    }

    public function readFilelist($targetDir)
    {
        $filelist = $this->resource->readdir($targetDir);
        for ($i = count($filelist) - 1; $i >= 0; $i--) {
            if (strpos($filelist[$i], LOG_PREFIX) === FALSE) {
                unset($filelist[$i]);
            }
        }
        return array_values($filelist);
    }

    public function readFileAndRender($logFileName, $filelist)
    {
        $logFile = '';
        if ($logFileName != '' && in_array($logFileName, $filelist)) {
            \Lpt\DevHelp::debugMsg('$logFileName: ' . $logFileName);
            $logFile = $this->resource->readfile(LOGS_DIR . DIR_SEP . $logFileName);
        }
        echo json_encode(array(
            'logs'  => array_values($filelist),
            'logFileName' => $logFileName,
            'logFile' => $logFile
        ));
    }
}
