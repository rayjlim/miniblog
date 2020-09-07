<?php
defined('ABSPATH') or exit('No direct script access allowed');

class BookmarkParams extends BaseModel
{
    public $path;

    public function loadParams($request)
    {
        $oBookmarkParams = new BookmarkParams();

        if (getValue($request, 'path')) {
            $oBookmarkParams->path = $request['path'];
        }
        if (getValue($request, 'daterange')) {
            $oBookmarkParams->daterange = $request['daterange'];
        } else {
            $oBookmarkParams->daterange = 6;
        }
        if (getValue($request, 'showpaths')) {
            $oBookmarkParams->showpaths = $request['showpaths'];
        }

        return $oBookmarkParams;
    }
}
