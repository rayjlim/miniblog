<?php
namespace controllers;

defined('ABSPATH') or exit('No direct script access allowed');

use \Lpt\DevHelp;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class LogHandler
{
    private $resource = null;
    /**
     * Constructor
     *
     * Initialize dependancies
     *
     * @param object $_iResource Connection to database
     *
     * @return array of page params
     */
    public function __construct($resource)
    {
        $this->resource = $resource;
    }

    public function getUrlHandler()
    {
        return function (Request $request, Response $response, $args) {
            $logFileName = isset($args['logFileName']) ? $args['logFileName'] : '';
            \Lpt\DevHelp::debugMsg('start logs list');
            $filelist = $this->readFilelist(LOGS_DIR);
            if ($logFileName == '') {
                \Lpt\DevHelp::debugMsg('reading first file');
                $logFileName = end($filelist);
            }

            $logFile = '';
            if ($logFileName != '' && in_array($logFileName, $filelist)) {
                \Lpt\DevHelp::debugMsg('$logFileName: ' . $logFileName);
                $logFile = $this->resource->readfile(LOGS_DIR . DIR_SEP . $logFileName);
            }
            $this->resource->echoOut(
                json_encode(
                    array(
                    'logs'  => array_values($filelist),
                    'logFileName' => $logFileName,
                    'logFile' => $logFile
                    )
                )
            );
            return $response;
        };
    }


    public function deleteHandler()
    {
        return function (Request $request, Response $response, $args) {
            $logFileName = isset($args['logFileName']) ? $args['logFileName'] : '';
            if ($logFileName !== '') {
                $this->resource->removefile(LOGS_DIR . DIR_SEP . $logFileName);
                $pageMessage = 'File Removed: ' . $logFileName;
                DevHelp::debugMsg($pageMessage);
                $this->resource->echoOut(json_encode($pageMessage));
            }
            return $response;
        };
    }

    public function readFilelist($targetDir)
    {
        $filelist = $this->resource->readdir($targetDir);
        for ($i = count($filelist) - 1; $i >= 0; $i--) {
            if (strpos($filelist[$i], LOG_PREFIX) === false) {
                unset($filelist[$i]);
            }
        }
        return array_values($filelist);
    }
}
