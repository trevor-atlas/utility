export const Throttle = (delayMS: number = 250) =>
    (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    if (!descriptor || !target || (!descriptor.value) || (typeof descriptor.value !== 'function')) {
        throw new TypeError(`Only methods can be decorated with @Throttle. <${typeof key === 'string' ? key : key.valueOf}> is not a method!`);
    }
    return {
        value: throttle(descriptor.value, delayMS)
    }
};

export function throttle<T extends (...args: any[]) => void>(
    func: T,
    threshold: number = 250,
    scope?: unknown
): T {
    let last: number, deferTimer: ReturnType<typeof setTimeout>;
    return function (this: unknown) {
        const context = scope || this;
        const now = Date.now();
        const args = arguments;
        if (last && now < last + threshold) {
            clearTimeout(deferTimer);
            deferTimer = setTimeout(() => {
                last = now;
                func.apply(context, args as any);
            }, threshold);
        } else {
            last = now;
            func.apply(context, args as any);
        }
    } as T;
}
