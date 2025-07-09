/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IProps {
    score: number;
    highScore: number;
    handleRestart: any;
}
const GameOver = (props: IProps) => {
    const { score, highScore, handleRestart } = props;
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

            {highScore <= score && <Text style={styles.note}>
                {`Oh! Điểm của bạn cao đấy, nhưng ...\nchắc gì hơn thằng bên cạnh.
                \nRủ nó chơi xem ai cao hơn nào.`}
            </Text>}
        </View>
    )
}
export default GameOver;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#f0f4f8',
        alignItems: 'center',
    },
    endGameBox: {
        backgroundColor: '#fff',
        borderRadius: 18,
        width: '70%',
        paddingVertical: 50,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
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
    note: {
        marginTop: 10,
        color: '#666',
        fontSize: 15,
        textAlign: 'center',
        fontStyle: 'italic',
        maxWidth: '90%',
    },
});