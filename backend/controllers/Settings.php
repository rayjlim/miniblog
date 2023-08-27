<?php
namespace controllers;

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
    public function get(): object
    {
        return function (Request $request, Response $response): void {
            $data = new stdClass();
            $data->UPLOAD_ROOT = $_ENV['FE_UPLOAD_ROOT'];
            $data->GOOGLE_CLIENTID = "not set";
            $data->GOOGLE_CLIENTID = "not set";


            $data->INSPIRATION_API = $_ENV['FE_INSPIRATION_API'];
            $data->QUESTION_API = $_ENV['FE_QUESTION_API'];

            $data->TRACKS_API = $_ENV['FE_TRACKS_API'];
            $data->MOVIES_API = $_ENV['FE_MOVIES_API'];
            $data->MOVIES_POSTERS = $_ENV['FE_MOVIES_POSTERS'];

            $data->SHOW_GH_CORNER = false;

            echo json_encode($data);
            die();
        };
    }

}

