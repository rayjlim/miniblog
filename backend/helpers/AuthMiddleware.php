<?php

defined('ABSPATH') or exit('No direct script access allowed');

use \Lpt\DevHelp;

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
        DevHelp::debugMsg('isset app token? ' . isset($headers[$token]));
        $headerStringValue = isset($headers[$token]) ? $headers[$token] : '';

        $decryptedString = decrypt($headerStringValue);
        DevHelp::debugMsg('decryptedString:' . $decryptedString);

        $this->app->userId = $decryptedString;
        DevHelp::debugMsg('header: ' . $headerStringValue . ", decryptedString: " . $decryptedString);
        return is_numeric(($decryptedString) ? $decryptedString : null);
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
        \Lpt\Logger::log('User Login: ' . $username);
        if ($username !== $_ENV['ACCESS_USER'] || $password !== $_ENV['ACCESS_PASSWORD']) {
            return false;
        }
        $response = new stdClass();
        $response->token = encrypt($_ENV['ACCESS_ID']);

        echo json_encode($response);
        exit;
    }

    public function call()
    {
        DevHelp::debugMsg(__FILE__);
        $app = $this->app;
        $req = $app->request;

        if ($app->request->isOptions()) {
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
        $parsedBody = $req->getBody();
        DevHelp::debugMsg('parsed:' . $parsedBody);
        $loginParams = json_decode($parsedBody);
        $username = isset($loginParams->username) ? htmlspecialchars($loginParams->username) : null;
        $password = isset($loginParams->password) ? htmlspecialchars($loginParams->password) : null;

        if (isset($loginParams->login)) {
            if (!$username || !$password) {
                $error = "{\"status\": \"fail\", \"message\":\"Missing Fields\"}";
                \Lpt\Logger::log('User Login fail: ' . $error);
            } else {
                \Lpt\Logger::log('doLogin:' . $username);
                if (!$this->doLogin($username, $password)) {
                    \Lpt\Logger::log('User Login fail: Wrong password: ' . $username . ":" . $password);
                    $error = "{\"status\": \"fail\", \"message\":\"Wrong password\"}";
                }
                // else {
                //     $this->next->call();
                //     return;
                // }
            }
        }

        // show Login Form
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
