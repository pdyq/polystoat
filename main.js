import "dotenv/config";

import { Client } from "stoat.js";
import * as deepl from 'deepl-node';
import Database from 'better-sqlite3';
import crypto from 'crypto';

const botToken = process.env.BOT_TOKEN;

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedData) {
  const [ivHex, authTagHex, encryptedText] = encryptedData.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  );
  
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
const db = new Database("polystoat.db")
db.exec(`
  CREATE TABLE IF NOT EXISTS PolyStoat (
    serverid TEXT PRIMARY KEY,
    apikey TEXT
  )
`);
const getConfig = db.prepare('SELECT * FROM PolyStoat WHERE serverid = ?');
const setConfig = db.prepare(`
  INSERT OR REPLACE INTO PolyStoat (serverid, apikey)
  VALUES (?, ?)
`);

// const authKey = process.env.DEEPL_AUTHKEY;
// const deeplClient = new deepl.DeepLClient(authKey);

let client = new Client();
const prefix = "ps?";

function getServerConfig(serverID) {
  let config = getConfig.get(serverID);
  if (!config) {
    config = {
      serverid: serverID,
      apikey: null,
    };
    setConfig.run(config.serverid, config.apikey);
  }
  return config;
}

client.on("ready", async () =>
  console.info(`Logged in as ${client.user.username}!`),
);

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.server) {
    return message.channel.sendMessage("Please use me on a server!");
  }
  const config = getServerConfig(message.server.id);
  if (!message.content.startsWith(prefix)) return;
  const parts = message.content.slice(prefix.length).trim().split(' ');
  const [cmd, arg1, arg2, ...arg3Parts] = parts;
  const arg3 = arg3Parts.join(' ');
  if (cmd == "translate" || cmd == "tr") {
    if (!arg1) {
      await message.channel.sendMessage("Source Language is missing!");
      return;
    }
    if (!arg2) {
      await message.channel.sendMessage("Target Language is missing!");
      return;
    }
    if (!arg3) {
      await message.channel.sendMessage("The text is missing!");
      return;
    }
    if (!config.apikey) {
      return message.channel.sendMessage("DeepL API key not set. Use ps?api <API_KEY> to set an API key.")
    }
    const apiKey = decrypt(config.apikey) || null;
    const deeplClient = new deepl.DeepLClient(apiKey);
    let result;
    const sourceLanguage = (arg1 === "auto" ? null : arg1);
    const targetLanguage = arg2;
    const text = arg3;
    try {
      result = await deeplClient.translateText(text, sourceLanguage, targetLanguage);
      await message.channel.sendMessage(result.text);
    } catch (error) {
      console.error(error);
      await message.channel.sendMessage(`${error.message}`);
    }
  } else if (cmd == "languages" || cmd == "langs") {
    if (!config.apikey) {
      return message.channel.sendMessage("DeepL API key not set. Use ps?api <API_KEY> to set an API key.")
    }
    const apiKey = decrypt(config.apikey) || null;
    const deeplClient = new deepl.DeepLClient(apiKey);
    const sourceLanguages = await deeplClient.getSourceLanguages();
    let result1 = "Available Sources languages: \n";
    for (let i = 0; i < sourceLanguages.length; i++) {
      const lang = sourceLanguages[i];
      result1 += `> ${lang.name}: \`${lang.code}\`\n`
    }
    await message.channel.sendMessage(result1);
    let result2 = "Available Target languages: \n";
    const targetLanguages = await deeplClient.getTargetLanguages();
    for (let i = 0; i < targetLanguages.length; i++) {
      const lang = targetLanguages[i];
      result2 += `> ${lang.name}: \`${lang.code}\`\n`
    }
    await message.channel.sendMessage(result2);
  } else if (cmd == "api") {
    if (!message.server.ownerId == message.member.id.user) {
       return message.channel.sendMessage("Only the owner of the server can set API keys.");
    }
    if (!arg1) {
      return message.channel.sendMessage("DeepL API key not provided!");
    }
    const newApiKey = arg1
    setConfig.run(message.server.id, encrypt(newApiKey));
    return message.channel.sendMessage("DeepL API key set successfully.");
    // console.log("YET IMPLEMENTED");
  } else if (cmd == "help") {
      const helpMessage = `
  **🤖 PolyStoat Translation Bot - Help Menu**

  **📝 Basic Commands:**
  > \`ps? tr <from> <to> <text>\` - Translate text
  > • Example: \`ps?tr auto en-US Hello world\`
  > • Example: \`ps?tr en es How are you?\`
  • Use \`AUTO\` as source language for automatic detection
  • Language codes are case-sensitive: \`en\`, \`es\`, \`fr\`, \`de\`, etc.

  **🌐 Language Commands:**
  > \`ps?languages\` or \`ps?langs\` - List all available languages
  > • Shows source and target languages with their codes

  **🔧 Setup Commands:**
  > \`ps?api <your-deepl-api-key>\` - Set DeepL API key for this server (Owner only)
  > • Get a key at: https://www.deepl.com/pro-api

  **❓ Help:**
  > \`ps?help\` - Show this message

  ---
  **⚠️ First Time Setup:**
  1. Get a DeepL API key from deepl.com
  2. Admin runs: \`ps?api YOUR_API_KEY_HERE\`
  3. Start translating!

  **🔗 Useful Links:**
  • DeepL API Docs: https://www.deepl.com/docs-api
  • Support: DM pdyq#3352
  `;
    return message.channel.sendMessage(helpMessage);
  } else {
    return message.channel.sendMessage("Wrong command! Please try again.");
  }
});

client.loginBot(botToken);
