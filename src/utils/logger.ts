import pino from "pino";
const transport = pino.transport({
    targets: [
        { target: "pino-pretty", options: { destination: 1 }, level: process.env.NODE_ENV == "prod" ? "debug" : "info" },
        { target: "#pino/file", options: { destination: `../logs/${Date.now()}-${process.env.NODE_ENV == "prod" ? "debug" : "info"}` }, level: process.env.NODE_ENV == "prod" ? "debug" : "info" }
    ]
})
export default pino(transport);