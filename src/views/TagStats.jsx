import React from "react";

const TagStats = props => {
  return (
    <div className="row">
      <h3>
        Goal: {props.metrics.goal}
      </h3>
      <ul className="col-sm-6">
        <li>
          {props.metrics.pageLabels.highest}: {props.metrics.milestone.highest}{" "}
          - {props.metrics.milestone.highestDate}
        </li>
        <li>
          {props.metrics.pageLabels.lowest}: {props.metrics.milestone.lowest} -{" "}
          {props.metrics.milestone.lowestDate}
        </li>

        <li>
          Biggest Gain Diff: {props.metrics.milestone.diffhighest} -{" "}
          {props.metrics.milestone.diffhighestDate}
        </li>
        <li>
          Biggest Drop Diff: {props.metrics.milestone.difflowest} -{" "}
          {props.metrics.milestone.difflowestDate}
        </li>
      </ul>
      <ul className="col-sm-6">
        <li>
          Overall Average: {props.metrics.overallAverage}
        </li>
        <li>
          This week: {props.metrics.milestone.thisWeeksAverage}
        </li>
        <li>
          Last week: {props.metrics.milestone.lastWeeksAverage}
        </li>
        <li>
          Rest of Month: {props.metrics.milestone.prev2WeeksAverage}
        </li>
      </ul>
    </div>
  );
};
export default TagStats;
