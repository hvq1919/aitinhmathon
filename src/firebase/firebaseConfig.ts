
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCMrx_BDu1wj-zwM7k-VnZszqBZ7AL-_9k',
  authDomain: 'ai-tinh-mat-hon.firebaseapp.com',
  projectId: 'ai-tinh-mat-hon',
  storageBucket: 'ai-tinh-mat-hon.firebasestorage.app',
  messagingSenderId: '202766891806',
  appId: '1:202766891806:web:06e0df3900201ff565270f',
  measurementId: 'G-WZH4ZLHTCN',
  databaseURL: 'https://ai-tinh-mat-hon-default-rtdb.asia-southeast1.firebasedatabase.app',
};

const app = initializeApp(firebaseConfig, 'realtime-database');
export const db = getDatabase(app);

const fireStorageConfig = {
  apiKey: 'AIzaSyBTl2bRuwMlBDtiGRgdG271Gt4WlqvRFl0',
  authDomain: 'ai-tinh-mat-hon-storage.firebaseapp.com',
  projectId: 'ai-tinh-mat-hon-storage',
  storageBucket: 'ai-tinh-mat-hon-storage.firebasestorage.app',
  messagingSenderId: '754039399094',
  appId: '1:754039399094:web:88c1268abf1c870873bc17',
  measurementId: 'G-FBE3NZC021',
};
const fireStorageApp = initializeApp(fireStorageConfig, 'firestore-database');
export const firestore = getFirestore(fireStorageApp);
