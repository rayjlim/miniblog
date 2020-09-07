<?php
defined('ABSPATH') or exit('No direct script access allowed');

use \Lpt\DevHelp;

/**
 * GraphHelper Class Doc Comment
 *
 * @category Class
 * @package  Smsblog
 */
class GraphHelper
{
    public $currentDate = null;

    /**
     * Constructor
     *
     * Initialize dependancies
     *
     * @param object $_currentDate Connection to database
     *
     * @return
     */
    public function __construct($currentDate)
    {
        $this->currentDate = $currentDate;
    }

    /**
     * createWeightedArray
     *
     * Create the Weight array
     *
     * @param integer $sampleSize   number of entries in the sample
     * @param float   $weightFactor number to use as the low weight value
     * @param integer $precision    number of values after the decimal to display
     *
     * @return array distributed values
     */
    public function createWeightedArray($sampleSize, $weightFactor, $precision = 2)
    {
        $baseSize = $sampleSize - 1;
        $factorIntervalSize = number_format((1 - $weightFactor) / $sampleSize, $precision);

        // example  (1-.9)/9 = .01
        $targetArray = range(0, $sampleSize - 1);
        $factorArray = array_fill(0, $sampleSize, $factorIntervalSize);
        $weightedArray = array_map("createFunctionalWeightArray", $targetArray, $factorArray);

        return $weightedArray;
    }

    /**
     * searchSite
     *
     * control logic for the searchSite
     *
     * @param object $graphParams Object defining Graph details
     *
     * @return array page labels
     */
    public function generatePageLabels($graphParams)
    {
        $pageLabels = array();
        if ($graphParams->label == '#weight') {
            $pageLabels['title'] = 'Weight Graph';
            $pageLabels['highest'] = 'Heaviest';
            $pageLabels['lowest'] = 'Lightest';
            $pageLabels['tag'] = "weight";
        } elseif ($graphParams->label == '#sleep') {
            $pageLabels['title'] = 'Sleep Time Graph';
            $pageLabels['highest'] = 'Latest';
            $pageLabels['lowest'] = 'Earliest';
            $pageLabels['tag'] = "sleep";
        } else {
            $pageLabels['title'] = 'Amount of Sleep Graph';
            $pageLabels['highest'] = 'Most';
            $pageLabels['lowest'] = 'Least';
            $pageLabels['tag'] = "awake";
        }
        return $pageLabels;
    }

    /**
     * defineGoal
     *
     * control logic for the searchSite
     *
     * @param object $graphParams Object defining Graph details
     *
     * @return integer value of the Goal
     */
    public function defineGoal($graphParams)
    {
        $goal = 0;
        if ($graphParams->label == '#weight') {
            $goal = 140;
        } elseif ($graphParams->label == '#sleep') {
            $goal = 0;
        } else {
            $goal = 7;
        }
        return $goal;
    }

