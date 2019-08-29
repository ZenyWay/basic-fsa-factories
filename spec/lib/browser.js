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
const tape = require('tape')

const term = new Terminal({
  cursorBlink: true,
  rows: 24,
  scrollback: 48,
  tabStopWidth: 2
})
term.open(document.querySelector('#terminal'))
tape.createStream().on('data', txt => term.writeln(txt))

require('../create-action-factory.spec')
require('../create-action-dispatchers.spec')
