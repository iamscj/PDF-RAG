"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { marked } from "marked";

enum Role {
    USER = "user",
    ASSISTANT = "assistant",
}

type Doc = {
    pageContent?: string;
    metadata?: {
        loc?: {
            pageNumber?: number;
        };
        source?: string;
    };
};

type Message = {
    role: Role;
    content?: string;
    documents?: Doc[];
};

export const ChatComponent = () => {
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSendChatMessage = useCallback(async () => {
        setMessages((prev) => [...prev, { role: Role.USER, content: message }]);
        setIsLoading(true);
        const response = await fetch(
            `http://localhost:8000/chat?message=${message}`
        );
        setMessage("");
        const data = await response.json();
        setMessages((prev) => [
            ...prev,
            {
                role: Role.ASSISTANT,
                content: data.result,
                documents: data.docs,
            },
        ]);
        setIsLoading(false);
    }, [message, setMessages]);

    return (
        <div className="p-4">
            <div className="fixed bottom-4 w-200 flex gap-3">
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your query here..."
                    disabled={isLoading}
                />
                <Button
                    onClick={handleSendChatMessage}
                    disabled={!message.trim() || isLoading}
                >
                    {isLoading ? "Sending..." : "Send"}
                </Button>
            </div>
            <div className="flex flex-col gap-2 mt-20 mb-20 overflow-y-auto h-[calc(100vh-200px)]">
                {messages.map((message, index) => (
                    <div key={index}>
                        <div className="bg-gray-100 p-2 rounded-md">
                            {message.role === Role.USER && (
                                <pre>{message.content}</pre>
                            )}
                        </div>
                        <div className="bg-blue-100 p-2 rounded-md">
                            {message.role === Role.ASSISTANT && (
                                <div>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: marked(
                                                message.content || ""
                                            ),
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
