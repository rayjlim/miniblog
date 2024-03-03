<?php
namespace App\helpers;

defined('ABSPATH') or exit('No direct script access allowed');

class DependFactory
{
    public function makeSmsEntriesDAO(): \App\mysql\SmsEntriesRedbeanDAO
    {
        return new \App\mysql\SmsEntriesRedbeanDAO();
    }

    public function makeResource(): \App\dao\Resource
    {
        return new \App\dao\Resource();
    }
}
