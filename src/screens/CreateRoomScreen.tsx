import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from '../firebase/firebaseConfig';
import { ref, set } from 'firebase/database';
import { getPlayerId, getRandomString } from '../utils';

export default function CreateRoomScreen({ navigation }: any) {
  const [name, setName] = useState('');

  const handleCreateRoom = async () => {
    if (!name.trim()) {
      Alert.alert('Vui lòng nhập tên');
      return;
    }
    const roomId = getRandomString();
    const roomRef = ref(db, 'rooms/' + roomId);

    const playerId = await getPlayerId(roomId);
    await set(roomRef, {
      status: 'waiting',
      players: {
        [playerId]: { name, score: 0, ready: false }
      }
    });
    navigation.navigate('GameRoom', { roomId, playerId, name });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo phòng mới</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên của bạn"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateRoom}>
        <Text style={styles.buttonText}>Tạo phòng</Text>
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