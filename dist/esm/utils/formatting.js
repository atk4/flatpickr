import { int, pad } from "../utils";
import { defaults } from "../types/options";
var doNothing = function () { return undefined; };
export var monthToStr = function (monthNumber, shorthand, locale) { return locale.months[shorthand ? "shorthand" : "longhand"][monthNumber]; };
var setDateSeconds = function (dateObj, secondsStr, isAbsolute) {
    var secondsArr = secondsStr.split(".", 2);
    var seconds = parseInt(secondsArr[0]);
    var nanos = secondsArr.length > 1
        ? Math.floor(parseInt(secondsArr[1]) * Math.pow(10, 9 - secondsArr[1].length))
        : 0;
    if (isAbsolute) {
        dateObj.setTime(seconds * 1000);
    }
    else {
        dateObj.setSeconds(seconds);
    }
    dateObj.setMilliseconds(Math.floor(nanos / 1000000));
    nanos = nanos - dateObj.getMilliseconds() * 1000000;
    if (nanos) {
        dateObj.flatpickrNanoseconds = nanos;
    }
    else if (dateObj.flatpickrNanoseconds !== undefined) {
        delete dateObj.flatpickrNanoseconds;
    }
};
var formatDateSeconds = function (date, isAbsolute, formatSecondsPrecision) {
    var seconds = isAbsolute
        ? Math.floor(date.getTime() / 1000)
        : date.getSeconds();
    var nanos = date.getMilliseconds() * 1000000 +
        (date.flatpickrNanoseconds || 0);
    if (formatSecondsPrecision > 0) {
        return seconds + "." + pad(nanos, 9).slice(0, formatSecondsPrecision);
    }
    else if (formatSecondsPrecision < 0 && nanos) {
        return seconds + "." + pad(nanos, 9).replace(/0+$/, "");
    }
    return "" + seconds;
};
var moveNumberDot = function (number, offset) {
    var pos = number.indexOf(".");
    if (pos !== -1) {
        number = number.slice(0, pos) + number.slice(pos + 1);
    }
    else {
        pos = number.length;
    }
    var newPos = pos + offset;
    if (newPos <= 0) {
        return "0." + pad(number, -newPos + 1);
    }
    else if (newPos < number.length) {
        return number.slice(0, newPos) + "." + number.slice(newPos);
    }
    while (newPos > number.length) {
        number += "0";
    }
    return number;
};
export var revFormat = {
    D: doNothing,
    F: function (dateObj, monthName, locale) {
        dateObj.setMonth(locale.months.longhand.indexOf(monthName));
    },
    G: function (dateObj, hour) {
        dateObj.setHours((dateObj.getHours() >= 12 ? 12 : 0) + parseFloat(hour));
    },
    H: function (dateObj, hour) {
        dateObj.setHours(parseFloat(hour));
    },
    J: function (dateObj, day) {
        dateObj.setDate(parseFloat(day));
    },
    K: function (dateObj, amPM, locale) {
        dateObj.setHours((dateObj.getHours() % 12) +
            12 * int(new RegExp(locale.amPM[1], "i").test(amPM)));
    },
    M: function (dateObj, shortMonth, locale) {
        dateObj.setMonth(locale.months.shorthand.indexOf(shortMonth));
    },
    S: function (dateObj, seconds) {
        setDateSeconds(dateObj, seconds, false);
    },
    U: function (dateObj, unixSeconds) {
        setDateSeconds(dateObj, unixSeconds, true);
    },
    W: function (dateObj, weekNum, locale) {
        var weekNumber = parseInt(weekNum);
        var date = new Date(dateObj.getFullYear(), 0, 2 + (weekNumber - 1) * 7, 0, 0, 0, 0);
        date.setDate(date.getDate() - date.getDay() + locale.firstDayOfWeek);
        return date;
    },
    Y: function (dateObj, year) {
        dateObj.setFullYear(parseFloat(year));
    },
    Z: function (_, ISODate) { return new Date(ISODate); },
    d: function (dateObj, day) {
        dateObj.setDate(parseFloat(day));
    },
    h: function (dateObj, hour) {
        dateObj.setHours((dateObj.getHours() >= 12 ? 12 : 0) + parseFloat(hour));
    },
    i: function (dateObj, minutes) {
        dateObj.setMinutes(parseFloat(minutes));
    },
    j: function (dateObj, day) {
        dateObj.setDate(parseFloat(day));
    },
    l: doNothing,
    m: function (dateObj, month) {
        dateObj.setMonth(parseFloat(month) - 1);
    },
    n: function (dateObj, month) {
        dateObj.setMonth(parseFloat(month) - 1);
    },
    s: function (dateObj, seconds) {
        setDateSeconds(dateObj, seconds, false);
    },
    u: function (dateObj, unixMilliseconds) {
        setDateSeconds(dateObj, moveNumberDot(unixMilliseconds, -3), true);
    },
    w: doNothing,
    y: function (dateObj, year) {
        dateObj.setFullYear(2000 + parseFloat(year));
    },
};
export var tokenRegex = {
    D: "",
    F: "",
    G: "(\\d{1,2})",
    H: "(\\d{1,2})",
    J: "(\\d{1,2})\\w+",
    K: "",
    M: "",
    S: "(\\d{1,2}(?:\\.\\d+)?)",
    U: "(\\d+(?:\\.\\d+)?)",
    W: "(\\d{1,2})",
    Y: "(\\d{4})",
    Z: "(.+)",
    d: "(\\d{1,2})",
    h: "(\\d{1,2})",
    i: "(\\d{1,2})",
    j: "(\\d{1,2})",
    l: "",
    m: "(\\d{1,2})",
    n: "(\\d{1,2})",
    s: "(\\d{1,2}(?:\\.\\d+)?)",
    u: "(\\d+(?:\\.\\d+)?)",
    w: "(\\d{1,2})",
    y: "(\\d{2})",
};
export var formats = {
    Z: function (date) { return date.toISOString(); },
    D: function (date, locale, formatSecondsPrecision) {
        return locale.weekdays.shorthand[parseInt(formats.w(date, locale, formatSecondsPrecision))];
    },
    F: function (date, locale, formatSecondsPrecision) {
        return monthToStr(parseInt(formats.n(date, locale, formatSecondsPrecision)) - 1, false, locale);
    },
    G: function (date, locale, formatSecondsPrecision) {
        return pad(formats.h(date, locale, formatSecondsPrecision));
    },
    H: function (date) { return pad(date.getHours()); },
    J: function (date, locale) {
        return (date.getDate() +
            (locale.ordinal !== undefined ? locale.ordinal(date.getDate()) : ""));
    },
    K: function (date, locale) { return locale.amPM[int(date.getHours() > 11)]; },
    M: function (date, locale) {
        return monthToStr(date.getMonth(), true, locale);
    },
    S: function (date, _, formatSecondsPrecision) {
        var res = formatDateSeconds(date, false, formatSecondsPrecision);
        var resArr = res.split(".");
        resArr[0] = pad(resArr[0], 2);
        return resArr.join(".");
    },
    U: function (date, _, formatSecondsPrecision) { return formatDateSeconds(date, true, formatSecondsPrecision); },
    W: function (date) { return "" + defaults.getWeek(date); },
    Y: function (date) { return pad(date.getFullYear(), 4); },
    d: function (date) { return pad(date.getDate()); },
    h: function (date) { return "" + (date.getHours() % 12 ? date.getHours() % 12 : 12); },
    i: function (date) { return pad(date.getMinutes()); },
    j: function (date) { return "" + date.getDate(); },
    l: function (date, locale) {
        return locale.weekdays.longhand[date.getDay()];
    },
    m: function (date) { return pad(date.getMonth() + 1); },
    n: function (date) { return "" + (date.getMonth() + 1); },
    s: function (date, _, formatSecondsPrecision) { return formatDateSeconds(date, false, formatSecondsPrecision); },
    u: function (date, _, formatSecondsPrecision) { return moveNumberDot(formatDateSeconds(date, true, formatSecondsPrecision), 3); },
    w: function (date) { return "" + date.getDay(); },
    y: function (date) { return String(date.getFullYear()).substring(2); },
};
