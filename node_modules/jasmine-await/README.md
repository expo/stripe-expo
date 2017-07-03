# jasmine-await

[![build status](https://api.travis-ci.org/svi3c/jasmine-await.svg)](https://travis-ci.org/svi3c/jasmine-await)

This project adds [asyncawait](https://github.com/yortus/asyncawait) support to
[jasmine](https://www.npmjs.com/package/jasmine).

It extends the functions `it()`, `beforeEach()`, `afterEach()`, `beforeAll()` and `afterAll()` and wraps
them in the `async()` function. So you can always use `await()` to wait for a promise's resolution or rejection.

## Installation

```
npm i -D jasmine-await
```

## Usage

Example1:

```javascript
var async = require("jasmine-await");
var it = async.it;
var await = async.await;

it("should work", () => {
  var x = await(new Promise(res => res(42)));
  expect(x).toBe(42);
})
```

Example2 (same test, using typescript with [jasmine-ts](https://github.com/svi3c/jasmine-ts)):

```typescript
import {it, await} from "jasmine-await"

it("should work", () => {
  let x = await(new Promise(res => res(42)));
  expect(x).toBe(42);
})
```

### Note

You still need to install the typings for jasmine to make the typescript-compiler happy about your specs:

```
typings i -D --ambient jasmine
```