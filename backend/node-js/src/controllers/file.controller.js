const jwt = require("jsonwebtoken");
const {
  createFile,
  findFileById,
  findAllFilesByUserId,
  findFilesByUserIdAndFileType,
  deleteFileById,
} = require("../services/file.service");
const { findSession } = require("../services/auth.service");
const { findUserById } = require("../services/user.service");

exports.createFile = async (req, res) => {
  const { token, file_name, file_type, s3_path } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const foundSession = await findSession(decoded.id, token);

    if (!foundSession) {
      return res.status(401).json({ message: "Invalid session" });
    }

    const foundUser = await findUserById(foundSession.user_id);

    const file = await createFile(
      foundUser.id,
      file_name,
      file_type,
      s3_path,
      new Date()
    );
    res.status(201).json({ message: "File created successfully", file });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFileById = async (req, res) => {
  const { fileId } = req.body;
  try {
    const file = await findFileById(fileId);
    res.status(200).json({ file });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFilesByUserId = async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const foundSession = await findSession(decoded.id, token);

    if (!foundSession) {
      return res.status(401).json({ message: "Invalid session" });
    }

    const userId = foundSession.user_id;

    const files = await findAllFilesByUserId(userId);
    res.status(200).json({ files });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFilesByUserIdAndFileType = async (req, res) => {
  const { token, fileType } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const foundSession = await findSession(decoded.id, token);

    if (!foundSession) {
      return res.status(401).json({ message: "Invalid session" });
    }

    const userId = foundSession.user_id;

    const files = await findFilesByUserIdAndFileType(userId, fileType);
    res.status(200).json({ files });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteFileById = async (req, res) => {
  const { fileId } = req.body;
  try {
    const file = await deleteFileById(fileId);
    res.status(200).json({ message: "File deleted successfully", file });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
