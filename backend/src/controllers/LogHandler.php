<?php
namespace App\controllers;

defined('ABSPATH') or exit('No direct script access allowed');

use Psr\Container\ContainerInterface;
use App\core\DevHelp;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\core\Logger;

class LogHandler
{
    public $resource = null;
    private $container;

    // constructor receives container instance
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function getLog(Request $request, Response $response, $args): Response
    {
        $factory = $this->container->get('Objfactory');
        $this->resource = $factory->makeResource();

        $logFileName = $args['logFileName'] ?? '';
        DevHelp::debugMsg('start logs list');
        $filelist = $this->readFilelist(LOGS_DIR);
        if ($logFileName == '') {
            DevHelp::debugMsg('reading first file');
            $logFileName = end($filelist);
        }

        $logFile = '';
        if ($logFileName != '' && in_array($logFileName, $filelist)) {
            DevHelp::debugMsg('$logFileName: ' . $logFileName);
            $logFile = $this->resource->readfile(LOGS_DIR . DIR_SEP . $logFileName);
        }

        $reply = new \stdClass();
        $reply->logs = array_values($filelist);
        $reply->logFileName = $logFileName;
        $reply->logFile = $logFile;
        $response->getBody()->write(json_encode($reply));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function deleteLog(Request $request, Response $response, $args): Response
    {
        $factory = $this->container->get('Objfactory');
        $this->resource = $factory->makeResource();
        $logFileName = $args['logFileName'] ?? '';
        if ($logFileName !== '') {
            Logger::log("Remove Log: \t" . LOGS_DIR . DIR_SEP . $logFileName);
            $this->resource->removefile(LOGS_DIR . DIR_SEP . $logFileName);
            $reply = 'File Removed: ' . $logFileName;
            $response->getBody()->write(json_encode($reply));
            return $response->withHeader('Content-Type', 'application/json');
        }
    }

    public function readFilelist(string $targetDir): array
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
