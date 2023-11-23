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
if (array_key_exists('HTTP_ORIGIN', $_SERVER)
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

// $beforeMiddleware = function (Request $request, RequestHandler $handler) {
//     $response = $handler->handle($request);
//     $existingContent = (string) $response->getBody();

//     $response = new Nyholm\Psr7\Response();
//     $response->getBody()->write('BEFORE' . $existingContent);

//     return $response;
// };

// $afterMiddleware = function ($request, $handler) {
//     $response = $handler->handle($request);
//     $existingContent = (string) $response->getBody();

//     $response = new Nyholm\Psr7\Response();
//     $response->getBody()->write($existingContent);
//     $response->getBody()->write('AFTER');
//     return $response;
// };
// $app->add($beforeMiddleware);
// $app->add($afterMiddleware);

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


$app->get('/api/posts/', \App\controllers\EntryHandler::class.":list");
$app->get('/api/sameDayEntries/', \App\controllers\EntryHandler::class.":listSameDay");
// $app->get('/api/yearMonth', $entryHandler->yearMonthsApi());

// $cudHandler = DAOFactory::getCUDHandler();
// $app->post('/api/posts/', $cudHandler->addEntry());
// $app->put('/api/posts/{id}', $cudHandler->updateEntry());
// $app->delete('/api/posts/{id}', CUDHandler::class . ':deleteEntry');

// // $app->get('/', \App\Action\EntryDelete::class . '::deleteIt');



// $uploadHandler = DAOFactory::getUploadHandler();
// $app->post('/uploadImage/', $uploadHandler->upload());
// $app->get('/uploadRotate/', $uploadHandler->rotate());
// $app->get('/uploadResize/', $uploadHandler->resize());
// $app->post('/uploadRename/', $uploadHandler->rename());

// $app->get('/media/', $uploadHandler->listMedia());
// $app->get('/media/{currentDir}', $uploadHandler->listMedia());
// $app->delete('/media/', $uploadHandler->deleteMedia());

// $app->get(
//     '/ping',
//     function (Request $request, Response $response, $args) {
//         echo "{\"pong\":\"true\"}";
//         // $response->getBody()->write("{\"pong\":\"true\"}");
//         return $response;
//     }
// );

// $logHandler = DAOFactory::getLogHandler();
// $app->get('/logs/', $logHandler->getUrlHandler());
// $app->get('/logs/{logFileName}', $logHandler->getUrlHandler());
// $app->delete('/logs/{logFileName}', $logHandler->deleteHandler());

$app->run();
