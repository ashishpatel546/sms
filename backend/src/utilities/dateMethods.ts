import { BadRequestException } from '@nestjs/common';
import * as moment from 'moment';

export const parseDate = (start_date: Date, end_date: Date): Array<Date> => {
  start_date.setHours(0, 0, 0, 0);
  end_date.setHours(23, 59, 59, 999);
  return [start_date, end_date];
};


export const stringToDate = (
  exam_date: string
): Date => {
  try {
    return new Date(exam_date);
  } catch (error) {
    return null;
  }
};// export const stringToDate = (
//   start_date: string,
//   end_date: string,
// ): Array<Date> => {
//   try {
//     return [new Date(start_date), new Date(end_date)];
//   } catch (error) {
//     return [null, null];
//   }
// };

export const parseDateToDbFormat = (date: Date): string => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss.ms');
};

export const convertMilliSecondsToTimeFormat = (duration: number) => {
  if (duration === 0) return '00:00:00';
  if (!duration) return null;

  const durationInSeconds = Math.floor(duration / 1000);

  const seconds = Math.floor(durationInSeconds % 60);
  const minutes = Math.floor((durationInSeconds / 60) % 60);
  let hours = Math.floor((durationInSeconds / 3600) % 24);
  const days = Math.floor(durationInSeconds / (3600 * 24));

  hours = days ? days * 24 + hours : hours;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export function convertLocalToUTC(dt: Date) {
  return moment(dt).utc().toDate();
}

export function getDayEndTimeStamp(date: Date) {
  if (!date) return null;
  const tempDate = new Date(date);
  tempDate.setHours(23, 59, 59, 999);
  return tempDate;
}

export function getDayStartTimeStamp(date: Date) {
  if (!date) return null;
  const tempDate = new Date(date);
  tempDate.setHours(0, 0, 0, 0);
  return tempDate;
}

export function timestampToDateString(date: Date): string {
  if (!date) return null;
  return moment(date).format('YYYY-MM-DD');
}

export function getPreviousDay(date: Date = new Date()): Date {
  if (!date) return null;
  const tempDate = new Date(date);
  tempDate.setDate(tempDate.getDate() - 1);
  return tempDate;
}

export function getNextDay(date: Date = new Date()): Date {
  if (!date) return null;
  const tempDate = new Date(date);
  tempDate.setDate(tempDate.getDate() + 1);
  return tempDate;
}

export function dateObjToDateString(date: Date): string {
  if (!date) return null;
  return moment(date).format('YYYY-MM-DD');
}

export function dateValidation(start_date: Date, end_date: Date): Date[] {
  const isValidFromDate: boolean = moment(start_date).isValid();
  const isValidtoDate: boolean = moment(end_date).isValid();
  const isValidDuration: boolean = moment(start_date).isSameOrBefore(end_date);
  if (!isValidFromDate || !isValidtoDate || !isValidDuration)
    throw new BadRequestException('Invalid Date or Date range');
  const [from, to] = parseDate(new Date(start_date), new Date(end_date));
  if (!from || !to)
    throw new BadRequestException('Invalid Date format recieved');
  return [from, to];
}
