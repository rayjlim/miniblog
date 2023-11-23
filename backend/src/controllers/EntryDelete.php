<?php

namespace App\controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\mysql\SmsEntriesRedbeanDAO;
final class EntryDelete
{
    public function __invoke(Request $request, Response $response): Response
    {
        $response->getBody()->write(json_encode(['hello' => 'world']));

        return $response->withHeader('Content-Type', 'application/json');
        // $response->getBody()->write('Hello, World!');

        // return $response;
    }
    public function deleteIt(Request $request, Response $response): Response
    {
        $response->getBody()->write('Delete It');

        return $response;
    }
    public function makeSmsEntriesDAO()
    {
        return new SmsEntriesRedbeanDAO();
    }
}
