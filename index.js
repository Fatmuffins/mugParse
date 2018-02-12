const csv = require('csv-stream');
const fs = require('fs');
const cp = require('./countPipe.js');
const fp = require('./countFormatPipe.js');
const { Transform, Writable } = require('stream');

const sourceFile = 'collected.txt'	
const csvOpt = {
	delimiter: '\t',
	columns: ['Line']
}
const objOpt = {
		max: 100,
		objectMode: true,
}

const dateFilter = /[0-9]+.[0-9]+.[0-9]{4}/;
const nameFilter = /[a-zA-Z]+ /g;
const linkFilter = /<(.+)>/;

var csvStream = new csv.createStream(csvOpt);
var counterStream = new cp.counter(objOpt);
var formatStream = new fp.format(objOpt);

fs.ReadStream(sourceFile).pipe(csvStream);
counterStream.pipe(formatStream).pipe(process.stdout);

csvStream.on('data', function(data) { 
    var nameMatch = data.Line.match(nameFilter);
    var dateMatch = data.Line.match(dateFilter);
    var linkMatch = data.Line.match(linkFilter);
    var fullName = [];
    
    for (let name of nameMatch) {
    	fullName.push(name);
    };
    
    var arrPerson = {
    	name: fullName.join('').substr(0, fullName.join('').length - 1),
    	date: dateMatch[0],
    	link: linkMatch[0].substr(1, linkMatch[0].length - 2),
    }
    counterStream.write(arrPerson);
})
csvStream.on('end', function() {
	counterStream.end();
})
counterStream.on('end', function() {
	formatStream.end();
})

csvStream.on('error', (err) => {
    console.error(err);
})
counterStream.on('error', (err) => {
	console.error(err);
})
formatStream.on('error', (err) => {
	console.error(err);
})
// To do: Investigate replacing csvStream with 'split' for its line reading capabilities.