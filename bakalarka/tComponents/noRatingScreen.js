import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet, Dimensions, ScrollView } from "react-native";
import { db } from "../firebaseConfig";
import {Card} from 'react-native-elements';
import TMenu from "../static/Tmenu";
import { Image } from "react-native-elements";
import { useNavigation} from '@react-navigation/core'
import { useFocusEffect } from '@react-navigation/native';

const NoRatingScreen = () => {
    const [cat, setCat] = useState()
    const [images, setImages] = useState()
    const [loading, isLoading] = useState(true)

    const navigation = useNavigation()

    const Data = () => {
        try {
            let category = null;
            setCat(null)
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
        setImages(null)
        console.log(category)
        let pictures = {}
        category.map((el, index) => {                     
            db.collection("cviky").doc("category").collection(el).onSnapshot((querySnapshot) => {
                let arr = [];
                querySnapshot.forEach((doc) => {
                    if(doc.data().state == false){
                        arr.push(doc.data())
                    }
                });
                pictures[el] = arr
                if(index == category.length - 1){
                    console.log(index, pictures)
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
                setCat(null)
                setImages(null)
                Data()
            }
            catch (err) {
                console.log(err);
            }
        }, [])
    );

    useEffect(() => {
        setCat(null)
        setImages(null)
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
                                    {images[element].length != 0 && <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{flex: 1}}>
                                    {
                                        images[element].map((el) => (<Image key={el['name']} source={{uri: el['image']}} style={styles.image} />)).reverse()
                                    }
                                    </ScrollView>
                                    }
                                    {images[element].length == 0 && <Text>Cviky v tejto kategórii sú už ohodnotené</Text>}
                                </Card>
                            ))
                        }
                    </ScrollView>
                    <TMenu showing={true} indexing={0}/>
                </View>
            </ImageBackground>
        )
    }
}
export default NoRatingScreen

const styles = StyleSheet.create({
    image: {
        aspectRatio: 1,
        //width: 150,
        //height: 150,
        width: Dimensions.get('window').width/3-20, 
        height: Dimensions.get('window').width/3-20, 
        marginHorizontal: 10
    }
})