<?php

namespace App\tests\functional;

use DI\Container;
use App\tests\functional\TestCase;

class EntryHandlerTest extends TestCase
{
  function test_list_one_day()
  {
    $app = $this->getAppInstance();
    /** @var Container $container */
    $container = $app->getContainer();

    $container->set('Objfactory', function () {
      $creator = $this->createMock('App\helpers\DependFactory');

      $resourceRef = $this->createMock('App\dao\Resource');
      $creator->expects($this->once())->method('makeResource')->willReturn($resourceRef);

      $dbRef = $this->createMock('App\mysql\SmsEntriesRedbeanDAO');
      $creator->expects($this->once())->method('makeSmsEntriesDAO')->willReturn($dbRef);
      $listObj = new \App\models\ListParams();
      $listObj->userId = 1;
      $listObj->startDate = '2023-11-23';
      $listObj->endDate = '2023-11-23';

      $mockFoundEntries = [
        array('id' => "3", "user_id" => "1", "date" => "2023-11-23", "content" => "day 23"),
      ];
      $dbRef->expects($this->once())->method('list')->with($listObj)

        ->willReturn($mockFoundEntries);
      return $creator;
    });

    $params = [
      'date' => '2023-11-23'
    ];
    $request = $this->createRequest('GET', '/api/posts/')->withQueryParams($params);

    $response = $app->handle($request);
    $payload = (string) $response->getBody();
    $mockFoundEntries = json_decode(json_encode([
      array('id' => "3", "user_id" => "1", "date" => "2023-11-23", "content" => "day 23"),
    ]));

    $expectedParams = '{"userId":1,"searchParam":"","tags":[],"startDate":"2023-11-23","endDate":"2023-11-23","filterType":0,"resultsLimit":100,"excludeTags":"","location":""}';
    $this->assertEquals($mockFoundEntries, json_decode($payload)->entries);
    $this->assertEquals($expectedParams, json_encode(json_decode($payload)->params));
  }

  // TODO: test for no start date and no search param
  function test_list_default_search()
  {
    $app = $this->getAppInstance();
    /** @var Container $container */
    $container = $app->getContainer();

    $container->set('Objfactory', function () {
      $creator = $this->createMock('App\helpers\DependFactory');

      $resourceRef = $this->createMock('App\dao\Resource');
      $resourceRef->expects($this->once())->method('getDateByDescription')->willReturn(date(
        'Y-m-d',
        strtotime('2023-08-23')
      ));
      $creator->expects($this->once())->method('makeResource')->willReturn($resourceRef);

      $dbRef = $this->createMock('App\mysql\SmsEntriesRedbeanDAO');
      $creator->expects($this->once())->method('makeSmsEntriesDAO')->willReturn($dbRef);
      $listObj = new \App\models\ListParams();
      $listObj->userId = 1;
      $listObj->startDate = '2023-08-23';
      $listObj->endDate = '';

      $mockFoundEntries = [
        array('id' => "3", "user_id" => "1", "date" => "2023-08-23", "content" => "day 23"),
      ];
      $dbRef->expects($this->once())->method('list')->with($listObj)

        ->willReturn($mockFoundEntries);
      return $creator;
    });

    $request = $this->createRequest('GET', '/api/posts/');

    $response = $app->handle($request);
    $payload = (string) $response->getBody();

    $mockFoundEntries = json_decode(json_encode([
      array('id' => "3", "user_id" => "1", "date" => "2023-08-23", "content" => "day 23"),
    ]));
    $this->assertEquals($mockFoundEntries, json_decode($payload)->entries);

    $expectedParams = '{"userId":1,"searchParam":"","tags":[],"startDate":"2023-08-23","endDate":"","filterType":0,"resultsLimit":100,"excludeTags":"","location":""}';
    $this->assertEquals($expectedParams, json_encode(json_decode($payload)->params));
  }

  function test_sameday_has_param()
  {
    // TODO: test for same day - has day param
    $this->markTestSkipped('Need to write test.');
  }
  // TODO: test for same day - has no day param
  function test_sameday_has_no_param()
  {
    $this->markTestSkipped('Need to write test.');
  }
}
