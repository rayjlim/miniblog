<?php

declare(strict_types=1);

use App\Application\Actions\User\ListUsersAction;
use App\Application\Actions\User\ViewUserAction;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Interfaces\RouteCollectorProxyInterface as Group;

use App\controllers\EntryHandler;
use App\controllers\CUDHandler;
use App\controllers\MediaHandler;
use App\controllers\UploadHandler;
use App\controllers\LogHandler;

return function (App $app) {
  // $app->options('/{routes:.*}', function (Request $request, Response $response) {
  //   // CORS Pre-Flight OPTIONS Request Handler
  //   return $response;
  // });


  $app->any(
    '/security',
    function (Request $request, Response $response, $args) {
      return $response;
    }
  );

  $app->get('/settings/', \App\controllers\Settings::class);

  $app->get('/api/posts/', EntryHandler::class . ":list");
  $app->get('/api/sameDayEntries/', EntryHandler::class . ":listSameDay");
  $app->get('/api/yearMonth', EntryHandler::class . ":yearMonths");

  $app->post('/api/posts/', CUDHandler::class . ":addEntry");
  $app->put('/api/posts/{id}', CUDHandler::class . ":updateEntry");
  $app->delete('/api/posts/{id}', CUDHandler::class . ':deleteEntry');

  $app->get('/media/', MediaHandler::class . ":listMedia");
  $app->get('/media/{currentDir}', MediaHandler::class . ":listMedia");
  $app->delete('/media/', MediaHandler::class . ":deleteMedia");

  $app->post('/uploadImage/', UploadHandler::class . ":upload");
  $app->get('/uploadRotate/', UploadHandler::class . ":rotate");
  $app->get('/uploadResize/', UploadHandler::class . ":resize");
  $app->post('/uploadRename/', UploadHandler::class . ":rename");

  $app->get('/logs/', LogHandler::class . ":getLog");
  $app->get('/logs/{logFileName}', LogHandler::class . ":getLog");
  $app->delete('/logs/{logFileName}', LogHandler::class . ":deleteLog");

  $app->get(
    '/ping',
    function (Request $request, Response $response, $args) {
      $response->getBody()->write("{\"pong\":\"true\"}");
      return $response;
    }
  );
};
