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
const { createActionFactory, payload } = require('../')

test('createActionFactory:', t => {
  t.test('when called with a string type argument:', st => {
    const ping = createActionFactory('PING')
    st.equal(typeof ping, 'function', 'returns a function')

    const action = ping('foo')
    st.deepEqual(
      action,
      { type: 'PING', payload: 'foo' },
      'returns a factory that maps a payload argument ' +
        'to a corresponding FSA of the given type.'
    )
    st.end()
  })

  t.test(
    'when called with a string type argument ' +
      'and the return value of the exported `payload` helper:',
    st => {
      const ping = createActionFactory('PING', payload())
      st.equal(typeof ping, 'function', 'returns a function')

      const action = ping('foo')
      st.deepEqual(
        action,
        { type: 'PING', payload: 'foo' },
        'returns a factory that maps a payload argument ' +
          'to a corresponding FSA of the given type.'
      )
      st.end()
    }
  )

  t.test('when called with an additional payload factory argument:', st => {
    const ping = createActionFactory('PING', (foo, bar) => ({ foo, bar }))
    st.equal(typeof ping, 'function', 'returns a function')

    const action = ping('bar', 'baz')
    st.deepEqual(
      action,
      { type: 'PING', payload: { foo: 'bar', bar: 'baz' } },
      'returns a factory that maps its arguments ' +
        'with the given payload factory ' +
        'to a corresponding FSA of the given type.'
    )
    st.end()
  })

  t.end()
})
