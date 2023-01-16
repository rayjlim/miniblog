<?php

defined('ABSPATH') or exit('No direct script access allowed');

use \Lpt\DevHelp;
use \Lpt\Logger;

class AuthMiddleware extends \Slim\Middleware
{
    /**
     * Check if the user is logged in
     * @return boolean
     */
    private function isLogged()
    {
        $headers = getallheaders();
        // print_r($headers);

        $token = $_ENV['AUTH_TOKEN'];
        DevHelp::debugMsg('isset app token? ' . $token . isset($headers[$token]));
        if (isset($headers[$token])) {
            $headerStringValue = isset($headers[$token]) ? $headers[$token] : '';

            $decryptedString = decrypt($headerStringValue);
            DevHelp::debugMsg('decryptedString:' . $decryptedString);
            $userObj = json_decode($decryptedString);

            $this->app->userId = $userObj ? $userObj->userId : NULL;
            if (is_numeric($userObj->userId)) {
                return $userObj->userId;
            }
        }

        if (isset($_GET["cron_pass"]) && $_GET["cron_pass"] == $_ENV['CRON_PW']) {
            $ipaddress = getenv("REMOTE_ADDR");
            Logger::log("Cron called from IP Address: " . $ipaddress);
            return 1;
        }

        return false;
    }

    /**
     * Do the login
     * @param  string $ip       IP address
     * @param  string $username Username
     * @param  string $password Password
     * @return boolean
     */
    private function doLogin($username, $password)
    {
        // Check the access to this function, using logs and ip
        $ipaddress = getenv("REMOTE_ADDR");
        Logger::log('doLogin:' . $username . 'from IP Address: ' . $ipaddress);
        if ($username !== $_ENV['ACCESS_USER'] || $password !== $_ENV['ACCESS_PASSWORD']) {
            return false;
        }

        $tokenObj = new stdClass();
        $tokenObj->userId = $_ENV['ACCESS_ID'];
        $tokenObj->name = $_ENV['ACCESS_NAME'];
        $tokenObj->user = $_ENV['ACCESS_USER'];
        $response = new stdClass();
        $response->token = encrypt(json_encode($tokenObj));

        echo json_encode($response);
        exit;
    }

    public function call()
    {
        DevHelp::debugMsg(__FILE__);
        $ipaddress = getenv("REMOTE_ADDR");
        $app = $this->app;
        $req = $app->request;

        if ($req->isOptions()) {
            header('HTTP/1.0 200 Ok');
            echo "Options METHOD check";
            exit(0);
        }

        $error = '';
        $userId = $this->isLogged();

        if (!empty($userId)) {
            $this->app->userId = $userId;
            $this->next->call();
            return;
        } else {
            $error = "Not Logged In";
        }

        $reqBody = $req->getBody();
        DevHelp::debugMsg('reqBody:' . $reqBody);
        $loginParams = json_decode($reqBody);

        $username = isset($loginParams->username) ? htmlspecialchars($loginParams->username) : null;
        $password = isset($loginParams->password) ? htmlspecialchars($loginParams->password) : null;
        // DevHelp::debugMsg('$loginParams->login:' . $loginParams->login);


        if (!isset($loginParams->login)) {
            $error = "{\"status\": \"fail\", \"message\":\"Invalid payload\"}";
            Logger::log('User Login fail: ' . $error . 'from IP Address: ' . $ipaddress);
        } elseif (!$username || !$password) {
            $error = "{\"status\": \"fail\", \"message\":\"Missing Fields\"}";
            Logger::log('User Login fail: ' . $error. 'from IP Address: ' . $ipaddress);
        } elseif (!$this->doLogin($username, $password)) {
            $error = "{\"status\": \"fail\", \"message\":\"Wrong password\"}";
            Logger::log('User Login fail: Wrong password: ' . $username . ":" . $password . 'from IP Address: ' . $ipaddress);
        }

        header('HTTP/1.0 403 Forbidden');
        echo $error;
        exit(0);
    }
}

function encrypt($simple_string)
{
    // Display the original string
    // echo "Original String: " . $simple_string;

    // Store the cipher method
    $ciphering = "AES-128-CTR";

    // Use OpenSSl Encryption method
    $iv_length = openssl_cipher_iv_length($ciphering);
    $options = 0;

    // Non-NULL Initialization Vector for encryption
    $encryption_iv = '1234567891011121';

    // Use openssl_encrypt() function to encrypt the data
    $encryption = openssl_encrypt(
        $simple_string,
        $ciphering,
        $_ENV['ENCRYPTION_KEY'],
        $options,
        $encryption_iv
    );
    return $encryption;
}

function decrypt($encryption)
{
    // Store the cipher method
    $ciphering = "AES-128-CTR";
    // Non-NULL Initialization Vector for decryption
    $decryption_iv = '1234567891011121';
    $options = 0;

    // Use openssl_decrypt() function to decrypt the data
    $decryption = openssl_decrypt(
        $encryption,
        $ciphering,
        $_ENV['ENCRYPTION_KEY'],
        $options,
        $decryption_iv
    );

    // Display the decrypted string
    return $decryption;
}
