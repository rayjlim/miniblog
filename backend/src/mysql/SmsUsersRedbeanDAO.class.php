<?php

namespace App\mysql;

use App\dao\SmsUsersDAO;

defined('ABSPATH') or exit('No direct script access allowed');

use \RedBeanPHP\R as R;

class SmsUsersRedbeanDAO implements SmsUsersDAO
{
    /**
     * The function loads a user from the database and returns its data.
     *
     * @param id The "id" parameter is the unique identifier of the user that you
     * want to load from the database.
     *
     * @return the exported data of the user with the specified ID.
     */
    public function load($id)
    {
        $user = R::load(USERS, $id);
        return $user->export();
    }

    public function queryAll()
    {
        $users = R::findAll(USERS);
        $sequencedArray = array_values(array_map(function ($item) {
            return $item->export();
        }, $users));
        return $sequencedArray[0];
    }

    public function delete($id)
    {
        $postBean = R::load(USERS, $id);
        R::trash($postBean);
        return 1;
    }

    public function insert($smsUser)
    {
        $userBean = R::xdispense(USERS);

        $userBean->facebook_id = $smsUser->facebookId;
        $userBean->email = $smsUser->email;
        $userBean->last_login = $smsUser->lastLogin;
        $userBean->pref_days_for_reminder = $smsUser->prefDaysForReminder;

        $id = R::store($userBean);
        return $id;
    }

    public function update($smsUser)
    {
        $userBean = R::load(USERS, $smsUser['id']);
        $userBean->facebook_id = $smsUser->facebookId;
        $userBean->email = $smsUser->email;
        $userBean->pref_days_for_reminder = $smsUser->prefDaysForReminder;
        R::store($userBean);
    }

    public function lookupByEmailGoogleId($email, $googleId)
    {
        $users = R::findAll(USERS, 'email = ? AND googleId = ? ', [$email, $googleId]);
        $sequencedArray = array_values(array_map(function ($item) {
            return $item->export();
        }, $users));
        return count($sequencedArray) ? $sequencedArray[0] : null;
    }

    public function lookupByEmail($email)
    {
        $users = R::findAll(USERS, 'email = ?', [$email]);
        $sequencedArray = array_values(array_map(function ($item) {
            return $item->export();
        }, $users));
        return count($sequencedArray) ? $sequencedArray[0] : null;
    }
    public function lookupByPassword($password)
    {
        $users = R::findAll(USERS, 'password = ?', [$password]);
        $sequencedArray = array_values(array_map(function ($item) {
            return $item->export();
        }, $users));

        return count($sequencedArray) ? $sequencedArray[0] : null;
    }
}
