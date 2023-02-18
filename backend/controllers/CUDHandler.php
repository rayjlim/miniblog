<?php
namespace controllers;

defined('ABSPATH') or exit('No direct script access allowed');

use \Lpt\DevHelp;
use \models\SmsEntrie;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use \stdClass;
use \Exception;

/**
 *   This class will handle the Create, Update, Delete Functionality
 *   for the Entrys
 */
class CUDHandler
{
    public $dao = null;
    public $resource = null;
    public $contentHelper = null;

    public function __construct($smsEntriesDAO, $resource, $contentHelper)
    {
        $this->resource = $resource;
        $this->dao = $smsEntriesDAO;
        $this->contentHelper = $contentHelper;
    }
    /**
     * @OA\Post(
     *     description="Create New Entry",
     *     path="/api/posts/{id}",
     * @OA\Response(
     *       response="200",
     *       description="Success",
     * @OA\MediaType(
     *           mediaType="application/json",
     * @OA\Schema(ref="#/components/schemas/SearchResults"),
     *         )
     *     )
     * )
     */
    public function addEntry()
    {
        return function (Request $request, Response $response, $args) {
            DevHelp::debugMsg('start add' . __FILE__);

            $entry = json_decode($request->getBody());
            if (!$entry) {
                throw new Exception('Invalid json' . $request->getBody());
            }
            $currentDateTime = $this->resource->getDateTime();
            $smsEntry = new SmsEntrie();
            $smsEntry->userId = $_ENV['ACCESS_ID'];
            $smsEntry->date = (!isset($entry->date) || $entry->date == '')
                ? $currentDateTime->format(FULL_DATETIME_FORMAT)
                : $entry->date;
            $smsEntry->content = trim(urldecode($entry->content));
            $smsEntry = $this->contentHelper->processEntry($smsEntry);

            $smsEntry->id = $this->dao->insert($smsEntry);
            \Lpt\Logger::log("New Entry: \t" . $smsEntry->id . "\t" . $smsEntry->date);
            $this->resource->echoOut(json_encode($smsEntry));
            return $response;
        };
    }
    /**
     * @OA\Put(
     *      description="Update Entry",
     *     path="/api/posts/{id}",
     * @OA\Parameter(
     *     in="path",
     *     name="id",
     *     required=true,
     *     description="Entry Id",
     *     ),
     * @OA\RequestBody(
     *         description="Entry content",
     *         required=true,
     * @OA\MediaType(
     *         mediaType="application/json",
     * @OA\Schema(ref="#/components/schemas/SmsEntrie")
     *         )
     *     ),
     * @OA\Response(
     *     response="200",
     *     description="Success",
     * @OA\MediaType(
     *     mediaType="application/json",
     * @OA\Schema(ref="#/components/schemas/SearchResults"),
     *     )
     *     )
     * )
     */
    public function updateEntry()
    {
        return function (Request $request, Response $response, $args) {
            DevHelp::debugMsg('start update ' . __FILE__);

            $entry = json_decode($request->getBody());
            if (!$entry) {
                throw new Exception('Invalid json' . $request->getBody());
            }


            $smsEntry = $this->dao->load($args['id']);
            if($smsEntry["id"] == 0){
                header('HTTP/1.0 404 File Not Found');
                $metaData = new stdClass();
                $metaData->message = "Entry not valid";
                $metaData->status = "fail";

                $this->resource->echoOut(json_encode($metaData));
                die();
            }
            if ($_ENV['ACCESS_ID'] != $smsEntry['user_id']) {
                header('HTTP/1.0 403 Forbidden');
                $metaData = new stdClass();
                $metaData->message = "Unauthorized User";
                $metaData->status = "fail";

                $this->resource->echoOut(json_encode($metaData));
                die();
            }

            $smsEntry['content'] = SmsEntrie::sanitizeContent($entry->content);
            $smsEntry['date'] = $entry->date;
            $this->dao->update($smsEntry);
            $this->resource->echoOut(json_encode($smsEntry));
            return $response;
        };
    }
    /**
     * @OA\Delete(
     *     description="Remove Entry",
     *     path="/api/posts/{id}",
     * @OA\Response(
     *       response="200",
     *       description="Success",
     * @OA\MediaType(
     *           mediaType="application/json",
     * @OA\Schema(ref="#/components/schemas/SearchResults"),
     *         )
     *     )
     * )
     */
    public function deleteEntry()
    {
        return function (Request $request, Response $response, $args) {
            DevHelp::debugMsg('start delete' . __FILE__);
            $smsEntry = $this->dao->load($args['id']);

            if ($_ENV['ACCESS_ID'] != $smsEntry['user_id']) {
                throw new Exception('Invalid User');
            }
            $rows_affected = $this->dao->delete($smsEntry['id']);
            \Lpt\Logger::log("Delete: \t" . $smsEntry['id'] . "\t" . $smsEntry['date']);
            $this->resource->echoOut('{"rows_affected": ' . $rows_affected . '}');
            return $response;
        };
    }
}
