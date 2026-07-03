/* ==========================================================================
   utils.js
   Concepts: Helper Functions, Number Formatting, Date Formatting,
             Error Handling Helpers, Arrow Functions, Template Literals
   ========================================================================== */

// Turns 32500 -> "32.5K", 1400000 -> "1.4M"
// Kept as a plain function (not arrow) since it's exported standalone,
// but the logic style is the same either way.
export function formatNumber(num) {
  const value = Number(num) || 0;

  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + "M";
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(1) + "K";
  }
  return String(value);
}

// Small helper: only adds "s" when the count isn't exactly 1.
// e.g. pluralize(1, "year") -> "1 year", pluralize(3, "year") -> "3 years"
function pluralize(count, unit) {
  return `${count} ${unit}${count === 1 ? "" : "s"}`;
}

// Turns an ISO date string ("2026-06-20T10:00:00Z") into
// a friendly relative string: "2 days ago", "3 weeks ago", etc.
export function formatDate(dateString) {
  if (!dateString) return "Unknown";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${pluralize(diffDays, "day")} ago`;
  if (diffDays < 30) return `${pluralize(Math.floor(diffDays / 7), "week")} ago`;
  if (diffDays < 365) return `${pluralize(Math.floor(diffDays / 30), "month")} ago`;
  return `${pluralize(Math.floor(diffDays / 365), "year")} ago`;
}

// Converts a raw fetch/HTTP error into a friendly message
// we can safely show the user in the UI.
export const createErrorMessage = (error) => {
  const message = error?.message ?? "";

  if (message.includes("404")) {
    return "That GitHub username doesn't exist. Double-check the spelling.";
  }
  if (message.includes("403")) {
    return "GitHub API rate limit reached. Please try again in a bit.";
  }
  if (message.includes("Failed to fetch")) {
    return "Network error — check your internet connection.";
  }
  return "Something went wrong while fetching that profile.";
};

// Small guard used before running a search — true if the value
// is empty/whitespace-only.
export const isEmpty = (value) => {
  return value === null || value === undefined || value.trim() === "";
};