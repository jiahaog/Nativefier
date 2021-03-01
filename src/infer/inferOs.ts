import * as log from 'loglevel';
import * as os from 'os';

// Ideally we'd get this list directly from electron-packager, but it's not
// accessible in the package without importing its private js files, which felt
// dirty. So if those change, we'll update these as well.
// https://electron.github.io/electron-packager/master/interfaces/electronpackager.options.html#platform
// https://electron.github.io/electron-packager/master/interfaces/electronpackager.options.html#arch
export const supportedArchs = ['all', 'ia32', 'x64', 'armv7l', 'arm64'];
export const supportedPlatforms = [
  'all',
  'darwin',
  'linux',
  'mac',
  'mas',
  'osx',
  'windows',
];

export function inferPlatform(): string {
  const platform = os.platform();
  if (
    platform === 'darwin' ||
    // @ts-ignore
    platform === 'mas' ||
    platform === 'win32' ||
    platform === 'linux'
  ) {
    log.debug('Inferred platform', platform);
    return platform;
  }

  throw new Error(`Untested platform ${platform} detected`);
}

export function inferArch(): string {
  const arch = os.arch();
  if (!supportedArchs.includes(arch)) {
    throw new Error(`Incompatible architecture ${arch} detected`);
  }
  log.debug('Inferred arch', arch);
  return arch;
}
