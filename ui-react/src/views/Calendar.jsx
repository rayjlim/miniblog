import React, { Fragment } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import moment from 'moment';
import constants from '../constants';
import axios from 'axios';
import './main.scss'; // webpack must be configured to do this

export default class Calendar extends React.Component {
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
      
        const targetDay = moment(fetchInfo.start)
         minFirstDay = targetDay.add(7, 'days');
        
      }
      console.log('minFirstDay :', minFirstDay);

			const response = await axios(`${constants.REST_ENDPOINT}api/posts/?month=${minFirstDay.format('YYYY-MM')}`);

			const formattedData = response.data.entries.map((entry) => {
				return { date: entry.date, title: entry.content };
			});

			// this.setState((state, props) => ({
			// 	entries: formattedData
			// }));

			successCallback(formattedData);
		} catch (error) {
			console.log(error);
		}
  }
  
  gotoDate(date){
    const day=moment(date);
    window.location = `/?date=${day.format('YYYY-MM-DD')}`;
  }

	handleDateClick = (arg) => {
		alert(arg.dateStr);
	};

	render() {
		console.log('this.state.entries :', this.state.entries);
		return (
			<Fragment>
				<RouterNavLink to="/textentry">textentry</RouterNavLink>
				<RouterNavLink to="/sameday">sameday</RouterNavLink>
				<FullCalendar
					ref={this.calendarRef}
					defaultView="dayGridMonth"
					plugins={[ dayGridPlugin ]}
					// events={this.state.entries}

					events={(fetchInfo, successCallback, failureCallback) =>
						this.getCalendarData(fetchInfo, successCallback, failureCallback)}
          dateClick={this.handleDateclick}
          
          eventClick={e=>this.gotoDate( e.event.start)}
				/>
			</Fragment>
		);
	}
}
