import { isEqual } from '../misc/isEqual';

export function isArrayEqual<T = any>(
  lft: Array<T>,
  rgt: Array<T>,
  strict: boolean = true
): boolean {
  return (
    lft.length === rgt.length &&
    lft.every((value, index) =>
      strict ? value === rgt[index] : isEqual(value, rgt[index])
    )
  );
}
