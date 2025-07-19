import 'react-native-gesture-handler';
import * as React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import HighScoreScreen from './src/screens/HighScoreScreen';
import HelpScreen from './src/screens/HelpScreen';
import JoinRoomScreen from './src/screens/rooms/JoinRoomScreen';
import Find100Number from './src/screens/Find100Number';

const Stack = createStackNavigator();

export default function App() {
  React.useEffect(() => {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setBarStyle('dark-content');
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Find100Number">
        <Stack.Screen
          name="Find100Number"
          component={Find100Number}
          options={{ title: 'Tim so 100', headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}