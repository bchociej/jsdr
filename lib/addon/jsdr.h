#ifndef JSDR_MAIN_API_GRAB_H
#define JSDR_MAIN_API_GRAB_H

#include <nan.h>

void deint_u8(const Nan::FunctionCallbackInfo<v8::Value> & info);
void u8_to_s8(const Nan::FunctionCallbackInfo<v8::Value> & info);

NAN_MODULE_INIT(InitAll) {
	NAN_EXPORT(target, deint_u8);
	NAN_EXPORT(target, u8_to_s8);
}

NODE_MODULE(jsdr, InitAll);

#endif
