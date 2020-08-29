const mongoose = require('mongoose');

let fileSchema = new mongoose.Schema(
	{
		name: String,
		mimeType: String,
		size: String,
		slug: String,
	},
	{
		collection: 'files',
	}
);

module.exports = mongoose.model('fileSchema', fileSchema);
