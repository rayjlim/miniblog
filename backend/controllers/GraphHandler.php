<?php
use \Lpt\DevHelp;

function printEntrys($carry, $item){
  $entryDay = new DateTime($item['date']);
  $message =  "<li>". $entryDay->format('Y-D') . ': ' . $item['content'] . "</li>";
  return $carry.=$message;
}

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

    $printedNonWeight = array_reduce($entries, "printEntrys");
 
    $message = "<HTML><BODY><ul>" . $printedNonWeight . "</ul></BODY></HTML>";

    $subject = "On this day ". $targetDay->format('M d'); 
    $to = MY_EMAIL;
    
    $headers = "From: smsblog@lilplaytime.com\r\n";
    $headers .= "Reply-To: ". MY_EMAIL . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
    echo $message;
    mail($to, $subject, $message, $headers);
    echo "{ \"cron\":\"email\"}";
    };
  }
      

  

  function groupByYearMonth($carry, $item){
    $year = substr($item['date'], 0,4);
    $month = substr($item['date'], 5, 2);
    if(!isset($carry[$year.'-'.$month])){$carry[$year.'-'.$month] = [];}
    array_push($carry[$year.'-'.$month], $item['weight']);
    return $carry;
  }

}