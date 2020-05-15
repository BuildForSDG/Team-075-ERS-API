const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const reportSchema = mongoose.Schema({
  reporter: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    phoneNo: { type: String, required: true }
  },
  location: {
    latitude: { type: String, required: true },
    longitude: { type: String, required: true }
  },
  imageUrl: { type: String },
  response: {
    status: { type: String, default: 'Respone Pending' },
    responder: { type: mongoose.Schema.Types.ObjectId, ref: 'responders' },
    recievedAt: { type: Date },
    etaToLocation: { type: Number },
    arrivedAt: { type: Date }
  }
}, { timestamps: true });

reportSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Report', reportSchema);
