import { Request, Response } from 'express';
import { StorageService } from '../services/storage.service';

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

const storageService = new StorageService();

export const uploadFile = async (req: Request, res: Response) => {
    const multerReq = req as MulterRequest;
    try {
        if (!multerReq.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { bucket } = req.body;
        if (!bucket) {
            return res.status(400).json({ error: 'Bucket name is required' });
        }

        // Generate a unique filename to prevent collisions
        const timestamp = Date.now();
        const filename = `${timestamp}-${multerReq.file.originalname}`;

        const publicUrl = await storageService.uploadFile(
            bucket,
            filename,
            multerReq.file.buffer,
            multerReq.file.mimetype
        );

        res.json({ url: publicUrl });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
};
