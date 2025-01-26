// src/test/suite/extension.test.ts
import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  // test("Command registration", async () => {
  //   const extension = vscode.extensions.getExtension(
  //     "your-publisher.print-var"
  //   );
  //   assert.ok(extension);

  //   const commands = await vscode.commands.getCommands();
  //   assert.ok(commands.includes("print-var.log"));
  // });

  test("Print variable in Julia file", async () => {
    const document = await vscode.workspace.openTextDocument({
      content: "function test()\n    x = 5\nend",
      language: "julia",
    });
    const editor = await vscode.window.showTextDocument(document);

    // Set cursor position
    editor.selection = new vscode.Selection(
      new vscode.Position(1, 4),
      new vscode.Position(1, 5)
    );

    // Execute command
    await vscode.commands.executeCommand("print-var.log");

    // Verify the result
    assert.strictEqual(
      document.getText(),
      'function test()\n    x = 5\n    println("x = $x")\nend'
    );
  });

  test("Error on unsupported language", async () => {
    const document = await vscode.workspace.openTextDocument({
      content: "const x = 5;",
      language: "javascript",
    });
    const editor = await vscode.window.showTextDocument(document);

    editor.selection = new vscode.Selection(
      new vscode.Position(0, 6),
      new vscode.Position(0, 7)
    );

    let errorShown = false;
    const originalShowError = vscode.window.showErrorMessage;
    vscode.window.showErrorMessage = async (message: string) => {
      if (message.includes("not supported")) {
        errorShown = true;
      }
      return undefined;
    };

    await vscode.commands.executeCommand("print-var.log");
    assert.strictEqual(errorShown, true);

    vscode.window.showErrorMessage = originalShowError;
  });
});
