import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../firebase/firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import { ColorGrid } from '../components/ColorGrid';

export default function GameRoom({ route, navigation }: any) {
  const { roomId, playerId, name } = route.params;
  const [room, setRoom] = useState<any>(null);
  const [myScore, setMyScore] = useState(0);

  // Lắng nghe trạng thái phòng và game realtime
  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomId}`);
    const unsub = onValue(roomRef, (snapshot) => {
      setRoom(snapshot.val());
    });
    return () => unsub();
  }, [roomId]);

  // Khi chọn ô
  const handlePress = (index: number) => {
    // Ví dụ: Nếu đúng thì cộng điểm, sai thì trừ điểm
    const isCorrect = index === room?.gameState?.targetIndex;
    const newScore = myScore + (isCorrect ? 100 : -20);
    setMyScore(newScore);
    update(ref(db, `rooms/${roomId}/players/${playerId}`), {
      score: newScore,
    });
    // Có thể gửi thêm trạng thái đã xong lượt, hoặc chuyển lượt cho đối thủ
  };

  // Hiển thị danh sách người chơi và điểm
  const renderPlayers = () => {
    if (!room?.players) return null;
    return Object.entries(room.players).map(([id, p]: any) => (
      <Text key={id} style={id === playerId ? styles.me : styles.other}>
        {p.name}: {p.score}
      </Text>
    ));
  };

  // Hiển thị grid game (giả sử đã có room.gameState)
  return (
    <View style={styles.container}>
      <Text style={styles.roomId}>Mã phòng: {roomId}</Text>
      <View style={styles.playersBox}>{renderPlayers()}</View>
      {room?.gameState && (
        <ColorGrid
          gridSize={room.gameState.gridSize}
          baseColor={room.gameState.baseColor}
          targetColor={room.gameState.targetColor}
          targetIndex={room.gameState.targetIndex}
          onPress={handlePress}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Thoát</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 24, backgroundColor: '#f0f4f8' },
  roomId: { fontSize: 16, color: '#888', marginBottom: 8 },
  playersBox: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  me: { color: '#3b82f6', fontWeight: 'bold', fontSize: 18 },
  other: { color: '#444', fontSize: 18 },
  button: { backgroundColor: '#ef4444', padding: 12, borderRadius: 10, marginTop: 24 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});