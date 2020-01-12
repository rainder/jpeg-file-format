export const fallback = <T>(
  fns: Array<() => T>,
) => {
  for (const fn of fns) {
    try {
      return fn();
    } catch (e) {
      // console.error(e);
    }
  }

  throw new Error('fallback failure');
};
