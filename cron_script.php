#!/archive/data1/bin/php -f
<?php
#
# standalone PHP program 
# (edit top line to point to local PHP executable)
#
# Submits GET request to search HST archive for given RA, Dec, and radius,
# limit results to 10 records, 
# returns data set name, RA, Dec, and Target name
# as a comma-separated list
# prints out column headings and data
#

# create GET request

$request = "http://www.lilplaytime.com/smsblog/cron?password=yar";      //quotes url


print "\nrequest = $request \n\n";

# download results from MAST as an array called $data
# (ignore errors)

$data = @file($request);