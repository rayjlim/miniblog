import React, { Component } from "react";

//TODO: CHANGE TO  STATELESS FUNCTIONAL COMPONENT
class TagDayStats extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("tds: componentDidUpdate");
    console.table(this.props);
    this.drawGraph(this.props.entrys);
  }

  drawGraph(entrys) {
    console.log(entrys);
    // DRAW THE BACKGROUND COLORS FOR THE WEEK DAY VALUES
    var maxWidth = 600;
    var chop = 50;
    var zoomFactor = 5;
    var lowestFactoredValue = 3; // THIS IS THE ABSOLUTE NUMBER TO GET ALL VALUES ABOVE 0
    var drawSpeed = 700;
    var maxValue = 0;
    // Draw the bar graph
    $("ul#weekDays li div").each(function eachItem(i) {
      var dayValue = parseFloat($(this).text());
      maxValue = Math.max(maxValue, dayValue);
    });

    maxValue = maxValue * zoomFactor + lowestFactoredValue;
    $("ul#weekDays li div")
      .each(function eachItem(i) {
        var realValue = parseFloat($(this).text());
        var dayValue = realValue * zoomFactor + lowestFactoredValue;

        var capacity = Math.round(dayValue / maxValue * maxWidth) - chop;
        $(this).width(capacity).css("background-color", "#9C9");
      })
      .show(drawSpeed);
  }

  render() {
    console.log("tds: render");
    return (
      <div className="row">
        <ul id="weekDays">
          <li>
            <em>Monday:</em>
            <div>
              {this.props.daysAverage.Monday}
            </div>
          </li>
          <li>
            <em>Tuesday:</em>
            <div>
              {this.props.daysAverage.Tuesday}
            </div>
          </li>
          <li>
            <em>Wednesday:</em>
            <div>
              {this.props.daysAverage.Wednesday}
            </div>
          </li>
          <li>
            <em>Thursday:</em>
            <div>
              {this.props.daysAverage.Thursday}
            </div>
          </li>
          <li>
            <em>Friday:</em>
            <div>
              {this.props.daysAverage.Friday}
            </div>
          </li>
          <li>
            <em>Saturday:</em>
            <div>
              {this.props.daysAverage.Saturday}
            </div>
          </li>
          <li>
            <em>Sunday:</em>
            <div>
              {this.props.daysAverage.Sunday}
            </div>
          </li>
          <li>
            <em>Baseline:</em>
            <div>0</div>
          </li>
        </ul>
      </div>
    );
  }
}

export default TagDayStats;
