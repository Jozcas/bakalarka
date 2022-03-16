import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import CameraScreen from './components/CameraScreen';
import TimerScreen from './components/TimerScreen';
import PictureScreen from './components/PictureScreen';
import HistoryExerciseScreen from './components/HistoryExerciseScreen';
import CategoryScreen from './components/CategoryScreen';
import HisScreen from './components/His';
import HESGallery from './components/HESGallery';
import CompareScreen from './components/CompareScreen';
import RatingGalleryScreen from './components/RatingGalleryScreen';
import RGallery from './components/RGallery';
import RCarouselScreen from './components/RCarouselScreen';
import NoRatingScreen from './tComponents/noRatingScreen';
import RatingScreen from './tComponents/RatingScreen';
import SetRateScreen from './tComponents/SetRateScreen';

import Logout from './components/Logout';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Welcome' }}/>
        <Stack.Screen name="HistoryExercise" component={HisScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Camera" component={CameraScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Timer" component={TimerScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Picture" component={PictureScreen} options={{headerShown: true,  title: 'Odfotený cvik' }}/>
        <Stack.Screen name="Category" component={CategoryScreen} options={{headerShown: false}}/>
        <Stack.Screen name="HESGallery" component={HESGallery} options={({route}) => ({headerShown: true, title: route.params.name})}/>
        <Stack.Screen name="Compare" component={CompareScreen} options={({route}) => ({headerShown: true, title: route.params.name})}/>
        <Stack.Screen name="RatingGallery" component={RatingGalleryScreen} options={{headerBackVisible: false, headerShown: true,  title: 'Hodnotené cviky', headerRight: () => <Logout/>}}/>
        <Stack.Screen name="RGallery" component={RGallery} options={({route}) => ({headerShown: true, title: route.params.name})}/>
        <Stack.Screen name="RCarousel" component={RCarouselScreen} options={({route}) => ({headerShown: true, title: route.params.name})}/>

        <Stack.Screen name="NoRating" component={NoRatingScreen} options={{headerBackVisible: false, title: 'Nehodnotené cviky'}}/>
        <Stack.Screen name="Rating" component={RatingScreen} options={{headerBackVisible: false, title: 'Hodnotené cviky', headerRight: () => <Logout/>}}/>
        <Stack.Screen name="SetRate" component={SetRateScreen} options={({route}) => ({headerShown: true, title: route.params.name})}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}