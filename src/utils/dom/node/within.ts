import { closest } from './closest';
import { matches } from './matches';
import { isDocument } from '../misc/isDocument';
import { isString } from '../../lang/string/isString';
import { toElement } from '../misc/toElement';
import { toNode } from '../misc/toNode';

export function within(
  element: tyny.ElementLike,
  selector: string | Document | tyny.ElementLike
): boolean {
  if (isString(selector)) {
    return matches(element, selector) || !!closest(element, selector);
  } else if (element === selector) {
    return true;
  }

  // IE 11 document does not implement contains
  const scope = isDocument(selector)
    ? selector.documentElement
    : toElement(selector);

  return scope ? scope.contains(toNode(element)) : false;
}
