/**
 * Sanitize raw text input into a plain numeric string (digits + optional decimal).
 * Stored in form state and parsed by Number.parseFloat on submit.
 */
export function sanitizeAmountInput(raw: string): string {
  const stripped = raw.replace(/[^\d.]/g, '');
  if (stripped === '') {
    return '';
  }

  const dotIndex = stripped.indexOf('.');
  let integerPart: string;
  let decimalPart: string | undefined;
  let hasTrailingDot = false;

  if (dotIndex === -1) {
    integerPart = stripped;
  } else {
    integerPart = stripped.slice(0, dotIndex);
    const afterDot = stripped.slice(dotIndex + 1).replace(/\./g, '');
    decimalPart = afterDot.slice(0, 2);
    hasTrailingDot = afterDot.length === 0;
  }

  if (integerPart.length > 1) {
    integerPart = integerPart.replace(/^0+/, '') || '0';
  }

  if (integerPart === '' && (decimalPart !== undefined || hasTrailingDot)) {
    integerPart = '0';
  }

  if (decimalPart !== undefined) {
    return hasTrailingDot ? `${integerPart}.` : `${integerPart}.${decimalPart}`;
  }

  return integerPart;
}

/**
 * Format a sanitized amount string with comma thousands separators.
 * Preserves a trailing decimal point while the user is mid-typing.
 */
export function formatAmountWithCommas(sanitized: string): string {
  if (sanitized === '') {
    return '';
  }

  const dotIndex = sanitized.indexOf('.');
  const integerPart = dotIndex === -1 ? sanitized : sanitized.slice(0, dotIndex);
  const decimalSuffix =
    dotIndex === -1 ? '' : sanitized.slice(dotIndex);

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${formattedInteger}${decimalSuffix}`;
}
