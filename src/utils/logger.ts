import pino from "pino";
import { resolve } from "path";

const logsPath = resolve(__dirname, "../..", "logs");
const transport = pino.transport({
    targets: [
        { target: "pino-pretty", options: { destination: 1 }, level: process.env.NODE_ENV == "prod" ? "info" : "debug" },
        { target: "pino/file", options: { destination: `${logsPath}/${process.env.NODE_ENV == "prod" ? "info" : "debug"}.json` }, level: process.env.NODE_ENV == "prod" ? "info" : "debug" }
    ]
});
export default pino(transport);