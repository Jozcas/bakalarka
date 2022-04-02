import React from "react";
import { Text, View, Button, Image } from "react-native";
import { auth } from "../firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Menu from "../static/menu";

const HomeScreen = ({ navigation }) => {
	userLogout = () => {
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
		<View style={{ flex: 1 }}>
			<View style={{ flex: 1 }}>
				<Text>Hello!</Text>
				<Button
					color="#3740FE"
					title="Log out"
					onPress={() => userLogout()}
				/>
			</View>
			<Menu />
		</View>

	);
};
export default HomeScreen
