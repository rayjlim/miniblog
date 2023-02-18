<?php
/**
 * Model for ORM User
 *
 * PHP version 8
 *
 * @category PHP
 * @package  Miniblog
 * @author   Raymond Lim <rayjlim@yahoo.com>
 * @license  MIT License
 * @link     https://github.com/rayjlim/miniblog/
 */
namespace models;

defined('ABSPATH') or exit('No direct script access allowed');

/**
 * Class SmsUser
 *
 * @category PHP
 * @package  Miniblog
 * @author   Raymond Lim <rayjlim@yahoo.com>
 * @license  MIT License
 * @link     https://github.com/rayjlim/miniblog/
 */
class SmsUser
{
    public $id;
    public $facebookId;
    public $email;
    public $fullname = '';
    public $isAuthenticated = false;
    public $password = null;

    /**
     * Constructor
     *
     * @param int     $id
     * @param string  $_facebookId=
     * @param string  $_email=
     * @param string  $_fullname=
     * @param boolean $_isAuthenticated
     * @param string  $_password
     */
    public function __construct(
        $_id = '',
        $_facebookId = '',
        $_email = '',
        $_fullname = '',
        $_isAuthenticated = false,
        $_password = ''
    ) {
        $this->id                  = $_id;
        $this->facebookId          = $_facebookId;
        $this->email               = $_email;
        $this->fullname            = $_fullname;
        $this->isAuthenticated     = $_isAuthenticated;
        $this->password            = $_password;
    }
}
