<?php
namespace App\dao;

defined('ABSPATH') or exit('No direct script access allowed');

interface IResourceDAO
{




    public function writeFile(string $filename, string $content);
    public function readdir($logDirectory);
    public function readfile($logfile);
    public function removefile($logfile);
    public function getDateTime();
    public function getDateByDescription(string $strDescription);

    public function load($url);

}
