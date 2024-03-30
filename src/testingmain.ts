import { XFetcher } from ".";
import MqttConnection from "./mqttconnector";
import type { FetchData, MQTTOptions, UpdateNotification } from "./types";

import { NOTIFY_AS } from "./types"
const defaultMqttOptions: MQTTOptions = {
    host: 'localhost',
    port: 1883,
    // other options like username, password, etc. can be added here
};
const defaultTopic = 'default/topic';
const mqttConnection = MqttConnection.getInstance(defaultMqttOptions, defaultTopic);




const xFetcher = new XFetcher(defaultMqttOptions);
await xFetcher.fetchData({ options: { key: "1", path: "/xcache/123" }, onFetchCallback: (data: FetchData) => { console.log("received published message " + JSON.stringify(data)) } })





let message: UpdateNotification = { key: "1", value: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes", valueType: NOTIFY_AS.LINK }
mqttConnection.publish(JSON.stringify(message), {})