    /**
     * calculateFields
     *
     * control logic for the searchSite
     *
     * @param array   $graphParams      Connection to database
     * @param integer $entries   Size of the sample
     *
     * @return array associative
     */
    public function calculateFields($graphParams, $entries)
    {
        DevHelp::debugMsg('calculateFields: ' . count($entries));
        $currentDateTime = $this->currentDate;
        $data = array();
        $data['pageLabels'] = $this->generatePageLabels($graphParams);
        $data['goal'] = $this->defineGoal($graphParams);
        $aWeightFactor = $this->createWeightedArray($graphParams->sampleSize, $graphParams->weightFactor);

        $tempAvgArray = array();
        $sumOfEntries = 0;
        $dayArray = array();
        $precision = 2;
        $thisWeekArray = array();
        $lastWeekArray = array();
        $prev2WeeksArray = array();

        //weight specific milestones
        $milestone = array('diffhighest' => 0, 'diffhighestDate' => '', 'difflowest' => 0, 'difflowestDate' => '', 'highest' => 0, 'highestDate' => '', 'lowest' => 300, 'lowestDate' => '');

        //determine this week
        $dateThisWeek = clone ($currentDateTime);
        $dateThisWeek->sub(new DateInterval('P8D'));

        $dateLastWeek = clone ($currentDateTime);
        $dateLastWeek->sub(new DateInterval('P15D'));

        $datePrevious2Weeks = clone ($currentDateTime);
        $datePrevious2Weeks->sub(new DateInterval('P1M'));

        $lastEntryValue = '';
        $entriesCount = count($entries);
        $entriesModified = [];

        foreach (array_reverse($entries, true) as $index => $entry) {
            $entry = $this->prepareEntry($entry, $graphParams->label);

            DevHelp::debugMsg('entry: ' . $entry['main']);

            // calculate milestones
            if ($lastEntryValue != '') {
                $currentdiff = $lastEntryValue - $entry['main'];
                if ($currentdiff > $milestone['diffhighest']) {
                    $milestone['diffhighest'] = $currentdiff;
                    $milestone['diffhighestDate'] = $entry['date'];
                }
                if ($currentdiff < $milestone['difflowest']) {
                    DevHelp::debugMsg('difflowest' . $currentdiff . ";" . $entry['date']);
                    $milestone['difflowest'] = $currentdiff;
                    $milestone['difflowestDate'] = $entry['date'];
                }
            }
            if ($entry['main'] > $milestone['highest']) {
                $milestone['highest'] = $entry['main'];
                $milestone['highestDate'] = $entry['date'];
            }
            if ($entry['main'] < $milestone['lowest']) {
                $milestone['lowest'] = $entry['main'];
                $milestone['lowestDate'] = $entry['date'];
            }

            $entryDate = new DateTime($entry['date']);
            if ($entryDate > $dateThisWeek) {
                array_push($thisWeekArray, $entry['main']);
            } elseif ($entryDate > $dateLastWeek) {
                array_push($lastWeekArray, $entry['main']);
            } elseif ($entryDate > $datePrevious2Weeks) {
                array_push($prev2WeeksArray, $entry['main']);
            }

            // CALCULATE MOVING AVERAGE
            array_push($tempAvgArray, $entry['main']);
            if (($entriesCount - $index) > $graphParams->sampleSize) {
                array_shift($tempAvgArray);
            }

            $hasEnoughForMovingAverage = count($tempAvgArray) > 0 && ($entriesCount - $index) >= $graphParams->sampleSize;

            $entry['average'] = $hasEnoughForMovingAverage ? $this->calculateMovingAverage($tempAvgArray, $aWeightFactor) : null;

            // ADD VALUE TO THE DAY SPECIFIC ARRAY
            if (!isset($dayArray[date("l", strtotime($entry['date']))])) {
                $dayArray[date("l", strtotime($entry['date']))] = array();
            }
            array_push($dayArray[date("l", strtotime($entry['date']))], $entry['main']);

            $lastEntryValue = $entry['main'];
            $sumOfEntries += $entry['main'];
            $entriesModified[] = $entry;
        }

        // end For loop on entries
        $entries = $entriesModified;
        DevHelp::debugMsg("count(thisWeekArray): " . count($thisWeekArray));

        $milestone['thisWeeksAverage'] = (count($thisWeekArray) != 0) ? number_format(array_sum($thisWeekArray) / count($thisWeekArray), $precision) : 0;
        $milestone['lastWeeksAverage'] = (count($lastWeekArray) != 0) ? number_format(array_sum($lastWeekArray) / count($lastWeekArray), $precision) : 0;
        $milestone['prev2WeeksAverage'] = (count($prev2WeeksArray) != 0) ? number_format(array_sum($prev2WeeksArray) / count($prev2WeeksArray), $precision) : 0;
        DevHelp::debugMsg("milestone['thisWeeksAverage']: " . $milestone['thisWeeksAverage']);
        DevHelp::debugMsg("milestone['lastWeeksAverage']: " . $milestone['lastWeeksAverage']);
        DevHelp::debugMsg("milestone['prev2WeeksAverage']: " . $milestone['prev2WeeksAverage']);

        DevHelp::debugMsg('sumOfEntries' . $sumOfEntries);
        $overallAverage = 0;
        if ($entries) {
            $overallAverage = number_format($sumOfEntries / count($entries), 2);
        }
        $data['overallAverage'] = $overallAverage;
        $dayArrayFinal = array();
        foreach ($dayArray as $key => $value) {
            $tempAvgValue = array_sum($value) / count($value);
            $dayArrayFinal[$key]['average'] = number_format($tempAvgValue - $overallAverage, 2);

            DevHelp::debugMsg($key . ',' . $dayArrayFinal[$key]['average']);
        }



        $data['entries'] = array_reverse($entries, true);
        $data['milestone'] = $milestone;

        $data['dayArray'] = $dayArrayFinal;

        $data['param'] = $graphParams;

        $data['passThroughLabel'] = $graphParams->label;

        return $data;
    }

    // end of calculateFields Function

    public function prepareEntry($entry, $label)
    {

        //remove the tag

        $entry['content'] = str_ireplace($label, '', $entry['content']);
        switch ($label) {
            case '#weight':
                $sizeOfNumber = 5;

                // how many characters long
                $entry['main'] = substr(trim($entry['content']), 0, $sizeOfNumber);

                //main value
                $entry['comment'] = substr(trim($entry['content']), $sizeOfNumber);

                //secondary value
                break;

            case '#sleep':
                $a = explode(":", $entry['content']);
                $hourValue = $a[0];
                $hourNumerical = ($hourValue > MID_DAY_HOUR) ? ($hourValue - HOURS_PER_DAY) : $hourValue;

                $wholeValue = $hourNumerical + ($a[1] / MINUTES_PER_HOUR);

                //echo $wholeValue.'<br>';
                $entry['main'] = $wholeValue;
                $entry['comment'] = '';
                break;

            case '#hr':
                $sizeOfNumber = 3;

                // how many characters long
                $entry['main'] = substr(trim($entry['content']), 0, $sizeOfNumber);

                //main value
                $entry['comment'] = substr(trim($entry['content']), $sizeOfNumber);

                //secondary value

                break;

            default:
                //wake
                $findme = ',';
                $pos = strpos($entry['content'], $findme);
                $asleepTotal = trim(substr($entry['content'], $pos + 1));
                $entry['main'] = $asleepTotal;
                $entry['comment'] = '';

                break;
        }
        return $entry;
    }

    /**
     * searchSite
     *
     *
     * @param array $tempArray     Values
     * @param array $aWeightFactor array of weights
     *
     * @return float Average
     */
    public function calculateMovingAverage($tempArray, $aWeightFactor)
    {
        if (count($tempArray) != count($aWeightFactor)) {
            DevHelp::debugMsg(count($tempArray) . "::" . count($aWeightFactor));
            throw new Exception("moving average arrays mismatch");
        }

        $total = array_reduce(array_map('multiply', $tempArray, $aWeightFactor), 'sum');
        return number_format($total / array_sum($aWeightFactor), 2);
    }
}

function sum($current, $n)
{
    return $current + $n;
}
function multiply($n, $m)
{
    return $n * $m;
}

function createFunctionalWeightArray($n, $factor)
{
    return 1 - ($factor * ($n));
}
