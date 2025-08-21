import { Bench } from 'tinybench'
import fs from 'fs'

import SnappyJS from 'snappyjs'
import { compress, uncompress } from '../index'
import path from 'path'
import util from 'util'

const TESTDATA = path.join(import.meta.dirname, './testdata')

function run_sample(filename: string) {
  const data_file = path.join(TESTDATA, filename)

  const buffer = fs.readFileSync(data_file)
  const uncompressed_data = new Uint8Array(buffer)
  const compressed_data = compress(uncompressed_data)

  console.log('result for ', filename)
  const b = new Bench()
  b.add('snappyjs compress', () => SnappyJS.compress(uncompressed_data))
  b.add('rust-snappy compress', () => compress(uncompressed_data))
  b.add('snappyjs uncompress', () => SnappyJS.uncompress(compressed_data))
  b.add('rust-snappy uncompress', () => uncompress(compressed_data))
  b.runSync()
  console.table(b.table())
}

fs.readdirSync(TESTDATA).forEach(function (filename: string) {
  run_sample(filename)
})
