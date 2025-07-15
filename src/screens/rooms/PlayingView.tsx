/* eslint-disable curly */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { ColorGrid } from '../../components/ColorGrid';
import { MainColor, rgbToHex, getTargetColor } from '../../utils';
import PlayerListHorizontal from '../../components/PlayerListHorizontal';


interface PlayingViewProps {
  gameState: any;
  players: any;
  hostKey: string;
  playerKey: string;
  totalLevel: number;
  timePerLevel: number;
  roomCode: string;
}

const MAX_DIFFERENCE = 100;
const COLOR_DIFF = 3;

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
  const [difference, setDifference] = useState(COLOR_DIFF + 2);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Tự động ẩn feedback sau 1s
  useEffect(() => {
    if (feedback) {
      const t = setTimeout(() => setFeedback(null), 1000);
      return () => clearTimeout(t);
    }
  }, [feedback]);

  // Handle cell press
  const handlePress = (index: number) => {
    if (answered) return;

    if (index === targetIndex) {
      const base = level < 5 ? 15 : level * 3;
      const bonus = remainingTime * 5;
      const totalAdd = Math.round((base + bonus) / 10) * 10;
      setLocalScore(s => Math.round((s + totalAdd) / 10) * 10);
      setAnswered(true); // Khóa sau khi đúng
      setFeedback('🎉 Chính xác!');
    } else {
      const penalty = level > 20 ? 20 : 10;
      setLocalScore(s => {
        const newScore = Math.max(0, s - penalty);
        return Math.round(newScore / 10) * 10;
      });
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
          setDifference(COLOR_DIFF + 2);
          // Host tăng level và update gameState
          if (roomCode && playerKey === hostKey) updateGameStateNextLevel(roomCode);
          return 0;
        }
        return prev - 1;
      });
      // Tăng độ khác biệt mỗi giây
      setDifference(prev => (prev < MAX_DIFFERENCE ? prev + COLOR_DIFF : prev));
    }, 1000);
    return () => clearInterval(interval);
  }, [level, timePerLevel, playerKey, hostKey, totalLevel, roomCode, gameState]);

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
        onPress={answered ? (() => { }) : handlePress}
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
