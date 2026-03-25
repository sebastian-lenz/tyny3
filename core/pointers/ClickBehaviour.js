import { Behaviour } from '../Behaviour';
import { on } from '../../utils/dom/event/on';
export class ClickBehaviour extends Behaviour {
    constructor(view, options) {
        super(view, options);
        this.shouldPreventNextClick = false;
        this.onClick = options.onClick || null;
    }
    onConnected() {
        this.addDestructor(on(this.el, 'click', this.onViewClick, { capture: true, scope: this }));
    }
    onViewClick(event) {
        if (this.shouldPreventNextClick) {
            this.shouldPreventNextClick = false;
            event.preventDefault();
            event.stopPropagation();
        }
        else if (this.onClick) {
            this.onClick(event);
        }
    }
    preventNextClick() {
        this.shouldPreventNextClick = true;
        setTimeout(() => {
            this.shouldPreventNextClick = false;
        }, 200);
    }
    static getClickBehaviour(view) {
        for (const behaviour of view.behaviours) {
            if (behaviour instanceof ClickBehaviour) {
                return behaviour;
            }
        }
        return null;
    }
    static tryPreventNextClick(view) {
        var _a;
        (_a = this.getClickBehaviour(view)) === null || _a === void 0 ? void 0 : _a.preventNextClick();
    }
}
