import { getScrollTop } from '../../../utils/dom/window/getScrollTop';
import { getState } from './state';
export function resetScrollPosition(url) {
    let top = 0;
    if (url.fragment) {
        const target = document.getElementById(url.fragment);
        const rect = target ? target.getBoundingClientRect() : null;
        top = rect ? rect.top + getScrollTop() : 0;
    }
    setTimeout(() => {
        window.scrollTo({ left: 0, top });
    }, 0);
}
export function restoreScrollPosition() {
    const value = getState('scrollPosition');
    if (typeof value !== 'object') {
        return;
    }
    setTimeout(() => {
        window.scrollTo(value);
    }, 0);
}
export function scrollToElement(target, behavior = 'smooth') {
    if (!target) {
        return;
    }
    window.scroll({
        behavior,
        left: 0,
        top: target.getBoundingClientRect().top + getScrollTop(),
    });
}
