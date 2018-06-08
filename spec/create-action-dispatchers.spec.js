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
const { createActionDispatchers } = require('../')

describe('createActionDispatchers:', () => {
  describe('when called with a spec map:', () => {
    let factory, dispatch

    beforeEach(() => {
      factory = jasmine.createSpy('factory').and.returnValue('foo')
      dispatch = jasmine.createSpy('dispatch')
      const { onPing, onPong } = createActionDispatchers({
        onPing: 'PING',
        onPong: ['PONG', factory]
      })(dispatch)
      onPing('foo', 'bar')
      onPong('bar', 'baz')
    })

    it('returns a factory that maps a dispatch function to a map with, ' +
    'for each key in the given spec map, ' +
    'an FSA dispatcher that creates FSA objects ' +
    'as specified by the corresponding spec value, ' +
    'and calls the given dispatch function with that object.', function () {
      expect(dispatch).toHaveBeenCalledWith({ type: 'PING', payload: 'foo' })
      expect(factory).toHaveBeenCalledWith('bar', 'baz')
      expect(dispatch).toHaveBeenCalledWith({ type: 'PONG', payload: 'foo' })
    })
  })
})
