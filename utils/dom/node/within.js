import { closest } from './closest';
import { matches } from './matches';
import { isDocument } from '../misc/isDocument';
import { isString } from '../../lang/string/isString';
import { toElement } from '../misc/toElement';
import { toNode } from '../misc/toNode';
export function within(element, selector) {
    if (isString(selector)) {
        return matches(element, selector) || !!closest(element, selector);
    }
    else if (element === selector) {
        return true;
    }
    const scope = isDocument(selector)
        ? selector.documentElement
        : toElement(selector);
    return scope ? scope.contains(toNode(element)) : false;
}
