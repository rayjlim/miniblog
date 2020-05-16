<?php

if (isset($_SESSION['page_message'])) {
    $app->view()->appendData(["page_message"=> $_SESSION['page_message']]);
    $_SESSION['page_message'] = null;
}
