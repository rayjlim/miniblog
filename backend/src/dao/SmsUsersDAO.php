<?php
namespace App\dao;

defined('ABSPATH') or exit('No direct script access allowed');

interface SmsUsersDAO
{
    public function load($id);

    public function lookupByEmail($email);

    public function lookupByEmailGoogleId($email, $googleId);

    public function queryAll();

    public function delete($id);

    public function insert($smsUser);

    public function update($smsUser);

    public function lookupByPassword($password);
}
