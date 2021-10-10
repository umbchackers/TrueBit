import { Client, Snowflake } from "discord.js";
import CommandManager from "@truebit/managers/CommandManager";
import { DEPLOY_SCRIPT_PATH } from "./constants";
import { spawn } from "child_process";
import logger from "@truebit/utils/logger";

export default
class extends Client 
{
    protected commandManager: CommandManager;

    constructor()
    {
        super({
            intents: ['DIRECT_MESSAGES', 'GUILDS'],
            allowedMentions: {
                parse: ["everyone", "roles", "users"]
            }
        });

        this.commandManager = new CommandManager(this);
    }

    /**
     * To make sure your slash command changes are instant, add them as guild level commands, not application level
     */
    public async runDeployScript(clientID: Snowflake, guildID: Snowflake): Promise<void>
    {
        return new Promise((resolve, reject) => {
            const node = spawn(`TOKEN="${process.env.TOKEN}" CLIENT_ID="${clientID}" GUILD_ID="${guildID}" node`, [DEPLOY_SCRIPT_PATH, JSON.stringify(this.commandManager.fetchAllCommands())]);

            node.stdout.on(`data`, (data) => {
                logger.debug(data.toString() ?? data);
            });

            node.stderr.on(`data`, (data) => {
                logger.error(data.toString() ?? data);
                reject(data.toString() ?? data);
            });

            node.on("close", (code) => {
                logger.debug(`deploy script finished. Exit code=${code}`);
                resolve();
            })
        });
    }
}