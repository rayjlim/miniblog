<?php

// error_reporting(E_ALL & E_STRICT);
// ini_set('display_errors', '1');
// ini_set('log_errors', '0');
// ini_set('error_log', './');

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// TODO: MOVE to Middleware
if (array_key_exists('HTTP_ORIGIN', $_SERVER) && strpos($_SERVER['HTTP_ORIGIN'], $_ENV['ORIGIN']) !== false) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');    // cache for 1 day

header("Access-Control-Allow-Headers: Access-Control-*, Origin, X-Requested-With, Content-Type, Accept, Authorization, X-App-Token");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, HEAD');
header('Allow: GET, POST, PUT, DELETE, OPTIONS, HEAD');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // The request is using the POST method
    echo "options-check";
    exit();
}
// TODO: move to .env
define("IV_SIZE", 16); //mcrypt_get_IV_SIZE(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
define("KEY", pack('H*', "b1904b71903ad0F8b54763051cef08bc55abe054Ddeba19e1d417e2ffb2a0193"));
// -- MOVE to Middleware

use \RedBeanPHP\R as R;
R::setup('mysql:host=' . $_ENV['DB_HOST'] . ';dbname=' . $_ENV['DB_NAME'], $_ENV['DB_USER'], $_ENV['DB_PASSWORD']);
R::freeze(true);
R::ext('xdispense', function ($type) {
    return R::getRedBean()->dispense($type);
});
// R::debug( TRUE );

$app = AppFactory::create();

$app->setBasePath($_ENV['BASE_PATH'] );
// $app->addErrorMiddleware(true, true, true);
$app->add(new AuthMiddleware());

$app->any('/security', function (Request $request, Response $response, $args) {
    return $response;
});

$entryHandler = DAOFactory::EntryHandler();
// $app->get('/api/posts/:id', $entryHandler->detailItemApi());
$app->get('/api/posts/', $entryHandler->listItemsApi());
$app->get('/api/sameDayEntries/', $entryHandler->listItemsSameDay());

$cudHandler = DAOFactory::CUDHandler();
$app->post('/api/posts/', $cudHandler->addEntry());
$app->put('/api/posts/{id}', $cudHandler->updateEntry());
$app->delete('/api/posts/{id}', $cudHandler->deleteEntry());

$uploadHandler = DAOFactory::UploadHandler();
$app->post('/uploadImage/', $uploadHandler->upload());
$app->get('/uploadRotate/', $uploadHandler->rotate());
$app->get('/uploadResize/', $uploadHandler->resize());
$app->post('/uploadRename/', $uploadHandler->rename());

$app->get('/media/', $uploadHandler->listMedia());
$app->get('/media/{currentDir}', $uploadHandler->listMedia());
$app->delete('/media/', $uploadHandler->deleteMedia());

$app->get('/ping', function (Request $request, Response $response, $args) {
    echo "{\"pong\":\"true\"}";
    // $response->getBody()->write("{\"pong\":\"true\"}");
    return $response;
});

$app->run();

// $app->post('/', function (Request $request, Response $response, $args) {
//     $app->redirect('posts/');
// });

// $app->get('/api/yearMonth', $entryHandler->yearMonthsApi());

// $graphHandler = DAOFactory::GraphHandler($app);
// $app->get('/cron', $graphHandler->logCronCall());

// $logHandler = DAOFactory::LogHandler();
// $app->get('/logs/:logfileName', $logHandler->getUrlHandler());
// $app->get('/logs/', $logHandler->getUrlHandler(''));
// $app->delete('/logs/:logfileName', $logHandler->delete());
