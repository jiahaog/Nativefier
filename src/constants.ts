import * as path from 'path';

export const DEFAULT_APP_NAME = 'APP';

// Update both together
export const DEFAULT_ELECTRON_VERSION = '8.1.1';
export const DEFAULT_CHROME_VERSION = '80.0.3987.141';

export const ELECTRON_MAJOR_VERSION = parseInt(
  DEFAULT_ELECTRON_VERSION.split('.')[0],
  10,
);
export const PLACEHOLDER_APP_DIR = path.join(__dirname, './../', 'app');
