/* ==========================================================================
   userModel.js
   Concepts: ES6 Class, Constructor, Getters, Setters, Prototype Methods,
             Destructuring, Optional Chaining, Nullish Coalescing, Sorting
   ========================================================================== */

export class GitHubUser {
  // The constructor runs automatically when we do: new GitHubUser(data)
  constructor(data) {
    // Destructuring pulls fields out of the raw GitHub API object in one go.
    // ": name" renames a field while destructuring (avatar_url -> avatarUrl).
    // "?? {}" (nullish coalescing) means: if `data` is null/undefined,
    // fall back to an empty object so destructuring doesn't crash.
    const {
      login,
      name,
      bio,
      avatar_url: avatarUrl,
      followers,
      following,
      public_repos: publicRepos,
      html_url: profileUrl,
      location,
      blog,
    } = data ?? {};

    // Nullish coalescing (??) only falls back when the value is
    // null/undefined — NOT for falsy values like 0 or "".
    this._login = login ?? "unknown";
    this._name = name ?? login ?? "Unknown User";
    this._bio = bio ?? "This user hasn't added a bio yet.";
    this._avatarUrl = avatarUrl ?? "";
    this._followers = followers ?? 0;
    this._following = following ?? 0;
    this._publicRepos = publicRepos ?? 0;
    this._profileUrl = profileUrl ?? "#";
    this._location = location ?? "Not specified";
    this._blog = blog ?? "";

    // Repos aren't part of the /users/{username} response — they get
    // loaded separately and assigned later through the `repos` setter.
    this._repos = [];
  }

  /* ------------------------------------------------------------------
     GETTERS
     Let us read values like properties: user.name (no parentheses)
     instead of user.getName(). Cleaner, and hides the "_" internals.
     ------------------------------------------------------------------ */
  get name() {
    return this._name;
  }

  get username() {
    return this._login;
  }

  get bio() {
    return this._bio;
  }

  get avatarUrl() {
    return this._avatarUrl;
  }

  get followers() {
    return this._followers;
  }

  get following() {
    return this._following;
  }

  get publicRepos() {
    return this._publicRepos;
  }

  get profileUrl() {
    return this._profileUrl;
  }

  get location() {
    return this._location;
  }

  get blog() {
    return this._blog;
  }

  get repos() {
    return this._repos;
  }

  /* ------------------------------------------------------------------
     SETTER
     Lets us write: user.repos = someArray
     but we can validate/guard the value before it's actually stored.
     ------------------------------------------------------------------ */
  set repos(reposArray) {
    if (!Array.isArray(reposArray)) {
      throw new Error("repos must be an array of repository objects");
    }
    this._repos = reposArray;
  }

  /* ------------------------------------------------------------------
     PROTOTYPE METHODS
     Regular class methods live on GitHubUser.prototype — every
     instance shares the same function in memory instead of each
     instance carrying its own copy.
     ------------------------------------------------------------------ */

  // Returns the top N repos sorted by star count (highest first).
  // We spread into a new array [...this._repos] first so .sort()
  // doesn't mutate the original stored array.
  getTopReposByStars(limit = 5) {
    return [...this._repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, limit);
  }

  // Adds up stargazers_count across every repo using reduce().
  getTotalStars() {
    return this._repos.reduce(
      (sum, repo) => sum + (repo?.stargazers_count ?? 0),
      0
    );
  }

  // Counts how often each language appears across repos, then
  // returns the top N languages sorted by frequency.
  getTopLanguages(limit = 5) {
    const counts = {};

    this._repos.forEach((repo) => {
      // Optional chaining: if repo were ever null, this just
      // evaluates to undefined instead of throwing an error.
      const language = repo?.language;
      if (language) {
        counts[language] = (counts[language] ?? 0) + 1;
      }
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([language]) => language);
  }

  // Returns the N most recently pushed-to repos — used to build a
  // "recent activity" feed since GitHub doesn't give us commit-level
  // events from this endpoint, only repo-level push timestamps.
  getRecentlyPushedRepos(limit = 4) {
    return [...this._repos]
      .filter((repo) => repo?.pushed_at)
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
      .slice(0, limit);
  }
}