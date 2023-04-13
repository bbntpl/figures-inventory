const multer = require('multer');

const upload = multer({
	storage: multer.memoryStorage(), // setup memory storage
	limits: { fileSize: 2 * 1024 * 1024 }, // limit upload size to 2MB
});

module.exports = upload;