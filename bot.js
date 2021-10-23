require("dotenv").config()
const Discord = require("discord.js");
const codes = require( "./checkin_codes.js" )
const fs = require("fs");
const { createClient } = require('@typeform/api-client')

const IDList = require("./ids.json");
const names = require("./names.json");
const guild_id = "889222242695786546"
//const guild_id = "898304048363634719"
const commander_ids = [
  '227146178943385600'
]
const startCareerFair = "BEGIN CAREER FAIR"

const endCareerFair = "END CAREER FAIR"
hacker_role_name = "Hackers"

const bot = new Discord.Client({
    fetchAllMembers: true
});

const settings = {
    COMMAND_ROLE: "767965691454160966",
    OWNER_ID: "200042113814102016"
};
const ONE_HOUR = 60 * 60 * 1000;

//var main_registration1 = {}
var main_registration2 = {}

var main_registrations = []

async function getAPIResponses(){
  all_responses = {}
  var typeformAPI = createClient({ token: 'FSMBuwxfPazBiMupZuY6gHHtnCtM44qEEAVcdybveqE3' })
    var  main_registration1 = await typeformAPI.responses.list({
              uid:'Bcr4BHNV',
              pageSize:1000});
    all_responses["main_registration1"] = await typeformAPI.responses.list({
          uid:'Bcr4BHNV',
          pageSize:1000});
    var all_emails_schools = []
    for (const x of all_responses["main_registration1"]["items"]){
      if (typeof(x["answers"][20]) != "undefined"  && typeof(x["answers"][20]["text"]) != "undefined"){

        all_emails_schools.push([x["answers"][2]["email"], x["answers"][5]["text"], x["answers"][20]["text"]])
      }else{
        all_emails_schools.push([x["answers"][2]["email"], x["answers"][5]["text"], ""])

      }
    }

    all_responses["main_registration2"] = await typeformAPI.responses.list({
          uid:'Bcr4BHNV',
          pageSize:1000,
          before: main_registration1["items"][main_registration1["items"].length - 1]["token"]


      });
    for (const x of all_responses["main_registration2"]["items"]){

      if (typeof(x["answers"][20]) != "undefined"  && typeof(x["answers"][20]["text"]) != "undefined"){

        all_emails_schools.push([x["answers"][2]["email"], x["answers"][5]["text"], x["answers"][20]["text"]])
      }else{
        all_emails_schools.push([x["answers"][2]["email"], x["answers"][5]["text"], ""])

      }      }
    all_responses["involvement_fest"] = await typeformAPI.responses.list({
          uid:'mxuplTow',
          pageSize:1000,
        });
    for (const x of all_responses["involvement_fest"]["items"]){
          all_emails_schools.push([x["answers"][2]["email"], "University of Maryland-Baltimore County", ""])
      }
    all_responses["priority_registrations"] = await typeformAPI.responses.list({
              uid:'Lv81gHpJ',
              pageSize:1000,
        });
      for (const x of all_responses["priority_registrations"]["items"]){
          all_emails_schools.push([x["answers"][2]["email"], x["answers"][5]["text"], ""])
      }

    return all_emails_schools;


}
//main_registration2 = typeform.list('Bcr4BHNV',pageSize= 1000, before=main_registration1[-1]["token"])['items']
//involvement_fest = typeform.list('mxuplTow',pageSize= 1000)['items']
//priority_registrations = typeform.list('Lv81gHpJ',pageSize= 1000)['items']

const registeredList = new Discord.Collection();

bot.on("ready", async () => {
    console.log("Starting")
    responses = await getAPIResponses();
    readList();
    console.log("I'm ready");

    bot.user.setActivity("", { type: "COMPETING" });

    // console.log(registeredList.get("FCXWU"));
});

