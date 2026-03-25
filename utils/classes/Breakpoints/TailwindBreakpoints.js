import { Breakpoints } from './index';
export class TailwindBreakpoints extends Breakpoints {
    constructor() {
        super({ index: 0, name: 'xs', query: 'width >= 0rem' }, [
            { index: 1, name: 'sm', query: '(width >= 40rem)' },
            { index: 2, name: 'md', query: '(width >= 48rem)' },
            { index: 3, name: 'lg', query: '(width >= 64rem)' },
            { index: 4, name: 'xl', query: '(width >= 80rem)' },
            { index: 5, name: '2xl', query: '(width >= 96rem)' },
        ]);
    }
}
