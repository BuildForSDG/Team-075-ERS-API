const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const responseUnitSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: {
    primaryPhoneNo: { type: String, required: true, unique: true },
    secondaryPhoneNo: { type: String, unique: true },
    primaryAddress: { type: String },
    secondaryAddress: { type: String },
    website: { type: String, unique: true }
  }
}, { timestamps: true });

responseUnitSchema.plugin(uniqueValidator);

module.exports = mongoose.model('ResponseUnit', responseUnitSchema);
