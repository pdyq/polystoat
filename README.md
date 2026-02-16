# 🤖 PolyStoat - Discord Translation Bot

A dumb Stoat translation bot powered by DeepL API. PolyStoat provides seamless message translations.


## To host it:

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/polystoat.git
   cd polystoat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Edit the `.env` file** with your credentials:
   ```env
   BOT_TOKEN=your_discord_bot_token_here
   DEEPL_AUTHKEY=your_deepl_api_key_here
   # Security - Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ENCRYPTION_KEY=your_64_char_hex_encryption_key_here
   ```

5. **Start the bot**
   ```bash
   npm start
   ```
## 📖 Usage

### For Server Owners

1. **Invite the bot** to your server with the required permissions
2. **Set your DeepL API key** (one-time setup):
   ```
   ?api your_deepl_api_key_here
   ```
3. **Start translating!**

### For Users

Basic translation:
```
?tr auto EN Bonjour le monde
?tr EN ES Hello world
?tr AUTO DE How are you?
```

List available languages:
```
?languages
```

## 🤖 Commands

| Command | Description | Permission |
|---------|-------------|------------|
| `?tr <from> <to> <text>` | Translate text from one language to another | Everyone |
| `?languages` or `?langs` | List all supported languages | Everyone |
| `?api <key>` | Set DeepL API key for the server | Owners |
| `?help` | Show help message | Everyone |

---

**Made with ❤️ and the permission of God by pdyq**
