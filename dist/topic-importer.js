"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var node_test_bed_adapter_1 = require("node-test-bed-adapter");
var log = node_test_bed_adapter_1.Logger.instance;
var TopicImporter = (function () {
    function TopicImporter(options) {
        var _this = this;
        this.id = 'kafka-topics-logger';
        this.messages = [];
        this.topic = options.topic;
        this.outputFile = this.createOutputFile(options.output);
        this.adapter = new node_test_bed_adapter_1.TestBedAdapter({
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
                }
            ],
            logging: {
                logToConsole: node_test_bed_adapter_1.LogLevel.Info
            }
        });
        this.adapter.on('error', function (e) { return log.error(e); });
        this.adapter.on('message', function (message) { return _this.processMessage(message); });
        this.adapter.on('ready', function () {
            log.info("Current time: " + _this.adapter.simTime);
            log.info(_this.id + " is connected... starting to read topic " + options.topic + " from offset " + options.index + ".");
        });
        this.adapter.connect();
    }
    TopicImporter.prototype.createOutputFile = function (filename) {
        var ext = '.json';
        return path.resolve(process.cwd(), filename) + (path.extname(filename).toLowerCase() === ext ? '' : ext);
    };
    TopicImporter.prototype.processMessage = function (message) {
        this.messages.push(message);
        this.reset();
    };
    TopicImporter.prototype.reset = function () {
        var _this = this;
        var saveAndQuit = function () {
            fs.writeFile(_this.outputFile, JSON.stringify(_this.messages, null, 2), { encoding: 'utf8' }, function (err) {
                if (err) {
                    log.error(err.message);
                    process.exit(1);
                }
                log.info("Successfully saved " + _this.messages.length + " messages to " + _this.outputFile + ".");
                process.exit(0);
            });
        };
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(saveAndQuit, 2000);
    };
    return TopicImporter;
}());
exports.TopicImporter = TopicImporter;
//# sourceMappingURL=topic-importer.js.map