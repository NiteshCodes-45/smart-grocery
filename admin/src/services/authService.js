import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from '@/firebase/firebase';

const mapAdminDocument = (uid, data) => ({
  uid: String(data.uid ?? uid),
  email: String(data.email ?? ''),
  role: String(data.role ?? 'admin'),
});

export const authService = {
  async getAdminByUid(uid) {
    // TODO: Expand Firestore admin profile fields and role permissions when the production schema is finalized.
    const adminRef = doc(db, 'admins', uid);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {
      return null;
    }

    return mapAdminDocument(uid, adminSnap.data());
  },

  async signIn(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const admin = await this.getAdminByUid(credential.user.uid);

    if (!admin) {
      await signOut(auth);
      throw new Error('This account is not authorized for the admin panel.');
    }

    return admin;
  },

  async signOut() {
    await signOut(auth);
  },

  observeAdmin(callback, onError) {
    return onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (!firebaseUser) {
            callback(null);
            return;
          }

          const admin = await this.getAdminByUid(firebaseUser.uid);

          if (!admin) {
            await signOut(auth);
            callback(null);
            return;
          }

          callback(admin);
        } catch (error) {
          onError(error instanceof Error ? error.message : 'Unable to verify admin access.');
        }
      },
      (error) => onError(error.message),
    );
  },
};
