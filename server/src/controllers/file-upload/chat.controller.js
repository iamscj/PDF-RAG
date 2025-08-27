import { embeddings } from "../../configs/embeddings.config.js";
import { QdrantVectorStore } from "@langchain/qdrant";
import { openaiClient } from "../../configs/openai-client.config.js";

const getSystemPrompt = (context) => {
    return `
    You are a helpful AI assistant that can answer the user's question based on the context provided.
    Here is the context: ${context}
    `;
};

const getChatResult = async (userQuery, context) => {
    const systemPrompt = getSystemPrompt(JSON.stringify(context));
    const chatResult = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userQuery },
        ],
    });
    return chatResult.choices[0].message.content;
};

const chat = async (req, res) => {
    try {
        const { message: userQuery } = req.query;
        // const userQuery = "Who is Shreyasa Joshi?";
        const vectorStore = await QdrantVectorStore.fromExistingCollection(
            embeddings,
            {
                url: process.env.QDRANT_URL,
                collectionName: "pdf-docs",
            }
        );

        const retriever = vectorStore.asRetriever({
            k: 2,
        });

        const result = await retriever.invoke(userQuery);

        const chatResult = await getChatResult(userQuery, result);

        res.status(200).json({ result: chatResult, docs: result });
    } catch (error) {
        console.log("Error in chat", error);
        res.status(500).json({ message: "Error in chat" });
    }
};

export default chat;
