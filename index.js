import express from 'express';
import mongoose from 'mongoose';
import { User, Slot } from './Models.js';

const app = express();
app.use(express.json());

const auth = async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ _id: token });
    if (!user) return res.status(400).json({ msg: 'Unauthorized Request.' });
    else next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { uniId, password } = req.body;
    const user = await User.findOne({ uniId: uniId });
    if (!user) return res.status(400).json({ msg: 'User does not exist. ' });
    if (user.password !== password)
      return res.status(400).json({ msg: 'wrong password' });
    res.status(200).json({ token: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const register = async (req, res) => {
  try {
    const { uniId, password, name } = req.body;

    const newUser = new User({
      password,
      uniId,
      name,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const available = async (req, res) => {
  try {
    const allSlots = await Slot.find({available: true});
    res.status(200).json({ available: allSlots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const allSlots = async (req, res) => {
  try {
    const allSlots = await Slot.find({});
    res.status(200).json({ allSlots: allSlots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addSlots = async (req, res) => {
  try {
    const { available, bookedBy, date , deanUniId } = req.body;
    const startTime = new Date(`${date} 10:00`);
    const newSlot = new Slot({
      available,
      bookedBy,
      date,
      startTime,
      deanUniId
    });
    const savedSlot = await newSlot.save();
    res.status(201).json(savedSlot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const bookSlots = async (req, res) => {
  try {
    const { slotId, uniId } = req.body;
    const updatedSlot = { available: false, bookedBy: uniId };
    const savedSlot = await Slot.findByIdAndUpdate(slotId, updatedSlot, {
      returnDocument: 'after',
    });
    res.status(201).json(savedSlot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const pendingSlots = async (req, res) => {
  try {
    const pendingSlots = await Slot.find({ available: false, startTime: {$gt: new Date()}  });
    res.status(200).json(pendingSlots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

app.use('/login', login);
app.use('/register', register);
app.use('/available', auth, available);
app.use('/addSlots', auth, addSlots);
app.use('/bookSlots', auth, bookSlots);
app.use('/pendingSlots', auth, pendingSlots);
app.use('/allSlots', auth, allSlots);

mongoose
  .connect(
    'mongodb+srv://chatterjeeprasoon:test@cluster0.lcn1pys.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(6000, () => console.log(`Server Port: 6000`));
  })
  .catch((error) => console.log(`${error} did not connect`));
