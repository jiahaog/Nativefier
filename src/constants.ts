import * as path from 'path';

export const DEFAULT_APP_NAME = 'APP';

// Upgrade both DEFAULT_ELECTRON_VERSION and DEFAULT_CHROME_VERSION together, and
//   - upgrade app / package.json / "devDependencies" / "electron"
//   - upgrade       package.json / "devDependencies" / "electron"
// Doing a *major* upgrade? Read https://github.com/nativefier/nativefier/blob/master/HACKING.md#deps-major-upgrading-electron
export const DEFAULT_ELECTRON_VERSION = '21.4.4';
// https://atom.io/download/atom-shell/index.json
// https://www.electronjs.org/releases/stable
export const DEFAULT_CHROME_VERSION = '106.0.5249.199';

// Update each of these periodically
// https://product-details.mozilla.org/1.0/firefox_versions.json
export const DEFAULT_FIREFOX_VERSION = '116.0';

// https://en.wikipedia.org/wiki/Safari_version_history
export const DEFAULT_SAFARI_VERSION = {
  majorVersion: 65,
  version: '16.5.2',
  webkitVersion: '605.1.15',
};

export const ELECTRON_MAJOR_VERSION = parseInt(
  DEFAULT_ELECTRON_VERSION.split('.')[0],
  10,
);
export const PLACEHOLDER_APP_DIR = path.join(__dirname, './../', 'app');
