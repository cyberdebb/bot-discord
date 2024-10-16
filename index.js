const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

const token = process.env.discordToken;
const llamaApi = 'http://localhost:11434/api/generate';
var stopTalkFlag = false; // Treating the interruption variable


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Ignores bot messages

    const promptText = message.content.toLowerCase();

    if (promptText.startsWith('!help')) help(message);
    if (promptText.startsWith('!rules')) rules(message);
    if (promptText.startsWith('!clear')) clear(message);
    if (promptText.startsWith('!ban')) ban(message);
    if (promptText.startsWith('!shrek')) easterEgg(message);
    if (promptText.startsWith('!talk')) talk(message, promptText);
    if (promptText.startsWith('!stop')) stopTalk(message, promptText);
});

function help(message) {
    let response = `
    **commands:** 

    **!rules**: displays the server rules.
    **!clear**: deletes all messages in the current text channel.
    **!ban**: bans a specified user from the server.
    **!talk**: initiates a conversation with Llama 3 AI bot.
    **!stop**: stops the AI bot from talking, ending the current conversation or interaction.
    `;

    message.channel.send(response);
}

function rules(message) {
    let response = `
    **rules:**

    **1) be respectful**
    treat all members with courtesy. bullying, hate speech, and harassment are not allowed.
    
    **2) no spamming**
    avoid repetitive messages, excessive use of emojis, or unnecessary tagging.
    
    **3) no advertising**
    self-promotion or sharing links without permission is not allowed.
    
    **4) listen to moderators**
    follow instructions from server moderators and admins.
    
    **5) have fun!!**
    `;
    message.channel.send(response);
}

async function clear(message) {
    const channel = message.channel;

    try {
        const newChannel = await channel.clone();
        await channel.delete(); // Deletes old channel
        newChannel.send('channel cleaned!');
    } catch (err) {
        console.error(err);
        message.channel.send('error on trying to clean the channel.');
    }
}

async function ban(message) {
    if (!message.member.permissions.has('BAN_MEMBERS')) {
        return message.reply('you do not have permission to ban.');
    }

    const userToBan = message.mentions.users.first();
    if (!userToBan) {
        return message.reply('please, mention the user you want to ban.');
    }

    const memberToBan = message.guild.members.cache.get(userToBan.id);
    if (!memberToBan) {
        return message.reply('user not found.');
    }

    try {
        // Bans the mentioned user
        await memberToBan.ban({ reason: 'you have been banned!' });
        message.channel.send(`${userToBan.tag} has been sucessfully banned.`);
    } catch (err) {
        console.error(err);
        message.channel.send('error on trying to ban user.');
    }
}

function easterEgg(message) {
    imageUrl = 'https://i0.wp.com/www.cofril.com.br/wp-content/uploads/2013/09/2015-09-23_Emb-14-Pernil-Especial-Churrasco_001-Editar1.jpg?fit=800%2C800&ssl=1';
    message.channel.send({ files: [imageUrl] });
}

async function stopTalk(message) {
    stopTalkFlag = true; // Activate flag
    message.channel.send('command talk canceled!');
    return false;
}

async function talk(message, promptText) {
    stopTalkFlag = false; // Reset flag
    message.channel.send('thinking...');
    const cleanPrompt = promptText.slice(6);
    
    try {
        const response = await fetch(llamaApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3",
                prompt: cleanPrompt
            })
        });

        const reader = response.body.getReader();
        let responseParts = '';
        let done = false;

        while (!done && !stopTalkFlag) {
            const { value, done: streamDone } = await reader.read();
            if (streamDone) break; // Stops the loop if there is no more data

            const chunk = new TextDecoder().decode(value);
            try {
                const jsonResponse = JSON.parse(chunk);

                if (jsonResponse.response) {
                    responseParts += jsonResponse.response;

                    // Verifies if the sentence is over
                    if (/[.!?]$/.test(responseParts.trim())) {
                        let endString = '';
                        if (!jsonResponse.done) endString = ' (...)';
                        message.channel.send(responseParts.trim() + endString); // Sends whole sentence
                        responseParts = '';
                    }
                }

                if (jsonResponse.done) {
                    done = true; // Processing is over
                    if (!stopTalkFlag) {
                        message.channel.send('(end of response)');
                    }
                }

            } 
            catch (jsonError) {
                console.error('error on trying to parse JSON response:', jsonError);
            }
        }

    } 
    catch (error) {
        console.error('error with Llama API:', error);
        message.channel.send('error on trying to connect with Llama API');
    }
}


client.login(token);
