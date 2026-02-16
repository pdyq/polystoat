# 🤖 PolyStoat - Stoat Translation Bot

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
   BOT_TOKEN=your_stoat_bot_token_here
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
   ps?api your_deepl_api_key_here
   ```
3. **Start translating!**

### For Users

Basic translation:
```
ps?tr auto en-US Bonjour le monde
ps?tr en es Hello world
ps?tr auto de How are you?
```

List available languages:
```
ps?languages
```

## 🤖 Commands

| Command | Description | Permission |
|---------|-------------|------------|
| `ps?tr <from> <to> <text>` | Translate text from one language to another | Everyone |
| `ps?languages` or `ps?langs` | List all supported languages | Everyone |
| `ps?api <key>` | Set DeepL API key for the server | Owners |
| `ps?help` | Show help message | Everyone |

---

**Made with ❤️ and the permission of God by pdyq**
