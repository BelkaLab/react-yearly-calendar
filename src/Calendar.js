import React from 'react';
import moment from 'moment';
import { Day } from './Day';

const propTypes = {
  year: React.PropTypes.number.isRequired,
  forceFullWeeks: React.PropTypes.bool,
  showDaysOfWeek: React.PropTypes.bool,
  onPickDate: React.PropTypes.func,
  dayToCSSClass: React.PropTypes.object
};

const defaultProps = {
  year: moment().year(),
  forceFullWeeks: false,
  showDaysOfWeek: true,
  onPickDate: null,
  selectedDay: moment(),
  dayToCSSClass: {}
};

// Grabbed from the underscore.js source code (https://github.com/jashkenas/underscore/blob/master/underscore.js#L691)
let range = function(start, stop, step) {
  if (stop == null) {
    stop = start || 0;
    start = 0;
  }
  step = step || 1;

  var length = Math.max(Math.ceil((stop - start) / step), 0);
  var range = Array(length);

  for (var idx = 0; idx < length; idx++, start += step) {
    range[idx] = start;
  }

  return range;
};

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
  }

  _monthDays(month) {
    const { year, forceFullWeeks, selectedDay, onPickDate, dayToCSSClass } = this.props;
    const monthStart = moment([year, month, 1]); // current day

    // number of days to insert before the first of the month to correctly align the weekdays
    const prevMonthDaysCount = monthStart.weekday();
    // days in month
    const numberOfDays = monthStart.daysInMonth();
    // insert days at the end to match up 37 (max number of days in a month + 6)
    // or 42 (if user prefers seeing the week closing with Sunday)
    const totalDays = forceFullWeeks? 42: 37;

    // day-generating loop
    return range(1, totalDays+1).map( i => {
      let day = moment([year, month, i - prevMonthDaysCount]);
      let dayStr = day.toISOString();

      // pick appropriate classes
      let classes = [];
      if( i <= prevMonthDaysCount ) {
        classes.push('prev-month');
      } else if ( i > (numberOfDays + prevMonthDaysCount) ) {
        classes.push('next-month');
      } else {
        // 'selected' class sholud be applied only to days in this month
        if( day.isSame(selectedDay, 'day') ) {
          classes.push('selected');
        }
      }

      if( (i-1)%7 === 0 ) {
        classes.push('bolder');
      }

      if (dayStr in dayToCSSClass) {
        classes.push(dayToCSSClass[dayStr]);
      }

      return (
        <Day
          key={'day-' + i}
          day={day}
          classes={classes.join(' ')}
          onClick={onPickDate}
        />
      );
    });
  }

  monthName(month, year) {
    return moment([year, month, 1]).format('MMM');
  }

  daysOfWeek(forceFullWeeks) {
    var daysOfWeek = [];
    const totalDays = forceFullWeeks? 42: 37;
    for (let i = 0; i < totalDays; i++) {
      daysOfWeek.push(moment().weekday(i).format('dd').charAt(0));
    }

    return daysOfWeek;
  }

  render() {
    const { year, forceFullWeeks } = this.props;
    let weekDays;
    if(this.props.showDaysOfWeek) {
      weekDays = (
        <tr>
          <th>
            &nbsp;
          </th>
          {this.daysOfWeek().map((day, i) => {
            return (
              <th
                key={'weekday-' + i}
                className={i%7==0? 'bolder': ''}
              >
                {day}
              </th>
            );
          })}
        </tr>
      );
    }

    const months = range(0,12).map((month, i) => {
      return (
        <tr key={'month' + i}>
          <td className='month-name'>
            {this.monthName(month, year)}
          </td>
          {this._monthDays(month)}
        </tr>
      );
    });

    return (
      <table className='calendar'>
        <thead className='day-headers'>
          {weekDays}
        </thead>
        <tbody>
          {months}
        </tbody>
      </table>
    );
  }
}

Calendar.propTypes = propTypes;
Calendar.defaultProps = defaultProps;
