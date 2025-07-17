/* eslint-disable react-hooks/exhaustive-deps */
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
import PenaltyMessageView from './PenaltyMessageView';
import { loadSounds, releaseSounds, playWin } from '../../soundManager';
const Icon = FontAwesome6 as unknown as React.FC<any>;

const GameRoomScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { roomCode, playerKey, playerName, isHost } = route.params;

  const [players, setPlayers] = useState<{ key: string; name: string; score?: number; }[]>([]);
  const [status, setStatus] = useState('waiting');
  const [hostKey, setHostKey] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<any | null>(null);
  const [totalLevel, setTotalLevel] = useState(10);
  const [timePerLevel, setTimePerLevel] = useState(3);

  // Play win sound when gameover
  useEffect(() => {
    if (status === 'gameover') {
      playWin();
    }
  }, [status]);

  /** Xóa phòng khi rời màn hình */
  useEffect(() => {
    loadSounds();
    return () => {
      if (roomCode && playerKey) {
        leaveRoom(roomCode, playerKey);
      }
      releaseSounds(); // cleanup
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
      setTotalLevel(data.totalLevel);
      setTimePerLevel(data.timePerLevel);

      if (data.players) {
        const playerList = Object.keys(data.players).map((key) => ({
          key,
          name: data.players[key].name,
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
  }, [roomCode, playerKey, playerName]);

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
    const reStart = status === 'gameover' ? 'bấm chơi lại' : 'bắt đầu';
    return (
      <>
        <Header title={status === 'gameover' ? '⏰ Hết giờ' : 'Phòng chờ'} navigation={navigation} />
        <View style={styles.card}>
          <Text style={styles.roomCodeLabel}>MÃ PHÒNG</Text>
          <TouchableOpacity style={styles.roomCodeBox} onPress={handleCopyRoomCode} activeOpacity={0.7}>
            <Text style={styles.roomCode}>{roomCode}</Text>
            <Icon name="copy" size={18} color={MainColor} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
          {status === 'waiting' && (
            <>
              <Text style={[styles.infoText, { fontSize: 13 }]}>Hãy kêu bạn bè nhập mã phòng để vào nhé!</Text>
              <Text style={styles.listTitle}>Danh sách người chơi:</Text>
            </>
          )}

          {loading ? (
            <ActivityIndicator color={MainColor} size="large" style={{ marginVertical: 24 }} />
          ) : (
            <PlayerListHorizontal
              players={players}
              hostKey={hostKey}
              showScore={status !== 'waiting'}
            />
          )}
          {isHost && status !== 'playing' && (
            <TouchableOpacity style={[styles.startBtn, { backgroundColor: MainColor }]} onPress={handleStartGame} activeOpacity={0.8}>
              <Icon name="play" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.startBtnText}>{status === 'waiting' ? 'Bắt đầu' : 'Chơi lại'}</Text>
            </TouchableOpacity>
          )}
          {!isHost && (
            <DotAnimation message={`Đợi chủ phòng ${reStart} game`} />
          )}
        </View>
        {status === 'waiting' && <View
          style={{
            marginTop: 20,
            backgroundColor: '#f0f4ff',
            borderRadius: 12,
            padding: 18,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <Text style={[styles.infoText, { fontWeight: 'bold', fontSize: 18, marginBottom: 8, color: '#3a57e8' }]}>
            📋 Luật chơi
          </Text>
          <Text style={[styles.infoText, { marginBottom: 4 }]}>
            🕹️ Sẽ có <Text style={{ fontWeight: 'bold', color: '#3a57e8' }}>{totalLevel}</Text> màn chơi.
          </Text>
          <Text style={[styles.infoText, { marginBottom: 4 }]}>
            ⏰ Mỗi màn có <Text style={{ fontWeight: 'bold', color: '#e83a57' }}>{timePerLevel} giây</Text> để chọn.
          </Text>
          <Text style={[styles.infoText, { marginBottom: 4 }]}>
            ⚡ Chọn đúng càng nhanh thì <Text style={{ fontWeight: 'bold', color: '#2ecc40' }}>điểm càng cao</Text>.
          </Text>
          <Text style={[styles.infoText, { marginBottom: 4 }]}>
            ❌ Chọn sai bị <Text style={{ fontWeight: 'bold', color: '#e83a57' }}>trừ điểm</Text>.
          </Text>
          <Text style={[styles.infoText]}>
            🚀 Càng về sau thì <Text style={{ fontWeight: 'bold', color: '#3a57e8' }}>điểm càng cao</Text>.
          </Text>
          <Text style={[styles.infoText, { marginTop: 8, fontWeight: 'bold', color: '#e83a57', fontSize: 16 }]}>😈 Người thua sẽ bị phạt nhé!</Text>
        </View>}
        {status === 'gameover' && players.length >= 2 && (
          <View style={{
            marginHorizontal: 10,
            marginTop: 15,
            backgroundColor: '#fffbe7',
            borderRadius: 8,
            padding: 10,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.07,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#D32F2F', marginBottom: 8 }}>🎲 Hình phạt cho người thua</Text>
            {/* Random 1 hình phạt từ roomSoloMessages */}
            {isHost && <PenaltyMessageView players={players} />}
            {!isHost && <Text style={{ fontSize: 14, color: '#444', marginTop: 8, textAlign: 'center' }}>Xem hình phạt bên máy chủ phòng</Text>}
          </View>
        )}
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
        totalLevel={totalLevel}
        timePerLevel={timePerLevel}
        roomCode={roomCode}
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
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 15,
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
    fontSize: 14,
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
