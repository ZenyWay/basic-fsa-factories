/**
 * @license
 * Copyright 2018 Stephane M. Catala
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * Limitations under the License.
 */
;
export function createActionDispatchers (
  specs: KeyedMap<(string|((...args: any[]) => any))[]|string|((...args: any[]) => any)>
): (dispatch: (event: any) => void) => KeyedMap<(...args: any[]) => void> {
  const factories = createActionFactories(specs)
  const keys = Object.keys(factories)
  return function (dispatch: (event: any) => void) {
    return keys.reduce(
      function (handlers, key) {
        handlers[key] = createDispatcher(dispatch, factories[key])
        return handlers
      },
      {} as KeyedMap<(args: any[]) => void>)
  }
}

export function createActionDispatcher <P>(
  type: string,
  createPayload = identity as (...args: any[]) => P
) {
  const factory = createActionFactory(type, createPayload)
  return function (dispatch: (event: any) => void) {
    return createDispatcher(dispatch, factory)
  }
}

function createDispatcher (dispatch: (event: any) => void, factory: Function) {
  return function (...args: any[]) {
    const action = factory(...args)
    if (action) dispatch(action)
  }
}

export function createActionFactories (
  specs: KeyedMap<(string|((...args: any[]) => any))[]|string|((...args: any[]) => any)>
): KeyedMap<(...args: any[]) => any> {
  return Object.keys(specs).reduce(
    function (factories, key) {
      const spec = specs[key]
      factories[key] = typeof spec === 'function'
        ? spec
        : Array.isArray(spec)
          ? createActionFactory(spec[0] as string, spec[1] as (...args: any[]) => any)
          : createActionFactory(spec)
      return factories
    },
    {} as KeyedMap<(...args: any[]) => any>
  )
}

export function createActionFactory <P>(
  type: string,
  createPayload = identity as (...args: any[]) => P
) {
  return function (...args: any[]): StandardAction<P> {
    const payload = createPayload(...args)
    return { type, payload }
  }
}

export interface StandardAction<P> {
  type: string
  payload: P
}

export interface KeyedMap<V> {
  [k: string]: V
}

function identity <V=any>(v: V): V {
  return v
}
