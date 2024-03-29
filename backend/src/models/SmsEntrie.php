<?php

/**
 * Model for ORM Entry
 *
 * PHP version 8
 *
 * @category PHP
 * @package  Miniblog
 * @author   Raymond Lim <rayjlim@yahoo.com>
 * @license  MIT License
 * @link     https://github.com/rayjlim/miniblog/
 */

namespace App\models;

defined('ABSPATH') or exit('No direct script access allowed');

use App\core\DevHelp;

/**
 * @OA\Schema(
 *   schema="SmsEntrie",
 *   type="object",
 * )
 */
class SmsEntrie
{
    /**
     * The entry id
     *
     * @var integer
     * @OA\Property()
     */
    public int $id;
    /**
     * The entry content
     *
     * @var string
     * @OA\Property()
     */
    public string $content;
    /**
     * The entry date
     *
     * @var string
     * @OA\Property()
     */
    public string $date;
    /**
     * The entry creator id
     *
     * @var integer
     * @OA\Property()
     */
    public int $userId;
    /**
     * The locations associated with entry
     *
     * @var string
     * @OA\Property()
     */
    public string $locations;

    public static function sanitizeContent(string $content): string
    {
        $order = ["\r\n", "\n", "\r"];

        // Processes \r\n's first so they aren't converted twice.
        $replace = '<br />';
        return stripslashes(str_replace($order, $replace, $content));
    }

    // formats
    /*
    standard: (no identifiers)
        foo bar baz

    hash tagged (#)
        140.0 #weight comments
        #news
        #sleep 23:00
        #awake 09:23,8.00

        #pushups
            how to handle workout videos; dont count or record total count
        #situps

    */
}
 //close of Class
