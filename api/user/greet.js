module.exports = (req, res) => {
  console.log("Greet endpoint was called at", new Date().toISOString());
  res.status(200).json({
    message: "Hello from Sajib Dhaka's premium API backend!",
    timestamp: new Date().toISOString()
  });
};
