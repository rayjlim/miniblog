<?php
namespace App\helpers;

defined('ABSPATH') or exit('No direct script access allowed');

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Nyholm\Psr7\Response;

class HeaderMiddleware
{
  public function __invoke(Request $request, RequestHandler $handler): Response
    {
        if (
            array_key_exists('HTTP_ORIGIN', $_SERVER)
            && strpos($_SERVER['HTTP_ORIGIN'], $_ENV['ORIGIN']) !== false
        ) {
            header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
        }

        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day

        header("Access-Control-Allow-Headers: Access-Control-*, Origin, "
            . "X-Requested-With, Content-Type, Accept, Authorization, X-App-Token");
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, HEAD');
        header('Allow: GET, POST, PUT, DELETE, OPTIONS, HEAD');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            // OPTIONS method is preceded in CORS checks before a POST (typically) is sent
            echo "options-check";
            exit();
        }
        $response = $handler->handle($request);
        $existingContent = (string) $response->getBody();
        $response = new Response();
        $response->getBody()->write($existingContent);
        return $response;

    }
}
