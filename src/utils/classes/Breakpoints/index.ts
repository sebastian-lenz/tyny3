import { trigger } from '../../dom/event/trigger';

export interface Step {
  index: number;
  name: string;
  query: string;
}
export const eventBreakpointsChanged = 'tyny:breakpointsChanged';

export class Breakpoints {
  current: Step;
  public readonly steps: Array<Step & { media: MediaQueryList }>;

  constructor(
    public readonly defaultStep: Step,
    steps: Array<Step>
  ) {
    this.current = defaultStep;
    this.steps = steps.map((step) => {
      const media = window.matchMedia(step.query);
      media.addEventListener('change', this.onMediaChanged);
      return { ...step, media };
    });

    this.onMediaChanged();
  }

  onMediaChanged = () => {
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

  setCurrent(current: Step) {
    if (current === this.current) return;
    this.current = current;
    trigger(window, eventBreakpointsChanged, current);
  }
}
