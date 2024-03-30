export type MQTTOptions = {
    host: string,
    port: number
}

export type SubscribeOptions = {
    key: string;
    path: string;
}

export type FetchPath = '/xcache/assets/neid'
    | '/xcache/123'
    | '/xcache/456'

export type FetchData = {
    dataLink: string
}

export type FetchCallbackFunctionType = (data: FetchData) => void

export type FetchOptions = {
    key: string;
    path: FetchPath;
}








/****************************************************following types should be imported from xcache package***************************** */
// type definition for cache subscription
export enum NOTIFY_AS {
    VALUE = 'value',
    LINK = 'link',
}

// defines error codes for XCache

export enum CacheErrorCode {
    INVALID_KEY = 'invalid_key',
    INVALID_CLIENT = 'invalid_client',
    NO_DATA_FOR_KEY = 'no_data_for_key',
    INVALID_TOPIC = 'invalid_topic',
    INVALID_PATH = 'invalid_path',
    INVALID_NOTIFY_AS = 'invalid_notifyAs',
}

export type Subscription = {
    key: string
    path: string
    topic: string
    clientId: string
    ttl?: number
    notifyAs: NOTIFY_AS
}

// type for data update messages sent to clients
export type UpdateNotification = {
    key: string
    valueType: NOTIFY_AS
    value: string | object
}

// type for Request rejection messages sent to clients
export type RequestRejected = {
    key: string
    errorCode: CacheErrorCode
    message: string
}