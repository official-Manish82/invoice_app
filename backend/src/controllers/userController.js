import User from '../models/User.js';

// @desc    Get user profile & settings
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        companyName: user.companyName,
        settings: user.settings || { currency: 'USD', address: '', gstNumber: '' }
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile & settings
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.companyName = req.body.companyName || user.companyName;
      
      // Safely ensure settings object exists before updating
      const currentSettings = user.settings || {};

      user.settings = {
        address: req.body.address !== undefined ? req.body.address : currentSettings.address,
        gstNumber: req.body.gstNumber !== undefined ? req.body.gstNumber : currentSettings.gstNumber,
        currency: req.body.currency || currentSettings.currency || 'USD',
      };

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        companyName: updatedUser.companyName,
        settings: updatedUser.settings,
        token: req.headers.authorization.split(' ')[1], // Keep current token
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    // THIS WILL TELL US EXACTLY WHAT WENT WRONG IN THE TERMINAL
    console.error("UPDATE PROFILE ERROR:", error); 
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};