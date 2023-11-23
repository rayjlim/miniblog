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
        // else, update last entry in array
        if (count($entries)) {
            $found = $entries[count($entries) - 1];
            $smsEntry = new SmsEntrie();
            $smsEntry->id = $found['id'];
            $smsEntry->date = $found['date'];
            $smsEntry->content = $found['content'] . "  \n" . trim(urldecode($entry->content));
            $smsEntry->content = SmsEntrie::sanitizeContent($smsEntry->content);
            $this->dao->update($smsEntry);
        } else {
            $smsEntry->content = trim(urldecode($entry->content));
            $smsEntry->content = SmsEntrie::sanitizeContent($smsEntry->content);
            $smsEntry->id = $this->dao->insert($smsEntry);
        }

        $response->getBody()->write(json_encode($smsEntry));
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
        $this->resource = $factory->makeResource();
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

            $response->getBody()->write(json_encode($metaData));
            return $response
                ->withStatus(403);
        }
        if ($found['user_id'] !== $_ENV['ACCESS_ID']) {

            $metaData = new stdClass();
            $metaData->message = "Unauthorized User";
            $metaData->status = "fail";

            $response->getBody()->write(json_encode($metaData));
            return $response
                ->withStatus(403);
        }
        $smsEntry = new SmsEntrie();
        $smsEntry->id = $found['id'];
        $smsEntry->content = SmsEntrie::sanitizeContent($entry->content);
        $smsEntry->date = $entry->date;
        $this->dao->update($smsEntry);

        $response->getBody()->write(json_encode($smsEntry));
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
            throw new Exception('Invalid User');
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
