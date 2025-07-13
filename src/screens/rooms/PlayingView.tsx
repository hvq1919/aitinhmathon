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
}

const TOTAL_TIME = 120;

const MAX_DIFFERENCE = 100;

const PlayingView: React.FC<PlayingViewProps> = ({
  gameState,
  players,
  hostKey,
  playerKey }) => {
  // State local cho client
  const [level, setLevel] = useState(gameState.level || 1);
  const [score, setScore] = useState(0);
  const [remainingTime, setRemainingTime] = useState(TOTAL_TIME);
  const [gameOver, setGameOver] = useState(false);
  const [currentTarget, setCurrentTarget] = useState(gameState.targetIndex);
  const [currentBaseColor, setCurrentBaseColor] = useState(gameState.baseColor);
  const [currentTargetColor, setCurrentTargetColor] = useState(gameState.targetColor);
  const [currentGridSize, setCurrentGridSize] = useState(gameState.gridSize);
  const [wrongCount, setWrongCount] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [difference, setDifference] = useState(0);

  // Đếm ngược
  useEffect(() => {
    if (gameOver) return;
    setRemainingTime(TOTAL_TIME);
    setDifference(0);
    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [level, gameOver]);

  // Mỗi giây tăng difference để màu target ngày càng rõ hơn
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const diff = level > 10 ? 2 : 3;
      setDifference(prev => Math.min(prev + diff, MAX_DIFFERENCE));
    }, 1000);
    return () => clearInterval(interval);
  }, [level, gameOver]);

  // Hàm bắt đầu round mới
  const startNewRound = () => {
    const nextLevel = level + 1;
    const nextGridSize = getGridSizeByLevel(nextLevel, START_GRID_SIZE);
    const baseColor = getRandomBaseColor();
    // Khi bắt đầu round mới, difference = 0
    setDifference(0);
    const targetColor = getTargetColor(baseColor, 0); // bắt đầu round mới, difference = 0
    const targetIndex = getRandomTargetIndex(nextGridSize);
    setLevel(nextLevel);
    setCurrentGridSize(nextGridSize);
    setCurrentBaseColor(baseColor);
    setCurrentTargetColor(targetColor);
    setCurrentTarget(targetIndex);
    setGameOver(false);
    setRemainingTime(TOTAL_TIME);
    setWrongCount(0);
    // Có thể reset/tăng score tuỳ luật chơi
  };


  // Xử lý click ô
  const onPress = (index: number) => {
    if (gameOver || animating) return;
    if (index === currentTarget) {
      setScore(s => s + 10 + remainingTime); // điểm cộng tuỳ luật
      setAnimating(true);
      setTimeout(() => {
        setAnimating(false);
        startNewRound();
      }, 700);
    } else {
      setWrongCount(w => {
        if (w >= 1) {
          setScore(s => Math.max(0, s - 5));
          setGameOver(true);
          return 0;
        }
        return w + 1;
      });
    }
  };

  // Đang chơi
  if (!gameOver) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Level {level}</Text>
        <Text style={styles.timer}>⏰ {remainingTime}s</Text>
        <Text style={styles.score}>Điểm: {score}</Text>
        <ColorGrid
          gridSize={currentGridSize}
          baseColor={rgbToHex(currentBaseColor.r, currentBaseColor.g, currentBaseColor.b)}
          targetColor={getTargetColor(currentBaseColor, difference)}
          targetIndex={currentTarget}
          onPress={onPress}
          note={`Độ khác biệt màu: ${difference}`}
        />
        <View style={styles.players}>
          <PlayerListHorizontal
            players={players}
            hostKey={hostKey}
            showScore
          />
        </View>
      </View>
    );
  }
  // Game over
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hết giờ!</Text>
      <Text style={styles.score}>Điểm: {score}</Text>
      <Button title="Chơi lại" onPress={() => {
        setLevel(1);
        setScore(0);
        setGameOver(false);
        setRemainingTime(TOTAL_TIME);
        setWrongCount(0);
        setCurrentGridSize(gameState.gridSize);
        setCurrentBaseColor(gameState.baseColor);
        setCurrentTargetColor(gameState.targetColor);
        setCurrentTarget(gameState.targetIndex);
      }} />
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
