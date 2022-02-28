import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Dimensions, ScrollView } from "react-native";
import Menu from "../static/menu";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card} from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';

const HistoryExerciseScreen = () => {
    //const [image, setImage] = useState([])
    const [categorie, setCategorie] = useState()
    const [pictures, setPictures] = useState({})
    const [loading, isLoading] = useState(true)

    const getWidth = () => {
        Image.getSize("file:///data/user/0/com.bakalarka/files/MyTes.jpg", (width, height) => {console.log(width + "a" + height)})
    }

    const [slideIndex, setSlideIndex] = useState(0);
    const { width: screenWidth } = Dimensions.get('window');

    //used for Carousel and Pagination
    const onSlide = slideIndex => {
        setSlideIndex(slideIndex);
    };
    /*const getImage = async () => {
        try {
            const categories = JSON.parse(await AsyncStorage.getItem('categorie'));
            setCategorie(categories);
            categories.forEach(async element => {
                const cat = JSON.parse(await AsyncStorage.getItem(element));
                pictures[element] = cat;
                /*await cat.forEach(
                    elem => {
                        image.push(elem)
                        setImage(image)
                        //console.log(image)
                    }
                )*/
           /* });
            setPictures(pictures)
            //console.log(pictures['Drep'][0])
        } catch (err) {
            console.log(err);
        }
    };*/

    let tempPic = {}
    console.log('useEffect', pictures)
    console.log('temp', tempPic)
    useEffect(
        async () => { 
            try {   
                const categories = await JSON.parse(await AsyncStorage.getItem('categorie'));
                setCategorie(categories);
                await categories.map(async element => {
                    const cat = await JSON.parse(await AsyncStorage.getItem(element));
                    console.log('cat', cat)
                    //console.log(element)
                    tempPic[element] = cat;
                    setPictures(tempPic)                
                });
                isLoading(false)
            }
            catch (err) {
                console.log(err);
            }
        }, []
    );

    if(loading){
        return (
            <View>
                <Text>Loading</Text>
            </View>
        )
    }
    else{
    return (
        <View style={{flex: 1}}>
            <ScrollView style={{flex: 1}}>
                {categorie.map((element) => (
                    <Card key={element} style={{flex: 1}}>
                        <Card.Title style={{alignSelf: 'flex-start'}}>{element}</Card.Title>
                        <Text>{pictures[element]}</Text>
                        {
                            pictures[element] && <Image source={{uri: "file:///data/user/0/com.bakalarka/files" + pictures[element][0]}} style={styles.image}/>
                        }
                    </Card>
                ))}            
                <Text>{JSON.stringify(pictures)}</Text>
                <View style={{marginTop:90}}></View>
            </ScrollView>
            <Menu/>
        </View>
    );
    }

	/*return (
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

	);*/
};
export default HistoryExerciseScreen

const styles = StyleSheet.create({
    image: {
        width: Dimensions.get('window').width/3-20, 
        height: ((Dimensions.get('window').width/3-20)/1500)*2000,
        //marginHorizontal: 10
    }
})