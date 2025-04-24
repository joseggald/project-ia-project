const { Router } = require("express");
const {
  createFile,
  getFileById,
  getFilesByUserId,
  getFilesByUserIdAndFileType,
  deleteFileById,
} = require("../controllers/file.controller");

const router = Router();

router.post("/create", createFile);
router.post("/get", getFileById);
router.post("/get-all", getFilesByUserId);
router.post("/get-by-type", getFilesByUserIdAndFileType);
router.delete("/delete", deleteFileById);

module.exports = router;
