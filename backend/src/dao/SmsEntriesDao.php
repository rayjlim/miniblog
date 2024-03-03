<?php
namespace App\dao;

defined('ABSPATH') or exit('No direct script access allowed');

use App\models\SmsEntrie;
use App\models\ListParams;

interface SmsEntriesDao
{
    /**
     * Get Domain object by primry key
     *
     * @param int $id primary key
     *
     * @return array[SmsEntries]
     */
    public function load(int $id): array;

    /**
     * Delete record from table
     *
     * @param int Id of smsEntrie
     */
    public function delete(int $id): int;

    /**
     * Insert record to table
     *
     * @param SmsEntrie Data for insertion
     * @return int Id of new entry
     */
    public function insert(SmsEntrie $smsEntrie): int;

    /**
     * Update record in table
     *
     * @param SmsEntrie smsEntrie
     */
    public function update(SmsEntrie $smsEntrie): void;

    /**
     * List Journal Entries
     *
     * @param  listParams search options
     */
    public function list(ListParams $listParams): array;

    public function getSameDayEntries(object $date): array;

    public function getYearMonths(): array;
}
