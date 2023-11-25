<?php
namespace App\helpers;

defined('ABSPATH') or exit('No direct script access allowed');

class DependFactory
{
    public function makeSmsEntriesDAO()
    {
        return new \App\mysql\SmsEntriesRedbeanDAO();
    }

    public function makeResource()
    {
        return new \App\dao\Resource();
    }
}
