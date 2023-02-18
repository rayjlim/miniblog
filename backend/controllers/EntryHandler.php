<?php
namespace controllers;

defined('ABSPATH') or exit('No direct script access allowed');
use \Lpt\DevHelp;
use \models\ListParams;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use \DateTime;
use \stdClass;


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
    public function __construct($_smsEntriesDAO, $_resource)
    {
        $this->dao = $_smsEntriesDAO;
        $this->resource = $_resource;
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
    public function listItemsApi()
    {
        return function (Request $request, Response $response, $args) {
            $queries = array();
            parse_str($_SERVER['QUERY_STRING'], $queries);

            $listObj = new ListParams();
            $listObj->loadParams($queries);
            $userId = $_ENV['ACCESS_ID'];
            $entries = $this->dao->queryBlogList($userId, $listObj);
            // $this->app->response()->header('Content-Type', 'application/json');

            $metaData = new stdClass();
            $metaData->entries = $entries;
            $metaData->params = $listObj;

            $this->resource->echoOut(json_encode($metaData));
            return $response;
        };
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
    public function listItemsSameDay()
    {
        return function (Request $request, Response $response, $args) {
            DevHelp::debugMsg(__file__);
            $userId = $_ENV['ACCESS_ID'];
            $currentDate = $this->resource->getDateTime();
            $queries = array();
            parse_str($_SERVER['QUERY_STRING'], $queries);
            $targetDay = getValue($queries, 'day') != ''
                ? DateTime::createFromFormat(YEAR_MONTH_DAY_FORMAT, getValue($queries, 'day'))
                : $currentDate;

            $entries = $this->dao->getSameDayEntries($userId, $targetDay);
            // $this->app->response()->header('Content-Type', 'application/json');
            $this->resource->echoOut('{"user": '. $userId .', "entries": ' . json_encode($entries) . '}');
            return $response;
        };
    }

    public function detailItemApi()
    {
        return function ($id) {
            DevHelp::debugMsg('start ' . __FILE__);

            $entry = $this->dao->load($id);
            // $this->app->response()->header('Content-Type', 'application/json'); // TODO: fix
            $this->resource->echoOut('{"entry": ' . json_encode($entry) . '}');
        };
    }
    /**
     * @OA\Get(
     *     description="Retrieve entries limit 50",
     *     path="/api/yearMonth",
     * @OA\RequestBody(
     *         description="Client side search object",
     *         required=true,
     * @OA\MediaType(
     *             mediaType="application/json",
     *         )
     *     ),
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

    public function yearMonthsApi()
    {
        return function () {
            $userId = $_ENV['ACCESS_ID'];
            DevHelp::debugMsg('start ' . __FILE__);

            $entry = $this->dao->getYearMonths($userId);
            // $this->app->response()->header('Content-Type', 'application/json'); // TODO: fix
            $this->resource->echoOut('{"data": ' . json_encode($entry) . '}');
        };
    }
}
/**
 * @OA\Schema(
 *   schema="SearchResults",
 *   type="array",
*    @OA\Items(
*         ref="#/components/schemas/SmsEntrie"
*      ),
 * )
 */
