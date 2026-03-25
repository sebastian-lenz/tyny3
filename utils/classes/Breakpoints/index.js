import { trigger } from '../../dom/event/trigger';
export const eventBreakpointsChanged = 'tyny:breakpointsChanged';
export class Breakpoints {
    constructor(defaultStep, steps) {
        this.defaultStep = defaultStep;
        this.onMediaChanged = () => {
            const { steps } = this;
            let current = this.defaultStep;
            for (let index = 0; index < steps.length; index++) {
                const step = steps[index];
                if (!step.media.matches) {
                    break;
                }
                current = step;
            }
            this.setCurrent(current);
        };
        this.current = defaultStep;
        this.steps = steps.map((step) => {
            const media = window.matchMedia(step.query);
            media.addEventListener('change', this.onMediaChanged);
            return Object.assign(Object.assign({}, step), { media });
        });
        this.onMediaChanged();
    }
    setCurrent(current) {
        if (current === this.current)
            return;
        this.current = current;
        trigger(window, eventBreakpointsChanged, current);
    }
}
