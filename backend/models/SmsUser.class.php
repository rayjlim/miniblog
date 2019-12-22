<?php
/**
 * Object represents table 'sms_entries'
 *
     * @author: http://phpdao.com
     * @date: 2011-02-25 14:02
 */
class SmsUser
{
    public $id;
    public $facebookId;
    public $email;
    public $lastLogin;
    public $prefDaysForReminder;
    public $fullname = '';
    public $isAuthenticated = false;
    public $password = null;

    public function __construct(
        $_id='',
        $_facebookId='',
        $_email='',
        $_lastLogin='',
        $_prefDaysForReminder='',
        $_fullname='',
        $_isAuthenticated=false,
        $_password=''
    ) {
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
