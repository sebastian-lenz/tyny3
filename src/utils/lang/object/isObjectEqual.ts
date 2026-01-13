import { isEqual } from '../misc/isEqual';

export function isObjectEqual(
  lft: tyny.AnyObject,
  rgt: tyny.AnyObject,
  strict: boolean = true
): boolean {
  const keys = Object.keys(lft);
  return (
    keys.length === Object.keys(rgt).length &&
    keys.every((key) =>
      strict ? lft[key] === rgt[key] : isEqual(lft[key], rgt[key])
    )
  );
}
