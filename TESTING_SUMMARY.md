# Summary of VS Code Extension Testing Issues

This document summarizes the issues encountered while trying to set up and run tests for the Antigravity Annotator VS Code extension.

## Initial Setup

I started by following the official VS Code documentation for testing extensions. This involved:

1.  Installing `mocha`, `@types/mocha`, `@vscode/test-electron`, `typescript`, `glob`, and `@types/glob`.
2.  Creating a `test` script in `package.json`.
3.  Creating a `src/test/runTest.ts` file to run the tests.
4.  Creating a `src/test/suite/index.ts` file to configure Mocha and discover tests using `glob`.
5.  Creating a `src/test/suite/extension.test.ts` file with a simple test case.
6.  Creating a `.vscode/launch.json` file to run the tests from the VS Code UI.

## Compilation Errors

I immediately ran into a series of compilation errors related to the `mocha` and `glob` imports. The TypeScript compiler was unable to resolve the modules correctly. I tried the following solutions, none of which worked:

*   **Different import syntaxes:** I tried `import * as ...`, `import ... from ...`, `import = require(...)`, and `import ... = require(...)`.
*   **`tsconfig.json` modifications:** I tried changing the `module`, `target`, and `moduleResolution` options to various combinations, including `commonjs`, `es6`, `esnext`, `nodenext`, `node`, `umd`, `system`, and `amd`. I also tried enabling `esModuleInterop` and `skipLibCheck`.
*   **Reinstalling dependencies:** I deleted the `node_modules` directory and the `package-lock.json` file and reinstalled all the dependencies.
*   **Resetting the project:** I used `reset_all` to revert all the changes and start from scratch, strictly following the official documentation.

## Test Runner Errors

After finally getting the code to compile, I ran into a different set of errors related to the test runner itself. The `@vscode/test-electron` package downloads a full instance of VS Code to run the tests, and this was creating a large number of files that were not being ignored by `.gitignore`. This caused the tests to fail with a "too many files" error.

I tried the following solutions, none of which worked:

*   **`.vscodeignore`:** I created a `.vscodeignore` file to exclude the `.vscode-test` directory.
*   **`--files`, `--spec`, and `--reporter` options:** I tried using these options in the `test` script to limit the scope of the test runner.
*   **Temporary directories:** I tried using different temporary directories for the VS Code instance, including `/tmp`, `/var/tmp`, and `~`.

## Current Status

I am still unable to run the tests successfully. The compilation errors have been resolved, but the test runner is still creating too many files. I have exhausted all the solutions I can think of, and I am currently blocked on this issue.
