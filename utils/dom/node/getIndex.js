import { childIndex } from './childIndex';
import { clamp } from '../../lang/number/clamp';
import { isNumber } from '../../lang/number/isNumber';
import { isString } from '../../lang/string/isString';
import { toNodes } from '../misc/toNodes';
import { toNumber } from '../../lang/number/toNumber';
export function getIndex(value, elements, current = 0, finite = false) {
    elements = toNodes(elements);
    const { length } = elements;
    let offset;
    if (isString(value) || isNumber(value)) {
        offset = toNumber(value) || 0;
    }
    else if (value === 'next') {
        offset = current + 1;
    }
    else if (value === 'previous') {
        offset = current - 1;
    }
    else {
        offset = childIndex(elements, value);
    }
    if (finite) {
        return clamp(offset, 0, length - 1);
    }
    offset %= length;
    return offset < 0 ? offset + length : offset;
}
