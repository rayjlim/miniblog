<?php
// ini_set('display_errors', 'On');
//ob_start("ob_gzhandler");
// error_reporting(E_ALL);
require 'common_header.php';

$app = new Slim\Slim();

if (defined('DEVELOPMENT') && DEVELOPMENT) {

    //Access-Control-Allow-Origin header with wildcard.
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Expose-Headers: Access-Control-*");
    header("Access-Control-Allow-Headers: Access-Control-*, Origin, X-Requested-With, Content-Type, Accept, Authorization");
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, HEAD');
    header('Allow: GET, POST, PUT, DELETE, OPTIONS, HEAD');
    $app->add(new AuthMiddleware());
} else {
    $app->add(new AuthMiddleware());
}

require 'backend/core/page_message.php';

$app->get('/security', function () {
    echo "{	\"user_id\":\"" . $_SESSION[SESSION_USER_ID] . "\"}";
});
$app->post('/security', function () {
    echo "{	\"user_id\":\"" . $_SESSION[SESSION_USER_ID] . "\"}";
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
