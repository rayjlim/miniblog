<?php
namespace dao;
defined('ABSPATH') or exit('No direct script access allowed');

interface IResourceDAO
{
    public function setSession($key, $value);
    public function getSession($key);
    public function issetSession($key);
    public function destroySession();
    public function setCookie($key, $value, $expiration);
    public function writeFile($filename, $fileData);
    public function readdir($logDirectory);
    public function readfile($logfile);
    public function removefile($logfile);
    public function getDateTime();

    public function load($url);
    public function sendEmail($email, $subject, $message);

    public function echoOut($output);
}
