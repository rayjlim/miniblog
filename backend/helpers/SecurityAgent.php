<?php
use \Lpt\DevHelp;

class SecurityAgent
{
  var $wowo_cookieLogin = true;

  var $iDao = null;
  var $iResource = null;
  var $facebook = null;
  function __construct($iDao, $iResource, $facebook) {
      $this->iDao = $iDao;
      $this->iResource = $iResource;
      $this->facebook = $facebook;
  }
      
  function checkPassword($password){
    DevHelp::debugMsg('-PASSWORD passed');
    $smsUser = new SmsUser();
    $dbUser = $this->iDao->lookupByPassword($password);
    
    if ($dbUser != null) {
      DevHelp::debugMsg('password correct, set vars');
      
      $smsUser->id = $dbUser['id'];
      $smsUser->isAuthenticated = true;
      $smsUser->fullname =  (!defined("DEVELOPMENT")) ?  'Ray': "dev 1";
 
      $this->logLogin( 'password: ' . $smsUser->id);
    } else {
      DevHelp::debugMsg('record bad password');
      $smsUser = null;
      $this->iResource->setSession('page_message', 'Invalid Password');
      $content = 'bad password attempt: ' . $password;
      $this->logLogin($content);

      $this->iResource->sendEmail('rayjlim1@gmail.com', $content, '');       
    }
    return $smsUser;
  }

  function loginByCookie($cookieValue){
    DevHelp::debugMsg('cookie available, set vars');
    $smsUser = new SmsUser();
    $cookieId = trim(SecurityAgent::decrypt($cookieValue));
    
    // LOOKUP KEY: USERID
    $dbUser = $this->iDao->load($cookieId);
    if(isset($dbUser)){
      $smsUser->id = $dbUser['id'];
      $smsUser->isAuthenticated = true;
      $smsUser->fullname = $dbUser['email'];
      $this->logLogin( 'cookie success: ' . $dbUser['email']);          
    }else{
      $smsUser = null;
      $this->logLogin( 'cookie invalid: ' .$cookieId );
      $this->iResource->setSession('page_message', 'Unregistered Facebook account');        
    }
    return $smsUser;
  }

