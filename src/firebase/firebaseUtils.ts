import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import { getDeviceId } from '../utils';

export const updateHighScore = async (highScore: number) => {
    const deviceId = await getDeviceId();
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
    const deviceId = await getDeviceId();
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


export const updateGameState = async (
    roomId: string,
    gameState: any,
    level: number,
    players: any,
    playerKey: string,
    highScore: number
) => {
    const currentPlayer = players.find((p: any) => p.key === playerKey);
    if (currentPlayer) {
        currentPlayer.highScore = highScore;
    }
    const roomRef = doc(firestore, 'rooms', roomId);
    await updateDoc(roomRef, {
        gameState,
        level,
        players,
        updateAt: new Date().toISOString(),
    });
};

export const deleteAllUsers = async () => {
    const usersRef = collection(firestore, 'users');
    const snapshot = await getDocs(usersRef);

    const deletePromises = snapshot.docs.map((docSnap) => {
        return deleteDoc(doc(firestore, 'users', docSnap.id));
    });

    await Promise.all(deletePromises);
    console.log('✅ Đã xóa toàn bộ user trong Firestore.');
}