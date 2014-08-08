var hmm = require('nodehmm'),
	model = new hmm.Model();

var fs = require('fs'),
	readLine = require('readline'),
	wordIdMap = require('../lib/tag.json');

var options = {
	flags: 'r',
	fd: null,
	encoding: null,
	mode: 0666,
	autoClose: true
};
var readStream = fs.createReadStream(__dirname + '/../output/out.txt', options);

var rl = readLine.createInterface({
	input: readStream,
	output: process.stdout,
	terminal: false
});

rl.on('line', function (line) {
	try {
		var lineParts = line.split('=');
		console.log('type:', lineParts[0]);
		parseModel(lineParts);
	} catch(e) {
		console.log('model file format error!');
		process.exit(0);
	}
});

rl.on('close', function () {
	console.log(model);
	console.log('finish training.');
});

function parseModel (lineParts) { 
	if (lineParts[0] === 'pi')
		model.setStatesSize(JSON.parse(lineParts[1]));
	else if (lineParts[0] === 'transitionProbability')
		model.setTransitionProbability(JSON.parse(lineParts[1]));
	else if (lineParts[0] === 'emissionProbability')
		model.setEmissionProbability(JSON.parse(lineParts[1]));
	else 
		throw new Error("model file format error!");
};