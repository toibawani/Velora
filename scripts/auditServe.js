/**
 * The build is made with homepage https://toibawani.github.io/Velora, so
 * index.html asks for /Velora/static/... . Every audit server below serves
 * from /, so without this every asset falls through to index.html and Chrome
 * parses HTML as JS with zero buttons rendered. That is the shared root
 * cause behind the layout and atlas timeouts. Both cases are stripped
 * because the path on Pages is case sensitive and old builds used lowercase.
 */
const stripBase = (url) => {
  let urlPath = decodeURIComponent(url.split('?')[0]);
  if (urlPath === '/Velora' || urlPath.startsWith('/Velora/')) {
    urlPath = urlPath.slice('/Velora'.length) || '/';
  } else if (urlPath === '/velora' || urlPath.startsWith('/velora/')) {
    urlPath = urlPath.slice('/velora'.length) || '/';
  }
  return urlPath;
};

module.exports = { stripBase };