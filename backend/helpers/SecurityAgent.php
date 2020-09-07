<?php
defined('ABSPATH') or exit('No direct script access allowed');

use \Lpt\DevHelp;
use \Lpt\Logger;

class SecurityAgent
{
    public $wowo_cookieLogin = true;

    public $iDao = null;
    public $iResource = null;

    public function __construct($iDao, $iResource)
    {
        $this->iDao = $iDao;
        $this->iResource = $iResource;
    }

    public function checkPassword($password)
    {
        DevHelp::debugMsg('-PASSWORD passed');
        $smsUser = new SmsUser();
        $dbUser = $this->iDao->lookupByPassword($password);

        if ($dbUser != null) {
            DevHelp::debugMsg('password correct, set vars');

            $smsUser->id = $dbUser['id'];
            $smsUser->isAuthenticated = true;
            $smsUser->fullname =  (!defined("DEVELOPMENT")) ?  'Ray' : "dev 1";

            $this->logLogin('password: ' . $smsUser->id);
        } else {
            DevHelp::debugMsg('record bad password');
            $smsUser = null;
            $this->iResource->setSession('page_message', 'Invalid Password');
            $content = 'bad password attempt: ' . $password;
            $this->logLogin($content);
            if (strtolower($password) == 'unauth') {
                $this->iResource->sendEmail(MY_EMAIL, $content, '');
            }
        }
        return $smsUser;
    }

    public function loginByCookie($request)
    {
        DevHelp::debugMsg('cookie available, set vars');
        $smsUser = new SmsUser();

        $request_body = file_get_contents('php://input');
        $data = json_decode($request_body);

        if (isset($data) && isset($data->email)) {
            $dbUser = $this->iDao->lookupByEmailGoogleId($data->email, $data->sub);

            $smsUser->id = $dbUser['id'];
            $smsUser->isAuthenticated = true;
            $smsUser->fullname = $dbUser['email'];
            $this->logLogin('cookie success: ' . $dbUser['email']);
            return $smsUser;
        }

        $this->logLogin('cookie passed, request body invalid: ' . $request_body);
        $this->iResource->setSession('page_message', 'cookie passed, request body invalid');
        return null;
    }

    public function checkLoggingOut($req)
    {
        return isset($req['logout']) && strtolower($req['logout']) == 'true';
    }

    public function logoutUser()
    {
        DevHelp::debugMsg('logging out');
        $this->logLogin('logout');
        $this->iResource->setCookie(COOKIE_USER, "", time() - 3600);
        $smsUser = null;
        $this->iResource->setSession(SESSION_USER_ID, null);
        session_destroy();
        session_start();
        $this->iResource->setSession('page_message', 'User Logged Out');
    }

    public function handleSessionUser($smsUser)
    {
        DevHelp::debugMsg('authenticated USER');
        $smsUser->id = $this->iResource->getSession(SESSION_USER_ID);
        $smsUser->fullname = $this->iResource->getSession(SESSION_USER_FULLNAME);
        $smsUser->isAuthenticated = true;
        return $smsUser;
    }

    public function authenticate($req)
    {
        $smsUser = new SmsUser();
        $cookieExpiration = time() + SECONDS_PER_DAY * 30;  // 30 DAYS

        DevHelp::debugMsg('get user id' . $this->iResource->getSession(SESSION_USER_ID));
        DevHelp::debugMsg('$this->iResource->issetSession(SESSION_USER_ID): ' .
            $this->iResource->issetSession(SESSION_USER_ID));
        if (!$this->iResource->issetSession(SESSION_USER_ID)) {
            DevHelp::debugMsg('not logged in, then check url param ');

            // check authenticated credentials
            // var_dump($_COOKIE);
            // var_dump($req);
            if (isset($req['password'])) {
                DevHelp::debugMsg('login by password');
                $smsUser = $this->checkPassword($req['password']);
            } elseif ($this->wowo_cookieLogin && isset($_COOKIE['auth0_is_authenticated'])) {
                DevHelp::debugMsg('login by cookie');
                $smsUser = $this->loginByCookie($req);
            } else {
                DevHelp::debugMsg('no password or cookie');
                $smsUser = null;
            }

            if ($smsUser !== null) {
                $this->iResource->setSession(SESSION_USER_ID, $smsUser->id);
                $this->iResource->setSession(SESSION_USER_FULLNAME, $smsUser->fullname);
            }
        } else {
            DevHelp::debugMsg('ELSE user is in session');
            DevHelp::debugMsg('$this->iResource->getSession(SESSION_USER_ID)' .
                $this->iResource->getSession(SESSION_USER_ID));
            $loggingOut = $this->checkLoggingOut($req);
            if ($loggingOut) {
                $this->logoutUser();
                return null;
            }
            $smsUser = $this->handleSessionUser($smsUser);
        }

        DevHelp::debugMsg('get user id' . $this->iResource->getSession(SESSION_USER_ID));

        return $smsUser;
    }

    public function logLogin($message)
    {
        Logger::log("\t" . getenv("REMOTE_ADDR") . "\t" . $message);
    }
}

function session($key, $default = null)
{
    return array_key_exists($key, $_SESSION) ? $_SESSION[$key] : $default;
}
