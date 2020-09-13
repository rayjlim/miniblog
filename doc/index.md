# Mini-Blog

- [[app-setup-db]]
- [[demo version]]
- [[bugs]]
- [[archive]]

## Tasks

- [ ] marked preview to the right in large view
- [ ] prettierrc check run on push
- [x] confirm on `delete` button click
- [ ] bug: delete last entry of day, causes `  refs[loadParams.scrollToLast]` to be undefined

## feature ideas

- emoji insert use case
/ typing @@shortcode@@ replaces with emoji
/ picker button shows widget and inserts at cursor

- Support multiuser; register, media view would need a full makeover
- fa-classifier

     ```report on font-awesome icon usage (count of each),
     text over 140 characters or under 10,
     common phrases
     ```

- have php have an endpoint to return constants. Like features enabled, folder paths. Then have SPA make call to get constants (which constants?)
- Try Symlink uploads
- Fa- quick entry helper. Modal to select common used
- Email formatting. Remove bullets from list. Align more left. Space between date entries
- quick buttons for templates: intentions, happenings, grateful for, action items; use shortcode `$$intenttion$$`
- show loading... for one day, same day on save
- idea: add link to images to go to media edit page ; use a regex find/replace to add link in content before markdown render
- js : create calendar entry manager
- edit ui modes: default, separate by carriage return and prepend fontawesome w/ guess of icon to use
- put sendBackendAuth call at end of react auth spa > handleRedirectCallback
- view by date range (ie. year-month) => make a dropdown for year months
- add date time picker to add / edit forms

- Calendar: nav with years options

- popup for font-awesome reference sheet
- look at adding another display page in one-a-day journal format to wordpress

use cursor position in textarea edit
       var cursorPosition = $('#myTextarea').prop("selectionStart");

- deprecate sleep metrics and morpheuz references
- feature: hide search box except on blog list and text view
- (epic) H: Batch Report, send weekly summary email (need more detail on what is in report)

//localhost/smsblog/index.php/api/morpheuz

// <?php
// $TAG_CLOUD_ARRAY = array('2r' => 1 , 'Dream' => 1 , 'Tv' => 11 , 'Weight' => 6 , );
//     $GOAL_LIST_ARRAY = array(
// array('name' => 'chores', 'code' => 'chores', 'type' => 'daily', 'Description' => 'check house for clean up before playing', 'startdate'=>'2011-04-24')
// , array('name' => 'pushups', 'code' => 'pushups', 'type' => '3x', 'Description' => 'Do 100 pushups 3x a week')
// , array('name' => 'situps', 'code' => 'situps', 'type' => '3x', 'Description' => 'Do 100 pushups 3x a week')
// );

add entry filters: via configuration file

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

## ADRs

added adr-tools project to path, to support autogenerate of adr template files

```sh
  export PATH="$PATH:/path/to/projects/adr-tools/src"
```

  then able to use "adr new adr title" in doc/adr

also npm install -g adr-log and then can use
 "adr-log -d . -i" to build table of contents
