import { PluggableModule } from '@testring/pluggable-module';
import { locateTestFiles } from './test-files-locator';
import { resolveTests } from './resolve-tests';

import { ITestFile } from '../interfaces';
import {loggerClientLocal} from '@testring/logger';

export enum TestsFinderPlugins {
    beforeResolve = 'beforeResolve',
    afterResolve = 'afterResolve'
}

export class TestsFinder extends PluggableModule {

    constructor() {
        super([
            TestsFinderPlugins.beforeResolve,
            TestsFinderPlugins.afterResolve
        ]);
    }

    public async find(pattern: string): Promise<ITestFile[]> {
        const tests = await locateTestFiles(pattern);
        const testsAfterPlugin = await this.callHook(TestsFinderPlugins.beforeResolve, tests);

        if (!testsAfterPlugin || testsAfterPlugin.length === 0) {
            loggerClientLocal.error(`No test files found by pattern: ${pattern}`);
            throw new Error(`No test files found by pattern: ${pattern}`);
        }

        const resolverTests = await resolveTests(testsAfterPlugin);

        return await this.callHook(
            TestsFinderPlugins.afterResolve,
            resolverTests
        );
    }
}
