<?php

use \controllers\CUDHandler;
// use \dao\SmsEntriesRedbeanDAO;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ManageMovieHelperTest extends \PHPUnit\Framework\TestCase
{
  function test_CUDHandler_delete_basic()
  {
    $dbRef = $this->createMock('\dao\SmsEntriesRedbeanDAO');

    $_rowsAffected = 1;
    $dbRef->expects($this->once())->method('load')->with(1)
      ->willReturn(array('id' => "1", "user_id" => "1", "date" => "2023-11-21"));
    $dbRef->expects($this->once())->method('delete')->with(1)
      ->willReturn($_rowsAffected);
    $iResource = $this->createMock('\dao\Resource');
    $content = $this->createMock('\helpers\ContentHelper');

    $handler =  new CUDHandler(
      $dbRef,
      $iResource,
      $content
    );

    $caller = $handler->deleteEntry();
    $request =  $this->createMock('Psr\Http\Message\ServerRequestInterface');
    $response = $this->createMock('Psr\Http\Message\ResponseInterface');
    $args = ['id' => 1];
    $caller($request, $response, $args);
  }
}
