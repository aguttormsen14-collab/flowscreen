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
// After initialization:
// - window.supabaseLib = CDN library (with createClient method)
// - window.supabase = client instance (for legacy app.js compatibility, has .storage/.auth)
// - window.supabaseClient = same as window.supabase (alias)
(function initSupabaseClientSingleton() {
  function attempt() {
    const cfg = window.getSupabaseConfig();
    if (!cfg) {
      console.error('[SUPABASE] Configuration missing, cannot initialize client');
      return false;
    }

    // nothing to do until the CDN library is available
    if (!window.supabaseLib && !window.supabase) {
      // supabase is the library when loaded by CDN
      if (typeof window.supabase === 'object' && typeof window.supabase.createClient === 'function') {
        // store library reference (CDN just loaded)
      } else {
        return false;
      }
    }

    // if client already exists, we're done
    if (window.supabaseClient) {
      return true;
    }

    // if the CDN library is loaded, create the client now
    const lib = window.supabaseLib || window.supabase;
    if (lib && typeof lib.createClient === 'function') {
      const client = lib.createClient(cfg.url, cfg.anonKey);
      
      // Store library reference (for grhs library access if needed)
      window.supabaseLib = lib;
      
      // Create client and expose via multiple names for compatibility
      window.supabaseClient = client;
      window.supabase = client;  // legacy compatibility for app.js
      
      console.log('[SUPABASE] Initialized client');
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
