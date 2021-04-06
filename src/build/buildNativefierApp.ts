import * as path from 'path';

import * as electronGet from '@electron/get';
import * as electronPackager from 'electron-packager';
import * as hasbin from 'hasbin';
import * as log from 'loglevel';

import { convertIconIfNecessary } from './buildIcon';
import {
  copyFileOrDir,
  getTempDir,
  isWindows,
  isWindowsAdmin,
} from '../helpers/helpers';
import { useOldAppOptions, findUpgradeApp } from '../helpers/upgrade/upgrade';
import { AppOptions } from '../options/model';
import { getOptions } from '../options/optionsMain';
import { prepareElectronApp } from './prepareElectronApp';

const OPTIONS_REQUIRING_WINDOWS_FOR_WINDOWS_BUILD = [
  'icon',
  'appCopyright',
  'appVersion',
  'buildVersion',
  'versionString',
  'win32metadata',
];

/**
 * Checks the app path array to determine if packaging completed successfully
 */
function getAppPath(appPath: string | string[]): string {
  if (!Array.isArray(appPath)) {
    return appPath;
  }

  if (appPath.length === 0) {
    return null; // directory already exists and `--overwrite` not set
  }

  if (appPath.length > 1) {
    log.warn(
      'Warning: This should not be happening, packaged app path contains more than one element:',
      appPath,
    );
  }

  return appPath[0];
}

/**
 * For Windows & Linux, we have to copy over the icon to the resources/app
 * folder, which the BrowserWindow is hard-coded to read the icon from
 */
async function copyIconsIfNecessary(
  options: AppOptions,
  appPath: string,
): Promise<void> {
  log.debug('Copying icons if necessary');
  if (!options.packager.icon) {
    log.debug('No icon specified in options; aborting');
    return;
  }

  if (
    options.packager.platform === 'darwin' ||
    options.packager.platform === 'mas'
  ) {
    log.debug('No copying necessary on macOS; aborting');
    return;
  }

  // windows & linux: put the icon file into the app
  const destFileName = `icon${path.extname(options.packager.icon)}`;
  const destIconPath = path.join(appPath, destFileName);

  log.debug(`Copying icon ${options.packager.icon} to`, destIconPath);
  await copyFileOrDir(options.packager.icon, destIconPath);
}

function trimUnprocessableOptions(options: AppOptions): void {
  if (
    options.packager.platform === 'win32' &&
    !isWindows() &&
    !hasbin.sync('wine')
  ) {
    const optionsPresent = Object.entries(options)
      .filter(
        ([key, value]) =>
          OPTIONS_REQUIRING_WINDOWS_FOR_WINDOWS_BUILD.includes(key) && !!value,
      )
      .map(([key]) => key);
    if (optionsPresent.length === 0) {
      return;
    }
    log.warn(
      `*Not* setting [${optionsPresent.join(', ')}], as couldn't find Wine.`,
      'Wine is required when packaging a Windows app under on non-Windows platforms.',
      'Also, note that Windows apps built under non-Windows platforms without Wine *will lack* certain',
      'features, like a correct icon and process name. Do yourself a favor and install Wine, please.',
    );
    for (const keyToUnset of optionsPresent) {
      options[keyToUnset] = null;
    }
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function buildNativefierApp(rawOptions): Promise<string> {
  log.info('Processing options...');
  log.debug(rawOptions);
  if (rawOptions.upgrade && rawOptions.upgrade !== undefined) {
    const oldApp = findUpgradeApp(rawOptions.upgrade.toString());
    if (oldApp === null) {
      throw new Error(
        `Could not find an old Nativfier app in "${<string>(
          rawOptions.upgrade
        )}"`,
      );
    }
    log.debug('Found old Nativefier app options', oldApp);
    rawOptions = useOldAppOptions(rawOptions, oldApp);
  }

  const options = await getOptions(rawOptions);

  if (options.packager.platform === 'darwin' && isWindows()) {
    // electron-packager has to extract the desired electron package for the target platform.
    // For a target platform of Mac, this zip file contains symlinks. And on Windows, extracting
    // files that are symlinks need Admin permissions. So we'll check if the user is an admin, and
    // fail early if not.
    // For reference
    // https://github.com/electron/electron-packager/issues/933
    // https://github.com/electron/electron-packager/issues/1194
    // https://github.com/electron/electron/issues/11094
    if (!isWindowsAdmin()) {
      throw new Error(
        'Building an app with a target platform of Mac on a Windows machine requires admin priveleges to perform. Please rerun this command in an admin command prompt.',
      );
    }
  }

  log.info('\nPreparing Electron app...');
  const tmpPath = getTempDir('app', 0o755);
  await prepareElectronApp(options.packager.dir, tmpPath, options);

  log.info('\nConverting icons...');
  options.packager.dir = tmpPath; // const optionsWithTmpPath = { ...options, dir: tmpPath };
  convertIconIfNecessary(options);
  await copyIconsIfNecessary(options, tmpPath);

  log.info(
    "\nPackaging... This will take a few seconds, maybe minutes if the requested Electron isn't cached yet...",
  );
  trimUnprocessableOptions(options);
  electronGet.initializeProxy(); // https://github.com/electron/get#proxies
  const appPathArray = await electronPackager(options.packager);

  log.info('\nFinalizing build...');
  const appPath = getAppPath(appPathArray);

  if (appPath) {
    let osRunHelp = '';
    if (options.packager.platform === 'win32') {
      osRunHelp = `the contained .exe file.`;
    } else if (options.packager.platform === 'linux') {
      osRunHelp = `the contained executable file (prefixing with ./ if necessary)\nMenu/desktop shortcuts are up to you, because Nativefier cannot know where you're going to move the app. Search for "linux .desktop file" for help, or see https://wiki.archlinux.org/index.php/Desktop_entries`;
    } else if (options.packager.platform === 'darwin') {
      osRunHelp = `the app bundle.`;
    }
    log.info(
      `App built to ${appPath}, move to wherever it makes sense for you and run ${osRunHelp}`,
    );
  }
  return appPath;
}
