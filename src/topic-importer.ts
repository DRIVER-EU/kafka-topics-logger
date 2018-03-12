import * as fs from 'fs';
import * as path from 'path';
import * as avsc from 'avsc';
import { ICommandOptions } from './cli';
import { TestBedAdapter, Logger, LogLevel, IAdapterMessage } from 'node-test-bed-adapter';
import { OffsetFetchRequest } from 'kafka-node';

const log = Logger.instance;

export class TopicImporter {
  private id = 'kafka-topics-logger';
  private topic: string;
  private adapter: TestBedAdapter;
  private outputFile: string;
  private timer: NodeJS.Timer;
  private messages: IAdapterMessage[] = [];

  constructor(options: ICommandOptions) {
    this.topic = options.topic;
    this.outputFile = this.createOutputFile(options.output);
    // fs.createWriteStream(this.outputFile, { encoding: 'utf8' });

    this.adapter = new TestBedAdapter({
      kafkaHost: options.kafka,
      schemaRegistry: options.registry,
      clientId: this.id,
      fetchAllSchemas: false,
      fromOffset: true,
      wrapUnions: 'auto',
      consume: [
        {
          offset: options.index,
          topic: options.topic
        } as OffsetFetchRequest
      ],
      logging: {
        logToConsole: LogLevel.Info
      }
    });
    this.adapter.on('error', (e) => log.error(e));
    this.adapter.on('message', (message) => this.processMessage(message));
    this.adapter.on('ready', () => {
      log.info(`Current time: ${this.adapter.simTime}`);
      log.info(`${this.id} is connected... starting to read topic ${options.topic} from offset ${options.index}.`);
    });
    this.adapter.connect();
  }

  private createOutputFile(filename: string) {
    const ext = '.json';
    return path.resolve(process.cwd(), filename) + (path.extname(filename).toLowerCase() === ext ? '' : ext);
  }

  private processMessage(message: IAdapterMessage) {
    this.messages.push(message);
    this.reset();
  }

  private reset() {
    const saveAndQuit = () => {
      fs.writeFile(this.outputFile, JSON.stringify(this.messages, null, 2), { encoding: 'utf8' }, (err) => {
        if (err) {
          log.error(err.message);
          process.exit(1);
        }
        log.info(`Successfully saved ${this.messages.length} messages to ${this.outputFile}.`);
        process.exit(0);
      });
    };
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(saveAndQuit, 2000);
  }
}
