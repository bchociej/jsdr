const RTLSDR = require('js-rtlsdr').RTLSDR;
const _ = require('highland');
const async = require('async');
const routines = require('bindings')('jsdr-routines.node');

/*

fastest methods I've found

1. suck in samples
	_('data', RTLSDR.whatever().read());

2. 'type' the data
	Uint8Array.from(buffer);


NB DO NOT try to slice up stream into individual bytes



TODO items - find highest performance solutions

1. arbitrary re-sizing of TypedArrays and/or Buffers
2. trig operations on TypedArrays
3. mixing (multiplying) one stream with another, with incongruent chunk sizes
4. IIR filtering at speed

*/

const bufLen = 15 * 16 * 32 * 512 * 2;
const nums = new Uint8Array(bufLen);

for (let i = 0; i < bufLen; i++) {
	nums[i] = Math.floor(Math.random() * 256);
}

function getter(push, next) {
	push(null, Buffer.from(nums));
	setTimeout(() => { next(); });
}

function cppDeinterleave(buf) {
	const buf8 = new Uint8Array(buf);
	const i8 = new Uint8Array(Buffer.allocUnsafe(buf.length / 2));
	const q8 = new Uint8Array(Buffer.allocUnsafe(buf.length / 2));

	routines.deint_u8(buf8, i8, q8);

	return [i8, q8];
}

function cppNormalize(channels) {
	return channels.map(routines.u8_to_s8);
}





let count = 0;
let print = false;

setInterval(() => { print = true; }, 2500);

const start = process.hrtime();
let last = process.hrtime();
_(getter)
	.map(cppDeinterleave)
	.map(cppNormalize)
	.tap((item) => {
		count += item[0].length;
		if (print) {
			const delta = process.hrtime(start);
			const Sps = count / (delta[0] + (delta[1] / 1e9));
			const MSps = Math.round(100 * Sps / (1000 * 1000)) / 100;
			console.log("\ntotal:   " + MSps + " MS/s");
			console.log("         " + (16*MSps) + " Mbps");
			print = false;

			console.log(nums.slice(0,10));
			console.log(item[0].slice(0, 5));
			console.log(item[1].slice(0, 5));
		}
	})
	.resume();
