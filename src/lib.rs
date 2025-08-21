use napi_derive::napi;
use napi::bindgen_prelude::*;
use napi::{Error, Status::GenericFailure, Status::InvalidArg};
use snap::raw::{decompress_len, Decoder, Encoder};

#[napi]
pub fn compress<'a>(
    env: &'a Env,
    input: Either<BufferSlice, Uint8Array>,
) -> Result<Either<BufferSlice<'a>, Uint8Array>> {
    let mut en = Encoder::new();
    let buf = match &input {
        Either::A(buf) => buf.as_ref(),
        Either::B(buf) => buf.as_ref(),
    };
    let buf = en
        .compress_vec(buf)
        .map_err(|e| Error::new(InvalidArg, format!("compress failed: {}", e)))?;

    match input {
        Either::A(_) => Ok(Either::A(
            BufferSlice::from_data(env, buf.as_slice()).map_err(|e| {
                Error::new(
                    GenericFailure,
                    format!("copy from failed: {}", e),
                )
            })?,
        )),
        Either::B(_) => Ok(Either::B(Uint8Array::new(buf))),
    }
}

#[napi]
pub fn uncompress<'a>(
    env: &'a Env,
    input: Either<BufferSlice, Uint8Array>,
    max_length: Option<i64>,
) -> Result<Either<BufferSlice<'a>, Uint8Array>> {
    let mut de = Decoder::new();
    let buf = match &input {
        Either::A(buf) => buf.as_ref(),
        Either::B(buf) => buf.as_ref(),
    };
    if let Some(max_length) = max_length {
        let expected_len = decompress_len(buf).map_err(|e| {
            Error::new(
                InvalidArg,
                format!("get uncompressed length failed: {}", e),
            )
        })?;
        if expected_len as i64 > max_length {
            return Err(Error::new(
                GenericFailure,
                format!("The uncompressed length of {expected_len} is too big, expect at most {max_length}"),
            ));
        }
    }
    let buf = de
        .decompress_vec(buf)
        .map_err(|e| Error::new(InvalidArg, format!("decompress failed: {}", e)))?;
    match input {
        Either::A(_) => Ok(Either::A(
            BufferSlice::from_data(env, buf.as_slice()).map_err(|e| {
                Error::new(
                    GenericFailure,
                    format!("copy from failed: {}", e),
                )
            })?,
        )),
        Either::B(_) => Ok(Either::B(Uint8Array::new(buf))),
    }
}
