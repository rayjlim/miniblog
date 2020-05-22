<?php

defined('ABSPATH') OR exit('No direct script access allowed');

use \Lpt\DevHelp;
use \Lpt\Logger;


class AuthMiddleware extends \Slim\Middleware
{
    public function call()
    {
        // Get reference to application
        $app = $this->app;
        DevHelp::debugMsg(__FILE__);

        $helper = DAOFactory::SecurityAgent();
        $app->smsUser = $helper->authenticate($_REQUEST);

        if ($app->smsUser == null) {
            if (strpos($app->request->getPath(), '/api/')) {
                $redirectUrl = '/api.php/unauth';
                // DevHelp::redirectHelper($redirectUrl);
            } else {
                DevHelp::debugMsg('$app->smsUser == null');
                // $path_parts = pathinfo($_SERVER["SCRIPT_NAME"]);
                $redirectUrl = '/' . ROOT_URL . "/login.php";
                if (isset($_REQUEST['cmd'])) {
                    $redirectUrl.= "?target=" . $_REQUEST['cmd'];
                }
                // DevHelp::redirectHelper($redirectUrl);
            }
            $message =  $_REQUEST['value'] ?? '';
            
            Logger::log('AuthMiddleware#unauth called: '. $message);
            echo '{"unauth": true}';
            exit(0);
        }
    

        $app->userId = $app->smsUser->id;

        DevHelp::debugMsg('$userId' . $app->userId);
        $this->setViewVars($app);

        // Run inner middleware and application
        $this->next->call();
    }

    public function setViewVars($app)
    {
        $app->view()->appendData(["user_fullname" => $app->smsUser->fullname]);
        $app->view()->appendData(["authenticated"=> $app->smsUser->isAuthenticated]);
        $app->view()->appendData(["admin" => isset($app->userId) && $app->userId == 0]);
        $app->view()->appendData(["userId"=> isset($app->userId) ? $app->userId : -1]);
    }
}
