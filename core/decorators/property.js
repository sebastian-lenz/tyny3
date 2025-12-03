import { __rest } from "tslib";
export function property(options = {}) {
    return function (target, name) {
        const descriptor = arguments[2];
        let property = descriptor || Object.getOwnPropertyDescriptor(target, name) || {};
        const { get } = property, desc = __rest(property, ["get"]);
        const properties = target.hasOwnProperty('_properties')
            ? target._properties
            : (target._properties = Object.assign({}, target._properties));
        properties[name] = Object.assign(Object.assign({}, options), { name });
        function customGetter() {
            const values = this._watchValues || (this._watchValues = {});
            if (name in values) {
                return values[name];
            }
            return (values[name] = get ? get.apply(this) : undefined);
        }
        if (descriptor) {
            descriptor.get = customGetter;
        }
        else {
            Object.defineProperty(target, name, Object.assign(Object.assign({}, desc), { get: customGetter }));
        }
    };
}
