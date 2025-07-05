
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCMrx_BDu1wj-zwM7k-VnZszqBZ7AL-_9k',
  authDomain: 'ai-tinh-mat-hon.firebaseapp.com',
  projectId: 'ai-tinh-mat-hon',
  storageBucket: 'ai-tinh-mat-hon.firebasestorage.app',
  messagingSenderId: '202766891806',
  appId: '1:202766891806:web:06e0df3900201ff565270f',
  measurementId: 'G-WZH4ZLHTCN',
  databaseURL: 'https://ai-tinh-mat-hon-default-rtdb.asia-southeast1.firebasedatabase.app'
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);