export interface Store {
  get: (key: string) => Promise<any>;
  set: (obj: any) => Promise<{}>;
}

export interface Configuration {
  GA_Tracking_ID: string;
  GA_Enabled: boolean;
  DB_Type: 'postgres' | 'mongo' | 'nedb';
  DB_Mongo_URL: string;
}
