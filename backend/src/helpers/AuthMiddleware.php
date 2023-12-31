<?php

namespace App\helpers;

defined('ABSPATH') or exit('No direct script access allowed');

use App\core\DevHelp;
use App\core\Logger;
use \stdClass;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Nyholm\Psr7\Response;

class AuthMiddleware
{
    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        DevHelp::debugMsg(__FILE__);

        $response = $handler->handle($request);
        $existingContent = (string) $response->getBody();
        $response = new Response();
        $response->getBody()->write($existingContent);

        if ($request->getMethod() == "OPTIONS") {
            header('HTTP/1.0 200 Ok');
            echo "Options METHOD check";
            exit(0);
        }

        if ($this->isLoggedIn()) {
            return $response;
        }

        $reqBody = $request->getBody();
        DevHelp::debugMsg('reqBody:' . $reqBody);
        $loginParams = json_decode($reqBody);

        if (isset($loginParams->id) && $loginParams->id !== '') {
            if ($loginParams->id == $_ENV['GOOGLE_ID']) {
                $this->generateToken();
            }
            $this->loginError('Wrong id');
        }

        $username = isset($loginParams->username) ? htmlspecialchars($loginParams->username) : null;
        $password = isset($loginParams->password) ? htmlspecialchars($loginParams->password) : null;

        if (!isset($loginParams->login)) {
            $this->loginError('Invalid payload ' . $_SERVER['REQUEST_URI']);
        } elseif (!$username || !$password) {
            $this->loginError('Missing Fields');
        } elseif (!$this->isValidUsernamePassword($username, $password)) {
            $this->loginError('Wrong username/password');
        }

        $this->generateToken();
    }

    private function generateToken()
    {
        $tokenObj = new stdClass();
        $tokenObj->userId = $_ENV['ACCESS_ID'];
        $tokenObj->name = $_ENV['ACCESS_NAME'];
        $tokenObj->user = $_ENV['ACCESS_USER'];
        $response = new stdClass();
        $response->token = encrypt(json_encode($tokenObj));

        echo json_encode($response);
        exit;
    }

    private function loginError($message)
    {
        $ipaddress = $this->getRealIpAddr();
        $response = new stdClass();
        $response->status = "fail";
        $response->message = $message;

        Logger::log('User Login Err: ' . $message . ' from IP Address: ' . $ipaddress, array('logFilePrefix' => "mb-login"));
        header('HTTP/1.0 403 Forbidden');
        echo json_encode($response);
        exit(0);
    }
    /**
     * Get the IP address of the visitor
     * @return string
     */
    private function getRealIpAddr()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {   //check ip from share internet
            return $_SERVER['HTTP_CLIENT_IP'];
        }
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {   //to check ip is pass from proxy
            return $_SERVER['HTTP_X_FORWARDED_FOR'];
        }

        return $_SERVER['REMOTE_ADDR'];
    }

    /**
     * Check if the user is logged in
     *
     * @return boolean
     */
    private function isLoggedIn()
    {
        if (isset($_ENV['PHP_TEST']) && $_ENV['PHP_TEST']) {
            return true;
        }
        $headers = getallheaders();
        $tokenName = $_ENV['AUTH_TOKEN'];
        DevHelp::debugMsg('isset app tokenName? ' . $tokenName . isset($headers[$tokenName]));
        // DevHelp::debugMsg('token value: ' . $headers[$tokenName]);
        // $headers =  getallheaders();
        // foreach($headers as $key=>$val){
        //     echo $key . ': ' . $val . '<br>';
        // }
        if (isset($headers[$tokenName])) {
            $headerStringValue = $headers[$tokenName];
            $decryptedString = decrypt($headerStringValue);

            $userObj = json_decode($decryptedString);
            return ($userObj
                && $userObj->userId == $_ENV['ACCESS_ID']);
        }

        if (isset($_GET["cron_pass"]) && $_GET["cron_pass"] == $_ENV['CRON_PW']) {
            $ipaddress = getenv("REMOTE_ADDR");
            Logger::log("Cron called from IP Address: " . $ipaddress, array('logFilePrefix' => "mb-login"));
            return true;
        }

        return false;
    }

    /**
     * Check Username and Password
     *
     * @param  string $username Username
     * @param  string $password Password
     * @return boolean
     */
    private function isValidUsernamePassword($username, $password)
    {
        $ipaddress = getenv("REMOTE_ADDR");
        Logger::log('check Valid Username: ' . $username . ' from IP Address: ' . $ipaddress, array('logFilePrefix' => "mb-login"));
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
