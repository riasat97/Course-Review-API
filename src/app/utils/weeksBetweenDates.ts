export const weeksBetweenDates = (d1: Date, d2: Date): number => {
  return Math.round(
    Math.ceil(d2.getTime() - d1.getTime()) / (7 * 24 * 60 * 60 * 1000),
  );
};
