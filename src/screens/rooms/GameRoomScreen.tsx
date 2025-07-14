/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Clipboard } from 'react-native';
import PlayerListHorizontal from '../../components/PlayerListHorizontal';
import PlayingView from './PlayingView';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ref, onValue } from 'firebase/database';
import { leaveRoom, startGame } from './roomFunctions';
import { MainColor } from '../../utils';
import Header from '../../components/Header';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { db } from '../../firebase/firebaseConfig';
import { DotAnimation } from '../../components/DotAnimation';
const Icon = FontAwesome6 as unknown as React.FC<any>;

const GameRoomScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { roomCode, playerKey, playerName, isHost } = route.params;

  const [players, setPlayers] = useState<{ key: string; name: string; highScore?: number; score?: number }[]>([]);
  const [status, setStatus] = useState('waiting');
  const [hostKey, setHostKey] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<any | null>(null);

  /** Xóa phòng khi rời màn hình */
  useEffect(() => {
    return () => {
      if (roomCode && playerKey) {
        leaveRoom(roomCode, playerKey);
      }
    };
  }, [roomCode, playerKey]);

  /** Lắng nghe phòng */
  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomCode}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        Alert.alert('Phòng đã bị xoá hoặc không tồn tại!');
        navigation.replace('JoinRoom');
        return;
      }
      setStatus(data.status);
      setHostKey(data.host);
      if (data.players) {
        const playerList = Object.keys(data.players).map((key) => ({
          key,
          name: data.players[key].name,
          highScore: data.players[key].highScore,
          score: data.players[key].score,
          url: data.players[key].url,
        }));
        setPlayers(playerList);
      } else {
        setPlayers([]);
      }
      setLoading(false);
      if (data && data.gameState) {
        setGameState(data.gameState);
      }
    });
    return () => unsubscribe();
  }, [roomCode, playerKey, playerName, navigation]);

  const handleStartGame = async () => {
    if (players.length < 2) {
      Alert.alert('Cần ít nhất 2 người để bắt đầu!');
      return;
    }
    await startGame(roomCode);
  };

  const handleCopyRoomCode = () => {
    Clipboard.setString(roomCode);
    Alert.alert('Đã sao chép mã phòng!');
  };

  const waitingView = () => {
    return (
      <>
        <Header title="Phòng chờ" navigation={navigation} />
        <View style={styles.card}>
          <Text style={styles.roomCodeLabel}>MÃ PHÒNG</Text>
          <TouchableOpacity style={styles.roomCodeBox} onPress={handleCopyRoomCode} activeOpacity={0.7}>
            <Text style={styles.roomCode}>{roomCode}</Text>
            <Icon name="copy" size={18} color={MainColor} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
          <Text style={styles.infoText}>Hãy kêu bạn bè nhập mã phòng để vào nhé!</Text>
          <Text style={styles.listTitle}>Danh sách người chơi:</Text>
          {loading ? (
            <ActivityIndicator color={MainColor} size="large" style={{ marginVertical: 24 }} />
          ) : (
            <PlayerListHorizontal
              players={players}
              hostKey={hostKey}
              showScore={status === 'playing'}
            />
          )}
          {isHost && status === 'waiting' && (
            <TouchableOpacity style={[styles.startBtn, { backgroundColor: MainColor }]} onPress={handleStartGame} activeOpacity={0.8}>
              <Icon name="play" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.startBtnText}>Bắt đầu</Text>
            </TouchableOpacity>
          )}
          {!isHost && (
            <DotAnimation message="Đợi chủ phòng bắt đầu game" />
          )}
        </View>
      </>
    );
  };

  const playingView = () => {

    if (!gameState) return <Text>Đang tải game...</Text>;

    return (
      <PlayingView
        gameState={gameState}
        players={players}
        hostKey={hostKey}
        playerKey={playerKey}
      />
    );
  };

  return (
    <View style={styles.bg}>
      {status === 'playing' ? playingView() : waitingView()}
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#e6ecf7',
    alignItems: 'center',
    paddingTop: 0,
  },
  card: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    width: '92%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  roomCodeLabel: {
    fontSize: 14,
    color: '#888',
    letterSpacing: 1,
    fontWeight: '500',
    marginBottom: 2,
  },
  roomCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: MainColor,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 22,
    marginBottom: 8,
    backgroundColor: '#f7fafd',
  },
  roomCode: {
    fontSize: 24,
    color: MainColor,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
    textAlign: 'center',
  },
  listTitle: {
    fontSize: 16,
    color: MainColor,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 2,
    alignSelf: 'flex-start',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    backgroundColor: '#f7fafd',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  playerName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 34,
    marginTop: 18,
    marginBottom: 8,
    elevation: 2,
  },
  startBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  waitingText: {
    color: '#888',
    fontSize: 15,
    marginTop: 18,
    fontStyle: 'italic',
  },
});

export default GameRoomScreen;
