import { __decorate } from "tslib";
import { event } from '../../core';
import { trigger } from '../../utils/dom/event/trigger';
import { Swap } from '../Swap';
import { tabChanged } from './events';
export class AriaTabs extends Swap {
    get tabs() {
        return this.findAll('*[role="tab"]');
    }
    constructor(options) {
        super(options);
        this.currentTab = null;
        const tab = this.find('*[role="tab"][aria-selected="true"]');
        const controls = tab ? tab.getAttribute('aria-controls') : null;
        this.currentTab = tab;
        this.content = controls ? document.getElementById(controls) : null;
    }
    onKeyDown(event) {
        const { currentTab, tabs } = this;
        const currentIndex = tabs.findIndex((tab) => tab === currentTab);
        let index = currentIndex;
        switch (event.key) {
            case 'ArrowLeft':
                index = index !== -1 ? index - 1 : 0;
                break;
            case 'ArrowRight':
                index = index !== -1 ? index + 1 : tabs.length - 1;
                break;
            case 'Home':
                index = 0;
                break;
            case 'End':
                index = tabs.length - 1;
                break;
        }
        if (index < 0)
            index = 0;
        if (index >= tabs.length)
            index = tabs.length - 1;
        if (currentIndex !== index) {
            this.setCurrentTab(tabs[index]);
        }
    }
    onTabClick(event) {
        const { tabs } = this;
        this.setCurrentTab(tabs.find((tab) => tab === event.current) || null);
    }
    setCurrentTab(value) {
        const { currentTab } = this;
        if (currentTab === value)
            return;
        this.currentTab = value;
        if (currentTab) {
            currentTab.classList.remove('selected');
            currentTab.setAttribute('aria-selected', 'false');
            trigger(currentTab, tabChanged, false);
        }
        if (value) {
            value.classList.add('selected');
            value.setAttribute('aria-selected', 'true');
            trigger(value, tabChanged, true);
        }
        const controls = value ? value.getAttribute('aria-controls') : null;
        this.setContent(controls ? document.getElementById(controls) : null);
    }
}
__decorate([
    event({ name: 'keydown', selector: '*[role="tablist"]' })
], AriaTabs.prototype, "onKeyDown", null);
__decorate([
    event({ name: 'click', selector: '*[role="tab"]' })
], AriaTabs.prototype, "onTabClick", null);
