# API

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Packaging Squirrel-based installers](#packaging-squirrel-based-installers)
- [Command Line](#command-line)
  - [Target Url](#target-url)
  - [[dest]](#dest)
  - [Help](#help)
  - [Version](#version)
  - [[upgrade]](#upgrade)
  - [[name]](#name)
  - [[platform]](#platform)
  - [[arch]](#arch)
  - [[app-copyright]](#app-copyright)
  - [[app-version]](#app-version)
  - [[build-version]](#build-version)
  - [[electron-version]](#electron-version)
  - [[widevine]](#widevine)
  - [[no-overwrite]](#no-overwrite)
  - [[conceal]](#conceal)
  - [[icon]](#icon)
    - [Packaging for Windows](#packaging-for-windows)
    - [Packaging for Linux](#packaging-for-linux)
    - [Packaging for macOS](#packaging-for-macos)
      - [Manually Converting `.icns`](#manually-converting-icns)
  - [[counter]](#counter)
  - [[bounce]](#bounce)
  - [[width]](#width)
  - [[height]](#height)
  - [[min-width]](#min-width)
  - [[min-height]](#min-height)
  - [[max-width]](#max-width)
  - [[max-height]](#max-height)
  - [[x]](#x)
  - [[y]](#y)
  - [[show-menu-bar]](#show-menu-bar)
  - [[fast-quit]](#fast-quit)
  - [[user-agent]](#user-agent)
  - [[honest]](#honest)
  - [[ignore-certificate]](#ignore-certificate)
  - [[disable-gpu]](#disable-gpu)
  - [[ignore-gpu-blacklist]](#ignore-gpu-blacklist)
  - [[enable-es3-apis]](#enable-es3-apis)
  - [[insecure]](#insecure)
  - [[internal-urls]](#internal-urls)
  - [[block-external-urls]](#block-external-urls)
  - [[proxy-rules]](#proxy-rules)
  - [[disk-cache-size]](#disk-cache-size)
  - [[inject]](#inject)
  - [[full-screen]](#full-screen)
  - [[maximize]](#maximize)
  - [[hide-window-frame]](#hide-window-frame)
  - [[title-bar-style]](#title-bar-style)
  - [[verbose]](#verbose)
  - [[disable-context-menu]](#disable-context-menu)
  - [[disable-dev-tools]](#disable-dev-tools)
  - [[crash-reporter]](#crash-reporter)
  - [[zoom]](#zoom)
  - [[single-instance]](#single-instance)
  - [[clear-cache]](#clear-cache)
  - [[tray]](#tray)
  - [[basic-auth-username]](#basic-auth-username)
  - [[processEnvs]](#processenvs)
  - [[file-download-options]](#file-download-options)
  - [[always-on-top]](#always-on-top)
  - [[global-shortcuts]](#global-shortcuts)
  - [[browserwindow-options]](#browserwindow-options)
  - [[darwin-dark-mode-support]](#darwin-dark-mode-support)
  - [[background-color]](#background-color)
  - [[bookmarks-menu]](#bookmarks-menu)
  - [Deprecated](#deprecated)
    - [[flash] and [flash-path]](#flash) (DEPRECATED)
- [Programmatic API](#programmatic-api)
  - [Addition packaging options for Windows](#addition-packaging-options-for-windows)
    - [[version-string]](#version-string)
    - [[win32metadata]](#win32metadata)
      - [Programmatic API](#programmatic-api-1)
    - [[disable-old-build-warning-yesiknowitisinsecure]](#disable-old-build-warning-yesiknowitisinsecure)
- [Accessing The Electron Session](#accessing-the-electron-session)
  - [Important Note On funcArgs](#important-note-on-funcargs)
  - [session-interaction-reply](#session-interaction-reply)
  - [Errors](#errors)
  - [Complex Return Values](#complex-return-values)
  - [Example](#example)

## Packaging Squirrel-based installers

See [PR #744 - Support packaging nativefier applications into Squirrel-based installers](https://github.com/nativefier/nativefier/pull/744)

## Command Line

```bash
nativefier [options] [targetUrl] [dest]
```

You must provide:
- Either a `targetUrl` to generate a new app from it.
- Or option `--upgrade <pathOfAppToUpgrade>` to upgrade an existing app.

Command line options are listed below.

#### Target Url

The url to point the application at.

#### [dest]

Specifies the destination directory to build the app to, defaults to the current working directory.

#### Help

```
-h, --help
```

Prints the usage information.

#### Version

```
-v, --version
```

Prints the version of your `nativefier` install.

#### [upgrade]

```
--upgrade <pathToExistingApp>
```

This option will attempt to extract all existing options from the old app, and upgrade it using the current Nativefier CLI.

The provided path must be the "executable" of an application packaged with a previous version of Nativefier, and to be upgraded to the latest version of Nativefier. "Executable" means: the `.exe` file on Windows, the executable on Linux, or the `.app` on macOS. The executable must be living in the original context where it was generated (i.e., on Windows and Linux, the exe file must still be in the folder containing the generated `resources` directory).

#### [name]

```
-n, --name <value>
```

The name of the application, which will affect strings in titles and the icon.

**For Linux Users:** Do not put spaces if you define the app name yourself with `--name`, as this will cause problems (tested on Ubuntu 14.04) when pinning a packaged app to the launcher.

#### [platform]

```
-p, --platform <value>
```

- Default: current operating system.
    - To test your default platform you can run
      ```
      node -p "process.platform"
      ```
      (See https://nodejs.org/api/os.html#os_os_platform)
- Can be overwritten by specifying either `linux`, `windows`, `osx` or `mas` for a Mac App Store specific build.

The alternative values `win32` (for Windows) or `darwin`, `mac` (for macOS) can also be used.

#### [arch]

```
-a, --arch <value>
```

The processor architecture to target when building.

- Default: the architecture of the installed version of node (usually the architecture of the build-time machine).
    - To test your default architecture you can run
      ```
      node -p "process.arch"
      ```
      (See https://nodejs.org/api/os.html#os_os_arch)
    - Please note: On M1 Macs, unless an arm64 version of brew is used to install nodejs, the version installed will be an `x64` version run through Rosetta, and will result in an `x64` app being generated. If this is not desired, either specify `-a arm64` to build for M1, or re-install node with an arm64 version of brew. See https://github.com/nativefier/nativefier/issues/1089
- Can be overridden by specifying one of: `ia32`, `x64`, `armv7l`, `arm64`.

#### [app-copyright]

```
--app-copyright <value>
```

The human-readable copyright line for the app. Maps to the `LegalCopyright` metadata property on Windows, and `NSHumanReadableCopyright` on OS X.

#### [app-version]

```
--app-version <value>
```

The release version of the application. By default the `version` property in the `package.json` is used but it can be overridden with this argument. If neither are provided, the version of Electron will be used. Maps to the `ProductVersion` metadata property on Windows, and `CFBundleShortVersionString` on OS X.

#### [build-version]

```
--build-version <value>
```

The build version of the application. Maps to the `FileVersion` metadata property on Windows, and `CFBundleVersion` on OS X.

#### [electron-version]

```
-e, --electron-version <value>
```

Electron version without the `v`, see https://github.com/atom/electron/releases.

#### [widevine]

```
--widevine
```

Use a Widevine-enabled version of Electron for DRM playback, see https://github.com/castlabs/electron-releases.

#### [no-overwrite]

```
--no-overwrite
```

Specifies if the destination directory should be not overwritten, defaults to false.

#### [conceal]

```
-c, --conceal
```

Specifies if the source code within the nativefied app should be packaged into an archive, defaults to false, [read more](http://electron.atom.io/docs/v0.36.0/tutorial/application-packaging/).

#### [icon]

```
-i, --icon <path>
```

##### Packaging for Windows

The icon parameter should be a path to a `.ico` file.

##### Packaging for Linux

The icon parameter should be a path to a `.png` file.

##### Packaging for macOS

The icon parameter can either be a `.icns` or a `.png` file if the [optional dependencies](../README.md#optional-dependencies) are installed.

If your `PATH` has our image-conversion dependencies (`iconutil`, and either ImageMagick `convert` + `identify`, or GraphicsMagick `gm`), Nativefier will automatically convert the `.png` to a `.icns` for you.

On MacOS 10.14+, if you have set a global shortcut that includes a Media key, the user will need to be prompted for permissions to enable these keys in System Preferences > Security & Privacy > Accessibility.

###### Manually Converting `.icns`

[iConvertIcons](https://iconverticons.com/online/) can be used to convert `.pngs`, though it can be quite cumbersome.

To retrieve the `.icns` file from the downloaded file, extract it first and press File > Get Info. Then select the icon in the top left corner of the info window and press `⌘-C`. Open Preview and press File > New from clipboard and save the `.icns` file. It took me a while to figure out how to do that and question why a `.icns` file was not simply provided in the downloaded archive.

#### [counter]

```
--counter
```

Use a counter that persists even with window focus for the application badge for sites that use an "(X)" format counter in the page title (i.e. Gmail).

#### [bounce]

```
--bounce
```

(macOS only) When the counter increases, the dock icon will bounce for one second. This only works if the `--counter` option is active.

#### [width]

```
--width <value>
```

Width of the packaged application, defaults to `1280px`.

#### [height]

```
--height <value>
```

Height of the packaged application, defaults to `800px`.

#### [min-width]

```
--min-width <value>
```

Minimum width of the packaged application, defaults to `0`.

#### [min-height]

```
--min-height <value>
```

Minimum height of the packaged application, defaults to `0`.

#### [max-width]

```
--max-width <value>
```

Maximum width of the packaged application, default is no limit.

#### [max-height]

```
--max-height <value>
```

Maximum height of the packaged application, default is no limit.

#### [x]

```
--x <value>
```

X location of the packaged application window.

#### [y]

```
--y <value>
```

Y location of the packaged application window.

#### [show-menu-bar]

```
-m, --show-menu-bar
```

Specifies if the menu bar should be shown.

#### [fast-quit]

```
-f, --fast-quit
```

(macOS only) Specifies to quit the app after closing all windows, defaults to false.

#### [user-agent]

```
-u, --user-agent <value>
```

Set the user agent to run the created app with.

#### [honest]

```
--honest
```

By default, Nativefier uses a preset user agent string for your OS and masquerades as a regular Google Chrome browser, so that sites like WhatsApp Web will not say that the current browser is unsupported.

If this flag is passed, it will not override the user agent.

#### [ignore-certificate]

```
--ignore-certificate
```

Forces the packaged app to ignore certificate errors.

#### [disable-gpu]

```
--disable-gpu
```

Disable hardware acceleration for the packaged application.

#### [ignore-gpu-blacklist]

```
--ignore-gpu-blacklist
```

Passes the ignore-gpu-blacklist flag to the Chrome engine, to allow for WebGl apps to work on non supported graphics cards.

#### [enable-es3-apis]

```
--enable-es3-apis
```

Passes the enable-es3-apis flag to the Chrome engine, to force the activation of WebGl 2.0.

#### [insecure]

```
--insecure
```

Forces the packaged app to ignore web security errors, such as [Mixed Content](https://developer.mozilla.org/en-US/docs/Security/Mixed_content) errors when receiving HTTP content on a HTTPS site.

#### [internal-urls]

```
--internal-urls <regex>
```

Regular expression of URLs to consider "internal" while following a hyperlink.
Internal URLs will open in Nativefier, other URLs will open in your preferred browser.

Defaults to view as "internal" two URLs that share the same base domain,
once stripped of `www.`. For example, by default,
- URLs from/to `foo.com`, `app.foo.com`, `www.foo.com` are considered internal.
- URLs from/to `abc.com` and `xyz.com` are considered external.

*[Breaking change in Nativefier 43.0.0]* Finally, URLs for known login pages
(e.g. `accounts.google.com` or `login.live.com`) are considered internal.
This does not replace `internal-urls`, it complements it, and happens *before*
your `internal-urls` rule is applied. So, if you already set the flag to let such
auth pages open internally, you don't need to change it but it might be unnecessary.

We think this is desirable behavior and are so far unaware of cases where users
might not want this. If you disagree, please chime in at
[PR #1124: App: Automatically consider known login pages as internal](https://github.com/nativefier/nativefier/pull/1124)

Example of `--internal-urls` causing all links to Google to be considered internal:

```bash
nativefier https://google.com --internal-urls ".*?\.google\.*?"
```

Or, if you never expect Nativefier to open an "external" page in your OS browser,

```bash
nativefier https://google.com --internal-urls ".*?"
```

#### [block-external-urls]

```
--block-external-urls
```

Forbid navigation to URLs not considered "internal" (see '--internal-urls'). Instead of opening in an external browser, attempts to navigate to external URLs will be blocked, and an error message will be shown. Default: false

Example:

```bash
nativefier https://google.com --internal-urls ".*?\.google\.*?" --block-external-urls
```

Blocks navigation to any URLs except Google and its subdomains.

#### [proxy-rules]

```
--proxy-rules <value>
```

Proxy rules. See [proxyRules](https://electronjs.org/docs/api/session?q=proxy#sessetproxyconfig-callback) for more details.

Example:

```bash
nativefier https://google.com --proxy-rules http://127.0.0.1:1080
```

#### [disk-cache-size]

```
--disk-cache-size <value>
```

Forces the maximum disk space to be used by the disk cache. Value is given in bytes.

#### [inject]

```
--inject <value>
```

Allows you to inject a javascript or css file. This command can be run multiple times to inject the files.

_Note:_ The javascript file is loaded _after_ `DOMContentLoaded`, so you can assume the DOM is complete & available.

Example:

```bash
nativefier http://google.com --inject ./some-js-injection.js --inject ./some-css-injection.css ~/Desktop
```

#### [full-screen]

```
--full-screen
```

Makes the packaged app start in full screen.

#### [maximize]

```
--maximize
```

Makes the packaged app start maximized.

#### [hide-window-frame]

```
--hide-window-frame
```

Disable window frame and controls.

#### [title-bar-style]

```
--title-bar-style <value>
```

(macOS only) Sets the style for the app's title bar. See more details at electron's [Frameless Window](https://github.com/electron/electron/blob/master/docs/api/frameless-window.md#alternatives-on-macos) documentation.

Consider injecting a custom CSS (via `--inject`) for better integration. Specifically, the CSS should specify a draggable region. For instance, if the target website has a `<header>` element, you can make it draggable like so.

```css
/* site.css */

/* header is draggable... */
header {
  -webkit-app-region: drag;
}

/* but any buttons inside the header shouldn't be draggable */
header button {
  -webkit-app-region: no-drag;
}

/* perhaps move some items out of way for the traffic light */
header div:first-child {
  margin-left: 100px;
  margin-top: 25px;
}
```

```sh
nativefier http://google.com --inject site.css --title-bar-style 'hiddenInset'
```

#### [verbose]

```
--verbose
```

Shows detailed logs in the console.

#### [disable-context-menu]

```
--disable-context-menu
```

Disable the context menu

#### [disable-dev-tools]

```
--disable-dev-tools
```

Disable the Chrome developer tools

#### [crash-reporter]

```
--crash-reporter <value>
```

Enables crash reporting and set the URL to submit crash reports to

Example:

```bash
nativefier http://google.com --crash-reporter https://electron-crash-reporter.appspot.com/PROJECT_ID/create/
```

#### [zoom]

```
--zoom <value>
```

Sets a default zoom factor to be used when the app is opened, defaults to `1.0`.

#### [single-instance]

```
--single-instance
```

Prevents application from being run multiple times. If such an attempt occurs the already running instance is brought to front.

#### [clear-cache]

```
--clear-cache
```

Prevents the application from preserving cache between launches.

#### [tray]

```
--tray [start-in-tray]
```

Application will stay as an icon in the system tray. Prevents application from being closed from clicking the window close button.

When the optional argument `start-in-tray` is provided, i.e. the application is started using `--tray start-in-tray`, the main window will not be shown on first start.

#### [basic-auth-username]

```
--basic-auth-username <value> --basic-auth-password <value>
```

Set basic http(s) auth via the command line to have the app automatically log you in to a protected site. Both fields are required if one is set.

#### [processEnvs]

```
--processEnvs <json-string>
```

a JSON string of key/value pairs to be set as environment variables before any browser windows are opened.

Example:

```bash
nativefier <your-geolocation-enabled-website> --processEnvs '{"GOOGLE_API_KEY": "<your-google-api-key>"}'
```

#### [file-download-options]

```
--file-download-options <json-string>
```

a JSON string of key/value pairs to be set as file download options. See [electron-dl](https://github.com/sindresorhus/electron-dl) for available options.

Example:

```bash
nativefier <your-website> --file-download-options '{"saveAs": true}'
```

#### [always-on-top]

```
--always-on-top
```

Enable always on top for the packaged application.

#### [global-shortcuts]

```
--global-shortcuts shortcuts.json
```

Register global shortcuts which will trigger input events like key presses or pointer events in the application.

You may define multiple global shortcuts which can trigger a series of input events. It has the following structure:

```js
[
  {
    // Key is passed as first argument to globalShortcut.register
    key: 'CommandOrControl+Shift+Z',
    // The input events exactly match the event config in Electron for contents.sendInputEvent(event)
    inputEvents: [
      {
        // Available event types: mouseDown, mouseUp, mouseEnter, mouseLeave, contextMenu, mouseWheel, mouseMove, keyDown, keyUp or char
        type: 'keyDown',
        // Further config depends on your event type. See docs at: https://github.com/electron/electron/blob/master/docs/api/web-contents.md#contentssendinputeventevent
        keyCode: 'Space',
      },
    ],
  },
];
```

**Important note for using modifier keys:**

If you want to trigger key events which include a modifier (Ctrl, Shift,...), you need to keyDown the modifier key first, then keyDown the actual key _including_ the modifier key as modifier property and then keyUp both keys again. No idea what this means? See the example for `MediaPreviousTrack` below!

**For more details, please see the Electron documentation:**

- List of available keys: https://github.com/electron/electron/blob/master/docs/api/accelerator.md
- Details about how to create input event objects: https://github.com/electron/electron/blob/master/docs/api/web-contents.md#contentssendinputeventevent

Example `shortcuts.json` for `https://deezer.com` & `https://soundcloud.com` to get your play/pause/previous/next media keys working:

```json
[
  {
    "key": "MediaPlayPause",
    "inputEvents": [
      {
        "type": "keyDown",
        "keyCode": "Space"
      }
    ]
  },
  {
    "key": "MediaPreviousTrack",
    "inputEvents": [
      {
        "type": "keyDown",
        "keyCode": "Shift"
      },
      {
        "type": "keyDown",
        "keyCode": "Left",
        "modifiers": ["shift"]
      },
      {
        "type": "keyUp",
        "keyCode": "Left",
        "modifiers": ["shift"]
      },
      {
        "type": "keyUp",
        "keyCode": "Shift"
      }
    ]
  },
  {
    "key": "MediaNextTrack",
    "inputEvents": [
      {
        "type": "keyDown",
        "keyCode": "Shift"
      },
      {
        "type": "keyDown",
        "keyCode": "Right",
        "modifiers": ["shift"]
      },
      {
        "type": "keyUp",
        "keyCode": "Right",
        "modifiers": ["shift"]
      },
      {
        "type": "keyUp",
        "keyCode": "Shift"
      }
    ]
  }
]
```

#### [browserwindow-options]

```
--browserwindow-options <json-string>
```

a JSON string that will be sent directly into electron BrowserWindow options.
See [Electron's BrowserWindow API Documentation](https://electronjs.org/docs/api/browser-window#new-browserwindowoptions) for the complete list of options.

Example:

```bash
nativefier <your-website> --browserwindow-options '{ "webPreferences": { "defaultFontFamily": { "standard": "Comic Sans MS", "serif": "Comic Sans MS" } } }'
```

#### [darwin-dark-mode-support]

```
--darwin-dark-mode-support
```

Enables Dark Mode support on macOS 10.14+.

#### [background-color]

```
--background-color <string>
```

See https://electronjs.org/docs/api/browser-window#setting-backgroundcolor

#### [bookmarks-menu]

```
--bookmarks-menu <string>
```

Path to a JSON file defining a bookmarks menu. In addition to containing a list of bookmarks, this file customizes the name of the menu and (optionally) allows assigning keyboard shortcuts to bookmarks.

This menu is a simple list; folders are not supported.

Your `menuLabel` can be bound to a `Alt + letter` shortcut using the letter `&` before the `letter` you want. Be careful to not conflict with the letter of other menus!

Keyboard shortcuts can use the modifier keys `Cmd`, `Ctrl`, `CmdOrCtrl`, `Alt`, `Option`, `AltGr`, `Shift`, and `Super`. See [the Electron documentation](https://www.electronjs.org/docs/api/accelerator) for more information.

Example of such a JSON file:

```json
{
    "menuLabel": "&Music",
    "bookmarks": [
        {
            "title": "lofi.cafe",
            "url": "https://lofi.cafe/",
            "type": "link",
            "shortcut": "CmdOrCtrl+1"
        },
        {
            "title": "beats to relax/study to",
            "url": "https://www.youtube.com/watch?v=5qap5aO4i9A",
            "type": "link",
            "shortcut": "CmdOrCtrl+2"
        },
        {
            "type": "separator"
        },
        {
            "title": "RÜFÜS DU SOL Live from Joshua Tree",
            "type": "link",
            "url": "https://www.youtube.com/watch?v=Zy4KtD98S2c"
        }
    ]
}

```

### Deprecated

#### [flash]

**DEPRECATED as of 2021-03-10, will be removed at some point**

There's nothing Nativefier can do to stop this treadmill, so here it goes.
Flash is triply dead upstream: at Adobe, in Chrome, and now in Electron.
Nativefier 43.0.0 was just released, and defaults to Electron 12, which
[removes support for Flash](https://www.electronjs.org/blog/electron-12-0#breaking-changes):

> Removed Flash support: Chromium has removed support for Flash, which was also
> removed in Electron 12. See [Chromium's Flash Roadmap](https://www.chromium.org/flash-roadmap).

Your best bet now is on [Ruffle, "a Flash Player emulator built in Rust"](https://ruffle.rs/).
It's usable to play `.swf`s, and that's [what Archive.org does](https://blog.archive.org/2020/11/19/flash-animations-live-forever-at-the-internet-archive/).
It's an emulator, so it's not the real perfect deal, but it already works well
for many swfs, and will get better with time.

You _might_ still be able to use Nativefier's existing Flash flags while they work,
by adding a `--electron-version 11.3.0` to your flags, but it's only downhill
from here and our Flash flags will be removed at some point in the future,
when maintaining compatibility with old Electrons becomes impossible.

```
--flash
```

If `--flash` is specified, Nativefier will automatically try to determine the
location of your Google Chrome flash binary. Take note that the version of Chrome
on your computer should be the same as the version used by the version of Electron
for the Nativefied package.

Note that if this flag is specified, the `--insecure` flag will be added automatically,
to prevent Mixed Content errors on sites such as [Twitch.tv](https://www.twitch.tv/).

```
--flash-path <value>
```

You can also specify the path to the Chrome flash plugin directly with this flag.
The path can be found at [chrome://plugins](chrome://plugins), under
`Adobe Flash Player` > `Location`. This flag automatically enables the `--flash` flag.

## Programmatic API

In addition to CLI flags, Nativefier offers a programmatic Node.js API.

```bash
# install and save to package.json
npm install --save nativefier
```

In your `.js` file:

```javascript
var nativefier = require('nativefier').default;

// possible options, defaults unless specified otherwise
var options = {
  name: 'Web WhatsApp', // will be inferred if not specified
  targetUrl: 'http://web.whatsapp.com', // required
  platform: 'darwin', // defaults to the current system
  arch: 'x64', // defaults to the current system
  version: '0.36.4',
  out: '.',
  overwrite: false,
  asar: false, // see conceal
  icon: '~/Desktop/icon.png',
  counter: false,
  bounce: false,
  width: 1280,
  height: 800,
  showMenuBar: false,
  fastQuit: false,
  userAgent: 'Mozilla ...', // will infer a default for your current system
  ignoreCertificate: false,
  ignoreGpuBlacklist: false,
  enableEs3Apis: false,
  internalUrls: '.*?',
  blockExternalUrls: false,
  insecure: false,
  honest: false,
  zoom: 1.0,
  singleInstance: false,
  clearCache: false,
  fileDownloadOptions: {
    saveAs: true, // always show "Save As" dialog
  },
  processEnvs: {
    GOOGLE_API_KEY: '<your-google-api-key>',
  },
};

nativefier(options, function (error, appPath) {
  if (error) {
    console.error(error);
    return;
  }
  console.log('App has been nativefied to', appPath);
});
```

### Additional packaging options for Windows

#### [version-string]

_Object_ (**deprecated** as removed in `electron-packager` 9.0.0, please use the
[`win32metadata`](#win32metadata) parameter instead)

#### [win32metadata]

```
--win32metadata <json-string>
```

a JSON string of key/value pairs of application metadata (ProductName, InternalName, FileDescription) to embed into the executable (Windows only).

Example:

```bash
nativefier <your-geolocation-enabled-website> --win32metadata '{"ProductName": "Your Product Name", "InternalName", "Your Internal Name", "FileDescription": "Your File Description"}'
```

##### Programmatic API

_Object_

Object (also known as a "hash") of application metadata to embed into the executable:

- `CompanyName`
- `FileDescription`
- `OriginalFilename`
- `ProductName`
- `InternalName`

_(Note that `win32metadata` was added to `electron-packager` in version 8.0.0)_

In your `.js` file:

```javascript
var options = {
    ...
    win32metadata: {
      CompanyName: 'Your Company Name',
      FileDescription: 'Your File Description',
      OriginalFilename: 'Your Original Filename',
      ProductName: 'Your Product Name',
      InternalName: 'Your Internal Name'
    }
};
```

#### [disable-old-build-warning-yesiknowitisinsecure]

Disables the warning shown when opening a Nativefier app made a long time ago, using an old and probably insecure Electron. Nativefier uses the Chrome browser (through Electron), and remaining on an old version is A. performance sub-optimal and B. dangerous.

However, there are legitimate use cases to disable such a warning. For example, if you are using Nativefier to ship a kiosk app exposing an internal site (over which you have control). Under those circumstances, it is reasonable to disable this warning that you definitely don't want end-users to see.

More description about the options for `nativefier` can be found at the above [section](#command-line).

## Accessing The Electron Session

Sometimes there are Electron features that are exposed via the [Electron `session` API](https://www.electronjs.org/docs/api/session), that may not be exposed via Nativefier options. These can be accessed with an injected javascript file (via the `--inject` command line argument when building your application). Within that javascript file, you may send an ipcRenderer `session-interaction` event, and listen for a `session-interaction-reply` event to get any result. Session properties and functions can be accessed via this event. This event takes an object as an argument with the desired interaction to be performed.

**Warning**: using this feature in an `--inject` script means using Electron's `session` API, which is not a standard web API and subject to potential [Breaking Changes](https://www.electronjs.org/docs/breaking-changes) at each major Electron upgrade.

To get a `session` property:

```javascript
const electron = require('electron');

const request = {
  property: 'availableSpellCheckerLanguages',
};
electron.ipcRenderer.send('session-interaction', request);
```

To set a `session` property:

```javascript
const electron = require('electron');

const request = {
  property: 'spellCheckerEnabled',
  propertyValue: true,
};
electron.ipcRenderer.send('session-interaction', request);
```

To call a `session` function:

```javascript
const electron = require('electron');

const request = {
  func: 'clearCache',
};
electron.ipcRenderer.send('session-interaction', request);
```

To call a `session` function, with arguments:

```javascript
const electron = require('electron');

const request = {
  func: 'setDownloadPath',
  funcArgs: [
    `/home/user/downloads`,
  ],
};
electron.ipcRenderer.send('session-interaction', request);
```

If neither a `func` nor a `property` is provided in the event, an error will be returned.

### Important Note On funcArgs

PLEASE NOTE: `funcArgs` is ALWAYS an array of arguments to be passed to the function, even if it is just one argument. If `funcArgs` is omitted from a request with a `func` provided, no arguments will be passed.

### session-interaction-reply

The results of the call, if desired, can be accessed one of two ways. Either you can listen for a `session-interaction-reply` event, and access the resulting value like so:

```javascript
const electron = require('electron');

const request = {
  property: 'availableSpellCheckerLanguages',
};
electron.ipcRenderer.send('session-interaction', request);

electon.ipcRenderer.on('session-interaction-reply', (event, result) => {
    console.log('session-interaction-reply', event, result.value)
});
```

Or the result can be retrieved synchronously, though this is not recommended as it may cause slowdowns and freezes in your apps while the app stops and waits for the result to be returned. Heed this [warning from Electron](https://www.electronjs.org/docs/api/ipc-renderer):

> ⚠️ WARNING: Sending a synchronous message will block the whole renderer process until the reply is received, so use this method only as a last resort. It's much better to use the asynchronous version.

```javascript
const electron = require('electron');

const request = {
  property: 'availableSpellCheckerLanguages',
};
console.log(electron.ipcRenderer.sendSync('session-interaction', request).value);
```

### Request IDs

If desired, an id for the request may be provided to distinguish between event replies:

```javascript
const electron = require('electron');

const request = {
  id: 'availableSpellCheckerLanguages',
  property: 'availableSpellCheckerLanguages',
};
electron.ipcRenderer.send('session-interaction', request);

electon.ipcRenderer.on('session-interaction-reply', (event, result) => {
    console.log('session-interaction-reply', event, result.id, result.value)
});
```

### Errors

If an error occurs while handling the interaction, it will be returned in the `session-interaction-reply` event inside the result:

```javascript
const electron = require('electron');

electron.ipcRenderer.on('session-interaction-reply', (event, result) => {
    console.log('session-interaction-reply', event, result.error)
});

electron.ipcRenderer.send('session-interaction', { func: 'thisFunctionDoesNotExist' });
```

### Complex Return Values

Due to the nature of how these events are transmitted back and forth, session functions and properties that return full classes or class instances are not supported.

For example, the following code will return an error instead of the expected value:

```javascript

const electron = require('electron');

const request = {
  id: 'cookies',
  property: 'cookies',
};
electron.ipcRenderer.send('session-interaction', request);

electon.ipcRenderer.on('session-interaction-reply', (event, result) => {
  console.log('session-interaction-reply', event, result)
});
```

### Example

This javascript, when injected as a file via `--inject`, will attempt to call the `isSpellCheckerEnabled` function to make sure the spell checker is enabled, enables it via the `spellCheckerEnabled` property, gets the value of the `availableSpellCheckerLanguages` property, and finally will call `setSpellCheckerLanguages` to set the `fr` language as the preferred spellcheck language if it's supported.

```javascript
const electron = require('electron');

electron.ipcRenderer.on('session-interaction-reply', (event, result) => {
    console.log('session-interaction-reply', event, result);
    switch (result.id) {
        case 'isSpellCheckerEnabled':
            console.log('SpellChecker enabled?', result.value);
            if (result.value === true) {
                console.log("Getting supported languages...");
                electron.ipcRenderer.send('session-interaction', { id: 'availableSpellCheckerLanguages', property: 'availableSpellCheckerLanguages', });
            } else {
                console.log("SpellChecker disabled. Enabling...");
                electron.ipcRenderer.send('session-interaction', { id: 'setSpellCheckerEnabled', property: 'spellCheckerEnabled', propertyValue: true, });
            }
            break;
        case 'setSpellCheckerEnabled':
            console.log('SpellChecker has now been enabled. Getting supported languages...');
            electron.ipcRenderer.send('session-interaction', { id: 'availableSpellCheckerLanguages', property: 'availableSpellCheckerLanguages', });
            break;
        case 'availableSpellCheckerLanguages':
            console.log('Avaliable spellChecker languages:', result.value);
            if (result.value.indexOf('fr') > -1) {
                electron.ipcRenderer.send('session-interaction', { id: 'setSpellCheckerLanguages', func: 'setSpellCheckerLanguages', funcArgs: [['fr']], });
            } else {
                console.log("Not changing spellChecker language. 'fr' is not supported.");
            }
            break;
        case 'setSpellCheckerLanguages':
            console.log('SpellChecker language was set.');
            break;
        default:
            console.error("Unknown reply id:", result.id);
    }
});

electron.ipcRenderer.send('session-interaction', { id: 'isSpellCheckerEnabled', func: 'isSpellCheckerEnabled', });
```
