<?php
use DI\Container;

class CUDHandlerTest extends \App\Tests\TestCase
{
  // $resourceMock = $this->createMock('App\dao\Resource');
  // $creator->expects($this->once())->method('makeResource')->willReturn($resourceMock);

  function test_update_basic_path()
  {
    $app = $this->getAppInstance();
    /** @var Container $container */
    $container = $app->getContainer();
    $container->set('Objfactory', function () {
      $dbRef = $this->createMock('App\mysql\SmsEntriesRedbeanDAO');
      $creator = $this->createMock('App\helpers\DependFactory');
      $creator->expects($this->once())->method('makeSmsEntriesDAO')->willReturn($dbRef);
      $dbRef->expects($this->once())->method('load')->with(1)
        ->willReturn(array('id' => "1", "user_id" => "1", "date" => "2023-11-21"));
      $dbRef->expects($this->once())->method('update');  // TODO: test inputs?
      return $creator;
    });

    $request = $this->createRequest('PUT', '/api/posts/1', ['name' => 'Sally']);
    $request->getBody()->write(json_encode([
      'id' => '1',
      'content' => 'content',
      'date' => '2023-11-22',
      'user_id' => 2
    ]));
    $response = $app->handle($request);
    $payload = (string) $response->getBody();
    $this->assertEquals(json_encode([
      'id' => 1,
      'content' => 'content',
      'date' => '2023-11-22',
    ]), $payload);

  }

  function test_update_no_request_body()
  {
    $app = $this->getAppInstance();
    /** @var Container $container */
    $container = $app->getContainer();
    $container->set('Objfactory', function () {
      $dbRef = $this->createMock('App\mysql\SmsEntriesRedbeanDAO');
      $creator = $this->createMock('App\helpers\DependFactory');
      $creator->expects($this->once())->method('makeSmsEntriesDAO')->willReturn($dbRef);
      return $creator;
    });

    $request = $this->createRequest('PUT', '/api/posts/1', ['name' => 'Sally']);
    try {
      $app->handle($request);
    } catch (Exception $e) {
      $this->assertEquals('Invalid json', $e->getMessage());
    }
  }

  function test_update_invalid_user()
  {
    $app = $this->getAppInstance();
    /** @var Container $container */
    $container = $app->getContainer();
    $container->set('Objfactory', function () {
      $dbRef = $this->createMock('App\mysql\SmsEntriesRedbeanDAO');
      $dbRef->expects($this->once())->method('load')->with(1)
        ->willReturn(array('id' => "1", "user_id" => "2", "date" => "2023-11-21"));

      $creator = $this->createMock('App\helpers\DependFactory');
      $creator->expects($this->once())->method('makeSmsEntriesDAO')->willReturn($dbRef);
      return $creator;
    });

    $request = $this->createRequest('PUT', '/api/posts/1', ['name' => 'Sally']);
    $request->getBody()->write(json_encode([
      'id' => '1',
      'content' => 'content',
      'date' => '2023-11-22',
      'user_id' => 2
    ]));
    $response = $app->handle($request);

    $payload = (string) $response->getBody();
    $this->assertEquals('{"message":"Unauthorized User","status":"fail"}', $payload);
  }

  function test_delete_basic()
  {
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
    $this->assertEquals('{"rowsAffected":1}', $payload);
  }
}
