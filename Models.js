import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  uniId: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});
const User = mongoose.model('User', userSchema);

const slotSchema = new Schema({
  available: {
    type: Boolean,
    required: true,
  },
  bookedBy: {
    type: Number,
    default: null,
  },
  deanUniId: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
});

const Slot = mongoose.model('Slot', slotSchema);

export { User, Slot };
