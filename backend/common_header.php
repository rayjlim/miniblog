<?php
require 'vendor/autoload.php';
use \RedBeanPHP\R as R;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

define ("IV_SIZE", 16); //mcrypt_get_IV_SIZE(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
define ("KEY", pack('H*', "b1904b71903ad0F8b54763051cef08bc55abe054Ddeba19e1d417e2ffb2a0193"));


R::setup('mysql:host=' . $_ENV['DB_HOST'] . ';dbname=' . $_ENV['DB_NAME'], $_ENV['DB_USER'], $_ENV['DB_PASSWORD']);
R::freeze(true);
R::ext('xdispense', function ($type) {
    return R::getRedBean()->dispense($type);
});
// R::debug( TRUE );
