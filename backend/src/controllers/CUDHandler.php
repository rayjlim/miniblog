<?php

namespace App\controllers;

defined('ABSPATH') or exit('No direct script access allowed');

use Psr\Container\ContainerInterface;

use App\core\DevHelp;
use App\models\SmsEntrie;
use App\models\ListParams;
use App\core\Logger;

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

    private $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
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

    public function addEntry(Request $request, Response $response): Response
    {
        $factory = $this->container->get('Objfactory');
        $this->dao = $factory->makeSmsEntriesDAO();
        $this->resource = $factory->makeResource();

        DevHelp::debugMsg('start add' . __FILE__);

        $entry = json_decode($request->getBody());
        if (!$entry) {
            throw new Exception('Invalid json' . $request->getBody());
        }
        $now = $this->resource->getDateTime();
        $targetDate = (!isset($entry->date) || $entry->date == '')
            ? $now->format(FULL_DATETIME_FORMAT)
            : $entry->date;

        //check for exisiting by date
        $listObj = new ListParams();
        $listObj->startDate = $targetDate;
        $listObj->endDate = $targetDate;
        $entries = $this->dao->list($listObj);

        // if no entries, dao insert
        // else, update last entry in array
        if (count($entries)) {
            $found = $entries[count($entries) - 1];
            $found->content = $found['content'] . "\n\n"
                . trim(urldecode($entry->content));
            $found->content = SmsEntrie::sanitizeContent($found->content);
            //TODO: join new entry to existing, need to look for duplicates
            // $found->locations = $entry->locations;
            $this->dao->update($found);
            $response->getBody()->write(json_encode($found));
        } else {
            $newEntry = new SmsEntrie();
            $newEntry->date = $targetDate;
            $newEntry->content = trim(urldecode($entry->content));
            $newEntry->content = SmsEntrie::sanitizeContent($newEntry->content);
            $newEntry->userId = $_ENV['ACCESS_ID'];
            $newEntry->locations = $entry->locations;
            $newEntry->id = $this->dao->insert($newEntry);
            $response->getBody()->write(json_encode($newEntry));
        }

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
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
    public function updateEntry(Request $request, Response $response, $args): Response
    {
        $factory = $this->container->get('Objfactory');
        $this->dao = $factory->makeSmsEntriesDAO();

        DevHelp::debugMsg('start update ' . __FILE__);

        $entry = json_decode($request->getBody());
        if (!$entry) {
            throw new Exception('Invalid json' . $request->getBody());
        }

        $found = $this->dao->load($args['id']);
        if ($found['user_id'] !== $_ENV['ACCESS_ID']) {
            $metaData = new stdClass();
            $metaData->message = "Unauthorized User";
            $metaData->status = "fail";

            $response->getBody()->write(json_encode($metaData));
            return $response
                ->withStatus(403);
        }

        $found->id = $found['id'];
        $found->content = SmsEntrie::sanitizeContent($entry->content);
        $found->locations = $entry->locations;
        $this->dao->update($found);

        $response->getBody()->write(json_encode($found));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
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
    public function deleteEntry(Request $request, Response $response, $args): object
    {
        $factory = $this->container->get('Objfactory');
        $this->dao = $factory->makeSmsEntriesDAO();

        DevHelp::debugMsg('start delete' . __FILE__);
        $smsEntry = $this->dao->load($args['id']);

        if ($_ENV['ACCESS_ID'] != $smsEntry['user_id']) {
            $metaData = new stdClass();
            $metaData->message = "Entry not valid";
            $metaData->status = "fail";

            $response->getBody()->write(json_encode($metaData));
            return $response
                ->withStatus(403);
        }

        $rows_affected = $this->dao->delete($smsEntry['id']);
        Logger::log("Delete: \t" . $smsEntry['id'] . "\t" . $smsEntry['date']);

        $metaData = new stdClass();
        $metaData->rowsAffected = $rows_affected;

        $response->getBody()->write(json_encode($metaData));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
