module.exports = (req, res) => {
  res.status(200).json({
    message: "Hello from Sajib Dhaka's premium API backend!",
    timestamp: new Date().toISOString()
  });
};
