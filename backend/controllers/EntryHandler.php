<?php
use \Lpt\DevHelp;

class EntryHandler extends AbstractController
{
  var $dao = null;
  var $resource = null;
  function __construct($app, $_smsEntriesDAO, $_resource) {
    $this->dao = $_smsEntriesDAO;
    $this->resource = $_resource;
    parent::__construct($app);
  }
    
  function showMain() {
    return function () {
      $userId = $this->resource->getSession(SESSION_USER_ID);
      DevHelp::debugMsg('start ' . __FILE__);
      
      // TODO: secure this by checking the user session id
      $entries = $this->dao->getYearMonths($userId);
      DevHelp::debugMsg('start ' . implode("|",$entries));
      $this->app->view()->appendData(["yearmonth" => $entries]);
      $this->app->render('main.twig');
    };
  } 

  function listItemsApi() {
    return function () {
      $request = $this->app->request();
      $requestParams = $request->params();
      $listObj = new ListParams();
      $listParams = $listObj->loadParams($requestParams);
      $userId = $this->resource->getSession(SESSION_USER_ID);
      $entries = $this->dao->queryBlogList($userId, $listParams);
      $this->app->response()->header('Content-Type', 'application/json');
      $this->resource->echoOut('{"entries": ' . json_encode($entries) . '}');
    };
  }
    
  function listItems() {
    return function ()  {
      DevHelp::debugMsg(__file__);
      $request = $this->app->request();
      if (getValue($request->params(), 'view') == 'mobile') {
        $this->app->render('mobile.twig');
        return;
      }
      $userId = $this->resource->getSession(SESSION_USER_ID);
      
      $currentDate = $this->resource->getDateTime();
      $listObj = new ListParams();
      $listParams = $listObj->loadParams($request->params());
      $listParams->endDate = $currentDate->format('Y-m-d');
      
      if (getValue($request->params(), 'view') == 'timeline') {
        $listParams->resultsLimit = 50;
        $this->app->view()->appendData(["searchParam" => trim($listParams->searchParam)]);
      }
      
      $this->setTemplateVariables($listParams, $currentDate);
      
      $templateName = (getValue($request->params(), 'view') == 'timeline') ? 
        "blog_list_text.twig" : "blog_list.twig";
      
     $this->app->render($templateName);
    };
  }
    
  function sameDayEntries() {
    return function () {
      DevHelp::debugMsg(__file__);
      
      // $request = $this->app->request();
      // $requestParams = $request->params();
      // $listObj = new ListParams();
      // $listParams = $listObj->loadParams($requestParams);
      
      $userId = $this->resource->getSession(SESSION_USER_ID);
      $currentDate = $this->resource->getDateTime();
      $request = $this->app->request();
      $requestParams = $request->params();
      $targetDay = getValue($requestParams, 'day') != '' ? DateTime::createFromFormat('Y-m-d', getValue($requestParams, 'day')) : $currentDate;
      
      $entries = $this->dao->getSameDayEntries($userId, $targetDay);
      $this->app->response()->header('Content-Type', 'application/json');
      $this->resource->echoOut('{"entries": ' . json_encode($entries) . '}');
    };
  }

    
  function itemDetailsApi() {
    return function ($id) {
      DevHelp::debugMsg('start ' . __FILE__);
      
      // TODO: secure this by checking the user session id
      $entry = $this->dao->load($id);
      $this->app->response()->header('Content-Type', 'application/json');
      $this->resource->echoOut('{"entry": ' . json_encode($entry) . '}');
    };
  }

  function yearMonthsApi() {
    return function () {
      $userId = $this->resource->getSession(SESSION_USER_ID);
      DevHelp::debugMsg('start ' . __FILE__);
      
      // TODO: secure this by checking the user session id
      $entry = $this->dao->getYearMonths($userId);
      $this->app->response()->header('Content-Type', 'application/json');
      $this->resource->echoOut('{"data": ' . json_encode($entry) . '}');
    };
  }  

  function setTemplateVariables($listParams, $currentDate) {
    $showCalendarMonth = isset($listParams->gotoYearMonth) ? $listParams->gotoYearMonth :
         $currentDate;
    
    $this->app->view()->appendData(["showDate" => $showCalendarMonth]);
    $this->app->view()->appendData(["CALENDAR_SUMMARY_LENGTH" => CALENDAR_SUMMARY_LENGTH]);
    $this->app->view()->appendData(["CALENDAR_UNTAGGED_SUMMARY_LENGTH" => 
      CALENDAR_UNTAGGED_SUMMARY_LENGTH]);
    $this->app->view()->appendData(["listParams" => $listParams]);
  }

   function pebbleInfo() {
    return function () {
      $userId = $this->resource->getSession(SESSION_USER_ID);
      
      $date = $this->resource->getDateTime();

      $data = $date->format("m/d") .' '. $date->format("l") .'
';
       $currentDate = $this->resource->getDateTime();

      $weight = $this->dao->getWeightAYearAgo($userId, $date);
      $data .= '1 yr #:'.$weight.'
';

      $weightWeekResult = $this->dao->getWeightAYearAgoAverage($userId, $date);

      $weightWeekArray = array();
      foreach ($weightWeekResult as $entry){
          array_push($weightWeekArray,substr($entry['content'],0,5));
      }

      $weekAverage =  substr(array_sum($weightWeekArray) / count($weightWeekArray),0,5);
      $data .= 'wk avg:'.$weekAverage;

      $graphParams = new GraphParams();
      $graphParams->label = "#weight";
      $graphParams->resultLimit = "7";
      $graphParams->sampleSize = "1";
      $graphParams->weightFactor = ".7";
      $graphParams->startDate = null;
      $graphParams->endDate = $currentDate->format('Y-m-d');
      $posts = $this->dao->queryGraphData($userId, $graphParams);
      
      $result =new stdClass();
      $result->content = $data;
      $result->data = $posts;
      echo json_encode($result);
    };
  }
}
