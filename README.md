# basic Flux Standard Action factories

[![NPM](https://nodei.co/npm/basic-fsa-factories.png?compact=true)](https://nodei.co/npm/basic-fsa-factories/)

basic (349 bytes gzip) partial implementation of some common [FSA](https://www.npmjs.com/package/flux-standard-action) factories
to instantiate action factories and dispatchers with strong typing.
does not support `error` and `meta` properties.

```js
import { createActionFactory, payload } from 'basic-fsa-factories'
const ping = createActionFactory('PING', payload<string>())
  // or createActionFactory<'PING', string>('PING')
const pong = createActionFactory(
  'PONG',
  (foo: string, bar: number) => ({ foo, bar } as const)
)

console.log(ping('bar')) // {type: 'PING', payload: 'bar'}
console.log(pong('baz', 42)) // {type: 'PONG', payload: {foo: 'baz', bar: 42}}

const dispatch = createActionDispatchers({
  'PING': payload<string>(),
  'PONG': (foo: string, bar: number) => ({ foo, bar })
})(console.log.bind(console)) // "dispatch" event objects to console

dispatch.PING('bar') // {type: 'PING', payload: 'bar'}
dispatch.PONG('baz', 42) // {type: 'PONG', payload: {foo: 'baz', bar: 42}}
```

# API

run the tests with `npm test` in node, or `npm test:web` in the browser.

```ts
export interface StandardAction<T extends string = string, P = any> {
  readonly type: T
  readonly payload?: P
}
export declare type ActionType<A> = A extends StandardAction<infer T, any>
  ? T
  : never
export declare type ActionPayload<
  A,
  T extends ActionType<A> = ActionType<A>
> = A extends StandardAction<T, infer P> ? P : never
export declare type FactoryAction<
  F,
  T extends keyof F = keyof F
> = F[T] extends ActionFactory ? ReturnType<F[T]> : never
export declare type ActionDispatcherMap<S extends ActionFactoriesSpec> = {
  [T in keyof S]: T extends string
    ? S[T] extends (...args: infer I) => infer P
      ? I extends [P]
        ? Dispatcher<P>
        : I extends any[]
        ? Dispatcher<P, I>
        : never
      : never
    : never
}
export declare type ActionFactoryMap<S extends ActionFactoriesSpec> = {
  [T in keyof S]: T extends string
    ? S[T] extends (...args: infer I) => infer P
      ? I extends [P]
        ? ActionFactory<T, P>
        : I extends any[]
        ? ActionFactory<T, P, I>
        : never
      : never
    : never
}
export declare type ActionFactoriesSpec<
  T extends string = string,
  P = any,
  I extends any[] = any[]
> = { [t in T]: (...args: I) => P }
export declare type ActionFactory<
  T extends string = string,
  P = any,
  I extends any[] = [P]
> = I extends [P]
  ? (payload: P) => StandardAction<T, P>
  : (...args: I) => StandardAction<T, P>
export declare type Dispatcher<P = any, I extends any[] = [P]> = I extends [P]
  ? (payload: P) => void
  : (...args: I) => void
export declare function createActionFactories<S extends ActionFactoriesSpec> (
  specs: S
): ActionFactoryMap<S>
export declare function createActionFactory<T extends string, P> (
  type: T
): ActionFactory<T, P>
export declare function createActionFactory<T extends string, P> (
  type: T,
  createPayload: (payload: P) => P
): ActionFactory<T, P>
export declare function createActionFactory<
  T extends string,
  P,
  I extends any[]
> (type: T, createPayload: (...args: I) => P): ActionFactory<T, P, I>
export declare function createActionDispatchers<S extends ActionFactoriesSpec> (
  specs: S
): <A extends FactoryAction<ActionFactoryMap<S>>>(
  dispatch: Dispatcher<A>
) => ActionDispatcherMap<S>
export declare function createActionDispatcher<T extends string, P> (
  type: T
): (dispatch: Dispatcher<StandardAction<T, P>>) => Dispatcher<P>
export declare function createActionDispatcher<T extends string, P> (
  type: T,
  createPayload: (payload: P) => P
): (dispatch: Dispatcher<StandardAction<T, P>>) => Dispatcher<P>
export declare function createActionDispatcher<
  T extends string,
  P,
  I extends any[]
> (
  type: T,
  createPayload: (...args: I) => P
): (dispatch: Dispatcher<StandardAction<T, P>>) => Dispatcher<P, I>
export declare function payload<P> (): (payload: P) => P
export declare function identity<V> (v: V): V
```

# TypeScript

although this library is written in [TypeScript](https://www.typescriptlang.org),
it may also be imported into plain JavaScript code:
modern code editors will still benefit from the available type definition,
e.g. for helpful code completion.

# License

Copyright 2019 Stéphane M. Catala

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the [License](./LICENSE) for the specific language governing permissions and
Limitations under the License.
