const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');
const {
  getProfile,
  updateProfile,
  deleteProfile,
  uploadImage
} = require('../controllers/profileController');

router.use(protect);

router.route('/')
  .get(getProfile)
  .put(updateProfile)
  .delete(deleteProfile);

router.post('/image', upload.single('profileImage'), uploadImage);

module.exports = router;
