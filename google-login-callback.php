<?php
require 'common_header.php';
require 'backend/3rdparty/JWT.php';
use \Lpt\DevHelp;

if(get('code')) {
  // Verify the state matches our stored state
  if(!get('state') || (isset($_SESSION['state']) && $_SESSION['state'] != get('state'))) {
    header('Location: ' . $_SERVER['PHP_SELF']);
    return new Response('Invalid state parameter', 401);
    die();
  }

  $tokenURL = 'https://www.googleapis.com/oauth2/v4/token';
  // Exchange the auth code for a token
  $token = apiRequest($tokenURL, array(
    'client_id' => GOOGLE_CLIENT_ID,
    'client_secret' => GOOGLE_CLIENT_SECRET,
    'redirect_uri' => 'http://' . $_SERVER['SERVER_NAME'] . $_SERVER['PHP_SELF'],
    'grant_type' => 'authorization_code',
    'code' => get('code')
  ));
  //echo "<pre>" . var_dump($token) . "</pre>";
  $decodedToken = JWT::decode($token->id_token, null, false);
  $_SESSION[SESSION_GOOGLE_TOKEN] = $decodedToken->email;
  $url='http://www.lilplaytime.com/smsblog/index.php/posts/';

  header("Location: $url");
  echo "<head><meta http-equiv=\"refresh\" content=\"5; url=$url\"></head>";
  echo "Have access token <a href=\"$url\">Posts page</a>";

} else {
  $url = 'http://www.lilplaytime.com/smsblog/login.php';

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
