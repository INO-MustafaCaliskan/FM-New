import moment from 'moment-timezone';

const TimeZoneDisplay = ({ timeZone, className = "", isInSpan = true }) => {
  
    const formattedTimeZone = moment.tz(timeZone).format('Z');
  
    if(isInSpan){
      return (
        <span className={className}>
          {`(GMT${formattedTimeZone}) ${timeZone} `}
        </span>
      );
    }

    return `(GMT${formattedTimeZone}) ${timeZone} `;
  };

export default TimeZoneDisplay