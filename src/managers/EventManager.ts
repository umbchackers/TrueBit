import TrueBit from "@truebit/core/TrueBit";
import { readdirSync } from "fs";
import { resolve } from "path";

export default
class
{
    constructor(private readonly client: TrueBit)
    {
        readdirSync(resolve(__dirname, "..", "events")).forEach(file => {
            this.client.on(file.split(".")[0], (require(resolve(__dirname, "..", "events", file))).bind(null, this.client));
        });
    }
}