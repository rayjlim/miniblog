<?php

/**
 * Main Application
 *
 * PHP version 8
 *
 * @category PHP
 * @package  Miniblog
 * @author   Raymond Lim <rayjlim@yahoo.com>
 * @license  MIT License
 * @link     https://github.com/rayjlim/miniblog/
 */

// error_reporting(E_ALL & E_STRICT);
// ini_set('display_errors', '1');
// ini_set('log_errors', '0');
// ini_set('error_log', './');
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Factory\AppFactory;
use App\dao\DAOFactory;
use App\helpers\AuthMiddleware;
use Slim\App;
use \RedBeanPHP\R as R;


if (!is_file('.env')) {
    echo "Missing Config file";
    exit;
}

require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// TODO: MOVE to Middleware
if (
    array_key_exists('HTTP_ORIGIN', $_SERVER)
    && strpos($_SERVER['HTTP_ORIGIN'], $_ENV['ORIGIN']) !== false
) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');    // cache for 1 day

header("Access-Control-Allow-Headers: Access-Control-*, Origin, "
    . "X-Requested-With, Content-Type, Accept, Authorization, X-App-Token");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, HEAD');
header('Allow: GET, POST, PUT, DELETE, OPTIONS, HEAD');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // OPTIONS method is preceded in CORS checks before a POST (typically) is sent
    echo "options-check";
    exit();
}

R::setup(
    'mysql:host=' . $_ENV['DB_HOST'] . ';dbname=' . $_ENV['DB_NAME'],
    $_ENV['DB_USER'],
    $_ENV['DB_PASSWORD']
);
R::freeze(true);
R::ext(
    'xdispense',
    function ($type) {
        return R::getRedBean()->dispense($type);
    }
);
// R::debug( TRUE );

// $app = AppFactory::create();
$app = (require __DIR__ . '/config/bootstrap.php');

$app->setBasePath($_ENV['BASE_PATH']);
// $app->addErrorMiddleware(true, true, true);

$app->add(new AuthMiddleware());


$app->any(
    '/security',
    function (Request $request, Response $response, $args) {
        return $response;
    }
);

$app->get('/', function (Request $request, Response $response) {
    $response->getBody()->write('Hello, World!');

    return $response;
});

$app->get('/asdf', \App\controllers\EntryDelete::class . ":deleteIt");

$app->get('/settings/', \App\controllers\Settings::class);

// $app->get('/api/', function (Request $request, Response $response) {
//     $response->getBody()->write('Hello, World!');
//     $data = array('name' => 'Bob', 'age' => 40);

//     $response->getBody()->write(json_encode($data));
//     return $response
//               ->withHeader('Content-Type', 'application/json');
//     return $response;
// });

use App\controllers\EntryHandler;

$app->get('/api/posts/', EntryHandler::class . ":list");
$app->get('/api/sameDayEntries/', EntryHandler::class . ":listSameDay");
$app->get('/api/yearMonth', EntryHandler::class . ":yearMonths");


use App\controllers\CUDHandler;

$app->post('/api/posts/', CUDHandler::class . ":addEntry");
$app->put('/api/posts/{id}', CUDHandler::class . ":updateEntry");
$app->delete('/api/posts/{id}', CUDHandler::class . ':deleteEntry');

// $uploadHandler = DAOFactory::getUploadHandler();
use App\controllers\MediaHandler;

$app->get('/media/', MediaHandler::class . ":listMedia");
$app->get('/media/{currentDir}', MediaHandler::class . ":listMedia");
$app->delete('/media/', MediaHandler::class . ":deleteMedia");

use App\controllers\UploadHandler;

$app->post('/uploadImage/', UploadHandler::class . ":upload");
$app->get('/uploadRotate/', UploadHandler::class . ":rotate");
$app->get('/uploadResize/', UploadHandler::class . ":resize");
$app->post('/uploadRename/', UploadHandler::class . ":rename");

use App\controllers\LogHandler;

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

$app->run();
