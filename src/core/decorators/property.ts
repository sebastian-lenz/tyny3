interface PropertyScope {
  _watchValues: tyny.AnyObject | null;
  params: any;
}

export interface PropertyOptions {
  immediate?: boolean;
  immutable?: boolean;
  watch?: { (newValue: any, oldValue: any): void } | string;
}

export interface PropertyHandler extends PropertyOptions {
  name: string;
}

export type PropertyHandlerMap = tyny.Map<PropertyHandler>;

export function property(options: PropertyOptions = {}): PropertyDecorator {
  return function (target: any, name: any) {
    const descriptor = arguments[2];
    let property =
      descriptor || Object.getOwnPropertyDescriptor(target, name) || {};

    const { get, ...desc } = property;
    const properties: PropertyHandlerMap = target.hasOwnProperty('_properties')
      ? target._properties
      : (target._properties = { ...target._properties });

    properties[name] = {
      ...options,
      name,
    };

    function customGetter(this: PropertyScope): any {
      const values = this._watchValues || (this._watchValues = {});
      if (name in values) {
        return values[name];
      }

      return (values[name] = get ? get.apply(this) : undefined);
    }

    if (descriptor) {
      descriptor.get = customGetter;
    } else {
      Object.defineProperty(target, name, {
        ...desc,
        get: customGetter,
      });
    }
  };
}
