<?php
session_start();
require 'backend/SERVER_CONFIG.php';
require 'vendor/autoload.php';

R::setup('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASSWORD);
R::freeze(true);
R::ext('xdispense', function ($type) {
    return R::getRedBean()->dispense($type);
});
// R::debug( TRUE );
