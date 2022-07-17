<?php
// ini_set('display_errors', 'On');
// ob_start("ob_gzhandler");
// error_reporting(E_ALL);
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
$app->get('/cron', $graphHandler->logCronCall("cron called and email"));

$logHandler = DAOFactory::LogHandler($app);
$app->get('/logs/:logfileName', $logHandler->getUrlHandlerWithParam());
$app->get('/logs/', $logHandler->getUrlHandler($app));
$app->delete('/logs/:logfileName', $logHandler->delete($app));

$app->get('/ping', function () {
    echo "{	\"ping\":\"true\"}";
});

$uploadHandler = DAOFactory::UploadHandler($app);
$app->post('/uploadImage/', $uploadHandler->upload());
$app->get('/uploadRotate/', $uploadHandler->rotate());
$app->get('/uploadResize/', $uploadHandler->resize());
$app->post('/uploadRename/', $uploadHandler->rename());

$app->get('/media/', $uploadHandler->listMedia());
$app->get('/media/:currentDir', $uploadHandler->listMedia());
$app->delete('/media/', $uploadHandler->deleteMedia());

$app->run();
