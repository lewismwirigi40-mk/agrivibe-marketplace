const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../storage/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'upload-' + uniqueSuffix + ext);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'application/zip', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Allowed: JPEG, PNG, WEBP, GIF, PDF, ZIP, DOC, DOCX'), false);
    }
};

// Multer upload
const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter
});

// ============================================
// UPLOAD SINGLE FILE
// ============================================
exports.uploadSingle = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;

        res.json({
            success: true,
            url: fileUrl,
            filename: req.file.filename,
            size: req.file.size,
            mimetype: req.file.mimetype
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
};

// ============================================
// UPLOAD MULTIPLE FILES
// ============================================
exports.uploadMultiple = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const uploadedFiles = req.files.map(file => ({
            url: `/uploads/${file.filename}`,
            filename: file.filename,
            size: file.size,
            mimetype: file.mimetype
        }));

        res.json({
            success: true,
            files: uploadedFiles
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload files' });
    }
};

// Delete file
exports.deleteFile = async (req, res) => {
    try {
        const { filename } = req.body;

        if (!filename) {
            return res.status(400).json({ error: 'Filename is required' });
        }

        const filePath = path.join(__dirname, '../../storage/uploads', filename);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({
                success: true,
                message: 'File deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'File not found'
            });
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Failed to delete file' });
    }
};

// ============================================
// MULTER MIDDLEWARE
// ============================================
exports.uploadSingleMiddleware = upload.single('image');
exports.uploadMultipleMiddleware = upload.array('images', 10);