  function facebookLoggedIn(){
    //instantiate the Facebook library with the APP ID and APP SECRET
    DevHelp::debugMsg('setup details from FB id');
    $smsUser = new SmsUser();

    if (!defined("DEVELOPMENT")) {
      try {
        // Returns a `Facebook\FacebookResponse` object
        $response = $this->facebook->get('/me?fields=id,name', $_SESSION['fb_access_token']);
      } catch(Facebook\Exceptions\FacebookResponseException $e) {
        echo 'Graph returned an error: ' . $e->getMessage();
        exit;
      } catch(Facebook\Exceptions\FacebookSDKException $e) {
        echo 'Facebook SDK returned an error: ' . $e->getMessage();
        exit;
      }

      $user = $response->getGraphUser();
      $fbUserId = $user['id'];
      
      DevHelp::debugMsg('-logged in by FB, Set the Auth vars' . $fbUserId);

      $dbUser = $this->iDao->lookupByFacebook($fbUserId); //lookup the id from db
      DevHelp::debugMsg('-smsuser' . $dbUser['id']);

      if(isset($dbUser)){
        $smsUser->id = $dbUser['id'];
        $smsUser->isAuthenticated = true;
        $smsUser->fullname = $user['name'];
        $this->logLogin( 'fb success: ' .$fbUserId .'-'. $smsUser->id );          
      }else{
        $smsUser = null;
        $this->logLogin( 'fb invalid: ' .$fbUserId );
        $this->iResource->setSession('page_message', 'Unregistered Facebook account');        
      }

      
    }
    
    return $smsUser;
  }
  function githubLoggedIn(){
    //instantiate the Facebook library with the APP ID and APP SECRET
    DevHelp::debugMsg('setup details from GH id');
    $smsUser = new SmsUser();

    if (!defined("DEVELOPMENT")) {
      DevHelp::debugMsg('session key' . session(SESSION_GH_ACCESS_TOKEN));

      $apiURLBase = 'https://api.github.com/';
      $user = apiRequest($apiURLBase . 'user', false, array(
           'User-Agent: smsblog'));

      if($user->id == 3877686){
        $smsUser->id = 1;
        $smsUser->isAuthenticated = true;
        $smsUser->fullname = $user->name;
        $this->logLogin( 'GH success: ' . $smsUser->id );
      } else {
          DevHelp::debugMsg('Not logged in through GH - redirect');

          $this->iResource->setSession('page_message', 'Invalid Github User');
          $this->logLogin( 'GH failed: ' . $user->id);
          $smsUser = null;
      }
    }
    
    return $smsUser;
  }
  function googleLoggedIn(){
    //instantiate the Facebook library with the APP ID and APP SECRET
    DevHelp::debugMsg('setup details from google id');
    $smsUser = new SmsUser();

    if (!defined("DEVELOPMENT")) {
      DevHelp::debugMsg('SESSION_GOOGLE_TOKEN' . session(SESSION_GOOGLE_TOKEN));

      $MY_GOOGLE_SUB_ID = 116755003025018433075;
      if(session(SESSION_GOOGLE_TOKEN) == 'rayjlim1@gmail.com'){
        $smsUser->id = 1;
        $smsUser->isAuthenticated = true;
        $smsUser->fullname = session(SESSION_GOOGLE_TOKEN) ;
        $this->logLogin( 'google success: ' . $smsUser->id );
      } else {
          DevHelp::debugMsg('Not logged in through google - redirect');

          $this->iResource->setSession('page_message', 'Invalid Google User');
          $this->logLogin( 'Google failed: ' . session(SESSION_GOOGLE_TOKEN));
          $smsUser = null;
      }
    }
    
    return $smsUser;
  }

  function checkLoggingOut($req){
      return isset($req['password']) && strtolower($req['password']) == 'unauth';
  }

  function logoutUser(){
    DevHelp::debugMsg('logging out');
    $this->logLogin( 'logout');
    
    $this->iResource->setCookie(COOKIE_USER, "", time() - 3600);
    $smsUser = null;
    $this->iResource->setSession(SESSION_USER_ID, null);
    session_destroy();
    session_start();
    $this->iResource->setSession('page_message', 'User Logged Out');
  }

  function handleSessionUser($smsUser){

    DevHelp::debugMsg('authenticated USER');
    
    $smsUser->id = $this->iResource->getSession(SESSION_USER_ID);
    $smsUser->fullname = $this->iResource->getSession(SESSION_USER_FULLNAME);
    $smsUser->isAuthenticated = true;
    return $smsUser;
  }
  function authenticate($req, $isLoginPage) {
    $smsUser = new SmsUser();
    $cookieExpiration = time() + SECONDS_PER_DAY * 30;  // 30 DAYS
    DevHelp::debugMsg('$this->iResource->issetSession(SESSION_USER_ID): ' . 
      $this->iResource->issetSession(SESSION_USER_ID));
    if (! $this->iResource->issetSession(SESSION_USER_ID)) {
      DevHelp::debugMsg('not logged in, then check url param, $isLoginPage: ' . $isLoginPage);
      if (! $isLoginPage) {
        DevHelp::debugMsg('isLoginPage==false');
        if (isset($req['password'])) {
          $smsUser = $this->checkPassword($req['password']);
        } elseif (isset($_SESSION['fb_access_token'])) {
          $smsUser = $this->facebookLoggedIn();
        } elseif (isset($_SESSION[SESSION_GH_ACCESS_TOKEN])) {
          $smsUser = $this->githubLoggedIn();
        }elseif (isset($_SESSION[SESSION_GOOGLE_TOKEN])) {
          $smsUser = $this->googleLoggedIn();
        } elseif ($this->wowo_cookieLogin && isset($_COOKIE[COOKIE_USER])) {
          $smsUser = $this->loginByCookie($_COOKIE[COOKIE_USER]);
        } else{
          $smsUser = null;
        }
      }
      if($smsUser !== null){
        $this->iResource->setCookie(COOKIE_USER, SecurityAgent::encrypt($smsUser->id), 
          $cookieExpiration);
        $this->iResource->setSession(SESSION_USER_ID, $smsUser->id);
        $this->iResource->setSession(SESSION_USER_FULLNAME, $smsUser->fullname);
      } 
    } else {
      DevHelp::debugMsg(' ELSE user is in session');
      DevHelp::debugMsg('$this->iResource->getSession(SESSION_USER_ID)' .
        $this->iResource->getSession(SESSION_USER_ID));
      $loggingOut = $this->checkLoggingOut($req);
      if ($loggingOut){
        $this->logoutUser();
        return null;
      }
      $smsUser = $this->handleSessionUser($smsUser);
    }

    return $smsUser;
  }

