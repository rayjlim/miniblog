<?php
/**
 * Intreface DAO
 *
 * @author: http://phpdao.com
 * @date: 2011-02-25 14:02
 */
interface SmsUsersDAO
{
    public function load($id);

    public function lookupByFacebook($facebookId);

    public function lookupByEmail($email);
    
    public function queryAll();

    public function delete($id);
    
    public function insert($smsUser);
    
    public function update($smsUser);

    public function lookupByPassword($password);
}
