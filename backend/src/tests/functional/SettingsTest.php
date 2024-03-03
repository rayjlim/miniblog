<?php

namespace App\tests\functional;

use App\tests\functional\TestCase;

class SettingTest extends TestCase
{
  // $resourceMock = $this->createMock('App\dao\Resource');
  // $creator->expects($this->once())->method('makeResource')->willReturn($resourceMock);

  function test_basic_path(): void
  {

    $app = $this->getAppInstance();
    $request = $this->createRequest('GET', '/settings/');
    $response = $app->handle($request);
    $payload = (string) $response->getBody();
    $this->assertEquals(json_encode([
      'UPLOAD_ROOT' => '',
      'GOOGLE_OAUTH_CLIENTID' => '',
      'GOOGLE_API_KEY' => '',
      'INSPIRATION_API' => '',
      'QUESTION_API' => '',

      'TRACKS_API' => '',
      'MOVIES_API' => '',
      'MOVIES_POSTERS' => '',

      'SHOW_GH_CORNER' => false,
      'UPLOAD_SIZE_LIMIT' => UPLOAD_SIZE_LIMIT,
    ]), $payload);

  }
}
