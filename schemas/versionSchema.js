// schemas/Version.js
const { Schema, model } = require('mongoose');

const versionSchema = new Schema({
    botVersion: String,
});

module.exports = model('Version', versionSchema);
