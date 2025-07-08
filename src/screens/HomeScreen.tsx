import React, { useEffect, useState } from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HIGH_SCORE_KEY } from '../constant';
import { LoginManager, AccessToken, Profile } from 'react-native-fbsdk-next';

export default function HomeScreen({ navigation }: any) {
  const [highScore, setHighScore] = useState(0);
  const [userInfo, setUserInfo] = useState<null | { name: string; picture: string }>(null);


  useEffect(() => {
    AsyncStorage.getItem(HIGH_SCORE_KEY).then(val => {
      if (val) setHighScore(Number(val));
    });
  }, []);

  const handleFBLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile']);
      if (result.isCancelled) return;

      const data = await AccessToken.getCurrentAccessToken();
      if (!data) return;

      const profile = await Profile.getCurrentProfile();
      if (profile) {
        setUserInfo({
          name: profile.name ?? '',
          picture: profile.imageURL ?? '',
        });
      }
    } catch (e) {
      // Xử lý lỗi nếu cần
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.highScore}>🏆 Điểm cao nhất: {highScore}</Text>
      <Text style={styles.title}>🎨 Different Color Game</Text>

      {userInfo ? (
        <>
          <Image
            source={{ uri: userInfo.picture }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Text style={{ marginTop: 10, fontSize: 18 }}>{userInfo.name}</Text>
        </>
      ) : (
        <TouchableOpacity style={styles.fbButton} onPress={handleFBLogin}>
          <Text style={styles.fbButtonText}>Login with Facebook</Text>
        </TouchableOpacity>
      )}
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: StatusBar.currentHeight || 24 },
  highScore: {
    position: 'absolute',
    top: 32,
    left: 8,
    fontSize: 16,
    color: '#f59e42',
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
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