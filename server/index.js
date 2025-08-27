import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
    uploadPdf,
    upload,
} from "./src/controllers/file-upload/file-upload.controller.js";
import chat from "./src/controllers/file-upload/chat.controller.js";

const app = express();
dotenv.config();
app.use(cors());

app.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});

app.post("/upload/pdf", upload.single("pdf"), uploadPdf);

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});

app.get("/chat", chat);
