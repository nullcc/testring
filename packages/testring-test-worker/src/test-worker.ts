import { ITransport, ITestWorker, TestCompiler, TestWorkerPlugin } from '@testring/types';
import { PluggableModule } from '@testring/pluggable-module';
import { TestWorkerInstance } from './test-worker-instance';


export class TestWorker extends PluggableModule implements ITestWorker {

    private compile: TestCompiler = (source: string, filename: string) => {
        return this.callHook(TestWorkerPlugin.compile, source, filename);
    };

    constructor(private transport: ITransport) {
        super([
            TestWorkerPlugin.compile
        ]);
    }

    spawn() {
        return new TestWorkerInstance(this.transport, this.compile);
    }
}
