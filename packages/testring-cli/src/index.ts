import * as process from 'process';
import { applyPlugins } from '@testring/plugin-api';
import { getConfig } from '@testring/cli-config';
import { LoggerServer, loggerClientLocal } from '@testring/logger';
import { testFinder } from '@testring/test-finder';
import { testWorker } from '@testring/test-worker';
import { TestRunController } from '@testring/test-run-controller';
import { transport } from '@testring/transport';

// CLI entry point, it makes all initialization job and
// handles all errors, that was not cached inside framework

export const runTests = async (argv: typeof process.argv) => {
    const userConfig = await getConfig(argv);
    const loggerServer = new LoggerServer(userConfig, transport);
    const testRunController = new TestRunController(userConfig, testWorker);

    applyPlugins({
        logger: loggerServer,
        testFinder: testFinder,
        testWorker: testWorker
    }, userConfig);

    loggerClientLocal.log(`User config: ${JSON.stringify(userConfig)}`);
    const tests = await testFinder.find(userConfig.tests);
    loggerClientLocal.info(`Found ${tests.length} test(s) to run.`);
    const testRunResult = await testRunController.runQueue(tests);

    if (testRunResult) {
        loggerClientLocal.error(`Failed ${testRunResult.length}/${tests.length} tests.`);
        throw new Error(`Failed ${testRunResult.length}/${tests.length} tests.`);
    }
};

export const runCLI = (argv: typeof process.argv) => {
    runTests(argv).catch((exception) => {
        loggerClientLocal.error(exception);
        process.exit(1);
    });
};
