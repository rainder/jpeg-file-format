export const suitch = <T>(value: string | number, cases: {
  [key: string]: () => T;
} | {
  [key: number]: () => T;
}, defaultFn?: () => T) => {
  for (const [key, fn] of Object.entries(cases)) {
    if (key === `${ value }`) {
      return fn();
    }
  }

  if (defaultFn) {
    return defaultFn();
  }

  throw new Error(`case ${ value } not found`);
};
