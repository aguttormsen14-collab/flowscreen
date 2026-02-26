/**
 * supabase-config.js — Helper functions for Supabase configuration
 * 
 * This file provides helper functions to get Supabase config and check if it's ready.
 * It requires that config.js has already been loaded to set:
 *   - window.SUPABASE_URL
 *   - window.SUPABASE_ANON_KEY
 *   - window.SUPABASE_BUCKET (optional)
 *   - window.DEFAULT_INSTALL_SLUG (optional)
 */

/**
 * Check if Supabase is properly configured
 * @returns {boolean} true if all required credentials are present
 */
window.isSupabaseConfigured = function() {
  return !!(window.SUPABASE_URL && window.SUPABASE_ANON_KEY);
};

/**
 * Get the current Supabase configuration object
 * @returns {Object|null} Config object with url, anonKey, bucket, installSlug, or null if not configured
 */
window.getSupabaseConfig = function() {
  if (!window.isSupabaseConfigured()) {
    console.warn('[supabase-config] Supabase not configured');
    return null;
  }
  
  return {
    url: window.SUPABASE_URL,
    anonKey: window.SUPABASE_ANON_KEY,
    bucket: window.SUPABASE_BUCKET || 'saxvik-hub',
    installSlug: window.DEFAULT_INSTALL_SLUG || 'amfi-steinkjer'
  };
};

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
