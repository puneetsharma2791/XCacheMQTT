import winston from 'winston';
import MqttConnection from './mqttconnector';
import type { MQTTOptions, FetchOptions, FetchCallbackFunctionType } from "./types";
import { Logger } from './logger/winston';

const defaultMqttOptions: MQTTOptions = {
    host: 'mqtt.example.com',
    port: 1883,
    // other options like username, password, etc. can be added here
};




/**
 * This class will provide the ability to intialise the connection and fetch data
 * 
 */
export class XFetcher {

    private readonly defaultTopic = 'default/topic';
    private readonly mqttConnection: MqttConnection
    private readonly logger: winston.Logger

    constructor(mqttOptions = defaultMqttOptions) {
        this.mqttConnection = MqttConnection.getInstance(mqttOptions, this.defaultTopic);
        this.logger = Logger.getInstance()

    }

    async fetchData({ options, onFetchCallback }: { options: FetchOptions; onFetchCallback: FetchCallbackFunctionType; }): Promise<void> {

        this.logger.debug("fetchData is called with options", options)
        // call xcache API for subscription


        // subscribe to the topic
        await this.mqttConnection.subscribe({
            key: options.key,
            path: options.path
        }, onFetchCallback).then(() => {
            this.logger.info('Subscribed successfully');

        }).catch((error) => {
            this.logger.error('Subscription failed', error)
            throw error
        });
        this.logger.debug("fetchData processing complete", options)







    }
}