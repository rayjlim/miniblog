/* global $:false, console:false quotmark:true */
var LptCal = (function() {
    "use strict";

    var calendarsFetched = [];

    var addSuccessCallback, updateSuccessCallback, deleteSuccessCallback;

    // ADD ZERO PADDING
    var pad = function(num, size) {
        var s = num + "";
        while (s.length < size) {
            s = "0" + s;
        }
        return s;
    };

    var calendarDayClick = function(date, jsEvent, view) {
        console.log("show adding form");
        //console.log($('#edit_content_field').html());
        window.eventTarget = null;

        var dateString = date.format("YYYY-MM-DD");
        var blankEntry = {
            entry: {
                id: 0,
                content: "",
                date: dateString
            }
        };

        console.log("this: " + this);
        populateDetails(blankEntry, "Add Blog Entry", false);
    };

    var calendarEventClick = function(calEvent, jsEvent, view) {
        console.log("show edit event");

        var url = window.baseurl + "api/posts/" + calEvent.id;
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: populateDetails,
            error: ajaxErrorHandler
        });
        window.eventTarget = calEvent;
    };

    var calendarViewRender = function(view, element) {
        console.log(
            "view render: " +
                view.intervalStart / 1000 +
                ":" +
                view.intervalEnd / 1000
        );

        //check if fetched already
        console.log($.inArray(view.intervalStart + 0, calendarsFetched));
        if ($.inArray(view.intervalStart + 0, calendarsFetched) != -1) {
            console.log("retrieved already");
            return;
        }

        calendarsFetched.push(view.intervalStart + 0);
        console.log("to retrieve");

        // make ajax call based on view.intervalStart
        console.log(view.intervalStart.format("YYYY-MM"));
        var url =
            window.baseurl +
            "api/posts/?month=" +
            view.intervalStart.format("YYYY-MM");
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: populateCalendarEntries,
            error: ajaxErrorHandler
        });
    };

    var populateCalendarEntries = function(result) {
        console.log(result);
        var taggedEvents = [];
        var goalEvents = [];
        var untaggedEvents = [];
        //on success; populate values
        //var arr = [{"id":"4607","content":"asfdafds","date":"2014-06-30","userId":"0"}];

        $.each(result.entries, function(index, obj) {
            console.log("obj" + index + ":" + obj["id"]);
            var calId = obj["id"];
            var calTitle = obj["content"];
            var calDate = obj["date"];
            if (calTitle.indexOf("#") > -1) {
                taggedEvents.push({
                    title: calTitle,
                    start: calDate + " 02:00",
                    id: calId
                });
            } else if (calTitle.indexOf("@") > -1) {
                goalEvents.push({
                    title: calTitle,
                    start: calDate + " 01:00",
                    id: calId
                });
            } else {
                untaggedEvents.push({
                    title: calTitle,
                    start: calDate + " 03:00",
                    id: calId
                });
            }
        });

        var srcTaggedEvents = {
            events: taggedEvents,
            color: "#66F"
        };
        var srcGoalEvents = {
            events: goalEvents,
            color: "#F66"
        };
        var srcUntaggedEvents = {
            events: untaggedEvents,
            color: "#000"
        };

        $("#calendar").fullCalendar("addEventSource", srcTaggedEvents);
        $("#calendar").fullCalendar("addEventSource", srcGoalEvents);
        $("#calendar").fullCalendar("addEventSource", srcUntaggedEvents);
    };

    // BUG - WHEN I DON'T PAD THE DAY & MONTH
    // THEN THE PREVIOUS DAY ENDS UP BEING OFF
    var yesterdayClick = function() {
        console.log(
            "yesterdayClick function called" + $("#edit_date_field").val()
        );
        var mydate = new Date(Date.parse($("#edit_date_field").val()) + 50); // add 50ms so it's not at midnight
        mydate.setDate(mydate.getDate());
        var curr_date = pad(mydate.getDate(), 2);
        var curr_month = pad(mydate.getMonth() + 1, 2);
        var curr_year = mydate.getFullYear();

        var dateString = curr_year + "-" + curr_month + "-" + curr_date;
        console.log(":" + dateString);

        //WHY IS THE FORMATDATE FUNCTION TAKING ANOTHER DAY OFF?
        $("#edit_date_field").val(dateString);
        return false;
    };

    var saveEvent = function() {
        $("#dialog_submit").attr("disabled", "disabled");
        // var form = $("#edit_form");
        var url = window.baseurl + "api/posts/";
        console.log("eventTarget: " + window.eventTarget);

        if (window.eventTarget === null) {
            console.log("ADDING");
            $.ajax({
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                url: url,
                data: (function() {
                    return JSON.stringify({
                        content: $("#edit_content_field").val(),
                        date: $("#edit_date_field").val()
                    });
                })(),
                success: savedDetails,
                error: ajaxErrorHandler
            });
        } else {
            console.log("UPDATING");
            $.ajax({
                type: "PUT",
                contentType: "application/json",
                dataType: "json",
                url: url + $("#edit_id_field").val(),
                data: (function() {
                    return JSON.stringify({
                        content: $("#edit_content_field").val(),
                        date: $("#edit_date_field").val()
                    });
                })(),
                success: savedDetails,
                error: ajaxErrorHandler
            });
        }
    };

    var deleteEvent = function() {
        console.log("delete called");
        var target_id = $("#edit_id_field").val();
        var url = window.baseurl + "api/posts/" + target_id;
        $.ajax({
            type: "DELETE",
            contentType: "application/json",
            dataType: "json",
            url: url,

            success: function(results) {
                console.log("delete done");
                console.log(results);
                // this should be based on screen resolution
                $("#dialog").dialog({
                    modal: true,
                    width: 600,
                    title: "dialogTitle"
                });
                $("#dialog").dialog("close");
                if (LptCal.deleteSuccessCallback !== undefined) {
                    LptCal.deleteSuccessCallback(target_id);
                }
            },
            error: ajaxErrorHandler
        });

        //window.eventTarget = null;
        return false;
    };

    var populateDetails = function(result, _dialogTitle, showDelete) {
        console.log("show populateDetails");
        var entry = result.entry;

        console.log("line 138" + entry.content);
        var content = entry.content;
        $("#edit_content_field").val(content.replace(/<br\s*[\/]?>/gi, "\n"));
        $("#edit_id_field").val(entry.id);
        console.log("showDelete:" + showDelete);
        if (typeof yourVariable === "object" || showDelete) {
            $("#edit_delete_link").attr("href", "api/" + entry.id);
            $("#edit_delete_link").show();
        } else {
            $("#edit_delete_link").hide();
        }

        $("#edit_date_field").val(entry.date);

        var dialogTitle =
            _dialogTitle === "success" ? "Edit Blog Entry" : _dialogTitle;

        // this should be based on screen resolution
        $("#dialog").dialog({
            modal: true,
            width: 600,
            title: dialogTitle
        });

        $("#dialog_submit").removeAttr("disabled");

        setTimeout(function() {
            console.log("delay focus");
            $("#edit_content_field").focus();
        }, 1000);
    };

    var savedDetails = function(results) {
        console.log("edit done");
        $("#dialog").dialog({
            modal: true,
            width: 600,
            title: ""
        });
        $("#dialog").dialog("close");
        if (window.eventTarget === null) {
            console.log("adding...");
            if (LptCal.addSuccessCallback !== undefined) {
                LptCal.addSuccessCallback(results);
            }
        } else {
            console.log("edit...");
            if (LptCal.updateSuccessCallback !== undefined) {
                LptCal.updateSuccessCallback(results);
            }
        }

        $("#edit_content_field").val("");
    };

    var cancelEvent = function() {
        console.log("edit done");
        $("#dialog").dialog({
            modal: true,
            width: 600,
            title: ""
        });
        $("#dialog").dialog("close");
        $("#edit_content_field").val("");
    };

    var ajaxErrorHandler = function(jqXHR, error, errorThrown) {
        if (jqXHR.status && jqXHR.status == 400) {
            window.alert(jqXHR.responseText);
        } else {
            window.alert(errorThrown);
            window.alert("Something went wrong");
        }
    };

    return {
        // fullcalendar.js params
        buttonIcons: false,
        allDayDefault: true,
        //fullcalendar.js callbacks
        viewRender: calendarViewRender,
        dayClick: calendarDayClick,
        eventClick: calendarEventClick,

        //public functions

        yesterdayClick: yesterdayClick,
        saveEvent: saveEvent,
        deleteEvent: deleteEvent,
        savedDetails: savedDetails,
        cancelEvent: cancelEvent,

        addSuccessCallback: addSuccessCallback,
        updateSuccessCallback: updateSuccessCallback,
        deleteSuccessCallback: deleteSuccessCallback,

        //Not public, but exposed for jasmine tests
        populateDetails: populateDetails
    };
})();
