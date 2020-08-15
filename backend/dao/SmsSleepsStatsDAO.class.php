<?php
defined('ABSPATH') or exit('No direct script access allowed');

interface SmsSleepStatsDAO
{
    public function load($id);

    public function queryAll();

    public function delete($id);

    public function insert($smsUser);
}
