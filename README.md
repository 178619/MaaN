> Warning: MaaN is NOT an official project of Maa / Maa Team.

> Note: MaaN is a temporary name.

MaaN is a GUI wrapper developed in Vanilla JS with [Neutralinojs](https://neutralino.js.org/) for [maa-cli](https://github.com/MaaAssistantArknights/Maa-cli). It aims to be a GUI tool that can be used on any desktop OS.

## How to use

Please follow the platform-specific guides before you start.

#### Linux / FreeBSD

Linux is the primary target OS family of MaaN. It is expected to run much faster than Windows GUI (with Wine) on Linux.

Linux executable files use webkit2-gtk for opening a window. For desktops using GTK-based environments (i.e. GNOME, MATE, Xfce, Cinnamon), this typically requires no additional setup.

If you are using Qt-based environments (e.g. KDE) or anything else, webkit2-gtk may not be present on your system. You can either:

- install webkit2-gtk on your system.
  - Debian: `apt install libwebkit2gtk`
  - Fedora: `dnf install webkit2gtk`
  - Arch: `pacman -S webkit2gtk`
  - FreeBSD: `pkg install webkit2-gtk3`
- OR, execute MaaN in the browser mode using the parameter `--mode=browser`.

Browser mode will open a MaaN instance on your default browser instead of a dedicated window. It should be able to deliver the most of the features MaaN has.

#### Windows

> Note: [MaaWpfGui](https://github.com/MaaAssistantArknights/MaaAssistantArknights) is available for Windows.

> Note: Windows on ARM, Windows 7 and Windows 8.1 are not supported.

Windows executable files use Microsoft Edge WebView2 for opening a window. By default it is included in the OS, in any case it is missing you can download it from [developer.microsoft.com](https://developer.microsoft.com/en-us/microsoft-edge/webview2).

You may have to install Visual C++ v14 Redistributable to run maa-cli on Windows. Download an installer from [learn.microsoft.com](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-160#latest-supported-redistributable-version) or run the following command.

```powershell
winget install "Microsoft.VCRedist.2015+.x64" --override "/repair /passive /norestart" --uninstall-previous --accept-package-agreements --force
```

MaaN is not supported on Windows on ARM. Please use MaaWpfGui, as it is the official repository of Maa Team and is well functional on ARM.

MaaN is not supported on Windows 7 / 8.1 or older.

By default, Windows disables the background transparency, as its native window frame forces the display of a white canvas. To bypass this and enable transparency using a custom UI, launch the application with the `--window-borderless` and `--window-transparent` flags. You can set up a shortcut to always launch it with these settings.

#### macOS

> Note: [MaaMacGui](https://github.com/MaaAssistantArknights/MaaMacGui) is available for macOS.

MaaN is expected to work on macOS, but it isn't tested.

PlayCover support is yet to be implemented. Android emulators and physical devices theoretically should work fine.

### Initialization

As MaaN is merely a wrapper to control maa-cli, it must be able to locate and execute maa-cli. It tries to launch maa-cli from `./maa` or `maa`. If it is found in neither, MaaN will prompt you to download maa-cli. Download it and place it in the same folder with MaaN. 

To precisely control how maa-cli is managed, refer to [CLI Install Docs](https://docs.maa.plus/en-us/manual/cli/install.html) of Maa Team.

> Note: You can also put a link of maa-cli instead of having the executable file itself in the folder.

### Differences

MaaN is similar to Maa's default UI in many ways, that there should not be many issues to follow the [official Maa Docs](https://docs.maa.plus).

However, do note that MaaN is basically a mere wrapper of maa-cli. Except for mandatory UI options such as UI language, MaaN depends on maa-cli profiles and tasks for its configuration. While this generally does not cause an issue for common tasks, you will have to clone cli profiles as well to create multiple instances properly. There will be an update to make the management of multiple profiles in the near future.

### Running from CLI

Once you set up maa-cli profiles, you can also run the following command to run maa-cli with profiles managed by MaaN:

```ps
maa run --profile $PROFILE $PROFILE/farming
```

> The default profile name MaaN uses is MaaN.

However, unlike when it is run from the UI, maa-cli does not reset any option for you, so make sure it doesn't have dangerous options enabled such as using Originite Prime. Also, scripts and emulators are executed by MaaN, so maa-cli will not launch or exit emtulators for you, and you will have to configure scripts for it manually.

### CLI arguments

* `--mode=browser`

  Opens MaaN in the browser mode. This allows it to be opened without any dependency as long as the system has a web browser.

  MaaN's backend Neutralinojs uses a security token to allow only the first session to interact with its internal server, so unless your browser is compromised, it should be safe, and the token shall never be exposed as it only uses localhost.

  It still allows your browser to perform actions from scripts, which means it is not sandboxed - this is simply necessary to run maa-cli. Never use any potentially malcious browser extension with it, and use this program at your own risk.

* `--window-borderless`

  Opens MaaN with a custom UI that resembles Windows window frame rather than using your OS' native UI.

  This provides a consistence appearance across all OSes and allows its title bar to be styled. The major drawback is that it becomes less integrated with your OS and may also become less stable.

  Use `--window-borderless=true` if you really just want a borderless window.

While the above two are what you ever would need in the most cases, it has a quite a few arguments available, from its framework. Check [neutralino.js Docs](https://neutralino.js.org/docs/cli/internal-cli-arguments) for more information.

## Build

```ps
# npm install -g @neutralinojs/neu
neu build --embed-resources
```

For a Windows executable, window transparency in the configs must be turned off to display the title bar properly. (Alternatively, define CUSTOM_UI global variable with the value 'WinUI' and enable borderless to use a fake, non-native title bar.)

## License

MaaN is under AGPL 3.0. Refer to the [License file](./License) for further information.

## Disclaimer

The program is provided "as is" without any warranty. Developers of this program or its dependencies do not assume any responsibility. Use at your own risk.
