import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';
import { promisify } from 'util';

import * as log from 'loglevel';

import { copyFileOrDir } from '../helpers/helpers';
import { AppOptions } from '../options/model';

const writeFileAsync = promisify(fs.writeFile);

/**
 * Only picks certain app args to pass to nativefier.json
 */
function pickElectronAppArgs(options: AppOptions): any {
  return {
    accessibilityPrompt: options.nativefier.accessibilityPrompt,
    alwaysOnTop: options.nativefier.alwaysOnTop,
    appCopyright: options.packager.appCopyright,
    appVersion: options.packager.appVersion,
    backgroundColor: options.nativefier.backgroundColor,
    basicAuthPassword: options.nativefier.basicAuthPassword,
    basicAuthUsername: options.nativefier.basicAuthUsername,
    bounce: options.nativefier.bounce,
    browserwindowOptions: options.nativefier.browserwindowOptions,
    buildVersion: options.packager.buildVersion,
    clearCache: options.nativefier.clearCache,
    counter: options.nativefier.counter,
    crashReporter: options.nativefier.crashReporter,
    darwinDarkModeSupport: options.packager.darwinDarkModeSupport,
    disableContextMenu: options.nativefier.disableContextMenu,
    disableDevTools: options.nativefier.disableDevTools,
    disableGpu: options.nativefier.disableGpu,
    diskCacheSize: options.nativefier.diskCacheSize,
    enableEs3Apis: options.nativefier.enableEs3Apis,
    fastQuit: options.nativefier.fastQuit,
    fileDownloadOptions: options.nativefier.fileDownloadOptions,
    flashPluginDir: options.nativefier.flashPluginDir,
    fullScreen: options.nativefier.fullScreen,
    globalShortcuts: options.nativefier.globalShortcuts,
    height: options.nativefier.height,
    hideWindowFrame: options.nativefier.hideWindowFrame,
    ignoreCertificate: options.nativefier.ignoreCertificate,
    ignoreGpuBlacklist: options.nativefier.ignoreGpuBlacklist,
    insecure: options.nativefier.insecure,
    internalUrls: options.nativefier.internalUrls,
    blockExternalUrls: options.nativefier.blockExternalUrls,
    maxHeight: options.nativefier.maxHeight,
    maximize: options.nativefier.maximize,
    maxWidth: options.nativefier.maxWidth,
    minHeight: options.nativefier.minHeight,
    minWidth: options.nativefier.minWidth,
    name: options.packager.name,
    nativefierVersion: options.nativefier.nativefierVersion,
    processEnvs: options.nativefier.processEnvs,
    proxyRules: options.nativefier.proxyRules,
    showMenuBar: options.nativefier.showMenuBar,
    singleInstance: options.nativefier.singleInstance,
    targetUrl: options.packager.targetUrl,
    titleBarStyle: options.nativefier.titleBarStyle,
    tray: options.nativefier.tray,
    userAgent: options.nativefier.userAgent,
    versionString: options.nativefier.versionString,
    width: options.nativefier.width,
    win32metadata: options.packager.win32metadata,
    disableOldBuildWarning: options.nativefier.disableOldBuildWarning,
    x: options.nativefier.x,
    y: options.nativefier.y,
    zoom: options.nativefier.zoom,
    buildDate: new Date().getTime(),
    // OLD_BUILD_WARNING_TEXT is an undocumented env. var to let *packagers*
    // tweak the message shown on warning about an old build, to something
    // more tailored to their audience (who might not even know Nativefier).
    // See https://github.com/kelyvin/Google-Messages-For-Desktop/issues/34#issuecomment-812731144
    // and https://github.com/nativefier/nativefier/issues/1131#issuecomment-812646988
    oldBuildWarningText: process.env.OLD_BUILD_WARNING_TEXT || '',
  };
}

async function maybeCopyScripts(srcs: string[], dest: string): Promise<void> {
  if (!srcs || srcs.length === 0) {
    log.debug('No files to inject, skipping copy.');
    return;
  }

  const supportedInjectionExtensions = ['.css', '.js'];

  log.debug(`Copying ${srcs.length} files to inject in app.`);
  for (const src of srcs) {
    if (!fs.existsSync(src)) {
      throw new Error(
        `File ${src} not found. Note that Nativefier expects *local* files, not URLs.`,
      );
    }

    if (supportedInjectionExtensions.indexOf(path.extname(src)) < 0) {
      console.log(`Skipping unsupported injection file: ${src}`);
      continue;
    }

    const postFixHash = generatePostFixHash(src);
    const destFileName = `inject-${postFixHash}.${path.extname(src)}`;
    const destPath = path.join(dest, 'inject', destFileName);
    log.debug(`Copying injection file "${src}" to "${destPath}"`);
    await copyFileOrDir(src, destPath);
  }
}

function normalizeAppName(appName: string, url: string): string {
  // use a simple random string to prevent collision
  const postFixHash = generatePostFixHash(url);
  const normalized = appName
    .toLowerCase()
    .replace(/[,:.]/g, '')
    .replace(/[\s_]/g, '-');
  return `${normalized}-nativefier-${postFixHash}`;
}

function generatePostFixHash(seed: string, length = 6): string {
  const hash = crypto.createHash('md5');
  // Add a random salt to help avoid collisions
  const salt = Math.random().toString();
  hash.update(seed + salt);
  return hash.digest('hex').substring(0, length);
}

function changeAppPackageJsonName(
  appPath: string,
  name: string,
  url: string,
): void {
  const packageJsonPath = path.join(appPath, '/package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());
  const normalizedAppName = normalizeAppName(name, url);
  packageJson.name = normalizedAppName;
  log.debug(`Updating ${packageJsonPath} 'name' field to ${normalizedAppName}`);

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson));
}

/**
 * Creates a temporary directory, copies the './app folder' inside,
 * and adds a text file with the app configuration.
 */
export async function prepareElectronApp(
  src: string,
  dest: string,
  options: AppOptions,
): Promise<void> {
  log.debug(`Copying electron app from ${src} to ${dest}`);
  try {
    await copyFileOrDir(src, dest);
  } catch (err) {
    throw `Error copying electron app from ${src} to temp dir ${dest}. Error: ${(err as Error).toString()}`;
  }

  const appJsonPath = path.join(dest, '/nativefier.json');
  log.debug(`Writing app config to ${appJsonPath}`);
  await writeFileAsync(
    appJsonPath,
    JSON.stringify(pickElectronAppArgs(options)),
  );

  if (options.nativefier.bookmarksMenu) {
    const bookmarksJsonPath = path.join(dest, '/bookmarks.json');
    try {
      await copyFileOrDir(options.nativefier.bookmarksMenu, bookmarksJsonPath);
    } catch (err) {
      log.error('Error copying bookmarks menu config file.', err);
    }
  }

  try {
    await maybeCopyScripts(options.nativefier.inject, dest);
  } catch (err) {
    log.error('Error copying injection files.', err);
  }
  changeAppPackageJsonName(
    dest,
    options.packager.name,
    options.packager.targetUrl,
  );
}
