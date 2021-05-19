import * as electronPackager from 'electron-packager';

export interface ElectronPackagerOptions extends electronPackager.Options {
  portable: boolean;
  platform: string;
  targetUrl: string;
  upgrade: boolean;
  upgradeFrom?: string;
}

export interface AppOptions {
  packager: ElectronPackagerOptions;
  nativefier: {
    accessibilityPrompt: boolean;
    alwaysOnTop: boolean;
    backgroundColor: string;
    basicAuthPassword: string;
    basicAuthUsername: string;
    blockExternalUrls: boolean;
    bookmarksMenu: string;
    bounce: boolean;
    browserwindowOptions: any;
    clearCache: boolean;
    counter: boolean;
    crashReporter: string;
    disableContextMenu: boolean;
    disableDevTools: boolean;
    disableGpu: boolean;
    disableOldBuildWarning: boolean;
    diskCacheSize: number;
    electronVersionUsed?: string;
    enableEs3Apis: boolean;
    fastQuit: boolean;
    fileDownloadOptions: any;
    flashPluginDir: string;
    fullScreen: boolean;
    globalShortcuts: any;
    hideWindowFrame: boolean;
    ignoreCertificate: boolean;
    ignoreGpuBlacklist: boolean;
    inject: string[];
    insecure: boolean;
    internalUrls: string;
    lang?: string;
    maximize: boolean;
    nativefierVersion: string;
    processEnvs: string;
    proxyRules: string;
    showMenuBar: boolean;
    singleInstance: boolean;
    titleBarStyle: string;
    tray: string | boolean;
    userAgent: string;
    userAgentHonest: boolean;
    verbose: boolean;
    versionString: string;
    width: number;
    widevine: boolean;
    height: number;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    x: number;
    y: number;
    zoom: number;
  };
}

export type NativefierOptions = Partial<
  AppOptions['packager'] & AppOptions['nativefier']
>;