bot.on("message", async msg => {
    if(msg.author.bot) return;

    if(msg.channel.type == "dm")
    {


        if (msg.content.includes("@")){
          var registered = false;
          var updated_responses = await getAPIResponses();
          for (var x in updated_responses){
            //console.log(updated_responses[x])
            if (typeof(updated_responses[x][0]) != "undefined"  ){
              if (updated_responses[x][0].trim().toLowerCase() == msg.content.trim().toLowerCase()){
                registered = true;
                var email = updated_responses[x][0]
                fs.writeFile('users.txt', msg.author.id + ',' + email + '\n', { flag: 'a+' }, err => {})

              }
            }
          }
          if (registered){
            msg.channel.send("You have successfully checked-in to hackUMBC. Give it a few minutes and you should soon gain access to all the hacker channels!");
            var guild = bot.guilds.cache.get(guild_id)
            let role = guild.roles.cache.find(role => role.name === hacker_role_name);
            guild.members.cache.get(msg.author.id).roles.add(role).catch(console.error);

          }else{
            const embed = new Discord.MessageEmbed()
              .setColor('#0099ff')
              .setTitle('Please Register Here')
              .setURL('http://www.hackUMBC.org')
              .addField("Welcome to hackUMBC Fall 2021!", "\u200b")
              .addField("There is no hackUMBC registration associated with this email.", "\u200b")
              .setThumbnail("https://www.hackumbc.org/assets/img/halloween-dog-logo.png")
              .addField("Register here and resend your email afterwards to gain access to the rest of the hackUMBC server.", "\u200b")


              msg.channel.send({embed: embed});


          }
        }

        if (msg.content.trim().length == 8){
          for (x in codes.codes){
            if (msg.content.trim().toUpperCase() == codes.codes[x][0]){

              if (Math.abs(msg.createdAt-(new Date(codes.codes[x][1]))) < ONE_HOUR){
                msg.channel.send("You have successfully checked in for this event!")
                fs.writeFile('checkInLog.txt', msg.author.id + ',' + codes.codes[x][0] + '\n', { flag: 'a+' }, err => {})

              }
              else{
                msg.channel.send("The check-in code entered has either expired or is invalid");
              }

            }
          }
        }
        if (commander_ids.includes(msg.author.id)){
          if (msg.content.trim() == startCareerFair){
            var guild = bot.guilds.cache.get(guild_id)

            let hacker_role = guild.roles.cache.find(role => role.name === hacker_role_name);
            let career_fair_role = guild.roles.cache.find(role => role.name === "career_fair");

            let membersWithRole = hacker_role.members;
            membersWithRole.forEach(member =>{
              member.roles.add(career_fair_role)
              member.roles.remove(hacker_role)
            })
          }
          if (msg.content.trim() == endCareerFair){
            var guild = bot.guilds.cache.get(guild_id)

            let hacker_role = guild.roles.cache.find(role => role.name === hacker_role_name);
            let career_fair_role = guild.roles.cache.find(role => role.name === "career_fair");

            let membersWithRole = career_fair_role.members;
            membersWithRole.forEach(member =>{
              member.roles.add(hacker_role)
              member.roles.remove(career_fair_role)
            })
          }
        }


        console.log(`${msg.author.id}: ${msg.author.username} said "${msg.content}" at ${msg.createdAt}`);
        return;
    }
    const prefixRegex = new RegExp(`^(<@!?${bot.user.id}>)\\s*`);
	if (!prefixRegex.test(msg.content)) return;

	const [, matchedPrefix] = msg.content.match(prefixRegex);
	const args = msg.content.slice(matchedPrefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    if(msg.member.roles.cache.has(settings.COMMAND_ROLE))
    {
        if(command == "list")
        {
            // Give list of ids and number of people who have registered
            let output = ["\`\`\`\nID        NUMBER OF USERS\n"];
            registeredList.map((val, key) => {
                output.push(`${key}:    ${val.length}\n`);
            });
            output.push(`\`\`\``);

            msg.channel.send("Here's the list: ");
            msg.channel.send(output.join(""));
        }
        else if(command == "add")
        {
            // Add a new ID to the list of current IDs
            const newID = args[0];

            if(registeredList.has(newID))
                msg.channel.send("This ID already exists!");
            else
                registeredList.set(newID, []);

            msg.channel.send(`"${newID}" was created!`);
            saveList();
        }
        else if(command == "remove")
        {
            // Add a new ID to the list of current IDs
            const IDtoRemove = args[0];

            if(registeredList.has(IDtoRemove))
                if(registeredList.get(IDtoRemove).length > 0)
                    msg.channel.send(`Unable to remove! There are users who registered with this id`);
                else
                {
                    registeredList.delete(IDtoRemove);
                    msg.channel.send(`"${IDtoRemove}" was removed!`);
                }

            saveList();
        }
        else if(command == "who")
        {
            // Attempts to fetch a list of users who have registered with this ID
            const IDToFetch = args[0]
            if(!registeredList.has(IDToFetch))
            {
                msg.channel.send(`This ID does not exist?`);
                return;
            }

            const users = registeredList.get(IDToFetch);

            /* const resolvedUsers = []
            users.forEach(async val => {
                const member = await msg.guild.members.fetch(val);
                resolvedUsers.push(member);
                console.log("here");
            });
            console.log(resolvedUsers); */

            msg.channel.send(`**Showing all server members for ${IDToFetch}**`);
            msg.channel.send(users.join("\n"), { split: true });
        }
        else if(command == "forceread")
        {
            msg.channel.send("Reading file..");
            readList();
            msg.channel.send("Done!");
        }
        else if(command == "forcesave")
        {
            msg.channel.send("Saving file..");
            saveList();
            msg.channel.send("Done!");
        }
        else if(command == "countall")
        {
            let set = new Set();
            for(const arr of registeredList.values())
                for(const val of arr)
                    set.add(val);

            msg.channel.send(`So far, we have **${set.size}** different users who have checked in!`);
        }
        else if(command == "compile")
        {
            const guild = await bot.guilds.fetch("767955561873670154");
            const compiledList = new Set();

            for(const arr of registeredList.values())
                for(const val of arr)
                    guild.members.fetch(val.substring(3, val.length - 1)).then(gmember => compiledList.add(`${gmember.user.tag}`)).then(() => console.log(compiledList));

            console.log(compiledList);

            msg.react(`👍`);
        }
        else if(command == "test")
        {
            const guild = await bot.guilds.fetch("767955561873670154");
            const compiledList = new Set();

            for(const arr of registeredList.values())
                for(const val of arr)
                {
                    let gmember = await guild.members.fetch(val.substring(3, val.length - 1)).catch(err => console.error(err));
                    if(gmember)
                        compiledList.add(`${gmember.user.tag}`);
                }

            console.log(compiledList.size);
            const newList = Array.from(compiledList).filter(user => names.includes(user));

            console.log(newList);

            msg.react(`👍`);
        }
        else if(command == "sendforms")
        {
            const guild = await bot.guilds.fetch("767955561873670154");
            const compiledList = new Set();

            for(const arr of registeredList.values())
                for(const val of arr)
                {
                    let gmember = await guild.members.fetch(val.substring(3, val.length - 1)).catch(err => console.error(err));
                    if(gmember)
                        compiledList.add(`${gmember.user.tag}`);
                }

            console.log(compiledList.size);
            const newList = Array.from(compiledList).filter(user => names.includes(user));

            guild.members.cache.array().forEach(member => {
                if(newList.includes(member.user.tag))
                    member.user.send("Hi there, we are reaching out to you because you qualified to get hackUMBC Swag, please fill out this form by Tuesday 11:59pm EST: https://hackumbc.typeform.com/to/IIUtQNVg\nHappy Hacking! :3");
            });

            msg.react(`👍`);
        }
    }
});

bot.on("warn", console.warn);
bot.on("error", console.error);
bot.on("disconnect", console.log);

function saveList()
{
    const objectMap = {};
    registeredList.keyArray().forEach(key => objectMap[key] = []);
    registeredList.mapValues((v, key) => objectMap[key].push(...v));

    fs.writeFileSync("./data/registerListLog.json", JSON.stringify(objectMap));
}

function readList()
{
    const data = fs.readFileSync("./data/registerListLog.json");
    if(data.toString().length == 0) return;
    const objectMap = JSON.parse(data);

    for(const key in objectMap)
        registeredList.set(key, objectMap[key]);
}

bot.login(process.env.TOKEN);
