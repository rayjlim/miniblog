# Mini-Blog

[[app-setup-db]]

[[demo-version]]

[[bugs]]

[[archive]]

Bug: links in email always logged and don’t get to wanted date

on change day, reset scrollToIndex

Support multiuser; register, media view would need a full makeover

Idea-have php have an endpoint to return constants. Like features enabled, folder paths. Then have SPA make call to get constants (which constants?)

Try Symlink uploads

Fa- quick entry helper. Modal to select common used

Email formatting. Remove bullets from list. Align more left. Space between date entries 

quick buttons: intentions, happenings, grateful for, action items; use shortcode $$intenttion$$

show loading... for one day, same day on save

• idea: add link to images to go to media edit page ; use a regex find/replace to add link in content before markdown render

//------------ fa-classifier
report on font-awesome icon usage (count of each), 
     text over 140 characters or under 10,
     common phrases

idea-edit ui modes: default, separate by carriage return and prepend fontawesome w/ guess of icon to use

put sendBackendAuth call at end of react auth spa > handleRedirectCallback
consolidate one day | same day | text search views

• view by date range (ie. year-month) => make a dropdown for year months

*  add date time picker to add / edit forms

•Calendar: nav with years options

• popup for font-awesome reference sheet
• 
* optimize: On change of date for same day. If matches regex then do fetch
* 
use cursor position in textarea edit 
       var cursorPosition = $('#myTextarea').prop("selectionStart");

deprecate sleep metrics and morpheuz references

//localhost/smsblog/index.php/api/morpheuz

// <?php
// $TAG_CLOUD_ARRAY = array('2r' => 1 , 'Dream' => 1 , 'Tv' => 11 , 'Weight' => 6 , );
//     $GOAL_LIST_ARRAY = array(
// array('name' => 'chores', 'code' => 'chores', 'type' => 'daily', 'Description' => 'check house for clean up before playing', 'startdate'=>'2011-04-24')
// , array('name' => 'pushups', 'code' => 'pushups', 'type' => '3x', 'Description' => 'Do 100 pushups 3x a week')
// , array('name' => 'situps', 'code' => 'situps', 'type' => '3x', 'Description' => 'Do 100 pushups 3x a week')
// );


 ## ADRs
 added adr-tools project to path, to support autogenerate of adr template files
  export PATH="$PATH:/media/ray/MainStorage/projects/adr-tools/src"
  then able to use "adr new adr title" in doc/adr 
also npm install -g adr-log and then can use
 "adr-log -d . -i" to build table of contents
add entry filters: via configuration file
feature: hide search box except on blog list and text view 
js : create calendar entry manager
(epic) H: Batch Report, send weekly summary email 
look at adding another display page in one-a-day journal format to wordpress
mobile: clear auth key
able edit the user config preferences
 [list out user preferences] - sample size, weight factor,
5[inform] As a user, I want to be able to limit results in textview by count or date range so I can see only dates I'm interested in
concat together - same day entries calendar view,
N: properties to a config file = processed folder[what's this?],
max_archive count

input: date range, username/pass

Combined @ and # and + together, now known as tags
tagged entries will have values

@ tagged entries will be just count

if multiple @ tagged entries in a day then consolidate to one daily entry
not implemented
