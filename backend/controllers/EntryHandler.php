<?php
defined('ABSPATH') or exit('No direct script access allowed');
use \Lpt\DevHelp;

/**
 * @OA\Info(title="Miniblog Api", version="0.1",
 *   @OA\Contact(
 *     email= "rayjlim1@gmail.com"
 *   )
 * )
 */

class EntryHandler extends AbstractController
{
    public $dao = null;
    public $resource = null;
    public function __construct($app, $_smsEntriesDAO, $_resource)
    {
        $this->dao = $_smsEntriesDAO;
        $this->resource = $_resource;
        parent::__construct($app);
    }

    /**
    * @OA\Get(
    *     path="/api/posts/",
    *     @OA\Response(
    *       response="200",
    *       description="Retrieve entries limit 50",
    *       @OA\MediaType(
    *         mediaType="application/json",
    *         @OA\Schema(ref="#/components/schemas/SmsEntrie"),
    *       )
    *     )
    * )
    */
    public function listItemsApi()
    {
        return function () {
            $request = $this->app->request();
            $requestParams = $request->params();
            $listObj = new ListParams();
            $listObj->loadParams($requestParams);
            $userId = $this->app->userId;
            $entries = $this->dao->queryBlogList($userId, $listObj);
            $this->app->response()->header('Content-Type', 'application/json');

            $metaData = new stdClass();
            $metaData->entries = $entries;
            $metaData->params = $listObj;

            $this->resource->echoOut(json_encode($metaData));
        };
    }

    /**
    * @OA\Get(
    *     description="Retrieve entries on same day of year",
    *     path="/api/sameDayEntries",
   *     @OA\Response(
   *         response=200,
   *         description="success",
   *         @OA\MediaType(
   *           mediaType="application/json",
   *           @OA\Schema(ref="#/components/schemas/SearchResults"),
   *         )
   *     ),
   *     @OA\Response(
   *         response=404,
   *         description="Could Not Find Resource"
   *     )
    * )
    */
    public function sameDayEntries()
    {
        return function () {
            DevHelp::debugMsg(__file__);
            $userId = $this->app->userId;
            $currentDate = $this->resource->getDateTime();
            $request = $this->app->request();
            $requestParams = $request->params();
            $targetDay = getValue($requestParams, 'day') != '' ? DateTime::createFromFormat(YEAR_MONTH_DAY_FORMAT, getValue($requestParams, 'day')) : $currentDate;

            $entries = $this->dao->getSameDayEntries($userId, $targetDay);
            $this->app->response()->header('Content-Type', 'application/json');
            $this->resource->echoOut('{"user": '. $userId .', "entries": ' . json_encode($entries) . '}');
        };
    }

    public function itemDetailsApi()
    {
        return function ($id) {
            DevHelp::debugMsg('start ' . __FILE__);

            $entry = $this->dao->load($id);
            $this->app->response()->header('Content-Type', 'application/json');
            $this->resource->echoOut('{"entry": ' . json_encode($entry) . '}');
        };
    }
   /**
   * @OA\Get(
   *     description="Retrieve entries limit 50",
   *     path="/api/yearMonth",
   *     @OA\RequestBody(
   *         description="Client side search object",
   *         required=true,
   *         @OA\MediaType(
   *             mediaType="application/json",
   *         )
   *     ),
   *     @OA\Response(
   *         response=200,
   *         description="success",
   *         @OA\MediaType(
   *           mediaType="application/json",
   *           @OA\Schema(ref="#/components/schemas/SearchResults"),
   *         )
   *     ),
   *     @OA\Response(
   *         response=404,
   *         description="Could Not Find Resource"
   *     )
    * )
    */

    public function yearMonthsApi()
    {
        return function () {
            $userId = $this->app->userId;
            DevHelp::debugMsg('start ' . __FILE__);

            $entry = $this->dao->getYearMonths($userId);
            $this->app->response()->header('Content-Type', 'application/json');
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
