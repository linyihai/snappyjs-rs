import test from 'ava'
import SnappyJS from 'snappyjs'

import { compress, uncompress } from '../index'

test('test accepts unit8array', (t) => {
  const simple = 'Hello World!'
  const encoder = new TextEncoder()
  const unit8_simple = encoder.encode(simple)
  const js_res = SnappyJS.uncompress(SnappyJS.compress(unit8_simple))
  const decoder = new TextDecoder()
  t.is(simple, decoder.decode(js_res))

  const rs_res = uncompress(compress(unit8_simple))
  t.is(simple, decoder.decode(rs_res))
})

test('test accepts ArrayBuffer', (t) => {
  const simple = 'Hello'
  let buffer = new ArrayBuffer(5)
  let arr = new Uint8Array(buffer)
  arr[0] = 72 // H
  arr[1] = 101 // e
  arr[2] = 108 // l
  arr[3] = 108 // l
  arr[4] = 111 // o
  const rs_res = uncompress(compress(arr))
  const decoder = new TextDecoder()
  t.is(simple, decoder.decode(rs_res))
})

test('test uncompress length args', (t) => {
  const simple = 'Hello'
  const encoder = new TextEncoder()
  const unit8_simple = encoder.encode(simple)
  const error = t.throws(() => uncompress(compress(unit8_simple), 1), undefined)
  t.is(error.message, 'The uncompressed length of 5 is too big, expect at most 1')

  const js_error = t.throws(() => SnappyJS.uncompress(SnappyJS.compress(unit8_simple), 1), undefined)
  t.is(js_error.message, 'The uncompressed length of 5 is too big, expect at most 1')
})
