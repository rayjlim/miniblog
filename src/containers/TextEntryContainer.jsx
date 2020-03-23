/* eslint-disable no-unused-vars, no-console */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import EntryList from '../views/EntryList.jsx';
import EntrySearchBar from '../views/EntrySearchBar.jsx';

import EntryApi from '../api/EntryApi';

class TextEntryContainer extends Component {
    constructor(props) {
        console.log('TextEntryContainer');
        super(props);
        const current = moment();

        this.state = {
            searchText: ' ',
            sameDayInput: current.format('YYYY-MM-DD'),
            month: ''
        };
        this.search = this.search.bind(this);
        this.handleSameDayChange = this.handleSameDayChange.bind(this);
        this.searchSameDay = this.searchSameDay.bind(this);
    }

    componentDidMount() {
        console.log('TEC: componentDidMount');
        let loc = window.location + ``;

        let param = loc.substring(loc.indexOf('?'));
        console.log('param text :', param);
        let urlParams = new URLSearchParams(param);

        console.log('urlParams.has month: ' + urlParams.has('month'));
        let month = urlParams.get('month');
        console.log('passed month: ' + month);

        if (month !== null) {
            this.monthCall(month);
        } else {
            this.searchCall(this.state.searchText);
        }
    }

    componentDidUpdate() {
        console.log('TEC: componentDidUpdate');
        let loc = window.location + '';

        let param = loc.substring(loc.indexOf('?')+1);
       console.log('param up text:', param);
        let urlParams = new URLSearchParams(param);

        console.log('62.urlParams.has: ' + urlParams.has('month'));
        let month = urlParams.get('month');
        console.log('62.passed month: ' + month);
    }

    search(event) {
        let text = event.target.value;
        console.log('TEC: search' + text);
        this.setState({ searchText: text });
        // debounce the search
        let timer;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            // console.log("timeout");

            this.searchCall(text);
        }, 300);
    }

    monthCall(searchParam) {
        EntryApi.getEntrys('month', searchParam);
    }

    searchCall(searchParam) {
        EntryApi.getEntrys('searchParam', searchParam);
    }

    handleSameDayChange(event) {
        this.setState({ sameDayInput: event.target.value });
    }

    searchSameDay() {
        EntryApi.sameDayEntrys(this.state.sameDayInput);
    }

    searchYearMonth(text) {
        console.log('YM: yearmonth' + text);
        EntryApi.getEntrys('month', text);
    }

    render() {
        console.log('TEC: render.1');
        return (
            <div>
                <EntrySearchBar
                    handleSearch={this.search}
                    searchInput={this.state.searchText}
                    handleSameDay={this.searchSameDay}
                    handleSameDayChange={this.handleSameDayChange}
                    sameDayInput={this.state.sameDayInput}
                />
                <EntryList entrys={this.props.entrys} handleDelete={this.deleteEntry} />
            </div>
        );
    }
}
const mapStateToProps = function(store) {
    return {
        entrys: store.postState.posts
    };
};
export default connect(mapStateToProps)(TextEntryContainer);
