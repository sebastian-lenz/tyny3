import { isString } from '../../lang/string/isString';
import { fragment } from './fragment';
import { find, findAll } from './find';
import { toElement } from '../misc/toElement';
import { toElements } from '../misc/toElements';
function isHtml(str) {
    return str[0] === '<' || !!str.match(/^\s*</);
}
export function $(selector, ctx) {
    if (!isString(selector)) {
        return toElement(selector);
    }
    else if (isHtml(selector)) {
        return toElement(fragment(selector));
    }
    return find(selector, ctx);
}
export function $$(selector, ctx) {
    if (!isString(selector)) {
        return toElements(selector);
    }
    else if (isHtml(selector)) {
        return toElements(fragment(selector));
    }
    return findAll(selector, ctx);
}
