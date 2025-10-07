const mongoose = require('mongoose');

const bhandaraSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // URL or path to image
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  additionalDetails: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

bhandaraSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Bhandara', bhandaraSchema);
