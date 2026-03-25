import { isEqual } from '../misc/isEqual';
export function isArrayEqual(lft, rgt, strict = true) {
    return (lft.length === rgt.length &&
        lft.every((value, index) => strict ? value === rgt[index] : isEqual(value, rgt[index])));
}
