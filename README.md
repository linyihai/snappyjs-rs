# Snappyjs-rs

This offers the same API of [SnappyJS](https://github.com/zhipeng-jia/snappyjs)

**SnappyJS.compress(input)**
Compress input, which must be type of ArrayBuffer, Buffer, or Uint8Array. Compressed byte stream is returned, with same type of input.

**SnappyJS.uncompress(compressed, [maxLength])**
Uncompress compressed, which must be type of ArrayBuffer, Buffer, or Uint8Array. Uncompressed byte stream is returned, with same type of compressed.

If maxLength is provided, uncompress function will throw an exception if the data length encoded in the header exceeds maxLength. This is a protection mechanism for malicious data stream.

These API underlyingly is a NAPI-rs wrapper of [rust-snappy](https://github.com/BurntSushi/rust-snappy).

## Benchmark

The `benchmark` tests the google/snappy test corpus in the `benchmark/testdata`.

After my test, this is 3 to 4 times more efficient than SnappyJS.
