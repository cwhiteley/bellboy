import { CoreOptions, UrlOptions } from 'request';

export interface IDbConnection {
    user?: string;
    password?: string;
    server?: string;
    host?: string;
    database?: string;
}

interface IDestination {
    batchSize?: number;
    recordGenerator?: (row: any) => AsyncIterableIterator<{}>;
    batchTransformer?: (rows: any[]) => Promise<any[]>;
}

export interface IHttpConnection {
    method: 'GET' | 'POST' | 'DELETE' | 'PUT';
    uri: string;
}

export interface IPostgresDestination extends IDestination {
    type: 'postgres';
    setup: {
        table: string;
        connection: IDbConnection;
        upsertConstraints: string[];
    }
}

interface IStdoutDestination extends IDestination {
    type: 'stdout';
}

export interface IMssqlDestination extends IDestination {
    type: 'mssql';
    setup: {
        table: string;
        connection: IDbConnection;
    }
}

export interface IHttpDestination extends IDestination {
    type: 'http';
    setup: IHttpConnection;
}

export interface IConfig {
    destinations: Destination[];
    verbose?: boolean;
}

export interface IFileConfig extends IConfig {
    path: string;
    filePattern?: string;
    files?: string[];
}

export interface IHttpConfig extends IConfig {
    connection: CoreOptions & UrlOptions;
}

export interface IHttpJsonConfig extends IHttpConfig {
    jsonPath: string;
    nextRequest?: (header: any) => Promise<CoreOptions & UrlOptions>;
}

export interface IDatabaseConfig extends IConfig {
    connection: any;
    query: string;
}

export interface IExcelConfig extends IFileConfig {
    hasHeader?: boolean;
    skipRows?: number;
}

export interface IJsonConfig extends IFileConfig {
    jsonPath: string;
}

export interface IDynamicConfig extends IConfig {
    generator: () => AsyncIterableIterator<any>;
}

export interface IMqttConfig extends IConfig {
    connection: {
        url: string;
        topics: string[];
    }
}

export interface IProcessor {
    on(eventName: string, cb: event): void;
    process(): Promise<void>;
}



export type DbTypes = 'postgres' | 'mssql';

export type event = (...args: any) => Promise<void | any>;

export type emit = (event: string, ...args: any) => Promise<void | any>;

export type Destination = IPostgresDestination | IStdoutDestination | IMssqlDestination | IHttpDestination;
