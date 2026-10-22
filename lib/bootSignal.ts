// Shared between LoadingScreen.tsx and Hero.tsx. LoadingScreen owns the
// sessionStorage bookkeeping for "the boot sequence has already played
// this session" and dispatches a window event the moment its Matrix-unlock
// grid wipe begins; Hero listens for that event to start its own
// left-to-right content fade-in in the same instant, so the two read as
// one continuous "system activating" sequence instead of two unrelated
// animations. Pulled into their own module rather than duplicated string
// literals in both files, which would silently drift if either changed.
export const BOOT_SESSION_KEY = "boot-shown";
export const BOOT_UNLOCK_EVENT = "portfolio:boot-unlock-start";
