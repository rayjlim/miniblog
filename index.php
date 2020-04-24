<?php
ini_set('display_errors', 'On');
//ob_start("ob_gzhandler");
error_reporting(E_ALL);
require 'common_header.php';

use Slim\Views\Twig as Twig;
use Slim\Slim;

$app = new Slim(array(
    'view' => new Twig
));

if (defined('DEVELOPMENT') && DEVELOPMENT) {
    // $app->add(new AuthMiddleware());
    $_SESSION[SESSION_USER_ID] = 1;
    //Access-Control-Allow-Origin header with wildcard.
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Expose-Headers: Access-Control-*");
    header("Access-Control-Allow-Headers: Access-Control-*, Origin, X-Requested-With, Content-Type, Accept, Authorization");
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, HEAD');
    header('Allow: GET, POST, PUT, DELETE, OPTIONS, HEAD');
}
else{
    $app->add(new AuthMiddleware()); 
}

$app->view()->appendData(["rooturl" => '/'.ROOT_URL]);
$app->view()->appendData(["baseurl"=> '/'.ROOT_URL.'/index.php/']);
$app->view()->appendData(["DEVELOPMENT"=> defined('DEVELOPMENT')]);

require 'backend/core/page_message.php';

// Create monolog logger and store logger in container as singleton
// (Singleton resources retrieve the same log resource definition each time)
// $app->container->singleton('log', function () {
//     $log = new \Monolog\Logger('slim-skeleton');
//     $log->pushHandler(new \Monolog\Handler\StreamHandler('_logs/app.log', LOGGER_LEVEL));
//     return $log;
// });

 if (!strpos($app->request()->getRootUri(), 'index.php')) {
     $app->get('/', function () use ($app) {
         $app->redirect('index.php/posts/');
     });
 } else {
     $app->get('/', function () use ($app) {
         $app->redirect('posts/');
     });
 }

$app->get('/security', function () {
    echo "{	\"user_id\":\"".$_SESSION[SESSION_USER_ID]."\"}";
});
$app->options('/security', function () {
    echo "options-check";
});

$app->post('/', function () use ($app) {
    $app->redirect('posts/');
});

$entryHandler = DAOFactory::EntryHandler($app);
$app->get('/main/', $entryHandler->showMain());
$app->get('/posts/', $entryHandler->listItems());

$app->get('/api/posts/:id', $entryHandler->itemDetailsApi());
$app->get('/api/posts/', $entryHandler->listItemsApi());
$app->get('/api/sameDayEntries/', $entryHandler->sameDayEntries());
$app->get('/api/pebble', $entryHandler->pebbleInfo());
$app->get('/api/yearMonth', $entryHandler->yearMonthsApi());

$cudHandler = DAOFactory::CUDHandler($app);
$app->post('/api/posts/', $cudHandler->addEntry());
$app->put('/api/posts/:id', $cudHandler->updateEntry());
$app->delete('/api/posts/:id', $cudHandler->deleteEntry());
$app->options('/api/posts/:id', function () {
    echo "options-check";
});

$graphHandler = DAOFactory::GraphHandler($app);
// $app->get('/graph/', $graphHandler->handle());
// $app->get('/api/graph/', $graphHandler->handleApi());
$app->get('/cron', $graphHandler->logCronCall("cron called and email"));

$logHandler = DAOFactory::LogHandler($app);
$app->get('/logs/:logfileName', $logHandler->getUrlHandlerWithParam());
$app->get('/logs/', $logHandler->getUrlHandler($app));
$app->delete('/logs/:logfileName', $logHandler->delete($app));

// $bookmarkHandler = DAOFactory::BookmarkHandler($app);
// $app->get('/bookmark/', $bookmarkHandler->render());
// $app->get('/api/bookmark/', $bookmarkHandler->apiPath());

$app->get('/ping', function () {
    echo "{	\"ping\":\"true\"}";
});

$uploadHandler = DAOFactory::UploadHandler($app);
$app->get('/uploadForm/', $uploadHandler->form());
$app->post('/uploadImage/', $uploadHandler->upload());
$app->get('/uploadViewer/', $uploadHandler->view());
$app->get('/uploadRotate/', $uploadHandler->rotate());
$app->get('/uploadResize/', $uploadHandler->resize());
$app->post('/uploadRename/', $uploadHandler->rename());

$app->get('/media/', $uploadHandler->listMedia());
$app->get('/media/:currentDir', $uploadHandler->listMedia());
$app->delete('/media/', $uploadHandler->deleteMedia());

$app->run();
