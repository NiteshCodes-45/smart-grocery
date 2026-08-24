import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { firebaseService } from '@/services/firebaseService';

const mapAdminDocument = (uid, data) => ({
  uid: String(data.uid ?? uid),
  email: String(data.email ?? ''),
  role: String(data.role ?? 'admin'),
});

export const authService = {
  async getAdminByUid(uid) {
    // TODO: Expand Firestore admin profile fields and role permissions when the production schema is finalized.
    const admin = await firebaseService.getDocument('admins', uid);

    if (!admin) {
      return null;
    }

    return mapAdminDocument(uid, admin);
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
