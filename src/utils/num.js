// parseFloat("") is NaN, and a single empty macro field used to poison every
// total on the page with it.
export const toNumber = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

// Trailing zeroes read as noise on a macro figure: 14 rather than 14.00, while
// 0.26 keeps its precision.
export const round = (value) => Math.round(value * 100) / 100;

export const formatNumber = (value) => round(value).toLocaleString();

export const formatGrams = (value) => `${formatNumber(value)}g`;

export const formatPercent = (share) => `${Math.round(share * 100)}%`;
