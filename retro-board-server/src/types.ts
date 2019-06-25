export interface Store {
  get: (key: string) => Promise<any>;
  set: (obj: any) => Promise<unknown>;
}

export interface Configuration {
  GA_Tracking_ID: string;
  GA_Enabled: boolean;
  DB_Use_Mongo: boolean;
  DB_Mongo_URL: string;
}
