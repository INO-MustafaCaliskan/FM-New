"use client";
import cookies from "js-cookie";
import { DateTime } from "luxon";

const tz =
  cookies.get("timeZone") ||
  Intl.DateTimeFormat().resolvedOptions().timeZone ||
  "Etc/UTC";

const useDateProcess = () => {
  const toUserZone = (dateString) => {
    if (!dateString) return null;

    try {
      return DateTime.fromISO(dateString).setZone(tz).toJSDate()
    } catch (error) {
      console.log(error);
      return dateString;
    }
  };
  const inoFormat = (dateString) => {
    if (!dateString) return null;

    try {
      return DateTime.fromISO(dateString)
        .setZone(tz)
        .toFormat("MMM d, yyyy HH:mm");
    } catch (error) {
      console.log(error);
      return dateString;
    }
  };

  const timeOnly = (dateString) => {
    if (!dateString) return null;

    try {
      return DateTime.fromISO(dateString).setZone(tz).toFormat("HH:mm");
    } catch (error) {
      console.log(error);
      return dateString;
    }
  };

  const dateOnly = (dateString) => {
    if (!dateString) return null;

    try {
      return DateTime.fromISO(dateString).setZone(tz).toFormat("MMM d, yyyy");
    } catch (error) {
      console.log(error);
      return dateString;
    }
  };

  const weekDay = (dateString) => {
    if (!dateString) return null;

    try {
      return DateTime.fromISO(dateString).setZone(tz).toFormat("EEEE");
    } catch (error) {
      console.log(error);
      return dateString;
    }
  };

  const dateDiffByMinutes = (date1, date2) => {
    // İki tarih arasındaki farkı dakika cinsinden hesaplama
    return DateTime.fromISO(date1).diff(DateTime.fromISO(date2), "minutes")
      .minutes;
  };

  const dateDiffByHours = (date1, date2) => {
    // İki tarih arasındaki farkı saat cinsinden hesaplama
    return DateTime.fromISO(date1).diff(DateTime.fromISO(date2), "hours").hours;
  };

  const dateDiffByDays = (date1, date2) => {
    // İki tarih arasındaki farkı gün cinsinden hesaplama
    return DateTime.fromISO(date1).diff(DateTime.fromISO(date2), "days").days;
  };

  return {
    inoFormat,
    timeOnly,
    dateOnly,
    weekDay,
    dateDiffByMinutes,
    dateDiffByHours,
    dateDiffByDays,
    toUserZone,
  };
};

export default useDateProcess;
