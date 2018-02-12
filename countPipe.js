/**
 * Contains the stream used to collect and count various name occurences.
 */
const { Transform } = require('stream');

exports.counter = class Counter extends Transform {
	constructor(options) {
		super(options || {});
		this._counts = {};
	}
	_transform(chunk, enc, cb) {
		var names = chunk.name.split(' ')
		for (var name of names) {
			if (this._counts[name]) {
				this._counts[name] += 1
			} else {
				this._counts[name] = 1
			}
		}
		
		cb()
	}
	_flush(cb) {
		this.push(this._counts);
		cb();
	}
}