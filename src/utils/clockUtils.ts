type TimeZoneInfo = {
  gmtOffset: number;
};

export const convertLocalToZone = (
  localDate: Date,
  targetZone: TimeZoneInfo,
): Date => {
  const utcMs = localDate.getTime() + localDate.getTimezoneOffset() * 60 * 1000;

  const targetMs = utcMs + targetZone.gmtOffset * 1000;

  return new Date(targetMs);
};
