import React, { Fragment } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import add from 'date-fns/add';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import constants from '../constants';

import './main.scss'; // webpack must be configured to do this
// import { useHistory } from 'react-router-dom';

import { withRouter } from 'react-router-dom';

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      month: '2020-02',
      entries: [],
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

    const _month = urlParams.has('date')
      ? urlParams.get('month')
      : format(new Date(), 'yyyy-MM');

    this.setState((state, props) => ({
      month: _month,
    }));
    // this.getMonthEntries(_month);
  }

  async getCalendarData(fetchInfo, successCallback) {
    try {
      let minFirstDay = new Date();
      console.log('fetchInfo :', fetchInfo);
      if (fetchInfo) {
        const targetDay = fetchInfo.start;
        minFirstDay = add(targetDay, { days: 7 });
      }
      console.log('minFirstDay :', minFirstDay);

      const response = await fetch(
        `${constants.REST_ENDPOINT}api/posts/?month=${format(
          minFirstDay,
          'yyyy-MM'
        )}`
      );

      if (!response.ok) {
        console.log('response.status :', response.status);
        alert(`loading error : ${response.status}`);
        return;
      } else {
        const data = await response.json();
        console.log('response.data :>> ', response.data.unauth);
        if (data.unauth) {
          // setAuth(false);
          alert('no auth');
        } else {
          const formattedData = data.entries.map(entry => {
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
    const day = parse(date, 'yyyy-MM-dd', new Date());
    this.props.history.push(`/?date=${format(day, 'yyyy-MM-dd')}`);
  }

  handleDateClick = arg => {
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
          <RouterNavLink to="/oneday?pageMode=1">
            <i className="fa fa-calendar-check" /> Same Day
          </RouterNavLink>
        </nav>

        <br />
        <br />
        <FullCalendar
          ref={this.calendarRef}
          defaultView="dayGridMonth"
          plugins={[dayGridPlugin]}
          // events={this.state.entries}

          events={(fetchInfo, successCallback, failureCallback) =>
            this.getCalendarData(fetchInfo, successCallback, failureCallback)
          }
          dateClick={this.handleDateclick}
          eventClick={e => this.gotoDate(e.event.start)}
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
