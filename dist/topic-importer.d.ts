import { ICommandOptions } from './cli';
export declare class TopicImporter {
    private id;
    private topic;
    private adapter;
    private outputFile;
    private timer;
    private messages;
    constructor(options: ICommandOptions);
    private createOutputFile(filename);
    private processMessage(message);
    private reset();
}
