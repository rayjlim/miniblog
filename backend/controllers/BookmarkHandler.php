<?php
use \Lpt\DevHelp;

class BookmarkHandler extends AbstractController
{
    public $dao = null;
    public $resource = null;

    public function __construct($app, $_bookmarkDAO, $resource)
    {
        $this->dao = $_bookmarkDAO;
        $this->resource = $resource;

        parent::__construct($app);
    }

    public function handleCore($req)
    {
        DevHelp::debugMsg(__FILE__);
        $BookmarkParams = new BookmarkParams();
        $params = $BookmarkParams->loadParams($req->params());
        $entries = $this->dao->queryGraphData($params);
        return $entries;
    }

    public function render()
    {
        return function () {
            $entries = $this->dao->getPaths();
            $this->app->view()->appendData(["paths" => $entries]);
            $this->app->render('bookmarks.twig');
        };
    }

    public function apiPath()
    {
        return function () {
            $data = $this->handleCore($this->app->request());
            $this->app->response()->header('Content-Type', 'application/json');

            $entryString = json_encode(array_values($data));
            $this->resource->echoOut('{ "entrys": ' . $entryString . '}');
        };
    }
}
