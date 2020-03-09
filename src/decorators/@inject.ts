import {LazyFactory} from '../di/LazyFactory';

export const Inject: PropertyDecorator = (target: any, key: string | symbol): any => {
    const concrete = (new LazyFactory()).get(key);
    let val = void 0;
    if (concrete) {
        val = concrete();
    }
    return Object.defineProperty(target, key, {
        get() {
            return val
        },
        enumerable: true,
        configurable: true
    });
};

