const Host = require("./models/Host");

exports.createHost = async (req, res) => {
  const hostData = req.body;
  try {
    const hostDoc = await Host.create(hostData);
    res.json(hostDoc);
  } catch (e) {
    res.status(422).json(e);
  }
};

exports.getHostById = async (req, res) => {
  const { id } = req.params;
  try {
    const hostDoc = await Host.findById(id);
    res.json(hostDoc);
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.updateHost = async (req, res) => {
  const { id } = req.params;
  const hostData = req.body;
  try {
    const hostDoc = await Host.findByIdAndUpdate(id, hostData, { new: true });
    res.json(hostDoc);
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.deleteHost = async (req, res) => {
  const { id } = req.params;
  try {
    await Host.findByIdAndDelete(id);
    res.json({ message: "Host deleted" });
  } catch (e) {
    res.status(500).json(e);
  }
};
