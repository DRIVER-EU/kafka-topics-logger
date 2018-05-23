# KAFKA-TOPICS-LOGGER

```console
  MIT license.

  Log messages in a Kafka topic to a JSON file.

Options

  -h, --help Boolean      Show help text.
  -i, --index String      Topic index (offset) to start reading from.
  -t, --topic String      Topic to log.
  -k, --kafka String      Kafka broker url [localhost:3501].
  -r, --registry String   Schema Registry url [localhost:3502].
  -o, --output String     The output file to log to. Default value is the topic name plus
                          extension.

Examples

  01. Log the css-demo topic.                   $ kafka-topics-logger css-demo
  02. Log the css-demo topic to demo.json.      $ kafka-topics-logger css-demo -o demo
  03. Log the css-demo topic to demo.json       $ kafka-topics-logger css-demo -o demo -i
  starting at offset 10.                        10
  04. Log the css-demo topic specifying         $ kafka-topics-logger css-demo -k
  registry and kafka.                           localhost:3501 -r localhost:3502
```

# Installation instructions

```console
npm i -g kafka-topics-logger
```

# Build instruction

```console
git clone https://github.com/DRIVER-EU/kafka-topics-logger
npm i
npm run build
```
