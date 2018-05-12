<?php
interface ContentHelperInterface {
    function __construct($_iDao, $_iResource);
    
    function processEntry(SmsEntrie $smsEntry);

    function checkSleepTag(SmsEntrie $smsEntry);
   
     function calculateWakeValue($sleepContent, $wakeContent,$currentTime);
    
    function checkDateShortForms(SmsEntrie $smsEntry);
    
    function expandShortCodes($smsEntry);
    
    function number_pad($number, $n);
}
