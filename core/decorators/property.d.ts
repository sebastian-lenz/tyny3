export interface PropertyOptions {
    immediate?: boolean;
    immutable?: boolean;
    watch?: {
        (newValue: any, oldValue: any): void;
    } | string;
}
export interface PropertyHandler extends PropertyOptions {
    name: string;
}
export type PropertyHandlerMap = tyny.Map<PropertyHandler>;
export declare function property(options?: PropertyOptions): PropertyDecorator;
