import React, { Component } from 'react';
import Immutable from 'immutable';

import TagSearchBar from '../views/TagSearchBar.jsx';

import WeightGraph from '../views/WeightGraph.jsx';
import TagStats from '../views/TagStats.jsx';
import TagDayStats from '../views/TagDayStats.jsx';
import GraphEntryList from '../views/GraphEntryList.jsx';
import getWeights from '../api/EntryApi';

class GraphContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metrics: {
        goal: 0,
        overallAverage: 0,
        milestone: {},
        pageLabels: {}
      },
      daysAverage: {},
      entrys: []
    };
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    console.log('GC: componentDidMount');
    this.dataFetch();
  }

  search(count) {
    console.log('GC: search');
    this.dataFetch('&count=' + count);
  }

  dataFetch(param = '') {
    var _this = this;
    console.log('dataFetch');
    getWeights(param)
      .then(function (response) {
        console.table(response.data);
        var metrics = response.data.metrics;

        /* massage the data for cleanliness, don't like the nested average value*/
        var daysAverage = {
          Monday: metrics.dayArray.Monday.average,
          Tuesday: metrics.dayArray.Tuesday.average,
          Wednesday: metrics.dayArray.Wednesday.average,
          Thursday: metrics.dayArray.Thursday.average,
          Friday: metrics.dayArray.Friday.average,
          Saturday: metrics.dayArray.Saturday.average,
          Sunday: metrics.dayArray.Sunday.average
        };

        _this.setState({
          metrics: response.data.metrics,
          daysAverage: daysAverage,
          entrys: response.data.entrys
        });
      })
      .catch(function (err) {
        console.error(err);
        alert(err);
      });
  }

  render() {
    console.log('GC: render');
    return (
      <div>
        <h1>
          {this.state.metrics.pageLabels.title}
        </h1>
        <h2>
          Tag: {this.state.metrics.pageLabels.tag}
        </h2>
        <TagSearchBar handleSearch={this.search} />
        <WeightGraph entrys={this.state.entrys} />
        <TagStats metrics={this.state.metrics} />
        <TagDayStats daysAverage={this.state.daysAverage} />
        <GraphEntryList entrys={this.state.entrys} />
      </div>
    );
  }
}

export default GraphContainer;
