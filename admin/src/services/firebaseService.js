import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';

import { db } from '@/firebase/firebase';

const getCollectionReference = (collectionName) => collection(db, collectionName);

export const firebaseService = {
  async getDocument(collectionName, documentId) {
    const snapshot = await getDoc(doc(db, collectionName, documentId));

    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  },

  async listDocuments(collectionName, { limitCount, orderByField, orderDirection = 'desc' } = {}) {
    const collectionReference = getCollectionReference(collectionName);
    const constraints = [];

    if (orderByField) {
      constraints.push(orderBy(orderByField, orderDirection));
    }

    if (limitCount) {
      constraints.push(limit(limitCount));
    }

    const snapshot = await getDocs(query(collectionReference, ...constraints));

    return snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
  },

  async addDocument(collectionName, data) {
    const timestamp = serverTimestamp();
    const documentReference = await addDoc(getCollectionReference(collectionName), {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return { id: documentReference.id, ...data };
  },

  async updateDocument(collectionName, documentId, data) {
    await updateDoc(doc(db, collectionName, documentId), {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return { id: documentId, ...data };
  },
};
