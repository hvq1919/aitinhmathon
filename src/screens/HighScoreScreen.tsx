import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HighScoreScreen({ navigation }: any) {
    const [highScore, setHighScore] = useState(0);

    useEffect(() => {
        AsyncStorage.getItem('HIGH_SCORE').then(val => {
            if (val) setHighScore(Number(val));
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🏆 Điểm cao nhất</Text>
            <Text style={styles.highScore}>{highScore}</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Quay lại</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32, color: '#3b82f6', textAlign: 'center' },
    highScore: { fontSize: 40, color: '#16a34a', fontWeight: 'bold', marginVertical: 24, textAlign: 'center' },
    button: { backgroundColor: '#3b82f6', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12, marginTop: 18, minWidth: 180 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});