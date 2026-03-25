import { findAll } from '../../../utils/dom/node/find';

let parser: DOMParser;

const headerTags = [
  'link[rel="canonical"]',
  'meta',
  'script[type="application/ld+json"]',
  'title',
];

export function copyHeaderTags(
  head: HTMLHeadElement,
  selectors: Array<string> = headerTags
) {
  const target = document.head;

  for (const selector of selectors) {
    for (const el of findAll(selector, target)) {
      el.remove();
    }

    for (const el of findAll(selector, head)) {
      target.insertBefore(el, target.firstElementChild);
    }
  }
}

export function decodeMails(el: HTMLElement): HTMLElement {
  for (const target of findAll('span[id]', el)) {
    const script = target.nextElementSibling;
    if (!script || script.tagName !== 'SCRIPT') {
      continue;
    }

    const match = /("[^"\\]*(?:\\.[^"\\]*)*")\.replace/.exec(script.innerHTML);
    if (match) {
      target.innerHTML = JSON.parse(match[1]).replace(/[a-zA-Z]/g, (c: any) =>
        String.fromCharCode(
          (c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26
        )
      );
    }
  }

  return el;
}

export function parseHtml(markup: string): Document {
  parser = parser || new DOMParser();
  return parser.parseFromString(markup, 'text/html');
}
