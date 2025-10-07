const express = require('express');
const Bhandara = require('../models/Bhandara');
const auth = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Create bhandara
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    let imageUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }
    const data = { ...req.body };
    if (data.location) {
      data.location = JSON.parse(data.location);
    }
    const bhandara = new Bhandara({ ...data, image: imageUrl, createdBy: req.user.id });
    await bhandara.save();
    res.status(201).json(bhandara);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get nearby bhandaras
router.get('/nearby', auth, async (req, res) => {
  try {
    const { lng, lat } = req.query;
    const bhandaras = await Bhandara.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 2000 // 2km
        }
      }
    }).populate('createdBy', 'username');
    res.json(bhandaras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bhandaras
router.get('/', auth, async (req, res) => {
  try {
    const bhandaras = await Bhandara.find().populate('createdBy', 'username').populate('attendees', 'username');
    res.json(bhandaras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single bhandara
router.get('/:id', auth, async (req, res) => {
  try {
    const bhandara = await Bhandara.findById(req.params.id).populate('createdBy', 'username').populate('attendees', 'username');
    if (!bhandara) {
      return res.status(404).json({ error: 'Bhandara not found' });
    }
    res.json(bhandara);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Attend or unattend bhandara
router.post('/:id/attend', auth, async (req, res) => {
  try {
    const bhandara = await Bhandara.findById(req.params.id);
    if (!bhandara) {
      return res.status(404).json({ error: 'Bhandara not found' });
    }
    const userId = req.user.id;
    const isAttending = bhandara.attendees.includes(userId);
    if (isAttending) {
      bhandara.attendees.pull(userId);
    } else {
      bhandara.attendees.push(userId);
    }
    await bhandara.save();
    res.json({ attending: !isAttending, attendeesCount: bhandara.attendees.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
