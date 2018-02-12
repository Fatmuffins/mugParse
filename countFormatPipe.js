/**
 * Contains the stream used to sort and organize the data the counter outputs.
 */
const { Transform } = require('stream');

exports.format = class Format extends Transform {
	constructor(options) {
		super(options || {});
		this._max = options['max'] || 50;
		this._writer = null;
		
		this._sorted = null;
		this._unsorted = null;
	}
	_transform(chunk, enc, cb) {
		this._unsorted = Object.entries(chunk);
		this._sorted = this._unsorted.sort(function (a, b) {
			return a[1] - b[1]
		});
		
		cb();
	}
	_flush(cb) {
		this.push(JSON.stringify(this._sorted.slice(this._sorted.length - this._max, this._sorted.length)));
		cb();
	}
}