A Chrome extension to help with pulling test data out of puzzle pages

## Installation

Make sure Node.js is installed on your system. The native component of the extension uses node for parsing and updating the test.json file.

In the `host` folder, run the appropriate `install_host` script for Windows or Linux/OSX to register the native component of the extension.

Next, load the `app` folder as an unpacked extension in chrome, per the [documentation](https://developer.chrome.com/extensions/getstarted#unpacked)

Double check the ID of the loaded extension in [chrome](chrome://extensions/). This id must match the domain for the `allowed_origins` entry in the `manifest.json` and `manifest-win.json` files in order for the extension to work. If it doesn't, update the manifest files and reinstall the host.

To remove the extension, run `/host/uninstall_host` and delete the extension from Chrome.

## Usage

The extension adds two keyboard shortcuts to the Advent of Code website:

- `Ctrl+Shift+S`: Saves the currently selected text as a test input for the current day/part
- `Ctrl+Shift+X`: Saves the currently selected text as the expected output for the next available test input for the current day/part

The extension will derive the year/day/part by inspecting the current page URL/DOM and save the selection to a `test.json` file in the appropriate day's folder:

```json
{
  "part1": [
    {
      "input": "testInput",
      "expect": "result"
    },
    {
      "input": "testInput2",
      "expect": "result2"
    }
  ],
  "part2": [
    {
      "input": "testInput",
      "expect": "result"
    }
  ]
}
```

The `test.json` file will be used to run test cases with your solution. Any test with an `expect` value will also test your solution's result against it and evaluate the test with a `pass` or `fail`.

NB: The extension simply saves in order, so make sure the order of your input selections matches the order of your result selections exactly for each part.
