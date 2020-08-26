import admin from "firebase-admin";
import account from './account';

class FirestoreBase {
  db: admin.firestore.Firestore;

  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: account.project_id,
        clientEmail: account.client_email,
        privateKey: account.private_key
      })
    });

    this.db = admin.firestore();
  }
}

export default FirestoreBase;