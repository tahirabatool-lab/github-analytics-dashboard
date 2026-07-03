# 🚀 GitHub Analytics Dashboard (DevStats)

A fully responsive GitHub profile analytics dashboard built with vanilla JavaScript.

It fetches real-time data from the GitHub REST API and visualizes user profiles, repositories, languages, and activity in a clean UI.

**No frameworks, no libraries — only HTML, CSS, and modern JavaScript (ES6+)**

---

## 🌐 Live Demo

👉 **Vercel Deployment**  
https://github-analytics-dashboard-xi.vercel.app?_vercel_share=4uqAA9sTduOuowzDhYlAx7pwYKFkFmHj

Try searching any GitHub username like:
- `torvalds`
- `gaearon`
- `octocat`

---

## ✨ Features

- 🔍 Live GitHub username search
- 👤 Profile details (avatar, name, bio, location, company, website)
- 📊 Statistics (followers, following, public repos, total stars)
- 🏷️ Top programming languages (calculated from repos)
- 📦 Top repositories (sorted by stars)
- 🕓 Recent activity (last pushed repositories)
- 🌗 Light / Dark theme toggle
- 📱 Fully responsive layout (mobile + desktop)
- 👤 Avatar dropdown menu:
  - View GitHub profile
  - Copy profile link
  - Logout (UI reset only)
- ⏳ Loading state during API calls
- ⚠️ Error handling (invalid username, empty input, rate limit)

---

## 🧠 JavaScript Concepts Used

- `let` / `const`
- Closures & IIFE
- ES6 Classes (constructor, getters, setters)
- Async / Await
- Fetch API
- DOM manipulation
- Event listeners
- Template literals
- Destructuring
- Spread & Rest operators
- Optional chaining (`?.`)
- Nullish coalescing (`??`)
- `try` / `catch` / `finally`
- ES6 Modules (import/export)

---

## 📁 Project Structure

```
github-analytics-dashboard/
├── index.html
├── style.css
├── README.md
├── assets/
│   ├── icons/
│   └── images/
└── js/
    ├── config.js          # API endpoints & constants
    ├── userModel.js       # User data model class
    ├── utils.js           # Helper functions
    ├── ui.js              # DOM manipulation & UI updates
    └── app.js             # Main application logic
```

---

## ⚙️ How It Works

1. User enters a GitHub username
2. App fetches data from GitHub REST API
3. Data is processed using JavaScript classes
4. UI updates dynamically using DOM manipulation
5. Profile, stats, repos, and activity are rendered in real-time

---

## 🚀 Getting Started

This project uses ES6 modules, so it must run on a local server.

### ▶️ Run Locally

**Option 1: VS Code Live Server**

- Install [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
- Right click `index.html`
- Click "Open with Live Server"

**Option 2: Python Server**

```bash
python -m http.server 5500
```

**Option 3: Node HTTP Server**

```bash
npx serve .
```

Then open `http://localhost:5500` in your browser.

---

## 🌐 API Reference

**GitHub REST API Endpoints:**

| Endpoint | Purpose |
|----------|---------|
| `https://api.github.com/users/{username}` | Get user profile data |
| `https://api.github.com/users/{username}/repos` | Get user repositories |

**Rate Limits:**
- Unauthenticated: 60 requests/hour
- Authenticated: 5,000 requests/hour (with personal access token)

---

## 🚧 Known Limitations

- Theme preference resets on page refresh
- No repository sorting/filtering UI yet
- Logout only resets UI state (no authentication system)
- Recent activity is based on repo push dates, not actual commit history
- Language calculation may not reflect all languages (limited to first 100 repos)

---

## 🛣️ Roadmap

- [ ] Add `localStorage` support (theme + last search)
- [ ] Add repository filters (stars, forks, language)
- [ ] Add charts for language visualization
- [ ] Improve mobile animations
- [ ] Deploy via GitHub Pages
- [ ] Add authentication for higher API limits

---

## 💻 Code Highlights

**User Model Class** (OOP approach):
```javascript
class GitHubUser {
  constructor(userData, repos) {
    this.data = userData;
    this.repos = repos;
  }
  
  get topLanguages() {
    // Calculate languages from repos
  }
  
  get topRepos() {
    // Sort repos by stars
  }
}
```

**Async Data Fetching**:
```javascript
async function searchUser(username) {
  try {
    const user = await fetch(`https://api.github.com/users/${username}`);
    // Process and display data
  } catch (error) {
    // Handle error
  }
}
```

---

## 👩‍💻 Author

Built by **Tahira Batool**

- GitHub: https://github.com/tahirabatool-lab
- LinkedIn: https://www.linkedin.com/in/tahirabatoolwebdeveloper

---

## ⭐ Acknowledgements

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)

---

## 📝 License

This project is open source and available for educational purposes.

---

**⭐ If you found this useful, please star the repository!**
