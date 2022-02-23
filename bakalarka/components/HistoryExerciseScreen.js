import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Dimensions } from "react-native";
import Menu from "../static/menu";
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryExerciseScreen = () => {
    const [image, setImage] = useState([])
    const [loading, isLoading] = useState(true)

    const getImage = async () => {
        try {
            const categories = JSON.parse(await AsyncStorage.getItem('categorie'));
            categories.forEach(async element => {
                const cat = JSON.parse(await AsyncStorage.getItem(element));
                console.log(cat)
                cat.forEach(
                    elem => {
                        image.push(elem)
                        setImage(image)
                        console.log(image)
                    }
                )
            });
            isLoading(false)
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(
        () => {    
            getImage();
        }, []
    );

    const getWidth = () => {
        Image.getSize("file:///data/user/0/com.bakalarka/files/MyTes.jpg", (width, height) => {console.log(width + "a" + height)})
    }
	return (
        loading ? <View></View> :
		<View style={{ flex: 1, marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}}>
            <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10}}>
                    <Image source={{uri: "file:///data/user/0/com.bakalarka/files" + image[0]}} style={styles.image} />
                    <Image source={{uri: "file:///data/user/0/com.bakalarka/files" + image[1]}} style={styles.image} />
                    <Image source={{uri: "file:///data/user/0/com.bakalarka/files" + image[2]}} style={styles.image} />
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