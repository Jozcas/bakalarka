import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import CameraScreen from './components/CameraScreen';
import TimerScreen from './components/TimerScreen';
import PictureScreen from './components/PictureScreen';
import HistoryExerciseScreen from './components/HistoryExerciseScreen';
import CategorieScreen from './components/CategorieScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Welcome' }}/>
        <Stack.Screen name="HistoryExercise" component={HistoryExerciseScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Camera" component={CameraScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Timer" component={TimerScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Picture" component={PictureScreen} options={{headerShown: true,  title: 'Odfotený cvik' }}/>
        <Stack.Screen name="Categorie" component={CategorieScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}