export interface CreateElementOptions {
  appendTo?: HTMLElement;
  attributes?: { [name: string]: string };
  children?: Array<string | Node>;
  className?: string;
  extraClassName?: string;
  prependTo?: HTMLElement;
  tagName?: string;
  template?: string | Function;
  text?: string;
}

export function createElement(options: CreateElementOptions): HTMLElement {
  const {
    appendTo,
    attributes,
    children,
    className,
    extraClassName,
    prependTo,
    tagName = 'div',
    template,
    text,
  } = options;

  const el = document.createElement(tagName);

  if (className) {
    el.className = className;
  }

  if (extraClassName) {
    el.classList.add(extraClassName);
  }

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      el.setAttribute(key, attributes[key]);
    });
  }

  if (template) {
    if (typeof template === 'function') {
      el.innerHTML = template(options);
    } else {
      el.innerHTML = template;
    }
  } else if (text) {
    el.textContent = text;
  } else if (children) {
    for (const child of children) {
      el.append(child);
    }
  }

  if (appendTo) {
    appendTo.appendChild(el);
  } else if (prependTo) {
    prependTo.insertBefore(el, prependTo.firstElementChild);
  }

  return el;
}
