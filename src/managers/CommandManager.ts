import TrueBit from "@truebit/core/TrueBit";
import { Collection } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default
class
{
    /** Global slash commands list */
    public slashCommands: Collection<string, SlashCommandBuilder>

    constructor(private client: TrueBit)
    {
        this.slashCommands = new Collection();
    }

    public defineCommand(key: string, cmd: SlashCommandBuilder)
    {
        if(this.slashCommands.has(key))
            console.log(`${key} already exists!! Overwritting...`);

        this.slashCommands.set(key, cmd);
    }

    public fetchAllCommands()
    {
        return this.slashCommands.map(cmd => cmd.toJSON());
    }
}