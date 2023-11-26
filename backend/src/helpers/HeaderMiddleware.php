<?php
namespace App\helpers;

defined('ABSPATH') or exit('No direct script access allowed');

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Psr\Http\Message\ResponseInterface as Response;
// use Nyholm\Psr7\Response;

class HeaderMiddleware
{
  public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $oldResponse = $handler->handle($request);
        $newResponse = null;
        if (
            array_key_exists('HTTP_ORIGIN', $_SERVER)
            && strpos($_SERVER['HTTP_ORIGIN'], $_ENV['ORIGIN']) !== false
        ) {

        }
        $newResponse = $oldResponse->withAddedHeader('Access-Control-Allow-Origin', '*');
        $newResponse = $newResponse->withAddedHeader('Access-Control-Allow-Credentials', 'true');
        $newResponse = $newResponse->withAddedHeader('Access-Control-Max-Age', '86400');    // cache for 1 day

        $newResponse = $newResponse->withAddedHeader('Access-Control-Allow-Headers','Access-Control-*, Origin, '
            . 'X-Requested-With, Content-Type, Accept, Authorization, X-App-Token');
        $newResponse = $newResponse->withAddedHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
        $newResponse = $newResponse->withAddedHeader('Allow', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            // OPTIONS method is preceded in CORS checks before a POST (typically) is sent
            echo "Options METHOD check in HeaderMiddleware";
            exit(0);
        }
        // $existingContent = (string) $oldResponse->getBody();

        // $newResponse->getBody()->write($existingContent);
        return $oldResponse;

    }
}
