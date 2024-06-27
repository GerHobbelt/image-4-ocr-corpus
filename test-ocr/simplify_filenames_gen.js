//
//
//

//console.log({ argv: process.argv });


let fs = require('fs');
let path = require('path');


let filepath = process.argv[2];
if (!fs.existsSync(filepath)) {
	console.error("must specify list file");
	process.exit(1);
}
let src = fs.readFileSync(filepath, 'utf8');

let a = src.split('\n')
.map(function (line) {
	return line.trim();
})
.filter(function (line) {
	return line.length > 0;
})
.map(function (line) {
	let dst = line
	.replace(/[\s\(\)\[\]\{\}!@#$%&+'",~`]/g, '_')
	.replace(/[.](png|jpg|jpeg|jp2|gif|tif|tiff|jfif|avif|jxl|bmp)[.]/g, '.')
	.replace(/[-._]+[.][-._]+/g, '.')
	.replace(/[.][-._]+/g, '.')
	.replace(/[-._]+[.]/g, '.')
	.replace(/[-_]{2,}/g, '-')
	.replace(/\\/g, '/')
	.replace(/[.][^.]+$/, function (m) {
		return m.toLowerCase();
	});
	
	let pn = dst.split('/')
	.map(function (l) {
		return l
		.replace(/^[-_]/g, '')
		.replace(/[-_]$/g, '')
	})
	.join('/');
	
	if (line !== pn) {
		if (/['"]/.test(line)) {
			return `
mv -n -- '${line}'     ${pn}
mv -n -- "${line}"     ${pn}
			`;
		} else {
			return `
mv -n -- '${line}'     ${pn}
			`;
		}
	} else {
		return "";
	}
})

console.log(`#! /bin/bash

set -v

`);

console.log(a.join('\n\n').replace(/[\n]{3,}/g, '\n\n'));

