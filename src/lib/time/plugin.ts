// main library
import dayjs from 'dayjs';

// plugins
import advancedFormat from 'dayjs/plugin/advancedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';

const localeList = dayjs.Ls;

// extend dayjs with plugins
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(utc);
dayjs.extend(localizedFormat);

dayjs.updateLocale('en', {
  relativeTime: {
    ...localeList.en.relativeTime,
    future: 'in %s',
    past: '%s ago',
    s: '%ds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '30d',
    MM: '%dmo',
    y: '1y',
    yy: '%dy',
  },
});

export default dayjs;
