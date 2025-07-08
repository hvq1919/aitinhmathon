/* eslint-disable curly */
import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HIGH_SCORE_KEY } from '../constant';
import { useFocusEffect } from '@react-navigation/native';
import FacebookLogin from '../components/FacebookLogin';
import { appStyles } from '../styles';
import { ScrollView } from 'react-native-gesture-handler';

export default function HomeScreen({ navigation }: any) {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(HIGH_SCORE_KEY).then(val => {
      if (val) {
        setHighScore(Number(val));
      }
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(HIGH_SCORE_KEY).then((val) => {
        if (val) {
          setHighScore(Number(val));
        }
      });
    }, [])
  );

  return (
    <View style={appStyles.container}>
      <View style={appStyles.headerTop}>
        <Text style={styles.highScore}>🏆 Điểm cao: {highScore}</Text>
        <FacebookLogin highScore={highScore} />
      </View>

      <ScrollView>
        <View>
          <Text style={styles.title}>🎨 Ai Tinh Mắt Hơn </Text>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Game')}>
            <Text style={styles.buttonText}>Chơi ngay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HighScore')}>
            <Text style={styles.buttonText}>Điểm cao</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Help')}>
            <Text style={styles.buttonText}>Hướng dẫn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonOnline} onPress={() => navigation.navigate('CreateRoom')}>
            <Text style={styles.buttonText}>Tạo phòng đấu online</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonOnline} onPress={() => navigation.navigate('JoinRoom')}>
            <Text style={styles.buttonText}>Vào phòng đấu online</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: StatusBar.currentHeight || 24 },
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
  highScore: {
    height: 40,
    fontSize: 16,
    color: '#f59e42',
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#f59e42',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    marginTop: 20,
    color: '#3b82f6',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 18,
    minWidth: 180,
  },
  buttonOnline: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 18,
    minWidth: 180,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fbButton: {
    backgroundColor: '#1877f3',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 18,
    minWidth: 180,
  },
  fbButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
