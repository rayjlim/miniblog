import React, { Component } from 'react';
import FullCalendar from '../views/FullCalendar.jsx';

class FullCalendarContainer extends Component {
    render() {
        console.log('FCC: render');
        return (
            <div>
                <Navigator />
                <FullCalendar />
            </div>
        );
    }
}

export default FullCalendarContainer;
