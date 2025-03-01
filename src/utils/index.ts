export const pad = (number: string | number, length = 2) => {
  let res = "" + number;
  while (res.length < length) {
    res = "0" + res;
  }
  return res;
};
export const int = (bool: boolean) => (bool === true ? 1 : 0);

/* istanbul ignore next */
export function debounce<F extends Function>(fn: F, wait: number) {
  let t: NodeJS.Timeout;
  return function (this: any) {
    const args = arguments;
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

export const arrayify = <T>(obj: T | T[]): T[] =>
  obj instanceof Array ? obj : [obj];

export type IncrementEvent = MouseEvent & { delta: number; type: "increment" };
