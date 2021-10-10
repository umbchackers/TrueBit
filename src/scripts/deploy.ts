import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;
const commands = JSON.parse(process.argv.pop()!);

const rest = new REST({ version: '9' }).setToken(token!);

rest.put(Routes.applicationGuildCommands(clientId!, guildId!), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);