import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    getRandomBaseColor,
    rgbToHex,
    getTargetColor,
    getGridSizeByLevel,
    getRandomTargetIndex,
} from '../utils';
import { ColorGrid } from '../components/ColorGrid';
import { HIGH_SCORE_KEY, MAX_DIFFERENCE, START_GRID_SIZE } from '../constant';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TOTAL_TIME = 120; // 2 phút

export default function MainGamePlay({ navigation }: any) {
    const [level, setLevel] = useState(1);
    const [gridSize, setGridSize] = useState(START_GRID_SIZE);
    const [baseColor, setBaseColor] = useState(getRandomBaseColor());
    const [difference, setDifference] = useState(2);
    const [targetIndex, setTargetIndex] = useState(0);
    const [timer, setTimer] = useState(0);
    const [score, setScore] = useState(0);

    const [remainingTime, setRemainingTime] = useState(TOTAL_TIME);
    const [gameOver, setGameOver] = useState(false);

    const [highScore, setHighScore] = useState(0);

    // Animated value cho điểm
    const animatedScore = useRef(new Animated.Value(1)).current;

    const baseHex = rgbToHex(baseColor.r, baseColor.g, baseColor.b);
    const targetColor = getTargetColor(baseColor, difference);

    // Load high score khi mở app
    useEffect(() => {
        AsyncStorage.getItem(HIGH_SCORE_KEY).then(val => {
            if (val) setHighScore(Number(val));
        });
    }, []);

    // Khi game over, nếu score cao hơn highScore thì lưu lại
    useEffect(() => {
        if (gameOver && score > highScore) {
            setHighScore(score);
            AsyncStorage.setItem(HIGH_SCORE_KEY, score.toString());
        }
    }, [gameOver, score, highScore]);

    const startNewRound = () => {
        const newGridSize = getGridSizeByLevel(level, START_GRID_SIZE);
        setGridSize(newGridSize);
        setBaseColor(getRandomBaseColor());
        setDifference(1);
        setTimer(0);
        setTargetIndex(getRandomTargetIndex(newGridSize));
    };

    useEffect(() => {
        startNewRound();
    }, [level]);

    useEffect(() => {
        const interval = setInterval(() => {
            const diff = level > 10 ? 2 : 3;
            setDifference((prev) => Math.min(prev + diff, MAX_DIFFERENCE));
            setTimer((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        if (gameOver) return;
        const interval = setInterval(() => {
            setDifference((prev) => Math.min(prev + 3, MAX_DIFFERENCE));
            setTimer((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [gameOver]);

    // Đếm ngược 3 phút
    useEffect(() => {
        if (gameOver) return;
        if (remainingTime <= 0) {
            setGameOver(true);
            return;
        }
        const countdown = setInterval(() => {
            setRemainingTime((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(countdown);
    }, [remainingTime, gameOver]);

    // Reset game
    const handleRestart = () => {
        setLevel(1);
        setScore(0);
        setRemainingTime(TOTAL_TIME);
        setGameOver(false);
    };

    const handlePress = (index: number) => {
        if (gameOver) return;
        let earnedScore = 0;
        if (index === targetIndex) {
            earnedScore = Math.max(100 - timer * 10, 10);
            setScore((prev) => prev + earnedScore);

            animatedScore.setValue(1.3);
            Animated.spring(animatedScore, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }).start();

            setLevel((prev) => prev + 1);
        } else {
            earnedScore = -20;
            setScore((prev) => Math.max(prev - 20, 0));

            animatedScore.setValue(1.3);
            Animated.spring(animatedScore, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }).start();
        }
    };

    // Hiển thị màn hình End game
    if (gameOver) {
        return (
            <View style={styles.container}>
                <View style={styles.endGameBox}>
                    <Text style={styles.endGameTitle}>⏰ Hết giờ!</Text>
                    <Text style={styles.endGameScore}>Điểm của bạn: {score}</Text>
                    <Text style={styles.highScore}>🏆 Điểm cao nhất: {highScore}</Text>
                    <TouchableOpacity style={styles.restartBtn} onPress={handleRestart}>
                        <Text style={styles.restartText}>Chơi lại</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#3b82f6" />
                </TouchableOpacity>
                <Text style={styles.level}>Level {level}</Text>
                <Animated.Text
                    style={[
                        styles.score,
                        { transform: [{ scale: animatedScore }] },
                    ]}
                >
                    Điểm: {score}
                </Animated.Text>

            </View>
            <Text style={styles.timer}>
                ⏰ {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
            </Text>
            <ColorGrid
                gridSize={gridSize}
                baseColor={baseHex}
                targetColor={targetColor}
                targetIndex={targetIndex}
                onPress={handlePress}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#f0f4f8',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '95%',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 8,
        marginBottom: 18,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    level: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3b82f6',
    },
    score: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#16a34a',
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#16a34a',
        shadowOpacity: 0.18,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        marginLeft: 8,
    },
    timer: {
        fontSize: 24,
        color: '#ef4444',
        fontWeight: 'bold',
        backgroundColor: '#ffe0f0',
        paddingHorizontal: 18,
        paddingVertical: 6,
        borderRadius: 16,
        marginVertical: 10,
        alignSelf: 'center',
        shadowColor: '#ef4444',
        shadowOpacity: 0.12,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    endGameBox: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 32,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
    },
    endGameTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ef4444',
        marginBottom: 16,
    },
    endGameScore: {
        fontSize: 22,
        fontWeight: '600',
        color: '#16a34a',
        marginBottom: 24,
    },
    restartBtn: {
        backgroundColor: '#3b82f6',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 32,
    },
    restartText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    highScore: {
        fontSize: 18,
        color: '#f59e42',
        fontWeight: 'bold',
        marginBottom: 16,
    },
    backBtn: {
        padding: 8,
    },
    backText: {
        fontSize: 28,
        color: '#3b82f6',
    },
});