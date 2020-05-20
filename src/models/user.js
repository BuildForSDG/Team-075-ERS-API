const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  phoneNo: { type: String, unique: true },
  emergencyContact: {
    name: { type: String },
    phoneNo: { type: String }
  },
  provider: { type: String },
  providerId: { type: String },
  providerData: {
    accessToken: { type: String },
    refreshToken: { typer: String }
  }
}, { timestamps: true });

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
