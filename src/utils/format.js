/**
 * VELORA utility module
 * format
 *
 * Small, boring formatters that more than one screen needs.
 */

const UNITS = ['B', 'kB', 'MB'];

/**
 * A byte count as a short string: "0 B", "980 B", "12.4 kB".
 *
 * Decimal units, because this is compared against a browser quota that is
 * quoted in decimal (5 MB), and because a figure that says 12.4 kB next to
 * 13,000 characters is easier to reconcile than 12 kB next to 12.7 KiB.
 *
 * One decimal place, but only when it adds something: 2 kB, not 2.0 kB.
 */
export const formatBytes = (bytes) => {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value <= 0) return '0 B';

  let scaled = value;
  let unit = 0;
  while (scaled >= 1000 && unit < UNITS.length - 1) {
    scaled /= 1000;
    unit += 1;
  }

  const rounded = unit === 0 ? Math.round(scaled) : Math.round(scaled * 10) / 10;
  return `${rounded} ${UNITS[unit]}`;
};

export default formatBytes;
