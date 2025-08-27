## PDF RAG System

A minimal Retrieval-Augmented Generation (RAG) setup where users upload a PDF and ask questions answered using context retrieved from that PDF.

### Highlights

-   **Upload + Drag & Drop**: Client lets users upload a PDF via click or drag/drop.
-   **Async Processing**: Upload enqueues a BullMQ job; a worker extracts text and stores embeddings.
-   **Vector Search**: Qdrant stores embeddings; queries retrieve top chunks as context.
-   **Chat**: The server composes the context and calls an LLM to answer.
-   **Auth-ready**: UI is structured to plug in Clerk for login if desired.

### Tech Stack

-   **Frontend**: Next.js (App Router), React
-   **Server**: Express, Multer (file upload), LangChain
-   **Queue**: BullMQ (Redis)
-   **Vector DB**: Qdrant
-   **LLM/Embeddings**: OpenAI via LangChain

### System Flow

1. User uploads a PDF from the client (`client/app/components/file-upload.tsx`).
2. Server saves the file (Multer) and enqueues a job (`pdf-upload`).
3. Worker consumes the job, loads the PDF, creates embeddings, and upserts to Qdrant (`pdf-docs` collection).
4. User asks a question; server retrieves relevant chunks from Qdrant and calls the LLM to answer.

### Key Endpoints

-   `POST /upload/pdf` — accepts multipart field `pdf`, saves file, enqueues BullMQ job.
-   `GET /chat?message=...` — retrieves top documents and returns an LLM answer plus matched docs.

### Important Files

-   Client UI: `client/app/components/file-upload.tsx`, `client/app/components/chat.tsx`, `client/app/page.tsx`
-   Server HTTP: `server/index.js`
-   Upload Controller: `server/src/controllers/file-upload/file-upload.controller.js`
-   Chat Controller: `server/src/controllers/file-upload/chat.controller.js`
-   Worker: `server/src/worker/worker.js`
-   OpenAI clients: `server/src/configs/openai-client.config.js`, `server/src/configs/embeddings.config.js`

### Quick Start (condensed)

1. Start Redis and Qdrant.
2. Configure environment variables (OpenAI keys, `OPENAI_BASE_URL`, `QDRANT_URL`).
3. From `server/`: install deps, run API and worker.
4. From `client/`: install deps, run the Next.js app.

Once running:

-   Upload a PDF in the left panel.
-   Ask questions in the chat panel; results include the answer and matching document chunks.

### Notes

-   Embedding model: `text-embedding-3-small`.
-   LLM: `gpt-4o-mini` (configurable).
-   Qdrant collection name: `pdf-docs`.
