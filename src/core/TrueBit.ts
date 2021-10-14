import { ApplicationCommandPermissionData, Client, Snowflake } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import CommandManager from "@truebit/managers/CommandManager";
import EventManager from "@truebit/managers/EventManager";
import logger from "@truebit/utils/logger";
import { DEPLOY_SCRIPT_PATH } from "./constants";
import { spawn } from "child_process";

export default
class TrueBit extends Client 
{
    public static readonly OWNER_UID: string = "200042113814102016";

    public commandManager: CommandManager;
    public eventManager: EventManager;

    constructor()
    {
        super({
            intents: ['DIRECT_MESSAGES', 'GUILDS'],
            allowedMentions: {
                parse: ["everyone", "roles", "users"]
            }
        });

        this.commandManager = new CommandManager(this);
        this.eventManager = new EventManager(this);
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

    /**
     * !! Run this ONCE !!
     */
    public async __defineAllCommands()
    {
        [
            new SlashCommandBuilder().setName("test").setDescription("Test command"),

        ]
        .map(val => this.commandManager.defineCommand(val.name, val));
    }

    /**
     * !! Run this ONCE !!
     * @param guildId 
     */
    public async __createGlobalDeployCmd(guildId: Snowflake)
    {
        if (!this.application?.owner) 
            await this.application?.fetch();

        this.commandManager.defineCommand("__globalDeploy", new SlashCommandBuilder().setName("deployscript").setDescription("Runs the deploy script").setDefaultPermission(false));
        const appCommand = await this.application?.commands.create(this.commandManager.slashCommands.get("__globalDeploy")?.toJSON()! as any);
        const permissions = [
            {
                id: TrueBit.OWNER_UID,
                type: `USER`,
                permission: true
            }
        ];
        // @ts-ignore
        await appCommand?.permissions.set({ permissions, guild: guildId });
    }
}