import {Singleton} from '../decorators/@singleton';

@Singleton
export class LazyFactory {
    private registry: Record<string, Function> = { };

    public get(key: string | symbol) {
        // symbols CAN be used as index types typescript >:(
        // @ts-ignore
        return this.getRegistry()[key];
    }

    public getRegistry() {
        return this.registry;
    }

    public register(key: string, fn: Function): LazyFactory {
        this.registry[key] = fn;
        return this;
    }
}
