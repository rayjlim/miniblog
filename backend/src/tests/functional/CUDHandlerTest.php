<?php

use App\controllers\CUDHandler;
use App\dao\SmsEntriesRedbeanDao;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use GuzzleHttp\Psr7\Stream;

class CUDHandlerTest extends \App\Tests\TestCase
{

  // function test_CUDHandler_update_invalid_user()
  // {
  //   $dbRef = $this->createMock('App\mysql\SmsEntriesRedbeanDAO');

  //       $dbRef->expects($this->once())->method('load')->with(1)
  //     ->willReturn(array('id' => "1", "user_id" => "2", "date" => "2023-11-21"));
  //   $iResource = $this->createMock('App\dao\Resource')->expects($this->once());
  //   //    ->expects($this->once())
  //   // ->method('echoOut')->with('Unauthorized User');


  //   $handler =  new CUDHandler(
  //     $dbRef,
  //     $iResource,
  //     $content
  //   );

  //   $caller = $handler->updateEntry();
  //   $yourString = "{}";
  //   $request =  $this->createMock('Psr\Http\Message\ServerRequestInterface')->method('getBody')->willReturn(new Stream(fopen('data://text/plain,' . $yourString,'r')));
  //   $response = $this->createMock('Psr\Http\Message\ResponseInterface');
  //   $args = ['id' => 1];
  //   $caller($request, $response, $args);

  // }

  function test_CUDHandler_delete_basic()
  {
    // $dbRef = $this->createMock('App\mysql\SmsEntriesRedbeanDAO');

    // $_rowsAffected = 1;
    // $dbRef->expects($this->once())->method('load')->with(1)
    //   ->willReturn(array('id' => "1", "user_id" => "1", "date" => "2023-11-21"));
    // $dbRef->expects($this->once())->method('delete')->with(1)
    //   ->willReturn($_rowsAffected);
    // $iResource = $this->createMock('App\dao\Resource');


    // $handler =  new CUDHandler(
    //   $dbRef,
    //   $iResource,
    //   $content
    // );

    // $request =  $this->createMock('Psr\Http\Message\ServerRequestInterface');
    // $writeMock = $this->createMock()->method('write')->with(1);
    // $response = $this->createMock('Psr\Http\Message\ResponseInterface')->method('getBody')->willReturn($writeMock);
    // $args = ['id' => 1];
    // $caller = $handler->deleteEntry($request,  $response, $args);

    $app = $this->getAppInstance();

    /** @var Container $container */
    $container = $app->getContainer();

    $container->set('Objfactory', function () {
      $dbRef = $this->createMock('App\mysql\SmsEntriesRedbeanDAO');
      $_rowsAffected = 1;
      $dbRef->expects($this->once())->method('load')->with(1)
        ->willReturn(array('id' => "1", "user_id" => "1", "date" => "2023-11-21"));
      $dbRef->expects($this->once())->method('delete')->with(1)
        ->willReturn($_rowsAffected);

      $creator = $this->createMock('App\helpers\DependFactory');
      $creator->expects($this->once())->method('makeSmsEntriesDAO')->willReturn($dbRef);
      return $creator;
    });

    $request = $this->createRequest('DELETE', '/api/posts/1');
    $response = $app->handle($request);

    $payload = (string) $response->getBody();
    // $expectedPayload = new ActionPayload(200, [$user]);
    // $serializedPayload = json_encode($payload, JSON_PRETTY_PRINT);
    // $serializedPayload = json_encode($payload);

    $this->assertEquals('{"rowsAffected":1}', $payload);
  }
}
