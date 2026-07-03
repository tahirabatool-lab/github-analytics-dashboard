/* ==========================================================================
   app.js
   Concepts: DOM Selection, Event Listeners, Fetch API, Async/Await,
             Promise Handling, Error Handling, Render Data, Modules,
             Destructuring, Spread Operator, Template Literals
   ========================================================================== */

import Config from "./config.js";
import { GitHubUser } from "./userModel.js";
import { formatNumber, formatDate, createErrorMessage, isEmpty } from "./utils.js";

/* --------------------------------------------------------------------
   DOM SELECTION
   Grab every element we'll need to read from or write to, once,
   at the top — so we're not calling querySelector over and over.
   -------------------------------------------------------------------- */
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("github-search");
const searchButton = document.getElementById("search-button");
const searchStatus = document.getElementById("search-status");

const profileAvatar = document.getElementById("profile-avatar");
const profileName = document.getElementById("profile-name");
const profileUsername = document.getElementById("profile-username");
const profileBio = document.getElementById("profile-bio");
const profileLocation = document.getElementById("profile-location");
const profileBlog = document.getElementById("profile-blog");
const profileGithubLink = document.getElementById("profile-github-link");
const headerAvatar = document.getElementById("header-avatar");
const userMenu = document.getElementById("user-menu");
const userMenuDropdown = document.getElementById("user-menu-dropdown");
const menuViewProfile = document.getElementById("menu-view-profile");
const menuCopyLink = document.getElementById("menu-copy-link");
const menuLogout = document.getElementById("menu-logout");

const followCountFollowers = document.getElementById("follow-count-followers");
const followCountFollowing = document.getElementById("follow-count-following");
const followCountRepos = document.getElementById("follow-count-repos");

const statPublicRepos = document.getElementById("stat-public-repos");
const statFollowers = document.getElementById("stat-followers");
const statFollowing = document.getElementById("stat-following");
const statTotalStars = document.getElementById("stat-total-stars");

const badgeList = document.getElementById("badge-list");
const repoList = document.getElementById("repo-list");
const activityList = document.getElementById("activity-list");

/* --------------------------------------------------------------------
   FETCH + ASYNC/AWAIT
   One async function that fetches both the user profile and their
   repos, then combines them into a single GitHubUser instance.
   -------------------------------------------------------------------- */
async function fetchGitHubUser(username) {
  // "await" pauses this function until the Promise from fetch()
  // resolves — without blocking the rest of the page.
  const userResponse = await fetch(Config.getUserEndpoint(username));

  if (!userResponse.ok) {
    // Thrown errors here get caught by the try/catch in handleSearch()
    throw new Error(`${userResponse.status} - could not find that user`);
  }

  const userData = await userResponse.json();

  // Build the model first so we can return something useful even if
  // the repos request happens to fail for some reason.
  const user = new GitHubUser(userData);

  const reposResponse = await fetch(Config.getReposEndpoint(username));

  if (reposResponse.ok) {
    const reposData = await reposResponse.json();
    user.repos = reposData; // uses the setter from userModel.js
  }

  return user;
}

/* --------------------------------------------------------------------
   RENDER DATA
   Small, focused functions — each one updates one part of the page.
   -------------------------------------------------------------------- */
/* --------------------------------------------------------------------
   MODULE-LEVEL STATE
   Keeps track of the currently loaded profile so the dropdown menu
   actions (view / copy link) always point at the right user.
   -------------------------------------------------------------------- */
let currentProfileUrl = null;

function renderProfile(user) {
  profileAvatar.src = user.avatarUrl;
  profileAvatar.alt = `Portrait of ${user.name}`;
  headerAvatar.src = user.avatarUrl;
  headerAvatar.alt = `Portrait of ${user.name}`;
  profileName.textContent = user.name;
  profileUsername.textContent = `@${user.username}`;
  profileBio.textContent = user.bio;

  profileLocation.textContent = user.location;

  // Template literal to build the link markup in one line
  profileBlog.innerHTML = user.blog
    ? `<a href="${user.blog}" target="_blank" rel="noopener">${user.blog}</a>`
    : "No website listed";

  profileGithubLink.onclick = () => window.open(user.profileUrl, "_blank");
  currentProfileUrl = user.profileUrl;

  followCountFollowers.textContent = formatNumber(user.followers);
  followCountFollowing.textContent = formatNumber(user.following);
  followCountRepos.textContent = formatNumber(user.publicRepos);
}

function renderStats(user) {
  statPublicRepos.textContent = formatNumber(user.publicRepos);
  statFollowers.textContent = formatNumber(user.followers);
  statFollowing.textContent = formatNumber(user.following);
  statTotalStars.textContent = formatNumber(user.getTotalStars());
}

