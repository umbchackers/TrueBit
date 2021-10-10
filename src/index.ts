import "dotenv/config";
import "module-alias/register"
import TrueBit from "@truebit/core/TrueBit";
const client = new TrueBit();
client.login(process.env.TOKEN);