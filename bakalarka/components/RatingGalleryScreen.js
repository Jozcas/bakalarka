import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet, Dimensions, ScrollView } from "react-native";
import { db } from "../firebaseConfig";
import {Card} from 'react-native-elements';
import Menu from "../static/menu";
import { Image } from "react-native-elements";
import { useNavigation} from '@react-navigation/core'
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'

const RatingGalleryScreen = () => {
    const [cat, setCat] = useState()
    const [images, setImages] = useState()
    const [loading, isLoading] = useState(true)

    const navigation = useNavigation()

    const Data = () => {
        try {
            let category;
            db.collection("category").onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    category = doc.data()['name']
                    setCat(category)            
                });
                Exercise(category)
            });
        } catch (error) {
            console.log(err);
        }
    }

    const Exercise = (category) => {
        //console.log(category)
        let pictures = {}
        category.map((el, index) => {            
            db.collection("cviky").doc("category").collection(el).onSnapshot((querySnapshot) => {
                let arr = [];
                querySnapshot.forEach((doc) => {
                    arr.push(doc.data())
                });
                pictures[el] = arr
                if(index == category.length - 1){
                    //console.log(index, pictures)
                    setImages(pictures)
                    isLoading(false)
                }
            })
            
        })
    }

    useFocusEffect(
        React.useCallback(() => { 
            try {   
                isLoading(true)
                Data()
            }
            catch (err) {
                console.log(err);
            }
        }, [])
    );

    useEffect(() => {
        Data();
    }, []);

    if(loading){
        return (            
            <View>
                <Text>
                    Loading
                </Text>
            </View>
        )
    }
    else{
        return (
            <ImageBackground source={require('../static/images/background.jpg')}  style={{flex:1}} imageStyle={{ opacity: 0.3 }}>
                <View style={{flex: 1}}>
                    <ScrollView style={{flex: 1}}>
                        {
                            cat.map((element) => (
                                <Card key={element} style={{flex: 1}}>
                                    <Card.Title style={{alignSelf: 'flex-start'}}>{element}</Card.Title>
                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{flex: 1}}>
                                    {
                                        images[element].map((el) => (
                                            <View key={el['name']}>
                                                {(el.state == true) && <Icon name='trophy-outline' size={20} style={{position: 'absolute', top: 5, right: 5, zIndex: 1}}/>}
                                                <Image key={el['name']} source={{uri: (el['drawImage'] && el.state == true) ? el['drawImage'] : el['image']}} /*resizeMode={'contain'}*/ style={styles.image} onPress={() => {navigation.navigate('RGallery', {name: element, data: el})}}/>
                                            </View>
                                        )).reverse()
                                    }
                                    </ScrollView>
                                </Card>
                            ))
                        }
                    </ScrollView>
                    <Menu showing={true} indexing={2}/>
                </View>
            </ImageBackground>
        )
    }
}
export default RatingGalleryScreen

const styles = StyleSheet.create({
    image: {
        height: Dimensions.get('window').width/3-10,
        width: Dimensions.get('window').width/3-10,
        marginRight: 2
    }
})