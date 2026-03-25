import { toElement } from '../misc/toElement';
export function parent(value) {
    const element = toElement(value);
    return element ? element.parentElement : null;
}
