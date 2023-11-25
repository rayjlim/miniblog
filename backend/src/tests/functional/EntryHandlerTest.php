<?php

namespace App\tests\functional;

use DI\Container;
use App\tests\functional\TestCase;

class EntryHandlerTest extends TestCase
{


  function test_list()
  {
    $app = $this->getAppInstance();
    /** @var Container $container */
    $container = $app->getContainer();

    $container->set('Objfactory', function () {
      $creator = $this->createMock('App\helpers\DependFactory');

      $resourceRef = $this->createMock('App\dao\Resource');
      $resourceRef->expects($this->once())->method('getDateByDescription')->willReturn(date(
      'Y-m-d', 111111111));
      $creator->expects($this->once())->method('makeResource')->willReturn($resourceRef);

      $dbRef = $this->createMock('App\mysql\SmsEntriesRedbeanDAO');
      $creator->expects($this->once())->method('makeSmsEntriesDAO')->willReturn($dbRef);
      $listObj = new \App\models\ListParams();
      $listObj->userId = 1;
      $listObj->startDate = '1973-07-09';
      $listObj->monthsBackToShow = 0;
      $mockFoundEntries = [
        array('id' => "1", "user_id" => "1", "date" => "2023-11-21", "content" => "day 1"),
        array('id' => "2", "user_id" => "1", "date" => "2023-11-22", "content" => "day 2"),
        array('id' => "3", "user_id" => "1", "date" => "2023-11-23", "content" => "day 3"),
      ];
      $dbRef->expects($this->once())->method('list')->with($listObj)

        ->willReturn($mockFoundEntries);
      return $creator;
    });

  //   $params = [
  //     'date' => '2023-11-23',
  // ];

  // $url = sprintf('/api/posts/?%s', http_build_query($params));

    $request = $this->createRequest('GET','/api/posts/');

    $response = $app->handle($request);
    $payload = (string) $response->getBody();
    $mockFoundEntries = json_decode(json_encode([
      array('id' => "1", "user_id" => "1", "date" => "2023-11-21", "content" => "day 1"),
      array('id' => "2", "user_id" => "1", "date" => "2023-11-22", "content" => "day 2"),
      array('id' => "3", "user_id" => "1", "date" => "2023-11-23", "content" => "day 3"),
    ]));

    $expectedParams = '{"userId":1,"searchParam":"","tags":[],"startDate":"1973-07-09","endDate":"","filterType":0,"resultsLimit":100,"monthsBackToShow":0,"excludeTags":""}';
    $this->assertEquals($mockFoundEntries, json_decode($payload)->entries);
    $this->assertEquals($expectedParams, json_encode(json_decode($payload)->params));
  }
}

