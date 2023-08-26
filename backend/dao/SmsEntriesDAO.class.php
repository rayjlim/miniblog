<?php
namespace dao;

defined('ABSPATH') or exit('No direct script access allowed');

use \models\SmsEntrie;
use \models\ListParams;
interface SmsEntriesDAO
{
    /**
     * Get Domain object by primry key
     *
     * @param  string $id primary key
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
     * @param SmsEntries smsEntrie
     */
    public function update(SmsEntrie $smsEntrie): void;

    public function list(ListParams $listParams): array;

    public function getSameDayEntries(object $date): array;

    public function getYearMonths(): array;
}
