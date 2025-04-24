import { Router } from "express";
import {
  createFileController,
  getFileByIdController,
  getFilesByUserIdController,
  getFilesByUserIdAndFileTypeController,
  deleteFileByIdController,
} from "../controllers/file.controller";

const router = Router();

router.post("/create", createFileController);
router.post("/get", getFileByIdController);
router.post("/get-all", getFilesByUserIdController);
router.post("/get-by-type", getFilesByUserIdAndFileTypeController);
router.delete("/delete", deleteFileByIdController);

module.exports = router;
