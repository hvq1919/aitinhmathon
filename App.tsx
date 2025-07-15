import 'react-native-gesture-handler';
import * as React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainGamePlay from './src/screens/MainGamePlay';
import HomeScreen from './src/screens/HomeScreen';
import HighScoreScreen from './src/screens/HighScoreScreen';
import HelpScreen from './src/screens/HelpScreen';
import GameRoomScreen from './src/screens/rooms/GameRoomScreen';
import JoinRoomScreen from './src/screens/rooms/JoinRoomScreen';

const Stack = createStackNavigator();

export default function App() {
  React.useEffect(() => {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setBarStyle('dark-content');
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Ai Tinh Mắt Hơn', headerShown: false }}
        />
        <Stack.Screen
          name="Game"
          component={MainGamePlay}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HighScore"
          component={HighScoreScreen}
          options={{ title: 'Điểm cao', headerShown: false }}
        />
        <Stack.Screen
          name="Help"
          component={HelpScreen}
          options={{ title: 'Hướng dẫn', headerShown: false }}
        />
        <Stack.Screen
          name="GameRoom"
          component={GameRoomScreen}
          options={{ title: 'Game Room', headerShown: false }} />
        <Stack.Screen
          name="JoinRoom"
          component={JoinRoomScreen}
          options={{ title: 'Tạo / Vào phòng đấu online', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}