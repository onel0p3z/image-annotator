import * as path from 'path';
import * as os from 'os';
import { runTests } from '@vscode/test-electron';
import * as cp from 'child_process';

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, '../../');

    // The path to the extension test script
    // Passed to --extensionTestsPath
    const extensionTestsPath = path.resolve(__dirname, './suite/index');

    // Copy the node_modules directory to the test environment
    cp.execSync('cp -r node_modules', { cwd: extensionDevelopmentPath });

    // Download VS Code, unzip it and run the integration test
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [
        '--user-data-dir',
        `/mnt/y/vscode-test-user-data`,
        '--extensions-dir',
        `/mnt/y/vscode-test-extensions`
      ]
    });
  } catch (err) {
    console.error('Failed to run tests');
    process.exit(1);
  }
}

main();
