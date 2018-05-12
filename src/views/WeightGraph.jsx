import React, { Component } from "react";

class WeightGraph extends Component {
  constructor(props) {
    super(props);
    this.plot1;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.plot1) {
      this.plot1.destroy();
    }
    this.drawGraph(this.props.entrys);
  }

  drawGraph(entrys) {
    console.log(entrys);
    entrys.reverse();
    var trackdata = entrys.map(x => {
      return [x.date + " 01:00AM", parseFloat(x.main)];
    });
    var avgdata = entrys.map(x => {
      return [x.date + " 01:00AM", parseFloat(x.average)];
    });
    // TODO: CHANGE OUT FOR D3
    console.log("draw circle");
    var sampleSVG = d3
      .select("#d3chart")
      .append("svg")
      .attr("width", 100)
      .attr("height", 100);

    sampleSVG
      .append("circle")
      .style("stroke", "gray")
      .style("fill", "white")
      .attr("r", 40)
      .attr("cx", 50)
      .attr("cy", 50)
      .on("mouseover", function() {
        d3.select(this).style("fill", "aliceblue");
      })
      .on("mouseout", function() {
        d3.select(this).style("fill", "white");
      });

    //jqplot
    $.jqplot.config.enablePlugins = true;
    this.plot1 = $.jqplot("chart", [trackdata, avgdata], {
      gridPadding: {
        right: 35
      },
      axes: {
        xaxis: {
          renderer: $.jqplot.DateAxisRenderer,
          rendererOptions: {
            tickRenderer: $.jqplot.CanvasAxisTickRenderer
          },
          tickOptions: {
            fontSize: "10pt",
            fontFamily: "Tahoma",
            angle: -40,
            formatString: "%m-%d-%y"
          },
          // tickInterval:'2 week'
          numberTicks: 10
        },
        yaxis: {
          tickOptions: {
            formatString: "$%.1f"
          }
        }
      },
      highlighter: {
        sizeAdjust: 10,
        tooltipLocation: "n",
        tooltipAxes: "y",
        useAxesFormatters: false,
        tooltipContentEditor: function tooltipContentEditor(
          str,
          seriesIndex,
          pointIndex,
          plot
        ) {
          var date = plot.data[seriesIndex][pointIndex][0];
          var weight = plot.data[seriesIndex][pointIndex][1];
          // var entryDate = new Date(date);
          var html = '<div class="highlight">';
          html += "Date : " + date;
          html += "  <br>Weight : " + weight + "</div>";
          return html;
        }
      },
      cursor: {
        show: false
      },
      series: [
        {
          lineWidth: 1,
          markerOptions: {
            style: "square"
          }
        },
        {
          lineWidth: 3,
          markerOptions: {
            style: "circle"
          },
          color: "red"
        }
      ],

      seriesDefaults: {
        color: "green",
        fill: false, // fill under the line,
        fillAndStroke: true, // *stroke a line at top of fill area.
        fillColor: "#66CCCC", // *custom fill color for filled lines (default is line color).
        fillAlpha: 0.2, // *custom alpha to apply to fillColor.
        markerRenderer: $.jqplot.MarkerRenderer, // renderer to use to draw the data
        // point markers.
        markerOptions: {
          show: true, // wether to show data point markers.
          style: "filledCircle", // circle, diamond, square, filledCircle.
          // filledDiamond or filledSquare.
          lineWidth: 1, // width of the stroke drawing the marker.
          size: 9, // size (diameter, edge length, etc.) of the marker.
          color: "#000", // color of marker, set to color of line by default.
          shadow: false, // wether to draw shadow on marker or not.
          shadowAngle: 45, // angle of the shadow.  Clockwise from x axis.
          shadowOffset: 1, // offset from the line of the shadow,
          shadowDepth: 3, // Number of strokes to make when drawing shadow.  Each stroke
          // offset by shadowOffset from the last.
          shadowAlpha: 0.07 // Opacity of the shadow
        }
      }
    });
  }

  render() {
    console.log("wg: render");
    return (
      <div>
        <div id="d3chart" />
        <div id="chart" />
      </div>
    );
  }
}

export default WeightGraph;
