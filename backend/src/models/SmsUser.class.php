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
namespace App\Smodels;

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
    public int $id;
    public $facebookId;
    public string $email;
    public string $fullname = '';
    public bool $isAuthenticated = false;
    public string $password = '';

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
        int $_id = null,
        string $_facebookId = '',
        string $_email = '',
        string $_fullname = '',
        bool $_isAuthenticated = false,
        string $_password = ''
    ) {
        $this->id                  = $_id;
        $this->facebookId          = $_facebookId;
        $this->email               = $_email;
        $this->fullname            = $_fullname;
        $this->isAuthenticated     = $_isAuthenticated;
        $this->password            = $_password;
    }
}
