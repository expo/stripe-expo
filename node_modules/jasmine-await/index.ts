import {async} from "asyncawait";

interface IDoneCallback {
  (): void;
  fail(error: Error): void;
}

let promising = (action: () => any) =>
  (done: IDoneCallback) =>
    async(action)().then(() => done(), done.fail);

let itWithPromise = (expectation: string, assertion: () => Promise<any> | any, timeout?: number) => {
  it(expectation, promising(assertion), timeout);
};

let beforeEachWithPromise = (action: () => Promise<any> | any, timeout?: number) => {
  beforeEach(promising(action), timeout);
};

let afterEachWithPromise = (action: () => Promise<any> | any, timeout?: number) => {
  afterEach(promising(action), timeout);
};

let beforeAllWithPromise = (action: () => Promise<any> | any, timeout?: number) => {
  beforeAll(promising(action), timeout);
};

let afterAllWithPromise = (action: () => Promise<any> | any, timeout?: number) => {
  afterAll(promising(action), timeout);
};

let invert = (promise: Promise<any>) =>
  promise.then(
    resolution => Promise.reject(new Error(`Promise should be rejected, but it is resolved with: ${resolution}`)),
    err => err
  );

export {
  itWithPromise as it,
  beforeEachWithPromise as beforeEach,
  afterEachWithPromise as afterEach,
  beforeAllWithPromise as beforeAll,
  afterAllWithPromise as afterAll,
  invert
};

export {await} from "asyncawait";