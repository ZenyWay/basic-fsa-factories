'use strict' /* eslint-env jasmine */
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
//
const test = require('tape')
const { createActionDispatchers, payload } = require('../')

test('createActionDispatchers:', t => {
  t.test('when called with a spec map:', t => {
    const actions = []
    const factory = createActionDispatchers({
      PING: payload(),
      PONG: (foo, bar) => ({ foo, bar })
    })
    t.equal(typeof factory, 'function', 'returns a function')

    t.test('which when called with a dispatcher', t => {
      const dispatch = factory(actions.push.bind(actions))
      t.deepEqual(
        Object.keys(dispatch).map(k => [k, typeof dispatch[k]]),
        [['PING', 'function'], ['PONG', 'function']],
        'returns a map of functions with the same keys as the spec map'
      )
      dispatch.PING('foo')
      dispatch.PONG('bar', 'baz')
      t.deepEqual(
        actions,
        [
          { type: 'PING', payload: 'foo' },
          { type: 'PONG', payload: { foo: 'bar', bar: 'baz' } }
        ],
        'each function in the returned map dispatches an FSA ' +
          'created from its arguments as specified by the corresponding spec value'
      )
      t.end()
    })
    t.end()
  })
  t.end()
})
