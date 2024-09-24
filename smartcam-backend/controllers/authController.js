const authService = require('../services/authService');

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Hi");
  try {
    const token = await authService.login(email, password);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { login };