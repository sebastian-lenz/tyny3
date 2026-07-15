import { __decorate } from "tslib";
import * as events from './events';
import { Behaviour } from '../../core/Behaviour';
import { createElement } from '../../utils/dom/node/createElement';
import { event, getClassNamePrefix } from '../../core';
function getApp() {
    return this.view.el;
}
export class ProgressBehaviour extends Behaviour {
    constructor(view, options) {
        super(view, options);
        this.current = null;
        this.createOptions = Object.assign({ appendTo: document.body, className: `${getClassNamePrefix()}App__progress`, tagName: 'div' }, (options.progress || {}));
    }
    onBeginLoad() {
        this.onEndLoad();
        const element = (this.current = createElement(this.createOptions));
        setTimeout(() => element.classList.add('started'), 0);
    }
    onEndLoad() {
        const { current: element } = this;
        this.current = null;
        if (element) {
            element.classList.remove('started');
            element.classList.add('finished');
            setTimeout(() => element.classList.add('fadeOut'), 300);
            setTimeout(() => element.remove(), 600);
        }
    }
}
__decorate([
    event({ name: events.beginLoadEvent, target: getApp })
], ProgressBehaviour.prototype, "onBeginLoad", null);
__decorate([
    event({ name: events.endLoadEvent, target: getApp })
], ProgressBehaviour.prototype, "onEndLoad", null);
