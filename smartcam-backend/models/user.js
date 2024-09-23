const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'faculty'], required: true },
  gender:{type:String},
  dob:{type:String},
  fid:{type:String},
  phone:{type:String}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);