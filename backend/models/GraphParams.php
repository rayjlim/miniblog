<?php

class GraphParams extends BaseModel
{
    public $userId;
    public $tag;
    public $label;
    public $sampleSize;
    public $weightFactor;
    public $resultLimit;
    public $startDate;
    public $endDate;
     
    public function loadParams($request, $currentDate)
    {
        $oGraphParams = new GraphParams();

        if (getValue($request, 'label')) {
            $oGraphParams->tag = substr($request['label'], 1);
            $oGraphParams->label = $request['label'];
        } elseif (getValue($request, 'tag')) {
            $oGraphParams->tag = $request['tag'];
            $oGraphParams->label = '#' . $request['tag'];
        } elseif (getValue($request, 'goal')) {
            $oGraphParams->tag = $request['goal'];
            $oGraphParams->label = '@' . $request['goal'];
        } else {
            $oGraphParams->tag  = 'weight';
            $oGraphParams->label = '#weight';
        }
        if (getValue($request, 'startDate')) {
            $oGraphParams->startDate = $request['startDate'];

            // TODO :should be the max number of days between start and end
            $request['count'] = 1000;
        }
        
        $oGraphParams->endDate = getValue($request, 'startDate')
                ? $request['endDate'] :  $currentDate->format('Y-m-d');
        
        $oGraphParams->sampleSize  = isset($request['sampleSize']) && is_numeric($request['sampleSize'])
            ? $request['sampleSize']
            : DEFAULT_SAMPLE_SIZE;
        $oGraphParams->weightFactor = isset($request['weightFactor']) && is_numeric($request['weightFactor'])
            ? $request['weightFactor']
            : DEFAULT_WEIGHT_FACTOR;
        
        $oGraphParams->resultLimit = isset($request['count']) && is_numeric($request['count'])
                        ? $request['count']
                        : BLOG_LIMIT_DEFAULT;
        return $oGraphParams;
    }
}
