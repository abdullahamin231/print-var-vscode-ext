# Variable Printer Extension

## Overview

The **Variable Printer** extension helps you quickly see the value of a variable in your code while you're working with it. Whether you have a variable highlighted or your cursor is inside the variable, this extension will print the value of the variable to the output console, making it easier to debug and understand your code flow in real time.

## Features

- **Print Variable Value**: If you have a variable highlighted, the extension will automatically print its value to the output console.
- **Print Variable Value on Cursor**: If the cursor is placed inside a variable, the extension will detect the variable and print its value in the output console.

## Installation

1. Install the extension through the Visual Studio Code Marketplace.
2. Once installed, simply open any project or file and start using it.

## Usage

- **Highlight the Variable**: Simply highlight a variable and the extension will automatically print the value in the output console.
- **Place the Cursor**: Position your cursor within a variable, and the extension will print the variable's value.

For example, if you have the following code:

```julia
my_var = result(
  x,
  y,
  z
);
```

When you highlight `my_var` or place the cursor inside `my_var`, the extension will add a print statement after it. The output will look like this:

```julia
my_var = result(
  x,
  y,
  z
);
println("my_var = $my_var");
```

## Support

If you have any issues or feature requests, please feel free to open an issue on the [GitHub repository](link-to-repository).

## License

This extension is licensed under the MIT License.

---

Feel free to modify it based on your specific needs or any additional functionality your extension might have!
