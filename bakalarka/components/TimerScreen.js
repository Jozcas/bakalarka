import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from '@react-navigation/core'
import Icon from "react-native-vector-icons/Ionicons"

const TimerScreen = () => {
    const [photoCount, setPhotoCount] = useState('1')
    const [timerValue, setTimerValue] = useState('0')
    const navigation = useNavigation();

    return (
        <View style={stylesTimer.container}>
            <View style={stylesTimer.view}>

                <TouchableOpacity
                    style={stylesTimer.timer}
                    onPress={() => {
                        navigation.navigate("Camera", {timer: timerValue, photoCount: photoCount})                        
                    }}
                >
                    <Icon name="timer-outline" size={40} color="white" />
                </TouchableOpacity>
                
                
                    <Text style={stylesTimer.text}>
                        Časovač
                    </Text>
                    <View style={{flexDirection: 'row', width: '90%'}}>
                        <TouchableOpacity style={{backgroundColor: timerValue === '0' ? '#5c5b5a' : '#737270', justifyContent: 'center', padding: 10}} onPress={() => setTimerValue('0')}>
                            <Text style={{color: 'white', fontSize: 20}}>Vyp.</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: timerValue === '5' ? '#5c5b5a' : '#737270', justifyContent: 'center', padding: 10}} onPress={() => setTimerValue('5')}>
                            <Text style={{color: 'white', fontSize: 20}}>5s</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: timerValue === '10' ? '#5c5b5a' : '#737270', justifyContent: 'center', padding: 10}} onPress={() => setTimerValue('10')}>
                            <Text style={{color: 'white', fontSize: 20}}>10s</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: timerValue === '15' ? '#5c5b5a' : '#737270', justifyContent: 'center', padding: 10}} onPress={() => setTimerValue('15')}>
                            <Text style={{color: 'white', fontSize: 20}}>15s</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={{color: 'white', fontSize: 40, marginTop: 10}}>
                        Počet fotiek
                    </Text>
                    <View style={{flexDirection: 'row', width: '90%'}}>
                        <TouchableOpacity style={{backgroundColor: photoCount === '1' ? '#5c5b5a' : '#737270', justifyContent: 'center', padding: 10}} onPress={() => setPhotoCount('1')}>
                            <Text style={{color: 'white', fontSize: 20}}>1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: photoCount === '2' ? '#5c5b5a' : '#737270', justifyContent: 'center', padding: 10}} onPress={() => setPhotoCount('2')}>
                            <Text style={{color: 'white', fontSize: 20}}>2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: photoCount === '3' ? '#5c5b5a' : '#737270', justifyContent: 'center', padding: 10}} onPress={() => setPhotoCount('3')}>
                            <Text style={{color: 'white', fontSize: 20}}>3</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor: photoCount === '4' ? '#5c5b5a' : '#737270', justifyContent: 'center', padding: 10}} onPress={() => setPhotoCount('4')}>
                            <Text style={{color: 'white', fontSize: 20}}>4</Text>
                        </TouchableOpacity>
                    </View>
            </View>            
        </View>
    );
};
export default TimerScreen

const stylesTimer = StyleSheet.create({
	container: {
		flex: 1,
        backgroundColor: 'black'
	},
    view: {
        margin: 20,
        justifyContent: 'flex-start'
    },
    timer: {
        flex: 1,
		position: "absolute",
		top: 0,
		right: 0,		
        marginTop: 20,
	},
    text: {
        marginTop: 70,
        color: 'white',
        fontSize: 40,
    },
    input: {
        width: '100%',
        backgroundColor: '#737270',
        fontSize: 20,
        padding: 10,
    },
    picker: {
        backgroundColor: '#737270',
        width: '100%'
    }
})