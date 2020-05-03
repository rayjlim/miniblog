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
    public $fullname = '';
    public $isAuthenticated = false;
    public $password = null;

    public function __construct(
        $_id='',
        $_facebookId='',
        $_email='',
        $_fullname='',
        $_isAuthenticated=false,
        $_password=''
    ) {
        $this->id                  = $_id;
        $this->facebookId          = $_facebookId;
        $this->email               = $_email;
        $this->fullname            = $_fullname;
        $this->isAuthenticated     = $_isAuthenticated;
        $this->password            = $_password;
    }
}
