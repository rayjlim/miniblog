<?php
/**
 * Object represents table 'sms_entries'
 *
     * @author: http://phpdao.com
     * @date: 2011-02-25 14:02   
 */
class SmsUser{
    
    var $id;
    var $facebookId;
    var $email;
    var $lastLogin;
    var $prefDaysForReminder;
    var $fullname = '';
    var $isAuthenticated = false;
    var $password = null;

    function __construct($_id='', $_facebookId='', $_email='', $_lastLogin='', 
        $_prefDaysForReminder='', $_fullname='', $_isAuthenticated=false, $_password='')
    {
        $this->id                  = $_id;
        $this->facebookId          = $_facebookId;
        $this->email               = $_email;
        $this->lastLogin           = $_lastLogin;
        $this->prefDaysForReminder = $_prefDaysForReminder;
        $this->fullname            = $_fullname;
        $this->isAuthenticated     = $_isAuthenticated;
        $this->password            = $_password;
    }
}