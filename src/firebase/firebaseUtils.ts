import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import { getDeviceId } from '../utils';

export const updateHighScore = async (highScore: number) => {
    const deviceId = await getDeviceId('');
    const userRef = doc(firestore, 'users', deviceId);
    const existingDoc = await getDoc(userRef);
    if (existingDoc.exists()) {
        await updateDoc(userRef, {
            high_score: highScore,
            updateAt: new Date().toISOString(),
        });
    } else {
        await setDoc(userRef, {
            id: deviceId,
            name: deviceId,
            url: '',
            high_score: highScore,
            fb_id: '',
            createdAt: new Date().toISOString(),
            updateAt: new Date().toISOString(),
        });
    }
};

export const updateFacebookUser = async (userData: {
    name: string;
    url: string;
    fb_id: string;
}) => {
    const deviceId = await getDeviceId('');
    const userRef = doc(firestore, 'users', deviceId);
    const existingDoc = await getDoc(userRef);
    if (existingDoc.exists()) {
        await updateDoc(userRef, {
            ...userData,
            updateAt: new Date().toISOString(),
        });
    } else {
        await setDoc(userRef, {
            id: deviceId,
            ...userData,
            high_score: 0,
            createdAt: new Date().toISOString(),
            updateAt: new Date().toISOString(),
        });
    }
};

