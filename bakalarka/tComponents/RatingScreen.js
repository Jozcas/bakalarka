import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet, Dimensions, ScrollView } from "react-native";
import { db } from "../firebaseConfig";
import {Card} from 'react-native-elements';
import TMenu from "../static/Tmenu";
import { Image } from "react-native-elements";
import { useNavigation} from '@react-navigation/core'
import { useFocusEffect } from '@react-navigation/native';

const RatingScreen = () => {
    const [cat, setCat] = useState()
    const [images, setImages] = useState()
    const [loading, isLoading] = useState(true)
    const [first, setFirst] = useState(false)

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
                if(category.length == 0){
                    setFirst(true)
                    return
                }
                else {
                    setFirst(false)
                }
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
                    if(doc.data().state == true){
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

    if(first){
        return (
            <ImageBackground source={require('../static/images/background.jpg')}  style={{flex:1}} imageStyle={{ opacity: 0.3 }}>
                <View style={{flex: 1}}>
                    <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 40, textAlign: 'center'}}>Žiadne hodnotené foto</Text>
                    </View>
                    <View style={{flex:1, position: 'absolute', bottom: 0, width: '100%'}}>
                        <TMenu showing={true} indexing={1}/>
                    </View>
                </View>
            </ImageBackground>
        )
    }
    else{
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
                                            images[element].map((el) => (<Image key={el['name']} source={{uri: el['drawImage'] ? el['drawImage'] : el['image']}} /*resizeMode={'contain'}*/ style={styles.image} 
                                            onPress={() => { navigation.navigate('RatingExercise', {name: element})}}
                                            />))                                        
                                        }
                                        </ScrollView>
                                        }
                                        {images[element].length == 0 && <Text>Ešte neboli hodnotené cviky v tejto kategórii</Text>}
                                    </Card>
                                ))
                            }
                        </ScrollView>
                        <TMenu showing={true} indexing={1}/>
                    </View>
                </ImageBackground>
            )
        }
    }
}
export default RatingScreen

const styles = StyleSheet.create({
    image: {
        width: Dimensions.get('window').width/3-20, 
        height: Dimensions.get('window').width/3-20, 
        marginHorizontal: 2
    }
})