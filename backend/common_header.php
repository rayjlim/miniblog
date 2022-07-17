<?php

require 'vendor/autoload.php';

use \RedBeanPHP\R as R;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

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

define("IV_SIZE", 16); //mcrypt_get_IV_SIZE(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
define("KEY", pack('H*', "b1904b71903ad0F8b54763051cef08bc55abe054Ddeba19e1d417e2ffb2a0193"));

R::setup('mysql:host=' . $_ENV['DB_HOST'] . ';dbname=' . $_ENV['DB_NAME'], $_ENV['DB_USER'], $_ENV['DB_PASSWORD']);
R::freeze(true);
R::ext('xdispense', function ($type) {
    return R::getRedBean()->dispense($type);
});
// R::debug( TRUE );
