import 'react-native-gesture-handler';
import * as React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainGamePlay from './src/screens/MainGamePlay';
import HomeScreen from './src/screens/HomeScreen';
import HighScoreScreen from './src/screens/HighScoreScreen';
import HelpScreen from './src/screens/HelpScreen';
import CreateRoomScreen from './src/screens/CreateRoomScreen';
import JoinRoomScreen from './src/screens/JoinRoomScreen';
import GameRoom from './src/screens/GameRoom';

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
          options={{ title: 'Different Color Game', headerShown: false }}
        />
        <Stack.Screen
          name="Game"
          component={MainGamePlay}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HighScore"
          component={HighScoreScreen}
          options={{ title: 'Điểm cao' }}
        />
        <Stack.Screen
          name="Help"
          component={HelpScreen}
          options={{ title: 'Hướng dẫn' }}
        />
        <Stack.Screen name="CreateRoom" component={CreateRoomScreen} />
        <Stack.Screen name="JoinRoom" component={JoinRoomScreen} />
        <Stack.Screen name="GameRoom" component={GameRoom} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}