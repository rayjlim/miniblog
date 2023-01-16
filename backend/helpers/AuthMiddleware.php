<?php

defined('ABSPATH') or exit('No direct script access allowed');

use \Lpt\DevHelp;
use \Lpt\Logger;



// use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Nyholm\Psr7\Response;

class AuthMiddleware
{
    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $response = $handler->handle($request);
        // $existingContent = (string) $response->getBody();

        $response = new Response();
        // $response->getBody()->write('BEFORE ' . $existingContent);

        DevHelp::debugMsg(__FILE__);
        $ipaddress = getenv("REMOTE_ADDR");

        if ($request->getMethod() == "OPTIONS") {
            header('HTTP/1.0 200 Ok');
            echo "Options METHOD check";
            exit(0);
        }

        $error = '';
        $userId = $this->isLoggedIn();

        if (!empty($userId)) {
            return $response;
        } else {
            $error = "Not Logged In";
        }

        $reqBody = $request->getBody();
        DevHelp::debugMsg('reqBody:' . $reqBody);
        $loginParams = json_decode($reqBody);

        $username = isset($loginParams->username) ? htmlspecialchars($loginParams->username) : null;
        $password = isset($loginParams->password) ? htmlspecialchars($loginParams->password) : null;

        if (!isset($loginParams->login)) {
            $error = "{\"status\": \"fail\", \"message\":\"Invalid payload\"}";
            Logger::log('User Login fail: ' . $error . 'from IP Address: ' . $ipaddress);
        } elseif (!$username || !$password) {
            $error = "{\"status\": \"fail\", \"message\":\"Missing Fields\"}";
            Logger::log('User Login fail: ' . $error . 'from IP Address: ' . $ipaddress);
        } elseif (!$this->doLogin($username, $password)) {
            $error = "{\"status\": \"fail\", \"message\":\"Wrong password\"}";
            Logger::log('User Login fail: Wrong password: ' . $username . ":" . $password . 'from IP Address: ' . $ipaddress);
        } else {
            // successful login
            $tokenObj = new stdClass();
            $tokenObj->userId = $_ENV['ACCESS_ID'];
            $tokenObj->name = $_ENV['ACCESS_NAME'];
            $tokenObj->user = $_ENV['ACCESS_USER'];
            $response = new stdClass();
            $response->token = encrypt(json_encode($tokenObj));

            echo json_encode($response);
            exit;
        }

        header('HTTP/1.0 403 Forbidden');
        echo $error;
        exit(0);
    }

    /**
     * Check if the user is logged in
     * @return boolean
     */
    private function isLoggedIn()
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

            if ($userObj && is_numeric($userObj->userId) && $userObj->userId == $_ENV['ACCESS_ID']) {
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
        return $username === $_ENV['ACCESS_USER'] && $password === $_ENV['ACCESS_PASSWORD'];
    }

}

function encrypt($simple_string)
{
    $ciphering = "AES-128-CTR"; // the cipher method

    // Use OpenSSl Encryption method
    openssl_cipher_iv_length($ciphering);
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
    $ciphering = "AES-128-CTR"; // the cipher method
    // Non-NULL Initialization Vector for decryption
    $encryption_iv = '1234567891011121';
    $options = 0;

    // Use openssl_decrypt() function to decrypt the data
    $decryption = openssl_decrypt(
        $encryption,
        $ciphering,
        $_ENV['ENCRYPTION_KEY'],
        $options,
        $encryption_iv
    );

    return $decryption;
}
