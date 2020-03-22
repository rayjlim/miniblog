/* eslint-disable no-alert, no-console */

const FullCalendarConfig = () => {
    // console.log("createCalendarHelper");
    let calendarsFetched = [];

    // ADD ZERO PADDING
    // let pad = function(num, size) {
    //   let s = num + "";
    //   while (s.length < size) {
    //     s = "0" + s;
    //   }
    //   return s;
    // };
    let populateDetails = function populateDetails(result, _dialogTitle, showDelete) {
        console.log('show populateDetails');
        let entry = result.entry;

        console.log('line 138' + entry.content);
        let content = entry.content;
        $('#edit_content_field').val(content.replace(/<br\s*[/]?>/gi, '\n'));
        $('#edit_id_field').val(entry.id);
        console.log('showDelete:' + showDelete);
        if (typeof yourVariable === 'object' || showDelete) {
            $('#edit_delete_link').attr('href', 'api/' + entry.id);
            $('#edit_delete_link').show();
        } else {
            $('#edit_delete_link').hide();
        }

        $('#edit_date_field').val(entry.date);

        let dialogTitle = _dialogTitle === 'success' ? 'Edit Blog Entry' : _dialogTitle;

        $('#dialog').dialog({
            modal: true,
            width: 600,
            title: dialogTitle
        });

        $('#dialog_submit').removeAttr('disabled');

        setTimeout(() => {
            console.log('delay focus');
            $('#edit_content_field').focus();
        }, 1000);
    };

    let ajaxErrorHandler = function ajaxErrorHandler(jqXHR, error, errorThrown) {
        if (jqXHR.status && jqXHR.status === 400) {
            window.alert(jqXHR.responseText);
        } else {
            window.alert(errorThrown);
            window.alert('Something went wrong');
        }
    };

    let calendarDayClick = function calendarDayClick(date) {
        console.log('show adding form');
        // console.log($('#edit_content_field').html());
        window.eventTarget = null;
        let dateString = date.format('YYYY-MM-DD');
        let blankEntry = {
            entry: {
                id: 0,
                content: '',
                date: dateString
            }
        };
        // console.log('this: ' + this);
        populateDetails(blankEntry, 'Add Blog Entry', false);
    };

    let calendarEventClick = function calendarEventClick(calEvent) {
        console.log('show edit event');

        let url = 'api/posts/' + calEvent.id;
        $.ajax({
            type: 'GET',
            url: url,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: populateDetails,
            error: ajaxErrorHandler
        });
        window.eventTarget = calEvent;
    };


    let populateCalendarEntries = function populateCalendarEntries(result) {
        console.log('FC: populateCalendarEntries');
        console.log(result);
        let taggedEvents = [];
        let goalEvents = [];
        let untaggedEvents = [];
        // on success; populate values
        // let arr = [{"id":"4607","content":"asfdafds","date":"2014-06-30","userId":"0"}];

        $.each(result.entries, (index, obj) =>{
            let calId = obj.id;
            let calTitle = obj.content;
            let calDate = obj.date;
            if (calTitle.indexOf('#') > -1) {
                taggedEvents.push({
                    title: calTitle,
                    start: calDate + ' 02:00',
                    id: calId
                });
            } else if (calTitle.indexOf('@') > -1) {
                goalEvents.push({
                    title: calTitle,
                    start: calDate + ' 01:00',
                    id: calId
                });
            } else {
                untaggedEvents.push({
                    title: calTitle,
                    start: calDate + ' 03:00',
                    id: calId
                });
            }
        });

        let srcTaggedEvents = {
            events: taggedEvents,
            color: '#66F'
        };
        let srcGoalEvents = {
            events: goalEvents,
            color: '#F66'
        };
        let srcUntaggedEvents = {
            events: untaggedEvents,
            color: '#000'
        };

        $('#calendar').fullCalendar('addEventSource', srcTaggedEvents);
        $('#calendar').fullCalendar('addEventSource', srcGoalEvents);
        $('#calendar').fullCalendar('addEventSource', srcUntaggedEvents);
    };
    let calendarViewRender = (view) => {
        console.log(`view render: ${view.intervalStart / 1000} : ${view.intervalEnd / 1000}`);

        // check if fetched already
        let alreadyFetched = $.inArray(view.intervalStart + 0, calendarsFetched) !== -1;
        console.log('check inArray: ' + alreadyFetched);
        if (alreadyFetched) {
            console.log('retrieved already');
            return;
        }

        calendarsFetched.push(view.intervalStart + 0);

        // make ajax call based on view.intervalStart
        console.log('going to retrieve: ' + view.intervalStart.format('YYYY-MM'));
        let url = 'api/posts/?month=' + view.intervalStart.format('YYYY-MM');
        $.ajax({
            type: 'GET',
            url: url,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: populateCalendarEntries,
            error: ajaxErrorHandler
        });
    };

    return {
        // fullcalendar.js params
        buttonIcons: false,
        allDayDefault: true,
        height: 'auto',
        // //fullcalendar.js callbacks
        viewRender: calendarViewRender,
        dayClick: calendarDayClick,
        eventClick: calendarEventClick,

        // //Not public, but exposed for jasmine tests
        populateDetails: populateDetails
    };
};

export default FullCalendarConfig;
