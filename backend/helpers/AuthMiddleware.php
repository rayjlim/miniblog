<?php
namespace middleware;

defined('ABSPATH') or exit('No direct script access allowed');

use \Lpt\DevHelp;
use \Lpt\Logger;
use \stdClass;

// use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Nyholm\Psr7\Response;

class AuthMiddleware
{
    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        DevHelp::debugMsg(__FILE__);
        $response = $handler->handle($request);
        // $existingContent = (string) $response->getBody();

        $response = new Response();
        // $response->getBody()->write('BEFORE ' . $existingContent);

        $ipaddress = getenv("REMOTE_ADDR");

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

        $username = isset($loginParams->username) ? htmlspecialchars($loginParams->username) : null;
        $password = isset($loginParams->password) ? htmlspecialchars($loginParams->password) : null;

        if (!isset($loginParams->login)) {
            $this->loginError('Invalid payload' . $_SERVER['REQUEST_URI']);
        } elseif (!$username || !$password) {
            $this->loginError('Missing Fields');
       }

        if (isset($loginParams->id) && $loginParams->id !== '') {
            if ($loginParams->id == $_ENV['GOOGLE_ID']) {
                $this->generateToken();
            }
            $this->loginError('Wrong id');
        }

        if ($this->doLogin($username, $password)) {
            $this->generateToken();
        }
        $this->loginError('Wrong username/password');
    }

    private function generateToken(){
        $tokenObj = new stdClass();
        $tokenObj->userId = $_ENV['ACCESS_ID'];
        $tokenObj->name = $_ENV['ACCESS_NAME'];
        $tokenObj->user = $_ENV['ACCESS_USER'];
        echo encrypt(json_encode($tokenObj));
        exit;
    }

    private function loginError($message){
        $ipaddress = $this->getRealIpAddr();
        $response = new stdClass();
        $response->status = "fail";
        $response->message = $message;

        Logger::log('User Login: '.$message.' from IP Address: ' . $ipaddress);
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
        $headers = getallheaders();

        $token = $_ENV['AUTH_TOKEN'];
        DevHelp::debugMsg('isset app token? ' . $token . isset($headers[$token]));
        if (isset($headers[$token])) {
            DevHelp::debugMsg('decrypting token ' . $headers[$token]);
            $headerStringValue = $headers[$token];
            $decryptedString = decrypt($headerStringValue);
            $userObj = json_decode($decryptedString);
            return ($userObj
                && $userObj->username == $_ENV['ACCESS_USER']
                && $userObj->password == $_ENV['ACCESS_PASSWORD']);

            $userObj = json_decode($decryptedString);
            return ($userObj && is_numeric($userObj->userId) && $userObj->userId == $_ENV['ACCESS_ID']);
        }

        if (isset($_GET["cron_pass"]) && $_GET["cron_pass"] == $_ENV['CRON_PW']) {
            $ipaddress = getenv("REMOTE_ADDR");
            Logger::log("Cron called from IP Address: " . $ipaddress);
            return true;
        }

        return false;
    }

    /**
     * Do the login
     *
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
