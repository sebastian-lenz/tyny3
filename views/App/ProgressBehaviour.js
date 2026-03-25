import { Behaviour } from '../../core/Behaviour';
export class ProgressBehaviour extends Behaviour {
    constructor() {
        super(...arguments);
        this.element = null;
    }
    begin() {
        this.end();
        const element = document.createElement('div');
        element.className = 'stApp__progress';
        this.element = element;
        document.body.append(element);
        setTimeout(() => element.classList.add('started'), 0);
    }
    end() {
        const { element } = this;
        this.element = null;
        if (element) {
            element.classList.remove('started');
            element.classList.add('finished');
            setTimeout(() => element.classList.add('fadeOut'), 300);
            setTimeout(() => element.remove(), 600);
        }
    }
}
