<?php

namespace App\controllers;

defined('ABSPATH') or exit('No direct script access allowed');

use Psr\Container\ContainerInterface;
use App\core\DevHelp;
use App\models\ListParams;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use \DateTime;
use \stdClass;

function getValue($array, $key)
{
    return $array[$key] ?? false;
}
/**
 * @OA\Info(title="Miniblog Api", version="0.1",
 * @OA\Contact(
 *     email= "rayjlim@yahoo.com"
 *   )
 * )
 */
class EntryHandler
{
    public $dao = null;
    public $resource = null;
    private $container;

    // constructor receives container instance
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }
    // public function __construct($_smsEntriesDAO, $_resource)
    // {
    //     $this->dao = $_smsEntriesDAO;
    //     $this->resource = $_resource;
    // }

    /**
     * @OA\Get(
     *     path="/api/posts/",
     * @OA\Response(
     *       response="200",
     *       description="Retrieve entries limit 50",
     * @OA\MediaType(
     *         mediaType="application/json",
     * @OA\Schema(ref="#/components/schemas/SmsEntrie"),
     *       )
     *     )
     * )
     */
    public function list(Request $request, Response $response): Response
    {
        $factory = $this->container->get('Objfactory');
        $this->dao = $factory->makeSmsEntriesDAO();

        $queries = array();
        parse_str($_SERVER['QUERY_STRING'], $queries);

        $listObj = new ListParams();
        $listObj->loadParams($queries);
        $userId = $_ENV['ACCESS_ID'];
        $listObj->userId = $userId;
        $entries = $this->dao->list($listObj);
        // $this->app->response()->header('Content-Type', 'application/json');

        $reply = new \stdClass();
        $reply->entries = $entries;
        $reply->params = $listObj;

        $response->getBody()->write(json_encode($reply));
        return $response->withHeader('Content-Type', 'application/json');
    }

    /**
     * @OA\Get(
     *     description="Retrieve entries on same day of year",
     *     path="/api/sameDayEntries",
     * @OA\Response(
     *         response=200,
     *         description="success",
     * @OA\MediaType(
     *           mediaType="application/json",
     * @OA\Schema(ref="#/components/schemas/SearchResults"),
     *         )
     *     ),
     * @OA\Response(
     *         response=404,
     *         description="Could Not Find Resource"
     *     )
     * )
     */
    public function listSameDay(Request $request, Response $response): Response
    {
        $factory = $this->container->get('Objfactory');
        $this->dao = $factory->makeSmsEntriesDAO();
        $this->resource = $factory->makeResource();

        DevHelp::debugMsg(__file__);
        $userId = $_ENV['ACCESS_ID'];
        $currentDate = $this->resource->getDateTime();
        $queries = [];
        parse_str($_SERVER['QUERY_STRING'], $queries);
        $dayValue = getValue($queries, 'day');
        $targetDay = $dayValue != false
            ? DateTime::createFromFormat(YEAR_MONTH_DAY_FORMAT, $dayValue)
            : $currentDate;

        $entries = $this->dao->getSameDayEntries($targetDay);

        $reply = new \stdClass();
        $reply->user = $userId;
        $reply->entries = $entries;
        $response->getBody()->write(json_encode($reply));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function yearMonths(Request $request, Response $response): Response
    {
        $factory = $this->container->get('Objfactory');
        $this->dao = $factory->makeSmsEntriesDAO();
        $userId = $_ENV['ACCESS_ID'];
        DevHelp::debugMsg('start ' . __FILE__);

        $entry = $this->dao->getYearMonths($userId);
        header('Content-Type: application/json');
        $response->getBody()->write(json_encode($entry));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
