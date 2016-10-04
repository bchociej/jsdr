#include <iostream>
#include "jsdr.h"

void deint_u8(const Nan::FunctionCallbackInfo<v8::Value> & info) {
	v8::Local<v8::Value> src  = info[0],
	                     dst1 = info[1],
	                     dst2 = info[2];

	if(!src->IsUint8Array() || !dst1->IsUint8Array() || !dst2->IsUint8Array())
		return Nan::ThrowTypeError("args must be Uint8Arrays");


	Nan::TypedArrayContents<uint8_t> src_tac(src);
	Nan::TypedArrayContents<uint8_t> dst1_tac(dst1);
	Nan::TypedArrayContents<uint8_t> dst2_tac(dst2);

	if(src_tac.length() != dst1_tac.length() * 2 || dst1_tac.length() != dst2_tac.length())
		return Nan::ThrowRangeError("src must be twice as long as dst1 and dst2");

	size_t dst_len = dst1_tac.length();
	uint8_t * src_u8 = *src_tac;
	uint8_t * dst1_u8 = *dst1_tac;
	uint8_t * dst2_u8 = *dst2_tac;

	for(size_t i = 0, j = 0; i < dst_len; i++, j += 2) {
		dst1_u8[i] = src_u8[j];
		dst2_u8[i] = src_u8[j+1];
	}
}

void u8_to_s8(const Nan::FunctionCallbackInfo<v8::Value> & info) {
	v8::Local<v8::Value> val = info[0];
	if(!val->IsUint8Array())
		return Nan::ThrowTypeError("arg must be a Uint8Array");

	Nan::TypedArrayContents<uint8_t> u8tac(val);
	Nan::TypedArrayContents<int8_t> i8tac(val);

	uint8_t * u8_ptr = *u8tac;
	int8_t * i8_ptr = *i8tac;

	size_t u8len = u8tac.length();

	for(size_t i = 0; i < u8len; i++) {
		int val = (int) u8_ptr[i] - 127;
		i8_ptr[i] = val;
	}

	info.GetReturnValue().Set(v8::Int8Array::New(val.As<v8::Uint8Array>()->Buffer(), 0, u8len));
}
