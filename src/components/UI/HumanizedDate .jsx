'use client'
import React from 'react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz'
import Cookies from 'js-cookie';

const tz = Cookies.get('timeZone') || 'UTC';
const HumanizedDate = ({ dateString, humanize, className, showHours, showTime }) => {
    // Handle null or undefined dateString
    if (!dateString) {
        return <span className={className}>Invalid date</span>;
    }
    
  // Verilen tarih dizesini parseISO ile bir Date nesnesine dönüştür
  const date = parseISO(dateString);

  // burda cookieden alıp çevircez. şimdilik istanbul verdim.
  const zonedDate = toZonedTime(date, tz)

  // If showTime is true, only display the time in 'HH.mm' format
  if (showTime) {
    const formattedTime = format(zonedDate, 'HH.mm');
    return <span className={className}>{formattedTime}</span>;
  }

  // Format the date in a human-readable format or in the specified format
  const formattedDate = humanize 
    ? formatDistanceToNow(date, { addSuffix: true, locale: enGB })
    : format(zonedDate, showHours ? 'MMM d, yyyy HH:mm' : 'MMM d, yyyy', { locale: enGB });

  return (
    <span className={className}>
      {formattedDate}
    </span>
  );
};

export default HumanizedDate;
