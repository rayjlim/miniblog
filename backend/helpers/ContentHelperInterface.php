<?php
defined('ABSPATH') OR exit('No direct script access allowed');

interface ContentHelperInterface
{
    public function __construct($_iDao, $_iResource);
    
    public function processEntry(SmsEntrie $smsEntry);

    public function checkSleepTag(SmsEntrie $smsEntry);
   
    public function calculateWakeValue($sleepContent, $wakeContent, $currentTime);
    
    public function checkDateShortForms(SmsEntrie $smsEntry);
    
    public function number_pad($number, $n);
}
