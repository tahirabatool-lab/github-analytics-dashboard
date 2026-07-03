/* ==========================================================================
   config.js
   Concepts: IIFE, Closure, Lexical Scope, Private Base URL, API Endpoints
   ========================================================================== */

// We wrap everything in an IIFE (Immediately Invoked Function Expression).
// The function runs the moment the file loads — we don't call it later.
// Anything declared INSIDE it is only visible inside it (lexical scope),
// so BASE_URL can never be touched or overwritten from outside this file.
const Config = (function () {
  "use strict";

  // Private variable — lives only in this function's scope.
  // Nothing outside this IIFE can read or change it directly.
  const BASE_URL = "https://api.github.com";

  // These functions "close over" BASE_URL — that's a CLOSURE.
  // Even after the IIFE finishes running, the returned functions
  // still remember (have access to) BASE_URL forever.
  function getUserEndpoint(username) {
    return `${BASE_URL}/users/${username}`;
  }

  function getReposEndpoint(username) {
    // sort=updated → most recently updated repos first
    // per_page=100 → grab up to 100 repos in one request
    return `${BASE_URL}/users/${username}/repos?sort=updated&per_page=100`;
  }

  // We only return (expose) what the rest of the app actually needs.
  // BASE_URL itself is NOT returned — it stays private forever.
  return {
    getUserEndpoint,
    getReposEndpoint,
  };
})();

// ES6 Module export — makes Config importable from other files
// with: import Config from "./config.js";
export default Config;