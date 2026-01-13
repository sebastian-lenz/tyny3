import { filter } from './filter';
import { toElement } from '../misc/toElement';
import { toElements } from '../misc/toElements';

export function children(
  element: tyny.ElementLike,
  selector?: string
): HTMLElement[] {
  const scope = toElement(element);
  const children = scope ? toElements(scope.children) : [];
  return selector ? filter(children, selector) : children;
}
