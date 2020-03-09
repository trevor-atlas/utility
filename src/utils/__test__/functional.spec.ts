import { compose, pipe } from '../functional';

describe("Functional helpers", () => {
    it("composes functions", () => {
        const fn1 = (val: string) => `fn1(${val})`;
        const fn2 = (val: string) => `fn2(${val})`;
        const fn3 = (val: string) => `fn3(${val})`;
        const composedFunction = compose(fn1, fn2, fn3);
        expect(composedFunction("inner")).toBe("fn1(fn2(fn3(inner)))");
    });

    it("pipes strings", () => {
        const fn1 = (val: string) => `fn1(${val})`;
        const fn2 = (val: string) => `fn2(${val})`;
        const fn3 = (val: string) => `fn3(${val})`;

        const pipedFunction = pipe(() => true, fn1, fn2, fn3);

        expect(pipedFunction("inner")).toBe("fn3(fn2(fn1(inner)))");
    });

    it("pipes numbers", () => {
        const fn1 = (val: number) => val + 1;
        const fn2 = (val: number) => val * val;
        const fn3 = (val: number) => val % val;

        const pipedFunction = pipe(() => true, fn1, fn2, fn3);

        expect(pipedFunction(0)).toBe(0);
        expect(pipedFunction(5)).toBe(0);
    });

    it("pipes arrays", () => {
        const fn1 = (val: string[]) => [`fn1(${val})`];
        const fn2 = (val: string[]) => [`fn2(${val})`];
        const fn3 = (val: string[]) => [`fn3(${val})`];

        const pipedFunction = pipe(() => true, fn1, fn2, fn3);

        expect(pipedFunction(['inner'])).toStrictEqual(["fn3(fn2(fn1(inner)))"]);
    });

    it("pipes values to functions only if the initial value is valid", () => {
        const failEval1 = (val: string) => `fn1(${val})`;
        const failEval2 = (val: string) => `fn2(${val})`;
        const failEval3 = (val: string) => `fn3(${val})`;

        const falsy1 = (val: null) => null;
        const falsy2 = (val: null) => null;
        const falsy3 = (val: null) => null;

        const succeedPipe = pipe(() => false, failEval1, failEval2, failEval3);
        const failPipe = pipe(() => true, falsy1, falsy2, falsy3);

        expect(succeedPipe("inner")).toBe("inner");
        expect(failPipe(null)).toBe(null);
    });
});
