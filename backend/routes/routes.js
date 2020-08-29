const express = require('express');
const multer = require('multer');
const fileSchema = require('../models/file');
var path = require('path');
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

var upload = multer({ storage: storage });

const routes = express.Router();
routes.route('/file/save').post(upload.single('file'), async (req, res) => {
	console.log(req.file);
	try {
		if (!req.file) {
			res.status(502).send({ success: false, message: 'No file uploaded' });
		}
		let slug = '';
		uniqueidfound = 1;
		while (uniqueidfound) {
			slug = generateRandomSlug(20);
			uniqueidfound = await fileSchema.findOne({
				slug: slug,
			});
		}
		var newFile = new fileSchema({
			name: req.file.originalname,
			mimeType: req.file.mimetype,
			size: req.file.size,
			slug: slug,
		});
		await newFile.save();
		res.status(200).send({ success: true, message: 'File saved sucessfully', data: newFile });
	} catch (error) {
		res.status(500).send({ success: false, message: 'Unexpected server error' });
	}
});

routes.route('/file/get/:slug').get(async (req, res, next) => {
	try {
		var slug = req.params.slug;
		var fileObject = await fileSchema.findOne({ slug: slug });
		console.log(fileObject);
		if (!fileObject) {
			res.status(404).send({ success: false, message: 'No file found' });
		}
		res.sendFile(`${path.dirname(require.main.filename)}/uploads/${fileObject.name}`);
	} catch (error) {
		console.log(error);
		res.status(500).send({ success: false, message: 'Unexpected server error' });
	}
});

module.exports = routes;

function generateRandomSlug(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
