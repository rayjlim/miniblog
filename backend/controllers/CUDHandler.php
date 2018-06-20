<?php
use \Lpt\DevHelp;

/**
 *   This class will handle the Create, Update, Delete Functionality
 *   for the Entrys
 */
class CUDHandler extends AbstractController
{
    
    var $dao = null;
    var $resource = null;
    var $contentHelper = null;
    function __construct($app, $smsEntriesDAO, $resource, $contentHelper) {
        $this->resource = $resource;
        $this->dao = $smsEntriesDAO;
        $this->contentHelper = $contentHelper;
        parent::__construct($app);
    }
    
    function addEntry() {
        return function () {
            DevHelp::debugMsg('start add' . __FILE__);
            $request = $this->app->request();
            $body = $request->getBody();
            $entry = json_decode($request->getBody());
            if (!$entry) {
                if (strpos($body, '23s')) {
                    $entry =  new stdClass();
                    $entry->content = '#s';
                } 
                else {
                    throw new Exception('Invalid json' . $request->getBody());
                }
            }
            $currentDateTime = $this->resource->getDateTime();
            $smsEntry = new SmsEntrie();
            $smsEntry->userId = $this->resource->getSession(SESSION_USER_ID);
            $smsEntry->date = (!isset($entry->date) || $entry->date == '') ? $currentDateTime->format('Y-m-d G:i:s') : $entry->date;
            $smsEntry->content = trim(urldecode($entry->content));
            $smsEntry = $this->contentHelper->processEntry($smsEntry);
            
            $smsEntry->id = $this->dao->insert($smsEntry);
            $this->resource->echoOut(json_encode($smsEntry));
        };
    }
    
    function updateEntry() {
        return function ($id) {
            DevHelp::debugMsg('start update' . __FILE__);
            
            $request = $this->app->request();
            $entry = json_decode($request->getBody());
            if (!$entry) {
                throw new Exception('Invalid json' . $request->getBody());
            }
            $smsEntry = $this->dao->load($id);
            
            $temp = $smsEntry['user_id'];
            if ($this->resource->getSession(SESSION_USER_ID) != $temp) {
                throw new Exception('Invalid User');
            }
            
            $smsEntry['content'] = SmsEntrie::sanitizeContent($entry->content);
            $smsEntry['date'] = $entry->date;
            $this->dao->update($smsEntry);
            $this->resource->echoOut(json_encode($smsEntry));
        };
    }
    
    function deleteEntry() {
        return function ($id) {
            DevHelp::debugMsg('start delete' . __FILE__);
            $smsEntry = $this->dao->load($id);
            
            if ($this->resource->getSession(SESSION_USER_ID) != $smsEntry['user_id']) {
                throw new Exception('Invalid User');
            }
            $rows_affected = $this->dao->delete($smsEntry['id']);
            $this->resource->echoOut('{"rows_affected": ' . $rows_affected . '}');
        };
    }
}
