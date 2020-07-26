# Archive

smsblog dev-archive
Completed
2016-06/01: 
 authMiddleware impl 
 fix calendar view going to wrong month
 
2016-6/4 : 
    handle unauth api calls
6/5
 reactify full calendar
 figure out call process for xhr calls
 impl react-router 
6/6
 react text view search
6/10
 year-month aggregate
6/22
 Reactify: Weight graph; got first stats [unfinished]
 
 
blog list : separate out Lptcal from EventEditor (new class)
                    --decided not to unless I design in a way to have clear responsibilities for each class

blog list : try bind instead of .click (done)
bug: header links don't work in graph page

add logging to when email check is run [archive]

* get a php rest api for getting entries by year/month; to be used for loading calendar entries
     blog list: jump to month to use JS instead of page reload
     get the js_tests to pass;
          issue with modal reference in jquery-ui component

api for getting json obj of entries
     http://localhost:82/smsblog/index.php/api/posts/?month=2013-09

get JS jasmine tests working again
calendar.viewrender:
     make ajax api call for the months data; pass start

bug: mobile > sleep not reading comment for time offset

mobile: upgrade jquery-mobile to latest
bug: calendar : broken link to Home
bug: calendar : goto month off by 1 month
mobile: fitness entry section with swipe

- H: json service for entries from a specific date range
    - What's the benefit? this is a building block for optimized calendar display, of lookup on demand

bug : search not working
====== Old notes for smsblog======
=== Completed: ===

B:  apostrophe in weight description
B: unable to edit entries with apostrophe's

Goals: use a weekly calendar view for quick entry
X: Last mail check stored in db, if not in last 15 min then do a check
H: use longer message length for 'untagged'
H: highlight lowest/highest weight and biggest drops/gains
h: display Graph goal as a line on the weight graph
H: able to edit weight goal in config
H: graph the @wake entries
h: display Graph goal as a line on the sleep graph
H: automatically calculate sleep length
H: Standardize the graph actions and templates to one
H: make count a form param
H: average for last week vs. prior week (80%)
H: graph: ADD form support sleep and wake.
h: @wake, cron support for -\d\d for minutes wake up difference
