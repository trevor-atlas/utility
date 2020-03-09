export function Bind<T extends Function>(target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void {
    if (!descriptor || (typeof descriptor.value !== 'function')) {
        throw new TypeError(`Only methods can be decorated with @bind. <${typeof key === 'string' ? key : key.toString()}> is not a method!`);
    }

    return {
        configurable: true,
        get(this: T): T {
            const bound: T = descriptor.value!.bind(this);
            // Credits to https://github.com/andreypopp/autobind-decorator for memoizing the result of bind against a symbol on the instance.
            Object.defineProperty(this, key, {
                value: bound,
                configurable: true,
                writable: true
            });
            return bound;
        }
    };
}
