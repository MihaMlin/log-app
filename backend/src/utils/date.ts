export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// --- past dates ---
export const fiveMinutesAgo = () => new Date(Date.now() - 5 * 60 * 1000);

export const oneHourAge = () => new Date(Date.now() - 60 * 60 * 1000);

export const oneDayAgo = () => new Date(Date.now() - ONE_DAY_MS);

// --- future dates ---
export const fifteenMinutesFromNow = () =>
  new Date(Date.now() + 15 * 60 * 1000);

export const oneHourFromNow = () => new Date(Date.now() + 60 * 60 * 1000);

export const oneDayFromNow = () => new Date(Date.now() + ONE_DAY_MS);

export const thirtyDaysFromNow = () => new Date(Date.now() + 30 * ONE_DAY_MS);

export const oneYearFromNow = () => new Date(Date.now() + 365 * ONE_DAY_MS);
