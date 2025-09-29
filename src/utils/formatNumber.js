import { replace } from 'lodash';
import numeral from 'numeral';

// ----------------------------------------------------------------------

const locale = 'en-US';
export function fCurrency(number) {
  const currency = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: process.env.CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  // Always return with exactly two decimal places; do not trim the last character
  // (previous implementation removed the last digit resulting in e.g. 1980.0)
  return currency.format(number);
}

export function fPercent(number) {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number) {
  return numeral(number).format();
}

export function fShortenNumber(number) {
  return replace(numeral(number).format('0.00a'), '.00', '');
}

export function fData(number) {
  return numeral(number).format('0.0 b');
}
