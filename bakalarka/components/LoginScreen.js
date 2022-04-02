/**
 * Author: Jozef Čásar (xcasar)
 * This is component that is shown where user is logging in (sportsman: 'andrej.sport@gmail.com' pass - 'andrej'; trainer: 'martin.trener@gmail.com' pass - 'martin';)
 */
import React from "react";
import { Text, View, StyleSheet, TextInput, Button, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
	const [email, updateEmail] = useState('')
	const [password, updatePassword] = useState('')
	const [loading, updateLoading] = useState(true)

	useEffect(() => {

		const unsubscribe = auth.onAuthStateChanged(async user => {
			if (user) {
				if (user.email == 'martin.trener@gmail.com') {
					navigation.replace("NoRating")
				}
				if (user.email == 'andrej.sport@gmail.com') {
					navigation.navigate('HistoryExercise')
				}
			} else {
				updateLoading(false)
			}
		})
		return unsubscribe
	}, [])

	//logging user and set data to asyncstorage
	const userLogin = () => {
		if (email === '' && password === '') {
			Alert.alert('Zadaj údaje pre prihlásenie!')
		} else {
			auth
				.signInWithEmailAndPassword(email, password)
				.then((res) => {
					const user = res.user.email
					console.log('User: ' + user + ' logged-in successfully!')
					AsyncStorage.setItem('user', user)
					AsyncStorage.setItem('timerValue', '0');
					AsyncStorage.setItem('photoCount', '1');
					AsyncStorage.setItem('voiceFlag', JSON.stringify(false));
					updatePassword('')
					updateEmail('')
					if (user == 'andrej.sport@gmail.com') {
						navigation.navigate('HistoryExercise')
					}
					if (user == 'martin.trener@gmail.com') {
						navigation.replace('NoRating')
					}
				})
				.catch(error => alert(error.message))
		}
	}
	return (
		loading ?
			<View style={styles.preloader}>
				<ActivityIndicator size="large" color="#9E9E9E" />
			</View>
			:
			<View style={styles.container}>
				<Text style={styles.headerText}>Prihlásenie</Text>
				<TextInput
					style={styles.inputStyle}
					placeholder="Email"
					value={email}
					onChangeText={(val) => updateEmail(val)}
				/>
				<TextInput
					style={styles.inputStyle}
					placeholder="Password"
					value={password}
					onChangeText={(val) => updatePassword(val)}
					maxLength={15}
					secureTextEntry={true}
				/>
				<Button
					color="#3740FE"
					title="Sign in"
					onPress={() => userLogin()}
				/>
			</View>
	);
};
export default LoginScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		padding: 35,
		backgroundColor: '#fff'
	},
	headerText: {
		width: '100%',
		fontSize: 30,
	},
	inputStyle: {
		width: '100%',
		marginBottom: 15,
		paddingBottom: 15,
		alignSelf: "center",
		borderColor: "#ccc",
		borderBottomWidth: 1
	},
});