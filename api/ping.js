module.exports = (req, res) => {
  res.status(200).json({ method: req.method, ok: true });
};