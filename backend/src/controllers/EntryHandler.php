<?php

namespace App\controllers;

defined('ABSPATH') or exit('No direct script access allowed');

use Psr\Container\ContainerInterface;
use App\core\DevHelp;
use App\models\ListParams;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use \DateTime;

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
    private $dao = null;
    private $resource = null;
    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }


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
        $this->resource = $factory->makeResource();
        $reply = new \stdClass();

        $listObj = new ListParams();
        $listObj->loadParams($request->getQueryParams());

        if ($listObj->startDate === '' && $listObj->searchParam === '') {
            $strDescription = "-" . DEFAULT_MONTHS_TO_SHOW . " months";
            $newStartDate = $this->resource->getDateByDescription($strDescription);
            $listObj->startDate = !is_null($newStartDate) ? $newStartDate : '';
        }

        $userId = $_ENV['ACCESS_ID'];
        $listObj->userId = $userId;
        $entries = $this->dao->list($listObj);


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

        $dayValue = getValue($request->getQueryParams(), 'day');

        $targetDay = $dayValue != false
            ? DateTime::createFromFormat(YEAR_MONTH_DAY_FORMAT, $dayValue)
            : $this->resource->getDateTime(); //current date

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
