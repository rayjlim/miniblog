import React, { Fragment } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import moment from 'moment';
import constants from '../constants';
import axios from 'axios';
import './main.scss'; // webpack must be configured to do this
// import { useHistory } from 'react-router-dom';

import { withRouter } from 'react-router-dom';

class Calendar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            month: '2020-02',
            entries: [ { title: 'event 1', date: '2020-03-01' }, { title: 'event 2', date: '2020-04-02' } ]
        };

        this.handleDateClick = this.handleDateClick.bind(this);
        this.getCalendarData = this.getCalendarData.bind(this);
        this.gotoDate = this.gotoDate.bind(this);
    }
    calendarRef = React.createRef();

    ///api/posts/?month=2020-03
    componentDidMount() {
        console.log('calendar: did mount');
        let loc = window.location + '';
        let param = loc.substring(loc.indexOf('?'));
        console.log('param :', param);
        let urlParams = new URLSearchParams(param);

        const _month = urlParams.has('date') ? urlParams.get('month') : moment().format('YYYY-MM');

        this.setState((state, props) => ({
            month: _month
        }));
        // this.getMonthEntries(_month);
    }

    async getCalendarData(fetchInfo, successCallback) {
        try {
            let minFirstDay = moment();
            console.log('fetchInfo :', fetchInfo);
            if (fetchInfo) {
                const targetDay = moment(fetchInfo.start);
                minFirstDay = targetDay.add(7, 'days');
            }
            console.log('minFirstDay :', minFirstDay);

            const result = await axios(`${constants.REST_ENDPOINT}api/posts/?month=${minFirstDay.format('YYYY-MM')}`);

            if (result.status !== 200) {
                console.log('result.status :', result.status);
                alert(`loading error : ${result.status}`);
                return;
            } else if (typeof result.data === 'string') {
                console.log('invalid json');
            } else {
                console.log('result.data :>> ', result.data.unauth);
                if (result.data.unauth) {
                    // setAuth(false);
                    alert('no auth');
                } else {
                    const formattedData = result.data.entries.map((entry) => {
                        return { date: entry.date, title: entry.content };
                    });
                    successCallback(formattedData);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    gotoDate(date) {
        const day = moment(date);
        this.props.history.push(`/?date=${day.format('YYYY-MM-DD')}`);
    }

    handleDateClick = (arg) => {
        alert(arg.dateStr);
    };

    render() {
        console.log('this.state.entries :', this.state.entries);
        return (
            <Fragment>
                <nav className="navbar navbar-expand-sm  navbar-light bg-light">
                    <RouterNavLink to="/">
                        <i className="fa fa-home" /> Home
                    </RouterNavLink>
                    <RouterNavLink to="/?pageMode=1">
                        <i className="fa fa-calendar-check" /> Same Day
                    </RouterNavLink>
                </nav>

                <br />
                <br />
                <FullCalendar
                    ref={this.calendarRef}
                    defaultView="dayGridMonth"
                    plugins={[ dayGridPlugin ]}
                    // events={this.state.entries}

                    events={(fetchInfo, successCallback, failureCallback) =>
                        this.getCalendarData(fetchInfo, successCallback, failureCallback)}
                    dateClick={this.handleDateclick}
                    eventClick={(e) => this.gotoDate(e.event.start)}
                />
                <br />
                <br />
                <nav className="navbar navbar-expand-sm navbar-light bg-light">
                    <RouterNavLink to={`/upload`} className="btn navbar-btn">
                        <i className="fa fa-file-upload" /> Upload Pix
                    </RouterNavLink>
                </nav>
            </Fragment>
        );
    }
}

export default withRouter(Calendar);

