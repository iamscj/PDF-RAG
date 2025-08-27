import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

const upload = multer({ storage });

app.post("/upload/pdf", upload.single("pdf"), (req, res) => {
    res.json({ message: "File uploaded", file: req.file });
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
