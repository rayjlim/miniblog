<?php

namespace controllers;

defined('ABSPATH') or exit('No direct script access allowed');

use \Lpt\DevHelp;
use \models\SmsEntrie;
use \models\ListParams;
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
    // case 1 : no entries on the date
    // case 2 : 1 entry on that date; append to this one
    // case 3 : multi entry on date; append to latest one

    public function addEntry(): object
    {
        return function (Request $request, Response $response): Response {
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

            //check for exisiting by date
            $listObj = new ListParams();
            $listObj->startDate = $smsEntry->date;
            $listObj->endDate = $smsEntry->date;
            $entries = $this->dao->list($listObj);

            // if no entries, dao insert
            if (count($entries)) {
                $found = $entries[count($entries) - 1];
                $smsEntry = new SmsEntrie();
                $smsEntry->id = $found['id'];
                $smsEntry->date = $found['date'];
                $smsEntry->content = $found['content'] . "  \n" . trim(urldecode($entry->content));
                $this->dao->update($smsEntry);
            } else {
                $smsEntry->content = trim(urldecode($entry->content));
                $smsEntry = $this->contentHelper->processEntry($smsEntry);
                $smsEntry->id = $this->dao->insert($smsEntry);
            }

            // else, update last entry in array

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
    public function updateEntry(): object
    {
        return function (Request $request, Response $response, $args): Response {
            DevHelp::debugMsg('start update ' . __FILE__);

            $entry = json_decode($request->getBody());
            if (!$entry) {
                throw new Exception('Invalid json' . $request->getBody());
            }

            $found = $this->dao->load($args['id']);
            if ($found["id"] == 0) {
                header('HTTP/1.0 404 File Not Found');
                $metaData = new stdClass();
                $metaData->message = "Entry not valid";
                $metaData->status = "fail";

                $this->resource->echoOut(json_encode($metaData));
                die();
            }
            if ($_ENV['ACCESS_ID'] != $found['user_id']) {
                header('HTTP/1.0 403 Forbidden');
                $metaData = new stdClass();
                $metaData->message = "Unauthorized User";
                $metaData->status = "fail";

                $this->resource->echoOut(json_encode($metaData));
                die();
            }
            $smsEntry = new SmsEntrie();
            $smsEntry->id = $found['id'];
            $smsEntry->content = SmsEntrie::sanitizeContent($entry->content);
            $smsEntry->date = $entry->date;
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
    public function deleteEntry(): object
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
