import TrueBit from "@truebit/core/TrueBit";
import logger from "@truebit/utils/logger";
import { Interaction, MessageEmbed } from "discord.js";

module.exports = async (client: TrueBit, interaction: Interaction) => {
    if(!interaction.isCommand()) return;

    const { commandName } = interaction;
    logger.info(`${interaction.user.username} is running ${commandName}`);

    // This is bad, will need to change later
    if(commandName === "deployscript") {
        await client.runDeployScript(client.user!.id, interaction.guildId!);
        await interaction.reply({ ephemeral: false, embeds: [new MessageEmbed().setDescription("Deployed!")]});
    }
}