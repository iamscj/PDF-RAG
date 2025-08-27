import multer from "multer";
import { Queue } from "bullmq";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

export const upload = multer({ storage });

const queue = new Queue("pdf-upload", {
    connection: {
        host: "localhost",
        port: 6379,
    },
});

const addFileToQueue = async (file) => {
    await queue.add(
        "file-ready",
        JSON.stringify({
            filename: file.filename,
            destination: file.destination,
            path: file.path,
        })
    );
};

export const uploadPdf = async (req, res) => {
    await addFileToQueue(req.file);
    res.json({ message: "File uploaded", file: req.file });
};
