<?php

namespace App\controllers;

defined('ABSPATH') or exit('No direct script access allowed');

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use \stdClass;

/**
 *   Handle App config settings
 */
class Settings
{
    /**
     * @OA\GET(
     *     description="GET settings",
     *     path="/api/settings",
     * @OA\Response(
     *       response="200",
     *       description="Success",
     * @OA\MediaType(
     *           mediaType="application/json",
     *     )
     * )
     */
    public function __invoke(Request $request, Response $response): Response
    {

        $data = new stdClass();
        $data->UPLOAD_ROOT = $_ENV['FE_UPLOAD_ROOT'] ?? '';
        $data->GOOGLE_OAUTH_CLIENTID = $_ENV['FE_GOOGLE_OAUTH_CLIENTID'] ?? '';
        $data->GOOGLE_API_KEY = $_ENV['FE_GOOGLE_API_KEY'] ?? '';

        $data->INSPIRATION_API = $_ENV['FE_INSPIRATION_API'] ?? '';
        $data->QUESTION_API = $_ENV['FE_QUESTION_API'] ?? '';

        $data->TRACKS_API = $_ENV['FE_TRACKS_API'] ?? '';
        $data->MOVIES_API = $_ENV['FE_MOVIES_API'] ?? '';
        $data->MOVIES_POSTERS = $_ENV['FE_MOVIES_POSTERS'] ?? '';

        $data->SHOW_GH_CORNER = false;
        $data->UPLOAD_SIZE_LIMIT = UPLOAD_SIZE_LIMIT;

        $response->getBody()->write(json_encode($data));
        return $response;
    }
}

