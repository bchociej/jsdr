const RTLSDR = require('js-rtlsdr').RTLSDR;
const _ = require('highland');

// fastest methods I've found

// suck in samples
_('data', RTLSDR.whatever().read());

// 'type' the data
Uint8Array.from(buffer);

// NB DO NOT try to slice up stream into individual bytes



/*
TODO items - find highest performance solutions

1. arbitrary re-sizing of TypedArrays and/or Buffers
2. trig operations on TypedArrays
3. mixing (multiplying) one stream with another, with incongruent chunk sizes
4. IIR filtering at speed