function renderLanguages(user) {
  const languages = user.getTopLanguages(5);

  if (languages.length === 0) {
    badgeList.innerHTML = `<li><span class="badge">No languages found</span></li>`;
    return;
  }

  // map() + join("") builds the full HTML string in one pass —
  // way cleaner than looping with createElement for a simple list.
  badgeList.innerHTML = languages
    .map((language) => `<li><span class="badge">${language}</span></li>`)
    .join("");
}

function renderRepos(user) {
  const topRepos = user.getTopReposByStars(5);

  if (topRepos.length === 0) {
    repoList.innerHTML = `<p class="repo-description">This user has no public repositories.</p>`;
    return;
  }

  repoList.innerHTML = topRepos
    .map((repo) => {
      // Destructuring straight out of the repo object, with defaults
      // via nullish coalescing for anything that might be missing.
      const {
        name,
        description,
        html_url: url,
        language,
        stargazers_count: stars = 0,
        forks_count: forks = 0,
        updated_at: updatedAt,
      } = repo;

      return `
        <div class="repo-card">
          <div class="repo-card-head">
            <h3 class="repo-name">${name}</h3>
            <button type="button" class="btn btn-outline" onclick="window.open('${url}', '_blank')">
              View Repository
            </button>
          </div>
          <p class="repo-description">${description ?? "No description provided."}</p>
          <div class="repo-meta">
            <span>${language ?? "Unknown"}</span>
            <span>★ ${formatNumber(stars)}</span>
            <span>⑂ ${formatNumber(forks)}</span>
            <span>Updated ${formatDate(updatedAt)}</span>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderActivity(user) {
  const recentRepos = user.getRecentlyPushedRepos(4);

  if (recentRepos.length === 0) {
    activityList.innerHTML = `<li>No recent activity found.</li>`;
    return;
  }

  activityList.innerHTML = recentRepos
    .map((repo) => {
      const { name, pushed_at: pushedAt } = repo;
      return `<li>Last push to <strong>${name}</strong> — ${formatDate(pushedAt)}</li>`;
    })
    .join("");
}

function renderUser(user) {
  renderProfile(user);
  renderStats(user);
  renderLanguages(user);
  renderRepos(user);
  renderActivity(user);
}

/* --------------------------------------------------------------------
   UI STATE HELPERS
   -------------------------------------------------------------------- */
function setLoadingState(isLoading) {
  searchButton.disabled = isLoading;
  searchButton.textContent = isLoading ? "Loading..." : "Analyze Profile";
  if (isLoading) {
    searchStatus.textContent = "";
  }
}

function showError(message) {
  searchStatus.style.color = "#d64545";
  searchStatus.textContent = message;
}

function clearError() {
  searchStatus.textContent = "";
}

/* --------------------------------------------------------------------
   EVENT LISTENER
   The form submit handler is where everything comes together:
   validation -> loading state -> fetch -> render -> error handling.
   -------------------------------------------------------------------- */
async function handleSearch(event) {
  event.preventDefault();

  const username = searchInput.value.trim();

  if (isEmpty(username)) {
    showError("Please enter a GitHub username first.");
    return;
  }

  try {
    setLoadingState(true);
    clearError();

    const user = await fetchGitHubUser(username);
    renderUser(user);
  } catch (error) {
    // Anything thrown above (bad response, network failure, etc.)
    // lands here instead of crashing the page.
    console.error("Search failed:", error);
    showError(createErrorMessage(error));
  } finally {
    // Runs whether the try succeeded or failed — always reset the button.
    setLoadingState(false);
  }
}

searchForm.addEventListener("submit", handleSearch);

/* --------------------------------------------------------------------
   USER MENU DROPDOWN
   Click the avatar to open/close a small menu with profile actions.
   -------------------------------------------------------------------- */
headerAvatar.addEventListener("click", (event) => {
  event.stopPropagation(); // don't let this click immediately close itself below
  userMenuDropdown.classList.toggle("open");
});

// Clicking anywhere outside the menu closes it
document.addEventListener("click", (event) => {
  if (!userMenu.contains(event.target)) {
    userMenuDropdown.classList.remove("open");
  }
});

menuViewProfile.addEventListener("click", (event) => {
  event.preventDefault();
  userMenuDropdown.classList.remove("open");

  if (!currentProfileUrl) {
    showError("Search a GitHub username first.");
    return;
  }
  window.open(currentProfileUrl, "_blank");
});

menuCopyLink.addEventListener("click", async (event) => {
  event.preventDefault();
  userMenuDropdown.classList.remove("open");

  if (!currentProfileUrl) {
    showError("Search a GitHub username first.");
    return;
  }

  try {
    await navigator.clipboard.writeText(currentProfileUrl);
    searchStatus.style.color = "#2f9e44";
    searchStatus.textContent = "Profile link copied to clipboard.";
  } catch (error) {
    showError("Could not copy the link. Please copy it manually.");
  }
});

menuLogout.addEventListener("click", (event) => {
  event.preventDefault();
  userMenuDropdown.classList.remove("open");
  // No real authentication in this project — "logout" just resets
  // the dashboard back to its default, pre-search state.
  location.reload();
});