import { TestBed, inject } from '@angular/core/testing';
import PouchDB from 'pouchdb';
import { PATIENTS } from '../patient-dashboard/services/patient.mock';
import { OfflineStorageService } from './offline-storage.service';

describe('OfflineStorageService', () => {
  let service = new OfflineStorageService();
  let patient1 = PATIENTS[0];
  let pat1ID = patient1.fullName + patient1.ampathMrsUId;
  let patient2 = PATIENTS[1];
  let pat2ID = patient2.fullName + patient2.ampathMrsUId;
  let patient3 = PATIENTS[2];
  let pat3ID = patient1.fullName + patient1.ampathMrsUId;
  beforeEach(() => {
    service.clear();
    TestBed.configureTestingModule({
      providers: [OfflineStorageService]
    });
  });

  it('Should return a pouch instance',
    inject([OfflineStorageService], () => {
      service.createDB('http://localhost:5984/test');
      expect(service).not.toBeNull();
    })
  );

  it('Should show 0 documents for newly created pouch instance',
    inject([OfflineStorageService], () => {
      service.createDB('http://localhost:5984/test');
      service.docCount().then((result) => {
        console.log(result);
        expect(result).toBe(0);
      }).catch((err) => {
        console.log(err);
        fail(err);
      });
    }));

  it('Should be able to add a patient to the PouchDB database',
    inject([OfflineStorageService], () => {
      service.createDB('http://localhost:5984/test');
      service.addDoc(pat2ID, patient2).then((response) => {
        expect(response.ok).toBe(true);
      });
    })
  );

  it('Should be able to update patient data',
    inject([OfflineStorageService], () => {
      service.createDB('http://localhost:5984/test');
      service.addDoc(pat1ID, patient2);
      service.addDoc(pat1ID, patient1).then((response) => {
        console.log(response);
        expect(response.ok).toBe(true);
      }).catch((err) => {
        console.log(err);
        fail();
      });
    })
  );

  it('Should be able to clear the database after items are added',
    inject([OfflineStorageService], () => {
      service.createDB('http://localhost:5984/test');
      service.addDoc(pat1ID, patient1);
      service.addDoc(pat2ID, patient2);
      service.clear();
      service.docCount().then((response) => {
        console.log(response);
        expect(response).toBe(0);
      }).catch((err) => {
        console.log(err);
      });
    }));

  it('Should be able to add multiple patients Test1',
    inject([OfflineStorageService], () => {
      service.createDB('http://localhost:5984/test');
      service.addDoc(pat1ID, patient1);
      service.addDoc(pat2ID, patient2).then((result) => {
        service.docCount().then((response) => {
          console.log(response);
          expect(response).toBe(2);
        }).catch((err) => {
          console.log(err);
          fail();
        });
        expect(result).toBe(true);
      }).catch((err) => {
        console.log(err);
        fail();
      });
    })
  );

  it('Should discard all patient data with clear()',
    inject([OfflineStorageService], () => {
      service.createDB('http://localhost:5984/test');
      service.addDoc(pat1ID, patient1);
      service.addDoc(pat2ID, patient2);
      service.addDoc(pat3ID, patient3);
      service.clear();
      service.docCount().then((response) => {
        console.log(response);
        expect(response).toBe(0);
      }).catch((err) => {
        console.log(err);
        fail();
      });
    })
  );

  it('Should delete item from DB',
    inject([OfflineStorageService], () => {
      service.createDB('http://localhost:5984/test');
      service.addDoc(pat1ID, patient1);
      service.deleteDoc(pat1ID).then((response) => {
        expect(response).toBe(true);
      }).catch((err) => {
        console.log(err);
        fail();
      });
    })
  );
});