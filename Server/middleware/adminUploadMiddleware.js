import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
const dirname = path.dirname(fileURLToPath(import.meta.url));
const storage = multer.diskStorage({
  destination: path.join(dirname, "../uploads/products"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`),
});
const fileFilter = (req, file, cb) => cb(null, /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype));
export const productImagesUpload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024, files: 6 } }).array("images", 6);
