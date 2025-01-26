import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  function createSnippet(languageId: string, word: string) {
    switch (languageId) {
      case "julia":
        return `println("${word} = $${word}")`;
      default:
        return;
    }
  }

  function getInsertLine(
    editor: vscode.TextEditor,
    cursorPosition: vscode.Position
  ): number {
    const openBlockIndicators = ["{", "(", "["];
    const closeBlockIndicators = ["}", ")", "]"];
    const currentLineText = editor.document.lineAt(cursorPosition.line).text;
    const currentLineNumber = cursorPosition.line;

    const isBlockOpen = openBlockIndicators.map((brace) =>
      currentLineText.split("").includes(brace)
    );
    if (!isBlockOpen.includes(true)) {
      return currentLineNumber + 1;
    }

    // Initialize counters for each type of brace
    const braceCounts = {
      "{": 0,
      "[": 0,
      "(": 0,
    };

    // Count opening braces in the current line
    for (const char of currentLineText) {
      if (openBlockIndicators.includes(char)) {
        braceCounts[char as keyof typeof braceCounts]++;
      }
      if (closeBlockIndicators.includes(char)) {
        const openBrace =
          openBlockIndicators[closeBlockIndicators.indexOf(char)];
        braceCounts[openBrace as keyof typeof braceCounts]--;
      }
    }

    // Search through subsequent lines
    let lineNumber = currentLineNumber + 1;
    while (lineNumber < editor.document.lineCount) {
      const lineText = editor.document.lineAt(lineNumber).text;

      // Process each character in the line
      for (const char of lineText) {
        if (openBlockIndicators.includes(char)) {
          braceCounts[char as keyof typeof braceCounts]++;
        }
        if (closeBlockIndicators.includes(char)) {
          const openBrace =
            openBlockIndicators[closeBlockIndicators.indexOf(char)];
          braceCounts[openBrace as keyof typeof braceCounts]--;
        }
      }

      // Check if all blocks are closed
      if (
        braceCounts["{"] === 0 &&
        braceCounts["["] === 0 &&
        braceCounts["("] === 0
      ) {
        return lineNumber + 1;
      }

      lineNumber++;
    }

    // If no closing block is found, return the next line after the current one
    return currentLineNumber + 1;
  }

  const disposable = vscode.commands.registerCommand("print-var.log", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No active editor found");
      return;
    }

    const cursorPosition = editor?.selection.active;

    if (!cursorPosition) {
      vscode.window.showErrorMessage("No cursor position found");
      return;
    }

    const currentLine = cursorPosition.line;
    const lineText = editor.document.lineAt(currentLine).text;
    if (!lineText) {
      vscode.window.showErrorMessage("No text found at cursor position");
      return;
    }

    const wordRange = editor.document.getWordRangeAtPosition(cursorPosition);
    if (!wordRange) {
      vscode.window.showErrorMessage("No word found at cursor position");
      return;
    }

    const word = editor.document.getText(wordRange);
    if (!word) {
      vscode.window.showErrorMessage("No word found at cursor position");
      return;
    }

    const languageId = editor.document.languageId;
    const snippet = createSnippet(languageId, word);
    if (!snippet) {
      vscode.window.showErrorMessage(
        "The current language is not supported. Please refer to the documentation for a list of supported languages."
      );
      return;
    }

    const insertLine = getInsertLine(editor, cursorPosition);
    const indent = lineText.match(/^\s*/)?.[0] || "";
    editor
      .edit((editBuilder) => {
        editBuilder.insert(
          new vscode.Position(insertLine, 0),
          indent + snippet + "\n"
        );
      })
      .then((success) => {
        if (!success) {
          vscode.window.showErrorMessage("Failed to insert snippet");
        }
      });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
