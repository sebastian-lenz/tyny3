import { event } from '../../core';
import { trigger } from '../../utils/dom/event/trigger';
import { Swap, type SwapOptions } from '../Swap';
import { tabChanged } from './events';

function tabListSelector(this: AriaTabs) {
  return this.tabListSelector;
}

function tabSelector(this: AriaTabs) {
  return this.tabSelector;
}

export interface AriaTabsOptions extends SwapOptions {
  tabSelector?: string;
  tabListSelector?: string;
}

export class AriaTabs extends Swap {
  currentTab: HTMLElement | null = null;
  tabSelector: string;
  tabListSelector: string;

  get tabs() {
    return this.findAll(this.tabSelector);
  }

  constructor({
    tabSelector = '*[role="tab"]',
    tabListSelector = '*[role="tablist"]',
    ...options
  }: AriaTabsOptions) {
    super(options);

    const tab = this.find(`${tabSelector}[aria-selected="true"]`);
    const controls = tab ? tab.getAttribute('aria-controls') : null;

    this.currentTab = tab;
    this.content = controls ? document.getElementById(controls) : null;
    this.tabListSelector = tabListSelector;
    this.tabSelector = tabSelector;
  }

  @event({ name: 'keydown', selector: tabListSelector })
  onKeyDown(event: KeyboardEvent) {
    event.stopPropagation();

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

    if (index < 0) index = 0;
    if (index >= tabs.length) index = tabs.length - 1;
    if (currentIndex !== index) {
      this.setCurrentTab(tabs[index]);
    }
  }

  @event({ name: 'click', selector: tabSelector })
  onTabClick(event: tyny.DelegateEvent) {
    const { tabs } = this;
    const tab = tabs.find((tab) => tab === event.current);

    if (tab) {
      this.setCurrentTab(tab);
      event.stopPropagation();
    }
  }

  setCurrentTab(value: HTMLElement | null) {
    const { currentTab } = this;
    if (currentTab === value) return;
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
