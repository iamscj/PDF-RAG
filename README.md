# 📘 PDF-RAG System

A **Retrieval-Augmented Generation (RAG)** system that allows users to upload PDF documents and ask questions about their content. The system processes PDFs, extracts meaningful chunks, embeds them into a vector database, and uses an LLM to provide context-aware answers.

---

## 🚀 Features

-   **User Authentication**  
    Integrated with **Clerk Auth** for secure login and signup.

-   **PDF Upload**  
    Users can upload PDFs, which are stored and queued for background processing.

-   **Background Processing with Queue**  
    Using **BullMQ** workers, PDFs are processed asynchronously to extract and chunk content.

-   **Vector Embeddings**  
    Extracted chunks are embedded using **LangChain** and stored in a **Vector Database (Qdrant)**.

-   **Intelligent Querying**  
    User queries are converted into embeddings, matched with the most relevant chunks, and combined with context for accurate responses.

-   **Frontend Experience**  
    Built with **Next.js**, providing an intuitive interface for uploading documents and chatting with the system.

-   **Backend Processing**  
    Powered by **Express.js** to handle uploads, manage workers, and communicate with the vector database.

---

## 🛠 Tech Stack

-   **Frontend:** Next.js (React-based UI for PDF upload & chat interface)
-   **Backend:** Express.js (API routes, file handling, communication with workers)
-   **Queue:** BullMQ (background job handling for PDF processing)
-   **Auth:** Clerk (user authentication and session management)
-   **Embeddings & Orchestration:** LangChain
-   **Vector Database:** Qdrant (stores PDF embeddings for semantic search)

---

## 🔄 System Workflow

1. **Authentication:** User logs in/signup using Clerk.
2. **Upload:** User uploads a PDF document via the frontend.
3. **Storage & Queue:** The PDF is stored, and a job is pushed to a **BullMQ** queue.
4. **Worker:** A background worker processes the PDF, chunks text, and generates embeddings.
5. **Vector Store:** Embeddings are stored in **Qdrant** for retrieval.
6. **Query:** User types a question → converted into embeddings.
7. **Retrieval:** Relevant chunks are retrieved from Qdrant.
8. **LLM Response:** Context + Query passed to an LLM → response returned to the user.

---

## 📊 Architecture Diagram

The high-level flow is represented below:

<img width="1370" height="646" alt="image" src="https://github.com/user-attachments/assets/7f0835fc-5fd6-406e-aa42-0d8ec565b446" />


---
