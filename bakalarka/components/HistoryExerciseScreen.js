import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Dimensions } from "react-native";
import Menu from "../static/menu";

const HistoryExerciseScreen = () => {
    const getWidth = () => {
        Image.getSize("file:///data/user/0/com.bakalarka/files/MyTes.jpg", (width, height) => {console.log(width + "a" + height)})
    }
	return (
		<View style={{ flex: 1, marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10}}>
                    <Image source={{uri: "file:///data/user/0/com.bakalarka/files/MyTes.jpg"}} style={styles.image} />
                    <Image source={{uri: "file:///data/user/0/com.bakalarka/files/MyTes.jpg"}} style={styles.image} />
                    <Image source={{uri: "file:///data/user/0/com.bakalarka/files/MyTes.jpg"}} style={styles.image} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
                    <Image source={{uri: "file:///data/user/0/com.bakalarka/files/MyTes.jpg"}} style={styles.image} />
                    <Image source={{uri: "file:///data/user/0/com.bakalarka/files/MyTes.jpg"}} style={styles.image} />
                    <Image source={{uri: "file:///data/user/0/com.bakalarka/files/MyTest.jpg"}} style={styles.image} />
                </View>
            </View>
			<Menu />
		</View>

	);
};
export default HistoryExerciseScreen

const styles = StyleSheet.create({
    image: {
        width: Dimensions.get('window').width/3-20, 
        height: ((Dimensions.get('window').width/3-20)/1500)*2000,
        //marginHorizontal: 10
    }
})