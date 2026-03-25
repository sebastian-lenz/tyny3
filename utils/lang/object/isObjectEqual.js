import { isEqual } from '../misc/isEqual';
export function isObjectEqual(lft, rgt, strict = true) {
    const keys = Object.keys(lft);
    return (keys.length === Object.keys(rgt).length &&
        keys.every((key) => strict ? lft[key] === rgt[key] : isEqual(lft[key], rgt[key])));
}
