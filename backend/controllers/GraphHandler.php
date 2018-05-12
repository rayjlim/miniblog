<?php
use \Lpt\DevHelp;

class GraphHandler extends AbstractController
{
  var $dao = null;
  var $graphHelper = null;
  var $resource = null;
  
  function __construct($app, $_smsEntriesDAO, $resource, $graphHelper) {
    $this->dao = $_smsEntriesDAO;
    $this->graphHelper = $graphHelper;
    $this->resource = $resource;
    
    parent::__construct($app);
  }

  function handleCore($req){
          DevHelp::debugMsg(__FILE__);
      $params = new GraphParams();
      $params = $params->loadParams($req->params(), $this->resource->getDateTime());
      
      $sqlParam = '';
      if ($params->startDate != '') {
          $sqlParam.= ' and date > \'' . $params->startDate . '\'';
      }
      if ($params->endDate != '') {
          $sqlParam.= ' and date <= \'' . $params->endDate . '\'';
      }
      
      $entries = $this->dao->queryGraphData($this->resource->getSession(SESSION_USER_ID), $params);
      return $this->graphHelper->calculateFields($params, $entries);
  }

  public function handle() {
    return function () {
      $data = $this->handleCore($this->app->request());
      $this->app->view()->appendData(["data" => $data]);
      $this->app->render('tag_track.twig');
    };
  }

  public function handleApi() {
    return function () {
      $data = $this->handleCore($this->app->request());
      $this->app->response()->header('Content-Type', 'application/json');

      $entryString = json_encode(array_values($data['entries']));
      $data['entries'] = null;
      $this->resource->echoOut('{"metrics": ' . json_encode($data) . 
        ', "entrys": ' . $entryString .
        '}');
    };
  }


  public function logCronCall($message) {
    return function () use ($message) {
    $date = $this->resource->getDateTime();
    $filename = LOGS_DIR . DIR_SEP . LOG_PREFIX . "_logins-" . $date->format("Y-m") . ".txt";
    $fileData = $date->format("Y-m-d G:i:s") . "\t" . getenv("REMOTE_ADDR") . "\t";
    $fileData.= $message . "\n";
    $this->resource->writeFile($filename, $fileData);
    
    $userId = $this->resource->getSession(SESSION_USER_ID);
    $targetDay = $date;
    
    $entries = $this->dao->getSameDayEntries($userId, $targetDay);
    
    $nonWeightEntrys = array_filter($entries, "nonWeightEntrys");
    $weightEntrys = array_filter($entries, "weightEntrys");

    $printedNonWeight = array_reduce($nonWeightEntrys, "printEntrys");
    $printedWeight = array_reduce($weightEntrys, "printEntrys");

    $message = $printedNonWeight."\n".$printedWeight;

    $subject = "On this day ". $targetDay->format('M d'); 
    $to = 'rayjlim1@gmail.com';
    
    $headers = 'From: smsblog@lilplaytime.com' . "\r\n" . 'Reply-To: rayjlim1@gmail.com' . "\r\n" . 
      'X-Mailer: PHP/' . phpversion();
    mail($to, $subject, $message, $headers);
    echo "{ \"cron\":\"email\"}";
    };
  }
      
  public function aggregate(){
    return function () {
      DevHelp::debugMsg(__FILE__);
      $params = new GraphParams();
      $params = $params->loadParams($this->app->request()->params(), $this->resource->getDateTime());
      $params->resultLimit = 5000;
      $entries = $this->dao->queryGraphData($this->resource->getSession(SESSION_USER_ID), $params);
      
      $entries = array_map("weightSubstr", $entries);
      $entries = array_reduce($entries, "groupByYearMonth");
      $final = [];
      foreach($entries as $key=>$value){
        $average = array_sum($value) / count($value);
        $final[$key] = number_format($average, 1);
      }
      $this->app->response()->header('Content-Type', 'application/json');
      $this->resource->echoOut('{"averages": ' . json_encode($final) . '}');
    };
  }
}


function nonWeightEntrys($item){
  return stripos($item['content'], '#weight') == false;
}

function weightEntrys($item){
  return stripos($item['content'], '#weight') !== false;
}

function printEntrys($carry, $item){
  $entryDay = new DateTime($item['date']);
  $message =  $entryDay->format('Y-D') . ': ' . $item['content'] . "\n";
  return $carry.=$message;
}

function groupByYearMonth($carry, $item){
  $year = substr($item['date'], 0,4);
  $month = substr($item['date'], 5, 2);
  if(!isset($carry[$year.'-'.$month])){$carry[$year.'-'.$month] = [];}
  array_push($carry[$year.'-'.$month], $item['weight']);
  return $carry;
}

function weightSubstr($x){
  $x['weight'] = substr($x['content'], 0, 5);
  unset($x['content']);
  unset($x['user_id']);
  unset($x['id']);
  return $x;
}
