<?php
require 'backend/core/common_header.php';
use \Lpt\DevHelp;

$tokenURL = 'https://github.com/login/oauth/access_token';

// When Github redirects the user back here, there will be a "code" and "state" parameter in the query string
if(get('code')) {
  // Verify the state matches our stored state
  if(!get('state') || (isset($_SESSION['state']) && $_SESSION['state'] != get('state'))) {
    header('Location: ' . $_SERVER['PHP_SELF']);
    die();
  }
  // Exchange the auth code for a token
  $token = apiRequest($tokenURL, array(
    'client_id' => OAUTH2_CLIENT_ID,
    'client_secret' => OAUTH2_CLIENT_SECRET,
    'redirect_uri' => 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['PHP_SELF'],
    // 'state' => $_SESSION['state'],
    'code' => get('code')
  ));
  $_SESSION[SESSION_GH_ACCESS_TOKEN] = "access_token"; // $token->access_token;

  $url="http://".DOMAIN."/".ROOT_URL."/index.php/main#/oneDay";

  header("Location: $url");
  echo "<head><meta http-equiv=\"refresh\" content=\"1  ; url=$url\"></head>";
  echo "Have access token <a href=\"$url\">Posts page</a>";

} else {
  $url = 'http://'.DOMAIN."/".ROOT_URL.'/login.php';

  header("Location: $url");
  echo "<head><meta http-equiv=\"refresh\" content=\"5; url=$url\"></head>";

  echo '<h3>Not logged in</h3>';
  echo "Have access token <a href=\"$url\">Login page</a>";
}

// utilities
function apiRequest($url, $post=FALSE, $headers=array()) {
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
  if($post)
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));
  $headers[] = 'Accept: application/json';
  if(session(SESSION_GH_ACCESS_TOKEN))
    $headers[] = 'Authorization: Bearer ' . session(SESSION_GH_ACCESS_TOKEN);

  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  $response = curl_exec($ch);
     DevHelp::debugMsg('response'.$response);
  return json_decode($response);
}

function get($key, $default=NULL) {
  return array_key_exists($key, $_GET) ? $_GET[$key] : $default;
}
function session($key, $default=NULL) {
  return array_key_exists($key, $_SESSION) ? $_SESSION[$key] : $default;
}
