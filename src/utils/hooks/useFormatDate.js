
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import Cookies from 'js-cookie';

// Example usages:
// console.log(formatDate('2024-07-24T18:14:00Z', false, false, 'dayOfWeek')); // Outputs: Tuesday
// console.log(formatDate('2024-07-24T18:14:00Z', false, false, 'timeOnly')); // Outputs: 18.14
// console.log(formatDate('2024-07-24T18:14:00Z', false, false, 'yearOnly')); // Outputs: 2024
// console.log(formatDate('2024-07-24T18:14:00Z', false, true)); // Outputs: in x days
// console.log(formatDate('2024-07-24T18:14:00Z', true)); // Outputs: Jul 24, 2024 18:14

const tz = Cookies.get('timeZone') || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Etc/UTC';
const useFormatDate = () => {
  return (dateString, showHours, humanize = false, formatOption = '') => {
    if (!dateString) return '';

    try {
      const date = parseISO(dateString);
      const zonedDate = toZonedTime(date, tz);
      let formattedDate = '';

      switch (formatOption) {
        case 'dayOfWeek':
          formattedDate = format(zonedDate, 'EEEE', { locale: enGB });
          break;
        case 'timeOnly':
          formattedDate = format(zonedDate, 'HH.mm');
          break;
        case 'yearOnly':
          formattedDate = format(zonedDate, 'yyyy');
          break;
        default:
          formattedDate = humanize
            ? formatDistanceToNow(zonedDate, { addSuffix: true, locale: enGB })
            : format(zonedDate, showHours ? 'MMM d, yyyy HH:mm' : 'MMM d, yyyy', { locale: enGB });
      }

      return formattedDate;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };
};

export default useFormatDate;
