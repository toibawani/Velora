/*
 * Resolve the theme before the first paint.
 *
 * This used to be an inline <script> in index.html. The Content-Security-Policy
 * in that file does not allow inline scripts, because allowing them is the
 * single largest hole a CSP can leave open: an injected <script> would run.
 * create-react-app minifies inline scripts in a production build, which also
 * means a hard-coded hash would stop matching the moment a build ran. A file in
 * public/ is served unchanged, needs no hash and no nonce, and keeps the strict
 * policy.
 *
 * It is a classic script in <head>, so it blocks parsing until it has run: that
 * is the point, because it has to set data-theme before anything is painted.
 * ThemeContext applies the stored preference too, but it runs after React
 * mounts, which meant a dark-mode visitor saw the cream page flash first. Same
 * storage key and the same three modes as ThemeContext; a localStorage that
 * throws (private browsing) simply falls through to "auto".
 */
(function () {
  try {
    var stored = localStorage.getItem('velora_theme_preference');
    var mode = stored === 'dark' || stored === 'light' ? stored : 'auto';
    var systemDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    var apply = function () {
      var dark = mode === 'dark' || (mode === 'auto' && systemDark);
      var root = document.documentElement;
      root.setAttribute('data-theme', dark ? 'dark' : 'light');
      root.style.colorScheme = dark ? 'dark' : 'light';
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', dark ? '#171009' : '#F6EFE4');
    };
    apply();
    // While the choice is "auto", follow the OS even before React is up. Once
    // React mounts ThemeContext owns this, but re-applying the same attributes
    // is harmless.
    if (window.matchMedia) {
      var media = window.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function (event) {
        systemDark = event.matches;
        if (mode === 'auto') apply();
      };
      if (media.addEventListener) media.addEventListener('change', onChange);
      else if (media.addListener) media.addListener(onChange);
    }
  } catch (e) {
    /* No localStorage (private mode etc.). Light is the safe default. */
  }
})();
