import pino from "pino";

const logger = pino({
    level: "info",
    transport: {
        target: "pino-pretty", // pretty output in dev
        options: { colorize: true },
    },
});

export default logger;
