const path = require('path');
const fs = require('fs');

function readImageAsBuffer(imagePath) {
	const fullPath = path.join(__dirname, imagePath);
	return fs.readFileSync(fullPath);
}

module.exports = {
	readImageAsBuffer,
}