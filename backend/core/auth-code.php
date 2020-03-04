<?php
use \Lpt\DevHelp;

DevHelp::debugMsg(__FILE__);

$helper = DAOFactory::SecurityAgent();
$smsUser = $helper->authenticate($_REQUEST, isset($loginPage));

if ($smsUser == null) {
    DevHelp::debugMsg('$smsUser == null');
    $path_parts = pathinfo($_SERVER["SCRIPT_NAME"]);
    $redirectUrl = '/' . ROOT_URL . "/login.php";
    if (isset($_REQUEST['cmd'])) {
        $redirectUrl.= "?target=" . $_REQUEST['cmd'];
    }

    DevHelp::redirectHelper($redirectUrl);
}
$userId = $smsUser->id;

DevHelp::debugMsg('$userId' . $userId);
