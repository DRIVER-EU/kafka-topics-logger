"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commandLineArgs = require("command-line-args");
var npmPackage = require("../package.json");
var topic_importer_1 = require("./topic-importer");
var CommandLineInterface = (function () {
    function CommandLineInterface() {
    }
    CommandLineInterface.optionDefinitions = [
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
            type: String,
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
    CommandLineInterface.sections = [
        {
            header: npmPackage.name.toUpperCase() + ", v" + npmPackage.version,
            content: npmPackage.license + " license.\n\n    " + npmPackage.description
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
    return CommandLineInterface;
}());
exports.CommandLineInterface = CommandLineInterface;
var options = commandLineArgs(CommandLineInterface.optionDefinitions);
if (options.help || !options.topic) {
    var getUsage = require('command-line-usage');
    var usage = getUsage(CommandLineInterface.sections);
    console.log(usage);
    process.exit(0);
}
else {
    if (!options.output) {
        options.output = options.topic;
    }
    options.kafka = options.kafka.replace('http://', '');
    options.registry = options.registry.replace('http://', '');
    var schemaParser = new topic_importer_1.TopicImporter(options);
}
//# sourceMappingURL=cli.js.map