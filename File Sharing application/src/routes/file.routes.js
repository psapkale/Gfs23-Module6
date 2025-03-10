import express from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import File from "../models/file.model.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// ES module dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for file upload
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      const uploadDir = path.join(dirname(__dirname), "../uploads");
      if (!fs.existsSync(uploadDir)) {
         fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
   },
   filename: (req, file, cb) => {
      const uniqueSuffix = crypto.randomBytes(16).toString("hex");
      cb(null, uniqueSuffix + path.extname(file.originalname));
   },
});

const upload = multer({
   storage,
   limits: {
      fileSize: 100 * 1024 * 1024, // 100MB limit
   },
   fileFilter: (req, file, cb) => {
      // Add file type restrictions if needed
      cb(null, true);
   },
});

// Upload file
router.post("/upload", auth, upload.single("file"), async (req, res) => {
   console.log(req.file.filename);

   try {
      if (!req.file) {
         return res.status(400).json({ message: "No file uploaded" });
      }

      const newFile = new File({
         filename: req.file.filename,
         originalname: req.file.originalname,
         mimetype: req.file.mimetype,
         size: req.file.size,
         path: req.file.path,
         owner: req.user._id,
      });

      // Check user storage limit
      const userStorageUsed = await File.aggregate([
         { $match: { owner: req.user._id } },
         { $group: { _id: null, total: { $sum: "$size" } } },
      ]);

      const totalStorageUsed = (userStorageUsed[0]?.total || 0) + req.file.size;
      if (totalStorageUsed > req.user.storageLimit) {
         fs.unlinkSync(req.file.path);
         return res.status(400).json({ message: "Storage limit exceeded" });
      }

      await newFile.save();
      res.status(201).json({
         message: "File uploaded successfully",
         file: newFile,
      });
   } catch (error) {
      if (req.file) {
         fs.unlinkSync(req.file.path);
      }
      res.status(500).json({
         message: "Error uploading file",
         error: error.message,
      });
   }
});

// Get all files for authenticated user
router.get("/my-files", auth, async (req, res) => {
   try {
      const files = await File.find({ owner: req.user._id });
      res.json(files);
   } catch (error) {
      res.status(500).json({
         message: "Error fetching files",
         error: error.message,
      });
   }
});

// Download file
router.get("/download/:fileId", auth, async (req, res) => {
   try {
      const file = await File.findById(req.params.fileId);
      if (!file) {
         return res.status(404).json({ message: "File not found" });
      }

      // Check if user has access to file
      if (
         !file.isPublic &&
         file.owner.toString() !== req.user._id.toString() &&
         !file.sharedWith.some(
            (share) => share.user.toString() === req.user._id.toString()
         )
      ) {
         return res.status(403).json({ message: "Access denied" });
      }

      file.downloadCount += 1;
      await file.save();

      res.download(file.path, file.originalname);
   } catch (error) {
      res.status(500).json({
         message: "Error downloading file",
         error: error.message,
      });
   }
});

// Share file
router.post("/share/:fileId", auth, async (req, res) => {
   try {
      const { userId, permission } = req.body;
      const file = await File.findById(req.params.fileId);

      if (!file) {
         return res.status(404).json({ message: "File not found" });
      }

      if (file.owner.toString() !== req.user._id.toString()) {
         return res.status(403).json({ message: "Access denied" });
      }

      // Check if already shared with user
      const shareIndex = file.sharedWith.findIndex(
         (share) => share.user.toString() === userId
      );

      if (shareIndex !== -1) {
         file.sharedWith[shareIndex].permission = permission;
      } else {
         file.sharedWith.push({ user: userId, permission });
      }

      await file.save();
      res.json({ message: "File shared successfully", file });
   } catch (error) {
      res.status(500).json({
         message: "Error sharing file",
         error: error.message,
      });
   }
});

// Generate shareable link
router.post("/share-link/:fileId", auth, async (req, res) => {
   try {
      const { expiresIn } = req.body; // Duration in hours
      const file = await File.findById(req.params.fileId);

      if (!file) {
         return res.status(404).json({ message: "File not found" });
      }

      if (file.owner.toString() !== req.user._id.toString()) {
         return res.status(403).json({ message: "Access denied" });
      }

      const shareableLink = crypto.randomBytes(32).toString("hex");
      file.shareableLink = shareableLink;

      if (expiresIn) {
         file.expiresAt = new Date(Date.now() + expiresIn * 60 * 60 * 1000);
      }

      await file.save();
      res.json({
         message: "Shareable link generated",
         link: `${
            process.env.BASE_URL || "http://localhost:3000"
         }/api/files/shared/${shareableLink}`,
      });
   } catch (error) {
      res.status(500).json({
         message: "Error generating shareable link",
         error: error.message,
      });
   }
});

// Delete file
router.delete("/:fileId", auth, async (req, res) => {
   try {
      const file = await File.findById(req.params.fileId);

      if (!file) {
         return res.status(404).json({ message: "File not found" });
      }

      if (file.owner.toString() !== req.user._id.toString()) {
         return res.status(403).json({ message: "Access denied" });
      }

      fs.unlinkSync(file.path);
      await file.deleteOne();

      res.json({ message: "File deleted successfully" });
   } catch (error) {
      res.status(500).json({
         message: "Error deleting file",
         error: error.message,
      });
   }
});

export default router;
