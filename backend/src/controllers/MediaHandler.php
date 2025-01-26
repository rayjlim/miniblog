<?php

namespace App\controllers;

defined('ABSPATH') or exit('No direct script access allowed');

use App\core\DevHelp;
use App\core\Logger;
use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/* The `MediaHandler` class is a PHP class that handles media-related operations.
It has two methods: `listMedia()` and `deleteMedia()`. */

class MediaHandler
{
    public $resource = null;
    private $container = null;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function listMedia(Request $request, Response $response, $args)
    {
        DevHelp::debugMsg('start listMedia');
        $currentDir = $args['currentDir'] ?? '';
        $filelist = preg_grep('/^([^.])/', scandir($_ENV['UPLOAD_DIR'] . DIR_SEP));

        DevHelp::debugMsg('currentDir ' . $currentDir);
        DevHelp::debugMsg('end($filelist)' . is_dir($_ENV['UPLOAD_DIR'] . DIR_SEP . end($filelist)));

        // no media in root folder, get from last
        if (count($filelist) > 0 && $currentDir == ''  && is_dir($_ENV['UPLOAD_DIR'] . DIR_SEP . end($filelist))) {
            DevHelp::debugMsg('reading first file');
            $currentDir = end($filelist);
        }

        DevHelp::debugMsg('$currentDir: ' . $currentDir);
        $dirContent = (array) preg_grep('/^([^.])/', scandir($_ENV['UPLOAD_DIR'] . DIR_SEP . $currentDir));
        $reply = new \stdClass();
        $reply->currentDir = $currentDir;
        $reply->uploadDirs = $filelist;
        $reply->dirContent = $currentDir !== '' ? $dirContent : []; // do not list root dir

        $response->getBody()->write(json_encode($reply));
        return $response;
    }

    public function mediaInfo(Request $request, Response $response, $args)
    {
        DevHelp::debugMsg('start media info');
        $queryParams = $request->getQueryParams();

        $fileName = $queryParams['fileName'];
        $filePath = $queryParams["filePath"];

        $targetDir = $_ENV['UPLOAD_DIR'] . DIR_SEP . $filePath;
        $targetFile = $targetDir . DIR_SEP . $fileName;
        $info = getimagesize($targetFile);

        $reply = new \stdClass();
        $reply->fileName = $fileName;
        $reply->filePath = $filePath;
        $reply->info = $info;
        $reply->fileSize = filesize($targetFile);

        $response->getBody()->write(json_encode($reply));
        return $response;
    }

    public function deleteMedia(Request $request, Response $response, $args)
    {
        $factory = $this->container->get('Objfactory');
        $this->resource = $factory->makeResource();

        DevHelp::debugMsg('delete media');
        $fileName = $_GET["fileName"];
        $filePath = $_GET["filePath"];

        DevHelp::debugMsg('$filePath' . $filePath . ', $fileName' . $fileName);

        $this->resource->removefile($_ENV['UPLOAD_DIR'] . DIR_SEP . $filePath . DIR_SEP . $fileName);
        $message = 'File Removed: ' . $filePath . DIR_SEP . $fileName;
        Logger::log($message);

        $reply = new \stdClass();
        $reply->pageMessage = $message;

        $response->getBody()->write(json_encode($reply));
        return $response;
    }
}
