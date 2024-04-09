import { XFetcher } from ".";
import { MqttConnection } from "./pubsub";
import type { FetchData, MQTTOptions, UpdateNotification } from "./types";

import { NOTIFY_AS } from "./types";

const fetchCallbackFunction = (data: FetchData) => {
  console.log("received published message " + JSON.stringify(data));
};
const MqttOptions: MQTTOptions = {
  host: "localhost",
  port: 1883,
  // other options like username, password, etc. can be added here
};
const defaultTopic = "default/topic";
const mqttConnection = MqttConnection.getInstance(MqttOptions, defaultTopic);

const xFetcher = new XFetcher();
await xFetcher.fetchData({
  options: { key: "1", path: "/xcache/123" },
  onFetchCallback: fetchCallbackFunction,
});

let message: UpdateNotification = {
  key: "1",
  value:
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes",
  valueType: NOTIFY_AS.LINK,
};
mqttConnection.publish(JSON.stringify(message), {});
