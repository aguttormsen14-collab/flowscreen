/**
 * supabase-config.js — Helper functions for Supabase configuration
 * 
 * This file provides helper functions to get Supabase config and check if it's ready.
 * It requires that config.js has already been loaded to set window.CONFIG with:
 *   - SUPABASE_URL
 *   - SUPABASE_ANON_KEY
 *   - SUPABASE_BUCKET (optional)
 *   - DEFAULT_INSTALL_SLUG (optional)
 */

/**
 * Check if Supabase is properly configured
 * @returns {boolean} true if all required credentials are present
 */
window.isSupabaseConfigured = function() {
  const cfg = window.SUPABASE_CONFIG || window.CONFIG;
  return !!(cfg && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);
};

/**
 * Get the current Supabase configuration object
 * @returns {Object|null} Config object with url, anonKey, bucket, installSlug, or null if not configured
 */
window.getSupabaseConfig = function() {
  const cfg = window.SUPABASE_CONFIG || window.CONFIG;
  
  if (!cfg || !cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
    console.error('[supabase-config] Missing Supabase credentials. url:', !!cfg?.SUPABASE_URL, 'key:', !!cfg?.SUPABASE_ANON_KEY);
    return null;
  }

  // Allow optional override via URL param: ?install=xxx
  const params = new URLSearchParams(location.search);
  const installOverride = params.get('install');

  return {
    url: cfg.SUPABASE_URL,
    anonKey: cfg.SUPABASE_ANON_KEY,
    bucket: cfg.SUPABASE_BUCKET || 'saxvik-hub',
    installSlug: installOverride || cfg.DEFAULT_INSTALL_SLUG || 'amfi-steinkjer'
  };
};

// Create a single Supabase client instance (singleton)
// window.supabase = CDN library (with createClient method)
// window.supabaseClient = actual client instance
(function initSupabaseClientSingleton() {
  function attempt() {
    if (!window.isSupabaseConfigured()) return false;

    // nothing to do until the CDN library is available
    if (!window.supabase) return false;

    // if client already exists, we're done
    if (window.supabaseClient) {
      console.log('[supabase-config] client already exists');
      return true;
    }

    // if the CDN library is loaded, create the client now
    if (typeof window.supabase.createClient === 'function') {
      const cfg = window.getSupabaseConfig();
      window.supabaseClient = window.supabase.createClient(cfg.url, cfg.anonKey);
      console.log('[supabase-config] client created');
      return true;
    }

    return false;
  }

  // try immediately; may return false if library not yet loaded
  if (!attempt()) {
    // poll until the library object appears or a client is created
    const interval = setInterval(() => {
      if (attempt()) clearInterval(interval);
    }, 50);
  }
})();

// Debug logging
if (typeof console !== 'undefined') {
  const isConfigured = window.isSupabaseConfigured();
  const logLevel = isConfigured ? 'log' : 'warn';
  console[logLevel](
    `[supabase-config] Supabase ${isConfigured ? '✓ configured' : '✗ NOT configured'}`
  );
  if (isConfigured) {
    const cfg = window.getSupabaseConfig();
    console.log('[supabase-config] Config:', {
      url: cfg.url,
      bucket: cfg.bucket,
      installSlug: cfg.installSlug,
      anonKey: '***' // don't log sensitive values
    });
  }
}
