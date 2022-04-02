/**
 * Author: Jozef Čásar (xcasar)
 * This is component that is used for logout user 
 */
import React from 'react';
import { auth } from "../firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { View } from 'react-native';
import { useNavigation} from '@react-navigation/core'

const Logout = () => {
    const navigation = useNavigation();
    const logout = () => {
        auth
        .signOut()
        .then(() => {
            AsyncStorage.removeItem('user');

        })
        .then(() => {
            navigation.navigate('Login')

        })
        .catch(error => alert(error.message))
    }

    return (
        <View>
        <Icon name="log-out-outline" size={35} color="black" onPress={() => {logout()}} />
        </View>
    )
    
}
export default Logout