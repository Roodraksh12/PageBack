import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBFUhQmTBKdqKgiFLwxNr8lQKgyXK3ywjU",
  authDomain: "pageback.firebaseapp.com",
  projectId: "pageback",
  storageBucket: "pageback.firebasestorage.app",
  messagingSenderId: "564716985363",
  appId: "1:564716985363:web:b7b62becf2b931146c73e6",
  measurementId: "G-5Y6J9Y9M2P"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
