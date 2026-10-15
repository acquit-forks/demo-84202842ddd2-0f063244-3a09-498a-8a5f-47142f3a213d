export type Line = { amount: number };

// ISO 4217 defines the minor-unit exponent (digits after the decimal point)
// for every currency code: 2 for USD, 0 for JPY, 3 for KWD, etc. Rather than
// hardcoding a table, derive it from the runtime's ECMA-402 / CLDR data,
// which implements ISO 4217 and stays current with it.
function currencyDigits(currency: string): number {
  try {
    const options = new Intl.NumberFormat('en', {
      style: 'currency',
      currency,
    }).resolvedOptions();
    return options.maximumFractionDigits ?? 2;
  } catch {
    // Not a valid ISO 4217 code, so no minor unit is defined for it.
    // Keep the previous two-decimal behavior.
    return 2;
  }
}

export function formatTotal(lines: Line[], currency: string): string {
  const sum = lines.reduce((total, line) => total + line.amount, 0);
  return sum.toFixed(currencyDigits(currency));
}
