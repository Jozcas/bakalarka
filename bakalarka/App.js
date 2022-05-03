/**
 * Author: Jozef Čásar (xcasar)
 * This is component that contain navigation stack for changing screens
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './app/components/LoginScreen';
import CameraScreen from './app/components/CameraScreen';
import TimerScreen from './app/components/TimerScreen';
import PictureScreen from './app/components/PictureScreen';
import CategoryScreen from './app/components/CategoryScreen';
import HisScreen from './app/components/His';
import HESGallery from './app/components/HESGallery';
import CompareScreen from './app/components/CompareScreen';
import RatingGalleryScreen from './app/components/RatingGalleryScreen';
import RGallery from './app/components/RGallery';
import RCarouselScreen from './app/components/RCarouselScreen';
import CompareClickScreen from './app/components/CompareClickScreen';
import RCarouselClick from './app/components/RCarouselClick';

import NoRatingScreen from './app/tComponents/noRatingScreen';
import RatingScreen from './app/tComponents/RatingScreen';
import SetRateScreen from './app/tComponents/SetRateScreen';
import DrawingScreen from './app/tComponents/DrawingScreen';
import RatingExerciseGallery from './app/tComponents/RatingExerciseGallery';
import TRateCarouselScreen from './app/tComponents/TRateCarouselScreen';
import SetRateClick from './app/tComponents/SetRateClick';

import Logout from './app/components/Logout';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
        <Stack.Screen name="HistoryExercise" component={HisScreen} options={{headerBackVisible: false, title: 'História cvikov', headerRight: () => <Logout/> }}/>
        <Stack.Screen name="Camera" component={CameraScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Timer" component={TimerScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Picture" component={PictureScreen} options={{headerShown: false,  title: 'Odfotený cvik' }}/>
        <Stack.Screen name="Category" component={CategoryScreen} options={{headerShown: false}}/>
        <Stack.Screen name="HESGallery" component={HESGallery} options={({route}) => ({headerShown: true, title: route.params.name})}/>
        <Stack.Screen name="Compare" component={CompareScreen} options={({route}) => ({headerShown: true, title: route.params.name})}/>
        <Stack.Screen name="RatingGallery" component={RatingGalleryScreen} options={{headerBackVisible: false, headerShown: true,  title: 'Hodnotené cviky', headerRight: () => <Logout/>}}/>
        <Stack.Screen name="RGallery" component={RGallery} options={({route}) => ({headerShown: true, title: route.params.name})}/>
        <Stack.Screen name="RCarousel" component={RCarouselScreen} options={({route}) => ({headerShown: true, title: route.params.name})}/>
        <Stack.Screen name="CompareClick" component={CompareClickScreen} options={({route}) => ({headerShown: true, title: route.params.name})}/>
        <Stack.Screen name="RCarouselClick" component={RCarouselClick} options={({route}) => ({headerShown: true, title: route.params.name})}/>

        <Stack.Screen name="NoRating" component={NoRatingScreen} options={{headerBackVisible: false, title: 'Nehodnotené cviky', headerRight: () => <Logout/>}}/>
        <Stack.Screen name="Rating" component={RatingScreen} options={{headerBackVisible: false, title: 'Hodnotené cviky', headerRight: () => <Logout/>}}/>
        <Stack.Screen name="SetRate" component={SetRateScreen} options={({route}) => ({headerShown: false, title: route.params.name})}/>
        <Stack.Screen name="Drawing" component={DrawingScreen} options={({route}) => ({headerShown: true, title: "Editor"})}/>
        <Stack.Screen name="RatingExercise" component={RatingExerciseGallery} options={({route}) => ({headerShown: true, title: route.params.name})}/>
        <Stack.Screen name="TRateCarousel" component={TRateCarouselScreen} options={({route}) => ({headerShown: false, title: route.params.name})}/>
        <Stack.Screen name="SetRateClick" component={SetRateClick} options={({route}) => ({headerShown: true, title: route.params.name})}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}