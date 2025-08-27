import { Worker } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import logger from "../logger/logger.js";
import dotenv from "dotenv";
import { embeddings } from "../configs/embeddings.config.js";

dotenv.config();

const uploadToQdrant = async (docs) => {
    try {
        console.log(process.env.QDRANT_URL, "QDRANT_URL");
        const vectorStore = await QdrantVectorStore.fromExistingCollection(
            embeddings,
            {
                url: process.env.QDRANT_URL,
                collectionName: "pdf-docs",
            }
        );

        await vectorStore.addDocuments(docs);
        logger.info("Documents uploaded to Qdrant");
        return true;
    } catch (error) {
        console.log("Error uploading documents to Qdrant", error);
        return false;
    }
};

const worker = new Worker(
    "pdf-upload",
    async (job) => {
        logger.info("Job" + JSON.stringify(job.data));
        const data = JSON.parse(job.data);
        const { filename, path } = data;
        /*
            - Read the pdf from path
            - Chun the pdf
            - call the openai embedding model for every chunk
            - store the chunk in Qdrant db
         */

        // Load the pdf
        const loader = new PDFLoader(path);
        const docs = await loader.load();
        const isUploaded = await uploadToQdrant(docs);

        // const textSplitter = new CharacterTextSplitter({
        //     chunkSize: 300,
        //     chunkOverlap: 5,
        // });

        // const texts = await textSplitter.splitDocuments(docs);
        // logger.info("Texts", texts);
    },
    {
        concurrency: 100,
        connection: {
            host: "localhost",
            port: 6379,
        },
    }
);
