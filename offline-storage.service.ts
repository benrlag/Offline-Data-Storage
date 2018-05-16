import { Injectable, InjectionToken } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable()
export class OfflineStorageService {
  public dbname: string = null;
  private db: PouchDB = null;

  constructor() {
  }

  public createDB(name: string): void {
    console.log('Creating PouchDB instance: ' + name);
    this.db = new PouchDB(name);
  }

  public addDoc(id: string, jsonObject: any): Promise<any> {
    return this.db.get(id).then((existing) => {
      console.log('checking if object already exists');
      console.log(existing);
      return this.db.put({
        _id: id,
        _rev: existing._rev,
        jsonObject
      }).then((response) => {
        return response.ok;
      }).catch((err) => {
        console.log(err);
      });
    }).catch((doesntExist) => {
      return this.db.put({
        _id: id,
        jsonObject
      }).then((response) => {
        console.log('Storing captured data for the first time: ' + response.id);
        console.log(response);
        return response;
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  public getDoc(id: string): Promise<any> {
    return this.db.get(id).then((existing) => {
      console.log('document exists');
      console.log(existing);
      return existing;
    }).catch((err) => {
      console.log(err);
      return null;
    });
  }

  public docCount(): Promise<any> {
    if (this.db != null) {
      return this.db.info().then((response) => {
        /*console.log(response);*/
        return response.doc_count;
      }).catch((err) => {
        console.log(err);
      });
    } else {
      console.log('DB is NULL');
      return new Promise((result) => {
        console.log('Empty DB, returning 0');
        return 0;
      }).catch((err) => {
        console.log('Something broke');
        console.log(err);
      });
    }
  }

  public deleteDoc(id: string): Promise<any> {
    return this.db.get(id).then((existing) => {
      console.log(existing);
      console.log('deleting data with _id: ' + id);
      return this.db.put(existing).then((doc) => {
        doc._deleted = true;
        return this.db.put(doc);
      }).catch((err) => {
        console.log(err);
      });
    }).catch((error) => {
      console.log('No data found for _id: ' + id);
    });
  }

  public clear(): Promise<any> {
    if (this.db != null) {
      return this.db.destroy().then((response) => {
        console.log('Clearing data from PouchDB');
        console.log(response);
        return response.ok;
      }).catch((err) => {
        console.log(err);
        return err;
      });
    } else {
      return new Promise<any>((result) => {
        return false;
      }).catch((err) => {
        console.log(err);
      });
    }
  }
}