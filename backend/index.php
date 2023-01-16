<?php
// error_reporting(E_ALL & E_STRICT);
// ini_set('display_errors', '1');
// ini_set('log_errors', '0');
// ini_set('error_log', './');
require 'common_header.php';

$app = new Slim\Slim();
$app->add(new AuthMiddleware());

$app->get('/security', function ()  use ($app) {
    echo "{	\"user_id\":\"" . $app->userId . "\"}";
});
$app->post('/security', function () use ($app) {
    echo "{	\"user_id\":\"" . $app->userId . "\"}";
});

$app->post('/', function () use ($app) {
    $app->redirect('posts/');
});

$entryHandler = DAOFactory::EntryHandler($app);

$app->get('/api/posts/:id', $entryHandler->itemDetailsApi());
$app->get('/api/posts/', $entryHandler->listItemsApi());

$app->get('/api/sameDayEntries/', $entryHandler->sameDayEntries());
$app->get('/api/yearMonth', $entryHandler->yearMonthsApi());

$cudHandler = DAOFactory::CUDHandler($app);
$app->post('/api/posts/', $cudHandler->addEntry());
$app->put('/api/posts/:id', $cudHandler->updateEntry());
$app->delete('/api/posts/:id', $cudHandler->deleteEntry());
// handled in AuthMiddleware

$graphHandler = DAOFactory::GraphHandler($app);
$app->get('/cron', $graphHandler->logCronCall());

$uploadHandler = DAOFactory::UploadHandler($app);
$app->post('/uploadImage/', $uploadHandler->upload());
$app->get('/uploadRotate/', $uploadHandler->rotate());
$app->get('/uploadResize/', $uploadHandler->resize());
$app->post('/uploadRename/', $uploadHandler->rename());

$app->get('/media/', $uploadHandler->listMedia());
$app->get('/media/:currentDir', $uploadHandler->listMedia());
$app->delete('/media/', $uploadHandler->deleteMedia());

$logHandler = DAOFactory::LogHandler();
$app->get('/logs/:logfileName', $logHandler->getUrlHandler());
$app->get('/logs/', $logHandler->getUrlHandler(''));
$app->delete('/logs/:logfileName', $logHandler->delete());

$app->get('/ping', function () {
    echo "{	\"ping\":\"true\"}";
});

$app->run();
