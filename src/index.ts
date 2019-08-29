/**
 * @license
 * Copyright 2019 Stephane M. Catala
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
export interface StandardAction<T extends string = string, P = any> {
  readonly type: T
  readonly payload?: P
}

export type ActionType<A> = A extends StandardAction<infer T, any> ? T : never

export type ActionPayload<
  A,
  T extends ActionType<A> = ActionType<A>
> = A extends StandardAction<T, infer P> ? P : never

export type FactoryAction<
  F,
  T extends keyof F = keyof F
> = F[T] extends ActionFactory ? ReturnType<F[T]> : never

export type ActionDispatcherMap<S extends ActionFactoriesSpec> = {
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

export type ActionFactoryMap<S extends ActionFactoriesSpec> = {
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

export type ActionFactoriesSpec<
  T extends string = string,
  P = any,
  I extends any[] = any[]
> = { [t in T]: (...args: I) => P }

export type ActionFactory<
  T extends string = string,
  P = any,
  I extends any[] = [P]
> = I extends [P]
  ? (payload: P) => StandardAction<T, P>
  : (...args: I) => StandardAction<T, P>

export type Dispatcher<P = any, I extends any[] = [P]> = I extends [P]
  ? (payload: P) => void
  : (...args: I) => void

export function createActionFactories<S extends ActionFactoriesSpec> (
  specs: S
): ActionFactoryMap<S> {
  const actions = Object.create(null)
  for (const type of Object.keys(specs)) {
    const createPayload = specs[type]
    actions[type] = createActionFactory(type, createPayload)
  }
  return actions
}

export function createActionFactory<T extends string, P> (
  type: T
): ActionFactory<T, P>
export function createActionFactory<T extends string, P> (
  type: T,
  createPayload: (payload: P) => P
): ActionFactory<T, P>
export function createActionFactory<T extends string, P, I extends any[]> (
  type: T,
  createPayload: (...args: I) => P
): ActionFactory<T, P, I>
export function createActionFactory<T extends string, P, I extends any[]> (
  type: T,
  createPayload?: (...args: I) => P
) {
  const createAction = (payload: P) => ({ type, payload } as const)
  return isDefaultPayloadFactory(createPayload)
    ? createAction
    : (...args: I) => createAction(createPayload(...args))
}

export function createActionDispatchers<S extends ActionFactoriesSpec> (
  specs: S
): <A extends FactoryAction<ActionFactoryMap<S>>>(
  dispatch: Dispatcher<A>
) => ActionDispatcherMap<S> {
  const types = Object.keys(specs)
  return function<A extends FactoryAction<ActionFactoryMap<S>>> (
    dispatch: Dispatcher<A>
  ) {
    const dispatchers = Object.create(null)
    for (const type of types) {
      dispatchers[type] = createActionDispatcher(type, specs[type])(dispatch)
    }
    return dispatchers
  }
}

export function createActionDispatcher<T extends string, P> (
  type: T
): (dispatch: Dispatcher<StandardAction<T, P>>) => Dispatcher<P>
export function createActionDispatcher<T extends string, P> (
  type: T,
  createPayload: (payload: P) => P
): (dispatch: Dispatcher<StandardAction<T, P>>) => Dispatcher<P>
export function createActionDispatcher<T extends string, P, I extends any[]> (
  type: T,
  createPayload: (...args: I) => P
): (dispatch: Dispatcher<StandardAction<T, P>>) => Dispatcher<P, I>
export function createActionDispatcher<T extends string, P, I extends any[]> (
  type: T,
  createPayload?: (...args: I) => P
) {
  return function (dispatch: Dispatcher<StandardAction<T, P>>) {
    const createAction = createActionFactory<T, P>(type)
    const dispatchAction = (payload: P) => dispatch(createAction(payload))
    return isDefaultPayloadFactory(createPayload)
      ? dispatchAction
      : (...args: I) => dispatchAction(createPayload(...args))
  }
}

export function payload<P> (): (payload: P) => P {
  return identity
}
export function identity<V> (v: V): V {
  return v
}

function isDefaultPayloadFactory (factory?: any): factory is <P>(p: P) => P {
  return !factory || factory === identity
}
