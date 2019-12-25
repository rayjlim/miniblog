// FullCalendarConfig

const FullCalendarConfig = () => {
  // console.log("createCalendarHelper");
  var calendarsFetched = [];

  // ADD ZERO PADDING
  // var pad = function(num, size) {
  //   var s = num + "";
  //   while (s.length < size) {
  //     s = "0" + s;
  //   }
  //   return s;
  // };

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

    var url = "api/posts/" + calEvent.id;
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

  var calendarViewRender = (view, element) =>{
    console.log(`view render: ${view.intervalStart / 1000} : ${view.intervalEnd / 1000}`);

    //check if fetched already
    var alreadyFetched =
      $.inArray(view.intervalStart + 0, calendarsFetched) !== -1;
    console.log("check inArray: " + alreadyFetched);
    if (alreadyFetched) {
      console.log("retrieved already");
      return;
    }

    calendarsFetched.push(view.intervalStart + 0);

    // make ajax call based on view.intervalStart
    console.log("going to retrieve: " + view.intervalStart.format("YYYY-MM"));
    var url = "api/posts/?month=" + view.intervalStart.format("YYYY-MM");
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
    console.log("FC: populateCalendarEntries");
    console.log(result);
    var taggedEvents = [];
    var goalEvents = [];
    var untaggedEvents = [];
    //on success; populate values
    //var arr = [{"id":"4607","content":"asfdafds","date":"2014-06-30","userId":"0"}];

    $.each(result.entries, function(index, obj) {
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

  var ajaxErrorHandler = function(jqXHR, error, errorThrown) {
    if (jqXHR.status && jqXHR.status === 400) {
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
    height: "auto",
    // //fullcalendar.js callbacks
    viewRender: calendarViewRender,
    dayClick: calendarDayClick,
    eventClick: calendarEventClick,

    // //Not public, but exposed for jasmine tests
    populateDetails: populateDetails
  };
};

export default FullCalendarConfig;
