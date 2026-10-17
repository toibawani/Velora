/**
 * The build is made with homepage https://toibawani.github.io/velora, so
 * index.html asks for /velora/static/... . Every audit server below serves
 * from /, so without this every asset falls through to index.html and Chrome
 * parses HTML as JS with zero buttons rendered. That is the shared root
 * cause behind the layout and atlas timeouts.
 */
const stripBase = (url) => {
  let urlPath = decodeURIComponent(url.split('?')[0]);
  if (urlPath === '/velora' || urlPath.startsWith('/velora/')) {
    urlPath = urlPath.slice('/velora'.length) || '/';
  }
  return urlPath;
};

module.exports = { stripBase };