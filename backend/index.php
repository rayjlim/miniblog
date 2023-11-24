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
use App\helpers\AuthMiddleware;
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

$app = (require __DIR__ . '/config/bootstrap.php');

$app->setBasePath($_ENV['BASE_PATH']);
// $app->addErrorMiddleware(true, true, true);

$app->add(new AuthMiddleware());

// Routes registered in Container

$app->run();
