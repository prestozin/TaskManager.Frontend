import { normalizeClass, capitalizeFirst, truncateText } from "./string.util";


describe('string.util', () => {
  it('ShouldNormalizeClass_WhenValueContainsAccentAndSpaces', () => {
    expect(normalizeClass('Em Progrésso')).toBe('em-progresso');
  });

  it('ShouldCapitalizeFirst_WhenValueIsProvided', () => {
    expect(capitalizeFirst('tAREFA')).toBe('Tarefa');
  });

  it('ShouldReturnEmptyString_WhenCapitalizedValueIsEmpty', () => {
    expect(capitalizeFirst(null)).toBe('');
    expect(capitalizeFirst(undefined)).toBe('');
  });

  it('ShouldTruncateText_WhenValueExceedsMaximumLength', () => {
    expect(truncateText('abcdefghij', 5)).toBe('abcde...');
  });

  it('ShouldKeepText_WhenValueFitsMaximumLength', () => {
    expect(truncateText('abc', 5)).toBe('abc');
  });

  it('ShouldReturnEmptyString_WhenTruncatedValueIsEmpty', () => {
    expect(truncateText(null, 5)).toBe('');
  });
});
