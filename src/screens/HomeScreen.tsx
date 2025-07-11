/* eslint-disable react-native/no-inline-styles */
/* eslint-disable curly */
import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HIGH_SCORE_KEY } from '../constant';
import { useFocusEffect } from '@react-navigation/native';
import FacebookLogin from '../components/FacebookLogin';
import { appStyles } from '../styles';
import { ScrollView } from 'react-native-gesture-handler';
import { PressableButton } from '../components/PressableButton';
import { MainColor } from '../utils';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
const Icon = FontAwesome6 as unknown as React.FC<any>;

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
          <View style={{
            flexDirection: 'row', alignItems: 'center',
            marginBottom: 32,
            marginTop: 20,
          }}>

            <Image
              style={{ width: 40, height: 40 }}
              source={require('../assets/eye.png')}
            />
            <Text style={[styles.title, { color: MainColor }]}> Ai Tinh Mắt Hơn </Text>
          </View>

          <PressableButton
            title={
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="play" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Chơi ngay</Text>
              </View>
            }
            onPress={() => navigation.navigate('Game')}
            style={[styles.button, { backgroundColor: MainColor }]}
          />
          <TouchableOpacity style={[styles.button, { marginTop: 50 }]} onPress={() => navigation.navigate('HighScore')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="trophy" size={20} color={'white'} style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Bảng xếp hạng</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Help')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="circle-question" size={20} color={'white'} style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Hướng dẫn</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttonOnline, { marginTop: 50 }]} onPress={() => navigation.navigate('JoinRoom')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="users" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Solo với lũ bạn</Text>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.buttonOnline} onPress={() => navigation.navigate('JoinRoom')}>
            <Text style={styles.buttonText}>Vào phòng đấu online</Text>
          </TouchableOpacity> */}
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
    color: '#3b82f6',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    minWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignSelf: 'center',
  },
  buttonOnline: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    minWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
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
