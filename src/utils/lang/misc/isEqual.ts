import { isArrayEqual } from '../array/isArrayEqual';
import { isObjectEqual } from '../object/isObjectEqual';
import { typeOf } from '../object/shape';

export function isEqual(lft: any, rgt: any): boolean {
  const type = typeOf(lft);
  if (type !== typeOf(rgt)) {
    return false;
  }

  switch (type) {
    case 'array':
      return isArrayEqual(lft, rgt);
    case 'object':
      return isObjectEqual(lft, rgt);
    default:
      return lft === rgt;
  }
}
