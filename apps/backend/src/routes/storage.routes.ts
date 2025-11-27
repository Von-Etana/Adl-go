import { Router } from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/storage.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

router.post('/upload', authenticateJWT, upload.single('file'), uploadFile);

export default router;
