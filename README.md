# basic Flux Standard Action factories
[![NPM](https://nodei.co/npm/basic-fsa-factories.png?compact=true)](https://nodei.co/npm/basic-fsa-factories/)

basic (0.3kB) partial implementation of some common [FSA](https://www.npmjs.com/package/flux-standard-action) factories
to instantiate action factories and dispatchers.
does not support `error` and `meta` properties.
```js
const ping = createActionFactory('PING')
const pong = createActionFactory('PONG', (foo, bar) => ({ foo, bar }))

console.log(ping('bar')) // {type: 'PING', payload: 'bar'}
console.log(pong('baz', 42)) // {type: 'PONG', payload: {foo: 'baz', bar: 42}}

const { onPing, onPong } = createActionDispatchers({
  onPing: 'PING',
  onPong: ['PONG', (foo, bar) => ({ foo, bar })]
})(console.log.bind(console)) // "dispatch" event objects to console

onPing('bar') // {type: 'PING', payload: 'bar'}
onPong('baz', 42) // {type: 'PONG', payload: {foo: 'baz', bar: 42}}
```

# <a name="API"></a>API
```ts
export declare function createActionDispatchers(
  specs: KeyedMap<(string | ((...args: any[]) => any))[] | string | ((...args: any[]) => any)>
): (dispatch: (event: any) => void) => KeyedMap<(...args: any[]) => void>

export declare function createActionDispatcher<P>(
  type: string,
  createPayload?: (...args: any[]) => P
): (dispatch: (event: any) => void) => (...args: any[]) => void

export declare function createActionFactories(
  specs: KeyedMap<(string | ((...args: any[]) => any))[] | string | ((...args: any[]) => any)>
): KeyedMap<(...args: any[]) => any>

export declare function createActionFactory<P>(
  type: string,
  createPayload?: (...args: any[]) => P
): (...args: any[]) => StandardAction<P>

export interface StandardAction<P> {
  type: string
  payload: P
}
export interface KeyedMap<V> {
  [k: string]: V
}
```
run the [unit tests](https://cdn.rawgit.com/ZenyWay/basic-fsa-factories/v1.0.0/spec/web/index.html)
in your browser.

# TypeScript
although this library is written in [TypeScript](https://www.typescriptlang.org),
it may also be imported into plain JavaScript code:
modern code editors will still benefit from the available type definition,
e.g. for helpful code completion.

# License
Copyright 2018 Stéphane M. Catala

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the [License](./LICENSE) for the specific language governing permissions and
Limitations under the License.