  function logLogin($message) {
      $date = $this->iResource->getDateTime();
      $filename = LOGS_DIR . DIR_SEP . LOG_PREFIX . "_logins-" . $date->format("Y-m") . ".txt";
      $fileData = $date->format("Y-m-d G:i:s") . "\t" . getenv("REMOTE_ADDR") . "\t";
      $fileData.= $message . "\n";
      $this->iResource->writeFile($filename, $fileData);
  }
    
  static private function encrypt($plaintext) {
    // create a random IV to use with CBC encoding
    
    $iv = mcrypt_create_iv(IV_SIZE, MCRYPT_RAND);
    
    // $plaintext = "This string was AES-256 / CBC / ZeroBytePadding encrypted.";
    $plaintext_utf8 = utf8_encode($plaintext);
    $ciphertext = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, KEY, $plaintext_utf8, MCRYPT_MODE_CBC, $iv);
    
    $ciphertext = $iv . $ciphertext;
    // encode the resulting cipher text so it can be represented by a string
    $ciphertext_base64 = base64_encode($ciphertext);
    return $ciphertext_base64;
  }
    
  static private function decrypt($ciphertext_base64) {
    // echo $ciphertext_base64;
    // === WARNING ===
    // Resulting cipher text has no integrity or authenticity added
    // and is not protected against padding oracle attacks.
    // --- DECRYPTION ---
    
    $ciphertext_dec = base64_decode($ciphertext_base64);
    // retrieves the IV, IV_SIZE should be created using mcrypt_get_IV_SIZE()
    $iv_dec = substr($ciphertext_dec, 0, IV_SIZE);
    // retrieves the cipher text (everything except the $IV_SIZE in the front)
    $ciphertext_dec = substr($ciphertext_dec, IV_SIZE);
    // may remove 00h valued characters from end of plain text
    $plaintext_utf8_dec = mcrypt_decrypt(MCRYPT_RIJNDAEL_128, KEY, $ciphertext_dec, MCRYPT_MODE_CBC, $iv_dec);
    
    // echo "decrypted: ".$plaintext_utf8_dec;
    return $plaintext_utf8_dec;
  }
}

// utilities
function apiRequest($url, $post=FALSE, $headers=array()) {
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
  $headers[] = 'User-Agent: smsblogger';
  if($post)
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));
  $headers[] = 'Accept: application/json';
  if(session(SESSION_GH_ACCESS_TOKEN))
    $headers[] = 'Authorization: Bearer ' . session(SESSION_GH_ACCESS_TOKEN);
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  $response = curl_exec($ch);

  return json_decode($response);
}
function session($key, $default=NULL) {
  return array_key_exists($key, $_SESSION) ? $_SESSION[$key] : $default;
}