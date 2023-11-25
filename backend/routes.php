<?php

declare(strict_types=1);

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;

use \App\controllers\Settings;
use App\controllers\EntryHandler;
use App\controllers\CUDHandler;
use App\controllers\MediaHandler;
use App\controllers\UploadHandler;
use App\controllers\LogHandler;
use App\helpers\AuthMiddleware;

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
  )->add(new AuthMiddleware());;

  $app->get('/settings/', Settings::class);

  $app->get('/api/posts/', EntryHandler::class . ":list")->add(new AuthMiddleware());
  $app->get('/api/sameDayEntries/', EntryHandler::class . ":listSameDay")->add(new AuthMiddleware());
  $app->get('/api/yearMonth', EntryHandler::class . ":yearMonths");

  $app->post('/api/posts/', CUDHandler::class . ":addEntry")->add(new AuthMiddleware());
  $app->put('/api/posts/{id}', CUDHandler::class . ":updateEntry")->add(new AuthMiddleware());
  $app->delete('/api/posts/{id}', CUDHandler::class . ':deleteEntry')->add(new AuthMiddleware());

  $app->get('/media/', MediaHandler::class . ":listMedia")->add(new AuthMiddleware());;
  $app->get('/media/{currentDir}', MediaHandler::class . ":listMedia")->add(new AuthMiddleware());
  $app->delete('/media/', MediaHandler::class . ":deleteMedia")->add(new AuthMiddleware());

  $app->post('/uploadImage/', UploadHandler::class . ":upload")->add(new AuthMiddleware());
  $app->get('/uploadRotate/', UploadHandler::class . ":rotate")->add(new AuthMiddleware());
  $app->get('/uploadResize/', UploadHandler::class . ":resize")->add(new AuthMiddleware());
  $app->post('/uploadRename/', UploadHandler::class . ":rename")->add(new AuthMiddleware());

  $app->get('/logs/', LogHandler::class . ":getLog")->add(new AuthMiddleware());;
  $app->get('/logs/{logFileName}', LogHandler::class . ":getLog")->add(new AuthMiddleware());
  $app->delete('/logs/{logFileName}', LogHandler::class . ":deleteLog")->add(new AuthMiddleware());

  $app->get(
    '/ping',
    function (Request $request, Response $response) {
      $response->getBody()->write("{\"pong\":\"true\"}");
      return $response;
    }
  );
};

