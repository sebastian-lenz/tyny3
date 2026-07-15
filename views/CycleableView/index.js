import { __decorate } from "tslib";
import { signal } from '@preact/signals';
import { CollectionView } from '../CollectionView';
import { isNumber } from '../../utils/lang/number/isNumber';
import { isUndefined } from '../../utils/lang/misc/isUndefined';
import { property } from '../../core';
export const transistEvent = 'tyny:transist';
export class CycleableView extends CollectionView {
    get $index() {
        let { _$index } = this;
        if (!_$index) {
            _$index = this.$index = signal(this.currentIndex);
        }
        return _$index;
    }
    set $index(value) {
        if (this._$index)
            throw Error('$index is already set');
        this._$index = value;
        this.addDestructor(value.subscribe((value) => {
            if (!this._inTransist) {
                this.withoutSignal(() => {
                    const normalized = this.normalizeIndex(value);
                    if (normalized !== value)
                        this.$index.value = normalized;
                    this.transist(normalized);
                });
            }
        }));
    }
    get current() {
        return this._current;
    }
    set current(value) {
        this.transist(value);
    }
    get currentIndex() {
        const { _current: current } = this;
        return current ? this.indexOf(current) : -1;
    }
    set currentIndex(value) {
        this.transist(value);
    }
    get next() {
        return this.at(this.normalizeIndex(this.currentIndex + 1));
    }
    get previous() {
        return this.at(this.normalizeIndex(this.currentIndex - 1));
    }
    constructor(options = {}) {
        super(options);
        this._$index = null;
        this._current = null;
        this._inTransist = false;
    }
    immediate(value) {
        this.transist(value);
    }
    normalizeIndex(index) {
        const { isLooped, length } = this;
        if (length < 1) {
            return -1;
        }
        let normalized = index;
        if (isLooped) {
            while (normalized < 0)
                normalized += length;
            while (normalized >= length)
                normalized -= length;
        }
        else {
            if (normalized < 0)
                return -1;
            if (normalized >= length)
                return -1;
        }
        return normalized;
    }
    transist(value, options) {
        const { _$index, _current: from } = this;
        const to = isNumber(value) ? this.at(this.normalizeIndex(value)) : value;
        if (from === to) {
            return;
        }
        this._current = to;
        if (_$index) {
            this.withoutSignal(() => (_$index.value = this.currentIndex));
        }
        this.onTransition(from, to, options);
        this.trigger(transistEvent, {
            from,
            options,
            target: this,
            to,
        });
    }
    onConnected() {
        const initialIndex = this.params.int({ name: 'initialIndex' });
        if (!isUndefined(initialIndex)) {
            this.transist(initialIndex);
        }
    }
    onTransition(from, to, options) { }
    withoutSignal(callback) {
        if (this._inTransist)
            return;
        this._inTransist = true;
        callback();
        this._inTransist = false;
    }
}
__decorate([
    property({ param: { defaultValue: false, type: 'bool' } })
], CycleableView.prototype, "isLooped", void 0);
