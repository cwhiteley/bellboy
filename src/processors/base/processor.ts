import { IProcessor, IProcessorConfig, processStream } from '../../types';

export abstract class Processor implements IProcessor {

    rowLimit: number;

    constructor(config?: IProcessorConfig) {
        this.rowLimit = 0
        if (config) {
            this.rowLimit = config.rowLimit || 0;
        }
    }

    async process(processStream: processStream) {
        throw new Error('Method not implemented.');
    }
}
