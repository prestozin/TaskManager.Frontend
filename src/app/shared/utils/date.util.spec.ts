import {
  convertLocalDateToUtc,
  formatDateToApi,
  getDateMonthsAgo,
  parseApiDate
} from './date.util';

describe('date.util', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('ShouldFormatDate_WhenDateIsProvided', () => {
    expect(formatDateToApi(new Date(2026, 8, 7))).toBe('2026-09-07');
  });

  it('ShouldReturnNull_WhenDateIsNull', () => {
    expect(formatDateToApi(null)).toBeNull();
  });

  it('ShouldParseDate_WhenApiDateIsProvided', () => {
    const result = parseApiDate('2026-09-07');

    expect(result?.getFullYear()).toBe(2026);
    expect(result?.getMonth()).toBe(8);
    expect(result?.getDate()).toBe(7);
  });

  it('ShouldReturnNull_WhenApiDateIsNull', () => {
    expect(parseApiDate(null)).toBeNull();
  });

  it('ShouldReturnPreviousMonthDate_WhenMonthsAgoIsProvided', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 27, 12));

    expect(getDateMonthsAgo(1)).toBe('2026-08-27');
  });

  it('ShouldConvertStartDateToUtc_WhenEndOfDayIsFalse', () => {
    const result = convertLocalDateToUtc('2026-09-27');

    const date = new Date(result);

    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(8);
    expect(date.getDate()).toBe(27);
  });

  it('ShouldConvertNextLocalMidnightToUtc_WhenEndOfDayIsTrue', () => {
    const result = convertLocalDateToUtc('2026-09-27', true);

    const date = new Date(result);

    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(8);
    expect(date.getDate()).toBe(28);
  });
});
