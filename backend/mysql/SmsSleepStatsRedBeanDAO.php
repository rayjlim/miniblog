<?php
defined('ABSPATH') OR exit('No direct script access allowed');

class SmsSleepstatsRedbeanDAO implements SmsSleepStatsDAO
{
    public function load($id)
    {
        $stat = R::sleepstat(SLEEPSTATS, $id);
        return $stat->export();
    }
    
    public function queryAll()
    {
        $stats = R::findAll(SLEEPSTATS);
        $sequencedArray = array_values(array_map("getExportValues", $stats));
        return $sequencedArray;
    }
    
    public function delete($id)
    {
        $statBean = R::load(SLEEPSTATS, $id);
        R::trash($SLEEPSTATS);
        return 1;
    }
    
    public function insert($smsSleepStat)
    {
        $statBean = R::xdispense(SLEEPSTATS);
        $statBean->urlString = $smsSleepStat->urlString;
        $statBean->totalSleepCount= $smsSleepStat->totalSleepCount;
        $statBean->restlessSleepCount= $smsSleepStat->restlessSleepCount;
        $statBean->deepSleepCount= $smsSleepStat->deepSleepCount;
        $statBean->lightSleepCount= $smsSleepStat->lightSleepCount;
        $statBean->ignoreSleepCount= $smsSleepStat->ignoreSleepCount;
        $resource =  DAOFactory::getResourceDAO();
        $now =  $resource->getDateTime();
        $statBean->dateCreated  = $now->format('Y-m-d');

        
        $statBean->sleepStart= $smsSleepStat->sleepStart;
        $statBean->startOffset= $smsSleepStat->startOffset;
        $id = R::store($statBean);
        return $id;
    }
}
