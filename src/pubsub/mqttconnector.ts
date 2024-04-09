import mqtt, {
  MqttClient,
  type IClientOptions,
  type IClientPublishOptions,
} from "mqtt";

import type {
  FetchCallbackFunctionType,
  SubscribeOptions,
  UpdateNotification,
} from "../types";
import { NOTIFY_AS } from "../types";
import { Logger } from "../logger/winston";
import type winston from "winston";

export class MqttConnection {
  private static instance: MqttConnection | null = null;
  private client: MqttClient | null = null;
  private readonly options: IClientOptions;
  private readonly topic: string;
  private readonly keyCallbackMap: Record<string, FetchCallbackFunctionType> =
    {};
  private readonly logger: winston.Logger;

  private constructor(options: IClientOptions, topic: string) {
    this.options = options;
    this.topic = topic;
    this.logger = Logger.getInstance();
    console.log("MQTT Connection initialised with topic ", topic);
  }

  /**
   *
   * The get instance helps in making sure that a single connection is made to MQTT
   * @param options
   * @param topic
   * @returns
   */
  static getInstance(options: IClientOptions, topic: string): MqttConnection {
    if (!MqttConnection.instance) {
      MqttConnection.instance = new MqttConnection(options, topic);
    }
    return MqttConnection.instance;
  }

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        this.client = mqtt.connect(this.options);
        resolve();
        this.client.on("error", (error) => {
          this.logger.error("MQTT connection error:", error);
          reject(error);
        });
      }
    });
  }

  private ensureConnected(): Promise<void> {
    this.logger.debug("Ensuring connection!");
    if (!this.client || this.client?.connected === false) {
      return this.connect();
    }
    return Promise.resolve();
  }

  disconnect(): void {
    if (this.client) {
      this.client.end();
      this.logger.info("Disconnected from MQTT broker");
    }
  }

  async publish(
    message: string,
    options?: IClientPublishOptions
  ): Promise<void> {
    await this.ensureConnected();
    return await new Promise<void>((resolve, reject) => {
      if (this.client) {
        this.client.publish(this.topic, message, options, (error) => {
          if (error) {
            this.logger.error("MQTT publish error:", error);
            reject(error);
          } else {
            this.logger.info(
              "Published message to default topic:" + this.topic
            );
            resolve();
          }
        });
      } else {
        this.logger.error("MQTT client is not connected");
        reject(new Error("MQTT client is not connected"));
      }
    });
  }

  async subscribe(
    options: SubscribeOptions,
    onMessage: FetchCallbackFunctionType
  ): Promise<void> {
    await this.ensureConnected();
    return await new Promise<void>((resolve, reject) => {
      if (this.client) {
        this.logger.info("Connected to MQTT broker");
        this.client?.subscribe(this.topic, (error) => {
          if (error) {
            this.logger.error("MQTT subscribe error:", error);
            reject(error);
          } else {
            this.keyCallbackMap[options.key] = onMessage;
            this.logger.info("Subscribed to topic:" + this.topic);
            resolve();
          }
        });
        this.client.on("message", (topic, message) => {
          this.logger.debug(
            "MQTT message received on topic " + topic,
            JSON.parse(message.toString())
          );
          let updateNotification: UpdateNotification = JSON.parse(
            message.toString()
          );
          const callback = this.keyCallbackMap[updateNotification.key];
          if (callback) {
            if (updateNotification.valueType === NOTIFY_AS.LINK) {
              callback({ dataLink: updateNotification.value.toString() });
            }
          }
        });
      } else {
        this.logger.error("MQTT client is not connected");
        reject(new Error("MQTT client is not connected"));
      }
    });
  }
}
