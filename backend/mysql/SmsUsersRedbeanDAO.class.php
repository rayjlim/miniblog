<?php

class SmsUsersRedbeanDAO implements SmsUsersDAO
{
    
    public function load($id) {
        $user = R::load(USERS, $id);
        return $user->export();
    }
    
    public function queryAll() {
        $users = R::findAll(USERS);
        $sequencedArray = array_values(array_map("getExportValues", $users));
        return $sequencedArray[0];
    }
    
    public function delete($id) {
        $postBean = R::load(USERS, $id);
        R::trash($postBean);
        return 1;
    }
    
    public function insert($smsUser) {
        $userBean = R::xdispense(USERS);
        
        $userBean->facebook_id = $smsUser->facebookId;
        $userBean->email = $smsUser->email;
        $userBean->last_login = $smsUser->lastLogin;
        $userBean->pref_days_for_reminder = $smsUser->prefDaysForReminder;
        
        $id = R::store($userBean);
        return $id;
    }
    
    public function update($smsUser) {
        $userBean = R::load(USERS, $smsEntrie['id']);
        $userBean->facebook_id = $smsUser->facebookId;
        $userBean->email = $smsUser->email;
        $userBean->pref_days_for_reminder = $smsUser->prefDaysForReminder;
        R::store($userBean);
    }
    
    public function lookupByFacebook($facebookId) {
        $users = R::findAll(USERS, 'facebook_id = ?', [$facebookId]);
        $sequencedArray = array_values(array_map("getExportValues", $users));
        return count($sequencedArray)? $sequencedArray[0]: null;
    }
    
    public function lookupByEmail($email) {
        $users = R::findAll(USERS, 'email = ?', [$email]);
        $sequencedArray = array_values(array_map("getExportValues", $users));
        return count($sequencedArray)? $sequencedArray[0]: null;
    }
    public function lookupByPassword($password) {
        $users = R::findAll(USERS, 'password = ?', [$password]);
        $sequencedArray = array_values(array_map("getExportValues", $users));

        return count($sequencedArray)? $sequencedArray[0]: null;
    }
}
