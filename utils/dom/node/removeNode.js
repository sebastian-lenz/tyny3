import { toNodes } from '../misc/toNodes';
export function removeNode(element) {
    toNodes(element).map((element) => element.parentNode && element.parentNode.removeChild(element));
}
