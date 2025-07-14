import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Button } from 'react-native';
import { ColorGrid } from '../../components/ColorGrid';
import { MainColor, rgbToHex, getRandomBaseColor, getTargetColor, getRandomTargetIndex, getGridSizeByLevel } from '../../utils';
import PlayerListHorizontal from '../../components/PlayerListHorizontal';
import { START_GRID_SIZE } from '../../constant';

interface UserHighScore {
  key: string;
  name: string;
  highScore: number;
}

interface PlayingViewProps {
  gameState: any;
  players: any;
  hostKey: string;
  playerKey: string;
  totalLevel: number;
  timePerLevel: number;
  roomCode: string;
}

const TOTAL_TIME = 120;

const MAX_DIFFERENCE = 100;

import { updateGameStateNextLevel } from './roomFunctions';

const PlayingView: React.FC<PlayingViewProps> = ({
  gameState,
  players,
  hostKey,
  playerKey,
  totalLevel,
  timePerLevel,
  roomCode }) => {
  const { level, baseColor, targetIndex, gridSize } = gameState;

  // Local state
  const [remainingTime, setRemainingTime] = useState(timePerLevel);
  const [localScore, setLocalScore] = useState(0);
  const [difference, setDifference] = useState(1);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Tự động ẩn feedback sau 1s
  useEffect(() => {
    if (feedback) {
      const t = setTimeout(() => setFeedback(null), 1000);
      return () => clearTimeout(t);
    }
  }, [feedback]);

  // Increase difference every second
  useEffect(() => {
    setDifference(5);
    const diffInterval = setInterval(() => {
      setDifference(prev => (prev < MAX_DIFFERENCE ? prev + 5 : prev));
    }, 1000);
    return () => clearInterval(diffInterval);
  }, [level]);

  // Handle cell press
  const handlePress = (index: number) => {
    if (answered) return;
    if (index === targetIndex) {
      setLocalScore(s => s + 10);
      setAnswered(true); // Chỉ khoá khi chọn đúng
      setFeedback('🎉 Chính xác!');
    } else {
      setLocalScore(s => (s > 0 ? s - 5 : 0));
      setFeedback('❌ Sai rồi!');
    }
  };

  useEffect(() => {
    setRemainingTime(timePerLevel);
    setAnswered(false); // Cho phép chọn lại ở round mới
    if (!gameState || !hostKey) return;
    if (level > totalLevel) return;
    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Host tăng level và update gameState
          if (roomCode && playerKey === hostKey) updateGameStateNextLevel(roomCode);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [level, timePerLevel, playerKey, hostKey, totalLevel, roomCode]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Màn {level}/{totalLevel}</Text>
      <Text style={styles.timer}>⏰ {remainingTime}s</Text>
      {/* Local state for score and difference */}
      <Text style={styles.score}>Điểm: {localScore}</Text>
      <ColorGrid
        gridSize={gridSize}
        baseColor={rgbToHex(baseColor.r, baseColor.g, baseColor.b)}
        targetColor={getTargetColor(baseColor, difference)}
        targetIndex={targetIndex}
        onPress={answered ? (() => {}) : handlePress}
        note={`Độ khác biệt màu: ${difference}`}
      />
      {feedback && (
        <Text style={{ color: feedback.includes('Chính xác') ? '#16a34a' : '#dc2626', fontWeight: 'bold', fontSize: 18, marginVertical: 8 }}>
          {feedback}
        </Text>
      )}
      <View style={styles.players}>
        <PlayerListHorizontal
          players={players}
          hostKey={hostKey}
          showScore
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#e6ecf7',
    paddingTop: 10,
  },
  title: {
    marginTop: StatusBar.currentHeight || 24,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: MainColor,
  },
  timer: {
    fontSize: 20,
    color: '#d32f2f',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  score: {
    fontSize: 20,
    color: '#1976d2',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  players: {
    marginTop: 32,
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  highScoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#3b5998',
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userName: {
    fontSize: 16,
    color: '#222',
  },
  userScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009688',
  },
});

export default PlayingView;
