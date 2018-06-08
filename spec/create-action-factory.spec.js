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
const { createActionFactory } = require('../')

describe('createActionFactory:', () => {
  describe('when called with a string type argument:', () => {
    let result

    beforeEach(() => {
      const ping = createActionFactory('PING')
      result = ping('foo', 'bar')
    })

    it('returns a factory that maps a payload argument ' +
    'to a corresponding FSA of the given type.', function () {
      expect(result).toEqual({ type: 'PING', payload: 'foo' })
    })
  })

  describe('when called with an additional payload factory argument:', () => {
    let factory, result

    beforeEach(() => {
      factory = jasmine.createSpy('factory').and.returnValue('foo')
      const ping = createActionFactory('PING', factory)
      result = ping('bar', 'baz')
    })

    it('returns a factory that maps its arguments ' +
    'with the given payload factory ' +
    'to a corresponding FSA of the given type.', function () {
      expect(factory).toHaveBeenCalledWith('bar', 'baz')
      expect(result).toEqual({ type: 'PING', payload: 'foo' })
    })
  })
})
