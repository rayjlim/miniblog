<?php
defined('ABSPATH') OR exit('No direct script access allowed');
use \Lpt\DevHelp;

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
            $smsUser->fullname =  (!defined("DEVELOPMENT")) ?  'Ray': "dev 1";

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

        if(isset($data) && isset($data->email)){
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

        DevHelp::debugMsg('get user id'. $this->iResource->getSession(SESSION_USER_ID));
        DevHelp::debugMsg('$this->iResource->issetSession(SESSION_USER_ID): ' .
        $this->iResource->issetSession(SESSION_USER_ID));
        if (! $this->iResource->issetSession(SESSION_USER_ID)) {
            DevHelp::debugMsg('not logged in, then check url param ' );

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
                // $this->iResource->setCookie(
                //     COOKIE_USER,
                //     SecurityAgent::encrypt($smsUser->id),
                //     $cookieExpiration
                // );

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

        DevHelp::debugMsg('get user id'. $this->iResource->getSession(SESSION_USER_ID));

        return $smsUser;
    }

    public function logLogin($message)
    {
        $date = $this->iResource->getDateTime();
        $filename = LOGS_DIR . DIR_SEP . LOG_PREFIX . "_logins-" . $date->format("Y-m") . ".txt";
        $fileData = $date->format("Y-m-d G:i:s") . "\t" . getenv("REMOTE_ADDR") . "\t";
        $fileData.= $message . "\n";
        $this->iResource->writeFile($filename, $fileData);
    }

    private static function encrypt($plaintext)
    {
        // create a random IV to use with CBC encoding

        // $iv = mcrypt_create_iv(IV_SIZE, MCRYPT_RAND);

        // // $plaintext = "This string was AES-256 / CBC / ZeroBytePadding encrypted.";
        // $plaintext_utf8 = utf8_encode($plaintext);
        // $ciphertext = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, KEY, $plaintext_utf8, MCRYPT_MODE_CBC, $iv);

        // $ciphertext = $iv . $ciphertext;
        // // encode the resulting cipher text so it can be represented by a string
        // $ciphertext_base64 = base64_encode($ciphertext);
        // return $ciphertext_base64;
        return $plaintext;
    }

    private static function decrypt($ciphertext_base64)
    {
        // echo $ciphertext_base64;
        // === WARNING ===
        // Resulting cipher text has no integrity or authenticity added
        // and is not protected against padding oracle attacks.
        // --- DECRYPTION ---

        // $ciphertext_dec = base64_decode($ciphertext_base64);
        // // retrieves the IV, IV_SIZE should be created using mcrypt_get_IV_SIZE()
        // $iv_dec = substr($ciphertext_dec, 0, IV_SIZE);
        // // retrieves the cipher text (everything except the $IV_SIZE in the front)
        // $ciphertext_dec = substr($ciphertext_dec, IV_SIZE);
        // // may remove 00h valued characters from end of plain text
        // $plaintext_utf8_dec = mcrypt_decrypt(MCRYPT_RIJNDAEL_128, KEY, $ciphertext_dec, MCRYPT_MODE_CBC, $iv_dec);

        // echo "decrypted: ".$plaintext_utf8_dec;
        return $ciphertext_base64;
    }

    // utilities
    private function apiRequest($url, $post=false, $headers=array())
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $headers[] = 'User-Agent: smsblogger';
        if ($post) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));
        }
        $headers[] = 'Accept: application/json';
        if (session(SESSION_GH_ACCESS_TOKEN)) {
            $headers[] = 'Authorization: Bearer ' . session(SESSION_GH_ACCESS_TOKEN);
        }
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = curl_exec($ch);
        $this->logLogin('GH:response'.$response);
        return json_decode($response);
    }
}

function session($key, $default=null)
{
    return array_key_exists($key, $_SESSION) ? $_SESSION[$key] : $default;
}
