# Discord Bot README

## Project Overview

This project is a simple Discord bot using JavaScript with a set of useful commands to manage a server and initiate conversations with an AI bot using Llama 3. The bot is built using discord.js to interact with Discord and dotenv for environment variable management.

## Features

**Commands**

1. !rules: Displays the server rules.
2. !clear: Deletes all messages in the current text channel.
3. !ban @user: Bans a specified user from the server.
4. !talk: Initiates a conversation with Llama 3 AI bot.
5. !stop: Stops the AI bot from talking, ending the current conversation.

  
## Setup Instructions

- **Install Required Packages**

Ensure you have node.js installed. Then, install the necessary packages:

```
npm install discord.js dotenv
```

- **Copy your bot token and store it in a .env file in your project directory as follows:**

```
discordToken=YOUR_TOKEN_HERE
```
You can find your bot token at [Discord Developer Portal](https://discord.com/developers/applications)

- **Set Up Llama 3 AI for !talk command:**

To enable the !talk command using the Llama 3 AI bot, follow these steps:

1. Download and install Ollama from the official site:

- [Ollama Download](https://ollama.com/download)
- [Llama 3 Model](https://ollama.com/library/llama3)

2. Start the Llama 3 AI model on your machine by running the following command in your terminal:

```
ollama run llama3
```

Make sure the terminal remains open and running while using the bot to handle AI conversations.

## Running the bot
  
```
node index.js
```

Ensure that Ollama is running in the terminal, as described above, to enable the !talk command.

Have fun!!

