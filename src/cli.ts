import * as commandLineArgs from 'command-line-args';
import { OptionDefinition } from 'command-line-args';
import * as npmPackage from '../package.json';
import { TopicImporter } from './topic-importer';

export interface ICommandOptions {
  /** Topic to import */
  topic: string;
  /** File to export too */
  output: string;
  /** Topic offset to start reading (default 0) */
  index: number;
  /** Kafka host */
  kafka: string;
  /** Kafka schema registry */
  registry: string;
  /** Display help output */
  help: boolean;
}

export class CommandLineInterface {
  static optionDefinitions: OptionDefinition[] = [
    {
      name: 'help',
      alias: 'h',
      type: Boolean,
      typeLabel: '{underline Boolean}',
      description: 'Show help text.'
    },
    {
      name: 'index',
      alias: 'i',
      type: Number,
      defaultValue: 0,
      typeLabel: '{underline String}',
      description: 'Topic index (offset) to start reading from.'
    },
    {
      name: 'topic',
      alias: 't',
      type: String,
      defaultOption: true,
      typeLabel: '{underline String}',
      description: 'Topic to log.'
    },
    {
      name: 'kafka',
      alias: 'k',
      type: String,
      defaultValue: 'localhost:3501',
      typeLabel: '{underline String}',
      description: 'Kafka broker url [localhost:3501].'
    },
    {
      name: 'registry',
      alias: 'r',
      type: String,
      defaultValue: 'localhost:3502',
      typeLabel: '{underline String}',
      description: 'Schema Registry url [localhost:3502].'
    },
    {
      name: 'output',
      alias: 'o',
      type: String,
      typeLabel: '{underline String}',
      description: 'The output file to log to. Default value is the topic name plus extension.'
    }
  ];

  static sections = [
    {
      header: `${npmPackage.name.toUpperCase()}, v${npmPackage.version}`,
      content: `${npmPackage.license} license.

    ${npmPackage.description}`
    },
    {
      header: 'Options',
      optionList: CommandLineInterface.optionDefinitions
    },
    {
      header: 'Examples',
      content: [
        {
          desc: '01. Log the css-demo topic.',
          example: '$ kafka-topics-logger css-demo'
        },
        {
          desc: '02. Log the css-demo topic to demo.json.',
          example: '$ kafka-topics-logger css-demo -o demo'
        },
        {
          desc: '03. Log the css-demo topic to demo.json starting at offset 10.',
          example: '$ kafka-topics-logger css-demo -o demo -i 10'
        },
        {
          desc: '04. Log the css-demo topic specifying registry and kafka.',
          example: '$ kafka-topics-logger css-demo -k localhost:3501 -r localhost:3502'
        }
      ]
    }
  ];
}

const options: ICommandOptions = commandLineArgs(CommandLineInterface.optionDefinitions);

if (options.help || !options.topic) {
  const getUsage = require('command-line-usage');
  const usage = getUsage(CommandLineInterface.sections);
  console.log(usage);
  process.exit(0);
} else {
  if (!options.output) {
    options.output = options.topic;
  }
  options.kafka = options.kafka.replace('http://', '');
  options.registry = options.registry.replace('http://', '');
  const schemaParser = new TopicImporter(options);
}
