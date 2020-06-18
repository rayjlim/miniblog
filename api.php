<?php
// not ready, not tested
exit(1);


// load required files
require 'backend/SERVER_CONFIG.php';

require 'vendor/autoload.php';
// require '_config/app_config.php';

// register Slim auto-loader
\Slim\Slim::registerAutoloader();

// define( 'POSTS', 'sms_entries' );

// set up database connection
R::setup('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASSWORD);
R::freeze(true);
R::ext('xdispense', function( $type ){
        return R::getRedBean()->dispense( $type );
    });

// R::debug(true);
// initialize app
$app = new \Slim\Slim();

$app->get('/unauth', function () use ($app){
        $app->response->setStatus(403);
        $app->response()->header('Content-Type', 'application/json');
        echo "{ \"error\":\"true\", \"message\":\"Unauth User\"}";
});

$app->group('/posts', function () use ($app) {
    $app->get('/', function () use ($app) {
        $get_data = $app->request->get();
        $posts = [];

        $limit = 10;
        $posts = R::findAll(POSTS, 'LIMIT ' . $limit);
        $sequencedArray = array_values(array_map("getExportValues", $posts));
        $app->response()->header('Content-Type', 'application/json');
        echo json_encode($sequencedArray);

    });

    $app->get('/:id', function ($id) use ($app) {
        $post = R::load(POSTS, $id);
        $app->response()->header('Content-Type', 'application/json');

        echo json_encode($post->export());
    });

    $app->post('/', function () use ($app) {
        http_response_code(201);
        $postBean = R::xdispense(POSTS);
        $request = $app->request();

        $post = json_decode($request->getBody());
        $smsEntry = new SmsEntry($post->date, $post->content);
        $ch = new ContentHelper();
        $smsEntry = $ch->process($smsEntry);

        $postBean->user_id = 0;
        $postBean->content = $smsEntry->content;
        $postBean->date = $smsEntry->date;
        $postBean->id = R::store($postBean);

        $app->response()->header('Content-Type', 'application/json');

        echo json_encode($postBean->export());

        // {"content":"blah","date":"2015-03-10"}
    });
    $app->put('/:id', function ($id) use ($app) {

        $postBean = R::load(POSTS, $id);
        $request = $app->request();

        $post = json_decode($request->getBody());
        $postBean->title = $post->title;
        $postBean->dt_viewed = $post->dt_viewed;
        $postBean->comments = $post->comments;
        R::store($postBean);
        $app->response()->header('Content-Type', 'application/json');

        echo json_encode($postBean->export());
    });

    $app->delete('/:id', function ($id) use ($app) {
        $post = R::load(POSTS, $id);
        R::trash($post);
        $app->response()->header('Content-Type', 'application/json');
        echo "{}";
    });
});

// run
$app->run();

// function getExportValues($item){
//     return $item->export();
// }
