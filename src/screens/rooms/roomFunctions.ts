import { db } from '../../firebase/firebaseConfig';
import {
  ref,
  set,
  update,
  get,
  onDisconnect,
} from 'firebase/database';
import { getDeviceId, getRandomBaseColor, getRandomString, getRandomTargetIndex, getTargetColor } from '../../utils';

// Tạo phòng mới và thêm chủ phòng
export const createRoom = async (playerName: string, totalLevel: number, timePerLevel: number, url?: string) => {
  const roomCode = getRandomString();
  const roomRef = ref(db, `rooms/${roomCode}`);

  const playerKey = getDeviceId();//  push(child(roomRef, 'players')).key as string;

  await set(roomRef, {
    status: 'waiting',
    host: playerKey,
    totalLevel,
    timePerLevel,
    players: {
      [playerKey]: {
        name: playerName,
        highScore: 0,
        url: url ?? '',
      },
    },
  });

  const disconnectRef = ref(db, `rooms/${roomCode}/players/${playerKey}`);
  onDisconnect(disconnectRef).remove();

  return { roomCode, playerKey };
};

// Tham gia phòng hiện có
export const joinRoom = async (
  roomCode: string,
  playerName: string,
  url?: string
): Promise<string> => {
  const roomRef = ref(db, `rooms/${roomCode}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    throw new Error('Phòng không tồn tại');
  }

  const playerKey = getDeviceId();

  await set(ref(db, `rooms/${roomCode}/players/${playerKey}`), {
    name: playerName,
    highScore: 0,
    url: url ?? '',
  });

  const disconnectRef = ref(db, `rooms/${roomCode}/players/${playerKey}`);
  onDisconnect(disconnectRef).remove();

  return playerKey;
};

// Bắt đầu game (chỉ chủ phòng gọi)
export const startGame = async (roomCode: string) => {
  const roomRef = ref(db, `rooms/${roomCode}`);
  const baseColor = getRandomBaseColor();
  await update(roomRef, {
    status: 'playing',
    gameState: {
      level: 1,
      baseColor: baseColor,
      gridSize: 5,
      targetColor: getTargetColor(baseColor, 1),
      targetIndex: getRandomTargetIndex(5),
    },
  });
};

// Rời phòng (xóa player khỏi danh sách)
export const leaveRoom = async (roomCode: string, playerKey: string) => {
  const roomRef = ref(db, `rooms/${roomCode}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) return;

  const roomData = snapshot.val();
  const isHost = roomData.host === playerKey;

  // Xoá player khỏi room
  const playerRef = ref(db, `rooms/${roomCode}/players/${playerKey}`);
  await set(playerRef, null);

  if (isHost) {
    // Nếu là host thì xoá cả phòng
    await set(roomRef, null);
  } else {
    // Nếu không phải host, kiểm tra nếu phòng rỗng thì xoá
    const players = roomData.players || {};
    const remainingPlayers = Object.keys(players).filter(k => k !== playerKey);
    if (remainingPlayers.length === 0) {
      await set(roomRef, null);
    }
  }
};

// Kiểm tra nếu phòng trống thì xóa luôn
export const cleanupRoomIfEmpty = async (roomCode: string) => {
  const playersRef = ref(db, `rooms/${roomCode}/players`);
  const snapshot = await get(playersRef);
  if (!snapshot.exists()) {
    const roomRef = ref(db, `rooms/${roomCode}`);
    await set(roomRef, null);
  }
};
