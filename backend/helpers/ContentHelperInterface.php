<?php
defined('ABSPATH') or exit('No direct script access allowed');

interface ContentHelperInterface
{
    public function __construct($_iDao, $_iResource);

    public function processEntry(SmsEntrie $smsEntry);
}
