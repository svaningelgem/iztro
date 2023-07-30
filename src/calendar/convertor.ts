import { getTotalDaysOfLunarMonth, getTotalDaysOfLunarYear } from './days';
import { getLeapDays, getLeapMonth } from './leap';
import { lunarDateToStr } from './misc';

export type LunarDate = {
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeap: boolean;
  toString: (toCnStr?: boolean) => string;
};

export type SolarDate = {
  solarYear: number;
  solarMonth: number;
  solarDay: number;
  toString: () => string;
};

export const normalizeLunarDateStr = (dateStr: string) => dateStr.split('-').map((item) => +item.trim());
export const normalizeSolarDateStr = (dateStr: string | Date) => {
  const date = new Date(dateStr);

  if (date.toString() === 'Invalid Date') {
    throw new Error('日期错误');
  }

  return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
};

/**
 * 公历转农历
 *
 * @param dateStr 公历日期 YYYY-MM-DD
 * @returns LunarDate
 */
export const solar2lunar = (dateStr: string): LunarDate => {
  const [year, month, day] = normalizeSolarDateStr(dateStr);

  //参数区间1900.1.31~2100.12.31
  //年份限定、上限
  if (year < 1900 || year > 2100) {
    throw new Error('超过可排盘时间');
  }

  //公历传参最下限 1900-01-31
  if (year === 1900 && month === 1 && day < 31) {
    throw new Error('超过可排盘时间');
  }

  const utcDate = Date.UTC(year, month - 1, day);
  const utcFloor = Date.UTC(1900, 0, 31);
  let lunarYear: number; // 农历年份
  let totalDayOfYear = 0;
  let offset = (utcDate - utcFloor) / 86400000; // 将差值转化为天

  for (lunarYear = 1900; lunarYear < 2101 && offset > 0; lunarYear++) {
    totalDayOfYear = getTotalDaysOfLunarYear(lunarYear);
    offset -= totalDayOfYear;
  }

  if (offset < 0) {
    offset += totalDayOfYear;
    lunarYear--;
  }

  const leapMonth = getLeapMonth(lunarYear); // 获取农历年闰月，如果该年没有闰月返回0
  let totalDayOfMonth = 0;
  let lunarMonth: number; // 农历月份
  let leapFixed = false;

  for (lunarMonth = 1; lunarMonth < 13 && offset > 0; lunarMonth++) {
    if (leapMonth > 0 && lunarMonth === leapMonth + 1 && leapFixed === false) {
      // 闰月
      --lunarMonth;
      leapFixed = true;
      totalDayOfMonth = getLeapDays(lunarYear); // 计算农历闰月天数
    } else {
      // 非闰月
      totalDayOfMonth = getTotalDaysOfLunarMonth(lunarYear, lunarMonth); // 计算农历普通月天数
    }

    // 解除闰月;
    if (leapFixed && lunarMonth === leapMonth + 1) {
      leapFixed = false;
    }

    offset -= totalDayOfMonth;
  }

  // 修复闰月导致数组下标重叠
  if (offset === 0 && leapMonth > 0 && lunarMonth === leapMonth + 1) {
    if (leapFixed) {
      leapFixed = false;
    } else {
      leapFixed = true;
      --lunarMonth;
    }
  }

  if (offset < 0) {
    offset += totalDayOfMonth;
    --lunarMonth;
  }

  const lunarDay = offset + 1;

  return {
    lunarYear,
    lunarMonth,
    lunarDay,
    isLeap: leapFixed,
    toString(toCnStr) {
      if (toCnStr) {
        return lunarDateToStr(`${lunarYear}-${lunarMonth}-${lunarDay}`, leapFixed);
      }

      return `${lunarYear}-${lunarMonth}-${lunarDay}`;
    },
  };
};

/**
 *
 * @param dateStr 农历日期 YYYY-MM-DD
 * @param isLeapMonth 是否闰月，若该月不是闰月，会忽略该参数
 * @returns SolarDate
 */
export const lunar2solar = (dateStr: string, isLeapMonth?: boolean) => {
  const [year, month, day] = normalizeLunarDateStr(dateStr);
  const leapMonth = getLeapMonth(year);

  if (isLeapMonth && leapMonth !== month) {
    // 该月不是闰月但传入了闰月标志，则讲标志设为false
    isLeapMonth = false;
  }

  const totalLeapDays = getLeapDays(year);
  const totalDaysOfTheMonth = getTotalDaysOfLunarMonth(year, month);
  // 获取当月总天数
  const totalDays = isLeapMonth ? totalLeapDays : totalDaysOfTheMonth;

  if (year < 1900 || year > 2100 || day > totalDays) {
    // 日期不合法
    throw new Error('日期错误');
  }

  // 农历日期时间偏移量
  let offset = 0;

  // 将今年以前的年份时间偏移量加入offset
  for (let i = 1900; i < year; i++) {
    offset += getTotalDaysOfLunarYear(i);
  }

  if (leapMonth < month && leapMonth > 0) {
    // 若该月前面有闰月，则需要将闰月天数加入偏移量
    offset += totalLeapDays;
  }

  // 将今年的当月以前的时间偏移量加入offset
  for (let i = 1; i < month; i++) {
    offset += getTotalDaysOfLunarMonth(year, i);
  }

  //转换闰月农历 需补充该年闰月的前一个月的时差
  if (isLeapMonth) {
    offset += totalDaysOfTheMonth;
  }

  //1900年农历正月一日的公历时间为1900年1月30日0时0分0秒(该时间也是本农历的最开始起始点)
  const stmap = Date.UTC(1900, 1, 30, 0, 0, 0);
  const solarDate = new Date((offset + day - 31) * 86400000 + stmap);
  const solarYear = solarDate.getUTCFullYear();
  const solarMonth = solarDate.getUTCMonth() + 1;
  const solarDay = solarDate.getUTCDate();

  return {
    solarYear,
    solarMonth,
    solarDay,
    toString() {
      return `${solarYear}-${solarMonth}-${solarDay}`;
    },
  };
};
