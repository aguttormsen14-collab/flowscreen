// GitHub Pages configuration
// SECURITY: This file should be empty or load from config.local.js
// When deploying to production, ensure environment-specific config is loaded FIRST
// 
// For local development:
//   1. Copy config.js.example to config.local.js
//   2. Fill in your Supabase credentials
//   3. config.local.js is git-ignored
//
// For GitHub Pages:
//   1. Use repository secrets to inject credentials via a build step
//   2. OR load credentials from a secure endpoint at runtime

// Fallback config if config.local.js doesn't load
if (!window.CONFIG) {
  window.CONFIG = {
    SUPABASE_URL: "https://bhunptoiypamybwgpfoz.supabase.co",
    SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJodW5wdG9peXBhbXlid2dwZm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwODkzMzMsImV4cCI6MjA4NzY2NTMzM30.nQzSxxP9MH2x5tSeA-t-ZSaYZ_OK8ni8kjvnZjdQ7Sc",
    SUPABASE_BUCKET: "saxvik-hub",
    DEFAULT_INSTALL_SLUG: "amfi-steinkjer"
  };
}

if (!window.CONFIG || !window.CONFIG.SUPABASE_URL || window.CONFIG.SUPABASE_URL.includes('YOUR_PROJECT_ID')) {
  console.error(
    '[CONFIG] Supabase credentials not configured. ' +
    'Copy config.js.example to config.local.js and fill in your values. ' +
    'On production, ensure credentials are injected via environment or deployment secrets.'
  );
}
