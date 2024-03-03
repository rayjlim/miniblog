<?php

namespace App\tests\functional;

use DI\Container;
use App\tests\functional\TestCase;

class UploadHandlerTest extends TestCase
{
  /**
   * @return never
   */
  function test_upload_too_large()
  {
    // TODO: test image too large
    $this->markTestSkipped('Need to write test.');
  }

  /**
   * @return never
   */
  function test_file_exists()
  {
    // TODO: write test
    $this->markTestSkipped('Need to write test.');
  }
  /**
   * @return never
   */
  function test_invalid_file_extension()
  {
    // TODO: write test
    $this->markTestSkipped('Need to write test.');
  }
}
