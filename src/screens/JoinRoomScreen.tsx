import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../firebase/firebaseConfig';
import { ref, get, update } from 'firebase/database';
import { getPlayerId } from '../utils';

export default function JoinRoomScreen({ navigation }: any) {
  const [roomId, setRoomId] = useState('');
  const [name, setName] = useState('');

  const handleJoinRoom = async () => {
    if (!roomId.trim() || !name.trim()) {
      Alert.alert('Vui lòng nhập đủ thông tin');
      return;
    }
    const roomRef = ref(db, `rooms/${roomId}`);
    const snapshot = await get(roomRef);
    if (!snapshot.exists()) {
      Alert.alert('Phòng không tồn tại!');
      return;
    }
    const playerId = await getPlayerId(roomId);
    await update(ref(db, `rooms/${roomId}/players/${playerId}`), {
      name,
      score: 0,
      ready: false
    });
    navigation.navigate('GameRoom', { roomId, playerId, name });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vào phòng</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mã phòng"
        value={roomId}
        onChangeText={setRoomId}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập tên của bạn"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleJoinRoom}>
        <Text style={styles.buttonText}>Vào phòng</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, width: '80%', marginBottom: 18 },
  button: { backgroundColor: '#3b82f6', padding: 14, borderRadius: 10, minWidth: 160 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});