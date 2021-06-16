import { CreateOptions } from 'asar';
import * as electronPackager from 'electron-packager';

export interface ElectronPackagerOptions extends electronPackager.Options {
  portable: boolean;
  platform?: string;
  targetUrl: string;
  upgrade: boolean;
  upgradeFrom?: string;
}

export interface AppOptions {
  packager: ElectronPackagerOptions;
  nativefier: {
    accessibilityPrompt: boolean;
    alwaysOnTop: boolean;
    backgroundColor?: string;
    basicAuthPassword?: string;
    basicAuthUsername?: string;
    blockExternalUrls: boolean;
    bookmarksMenu?: string;
    bounce: boolean;
    browserwindowOptions?: BrowserWindowOptions;
    clearCache: boolean;
    counter: boolean;
    crashReporter?: string;
    disableContextMenu: boolean;
    disableDevTools: boolean;
    disableGpu: boolean;
    disableOldBuildWarning: boolean;
    diskCacheSize?: number;
    electronVersionUsed?: string;
    enableEs3Apis: boolean;
    fastQuit: boolean;
    fileDownloadOptions: unknown;
    flashPluginDir?: string;
    fullScreen: boolean;
    globalShortcuts?: GlobalShortcut[];
    hideWindowFrame: boolean;
    ignoreCertificate: boolean;
    ignoreGpuBlacklist: boolean;
    inject?: string[];
    insecure: boolean;
    internalUrls?: string;
    lang?: string;
    maximize: boolean;
    nativefierVersion?: string;
    processEnvs?: string;
    proxyRules?: string;
    showMenuBar: boolean;
    singleInstance: boolean;
    titleBarStyle?: string;
    tray: string | boolean;
    userAgent?: string;
    userAgentHonest: boolean;
    verbose: boolean;
    versionString?: string;
    width?: number;
    widevine: boolean;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    x?: number;
    y?: number;
    zoom: number;
  };
}

export type BrowserWindowOptions = Record<string, unknown>;

export type GlobalShortcut = {
  key: string;
};

export type NativefierOptions = Partial<
  AppOptions['packager'] & AppOptions['nativefier']
>;

export type OutputOptions = NativefierOptions & {
  buildDate: number;
  isUpgrade: boolean;
  oldBuildWarningText: string;
};

export type PackageJSON = {
  name: string;
};

export type RawOptions = {
  accessibilityPrompt?: boolean;
  alwaysOnTop?: boolean;
  appCopyright?: string;
  appVersion?: string;
  arch?: string | string[];
  asar?: boolean | CreateOptions;
  backgroundColor?: string;
  basicAuthPassword?: string;
  basicAuthUsername?: string;
  blockExternalUrls?: boolean;
  bookmarksMenu?: string;
  bounce?: boolean;
  browserwindowOptions?: BrowserWindowOptions;
  buildVersion?: string;
  clearCache?: boolean;
  conceal?: boolean;
  counter?: boolean;
  crashReporter?: string;
  darwinDarkModeSupport?: boolean;
  disableContextMenu?: boolean;
  disableDevTools?: boolean;
  disableGpu?: boolean;
  disableOldBuildWarning?: boolean;
  disableOldBuildWarningYesiknowitisinsecure?: boolean;
  diskCacheSize?: number;
  electronVersion?: string;
  electronVersionUsed?: string;
  enableEs3Apis?: boolean;
  fastQuit?: boolean;
  fileDownloadOptions?: unknown;
  flashPath?: string;
  flashPluginDir?: string;
  fullScreen?: boolean;
  globalShortcuts?: string | GlobalShortcut[];
  height?: number;
  hideWindowFrame?: boolean;
  icon?: string;
  ignoreCertificate?: boolean;
  ignoreGpuBlacklist?: boolean;
  inject?: string[];
  insecure?: boolean;
  internalUrls?: string;
  lang?: string;
  maxHeight?: number;
  maximize?: boolean;
  maxWidth?: number;
  minHeight?: number;
  minWidth?: number;
  name?: string;
  nativefierVersion?: string;
  out?: string;
  overwrite?: boolean;
  platform?: string;
  portable?: boolean;
  processEnvs?: string;
  proxyRules?: string;
  showMenuBar?: boolean;
  singleInstance?: boolean;
  targetUrl?: string;
  titleBarStyle?: string;
  tray?: string | boolean;
  upgrade?: string | boolean;
  upgradeFrom?: string;
  userAgent?: string;
  userAgentHonest?: boolean;
  verbose?: boolean;
  versionString?: string;
  widevine?: boolean;
  width?: number;
  win32metadata?: electronPackager.Win32MetadataOptions;
  x?: number;
  y?: number;
  zoom?: number;
};
