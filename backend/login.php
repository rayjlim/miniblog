<?php
/** * Login page */
$loginPage = true;
require 'common_header.php';
use Slim\Views\Twig as Twig;
use Slim\Slim;

$app = new Slim(array(
    'view' => new Twig
));

require 'backend/core/page_message.php';

\Lpt\DevHelp::debugMsg('login');

$target_url = isset($_REQUEST["target"])
                ? $_REQUEST["target"]
                : "";

$app->view()->appendData(["baseurl"=> '/' . $_ENV['ROOT_URL'] . '/index.php/']);
$app->view()->appendData(["target" => $target_url]);

//FB login support
require_once 'backend/3rdparty/Facebook/autoload.php';


$fb = new Facebook\Facebook([
  'app_id' => FB_APP_ID, // Replace {app-id} with your app id
  'app_secret' => FB_APP_SECRET
  ]);
//Get the FB UID of the currently logged in user
 // $user = $fb->getUser();

//if the user has already allowed the application, you'll be able to get his/her FB UID
$helper = $fb->getRedirectLoginHelper();
$permissions = ['email']; // optional
$fbLoginUrl = $helper->getLoginUrl('https://'.$_ENV['DOMAIN']."/".$_ENV['ROOT_URL'].'/fb-login-callback.php', $permissions);
$app->view()->appendData(["fbLoginUrl" => $fbLoginUrl]);

//Github OAuth
$authorizeURL = 'https://github.com/login/oauth/authorize?';

$_SESSION['state'] = hash('sha256', microtime(TRUE).rand().$_SERVER['REMOTE_ADDR']);
unset($_SESSION['access_token']);
$githubRedirectUrl = 'https://'.$_ENV['DOMAIN']."/".$_ENV['ROOT_URL'].'/github-login-callback.php';
$params = array(
	'client_id' => OAUTH2_CLIENT_ID,
	'redirect_uri' => $githubRedirectUrl,
	'scope' => 'user',
	'state' => $_SESSION['state']
);
  // Redirect the user to Github's authorization page

$githubLoginUrl = $authorizeURL . http_build_query($params);
$app->view()->appendData(["githubLoginUrl" => $githubLoginUrl]);
$app->view()->appendData(["FB_APP_ID" => FB_APP_ID]);

//GOOGLE
$gAuthorizeUrl = 'https://accounts.google.com/o/oauth2/v2/auth?';
$googleRedirectUrl = 'https://'.$_ENV['DOMAIN']."/".$_ENV['ROOT_URL'].'/google-login-callback.php';
$gParams = array(
  'client_id' => GOOGLE_CLIENT_ID,
  'response_type' => 'code',
  'scope'=>'openid email',
  'redirect_uri' => $googleRedirectUrl,
  'state' => $_SESSION['state']
);
$googleLoginUrl = $gAuthorizeUrl . http_build_query($gParams);
$app->view()->appendData(["googleLoginUrl" => $googleLoginUrl]);

$app->render("login.twig");
