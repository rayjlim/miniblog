<?php

declare(strict_types=1);

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Routing\RouteCollectorProxy;
use Slim\App;

use \App\controllers\Settings;
use App\controllers\EntryHandler;
use App\controllers\CUDHandler;
use App\controllers\MediaHandler;
use App\controllers\UploadHandler;
use App\controllers\LogHandler;
use App\helpers\AuthMiddleware;
use App\core\Logger;

return function (App $app) {

  $app->get('/settings/', Settings::class);

  $app->post('/ping',
    function (Request $request, Response $response) {
      $response->getBody()->write("{\"pong\":\"true\"}");
      return $response;
    }
  );

  $app->group('', function (RouteCollectorProxy $group) {
    $group->any('/security', function (Request $request, Response $response, $args) {
        return $response;
      }
    );

    $group->get('/api/posts/', EntryHandler::class . ":list");
    $group->get('/api/sameDayEntries/', EntryHandler::class . ":listSameDay");
    $group->get('/api/yearMonth', EntryHandler::class . ":yearMonths");

    $group->post('/api/posts/', CUDHandler::class . ":addEntry");
    $group->put('/api/posts/{id}', CUDHandler::class . ":updateEntry");
    $group->delete('/api/posts/{id}', CUDHandler::class . ':deleteEntry');

    $group->get('/media/', MediaHandler::class . ":listMedia");;
    $group->get('/media/{currentDir}', MediaHandler::class . ":listMedia");
    $group->delete('/media/', MediaHandler::class . ":deleteMedia");

    $group->post('/uploadImage/', UploadHandler::class . ":upload");
    $group->get('/uploadRotate/', UploadHandler::class . ":rotate");
    $group->get('/uploadResize/', UploadHandler::class . ":resize");
    $group->post('/uploadRename/', UploadHandler::class . ":rename");

    $group->get('/logs/', LogHandler::class . ":getLog");;
    $group->get('/logs/{logFileName}', LogHandler::class . ":getLog");
    $group->delete('/logs/{logFileName}', LogHandler::class . ":deleteLog");
  })->add(new AuthMiddleware());

  $app->options('/{routes:.*}', function (Request $request, Response $response) {
    // CORS Pre-Flight OPTIONS Request Handler
    return $response;
  });
};
