export function hoursBetween(start, end = new Date()) {
  const startDate = start instanceof Date ? start : new Date(start);
  return Math.max(0, (end.getTime() - startDate.getTime()) / 36e5);
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

