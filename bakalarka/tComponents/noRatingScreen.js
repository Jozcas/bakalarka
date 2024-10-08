/**
 * Author: Jozef Čásar (xcasar)
 * This is component that shows trainer all categories and images that are not rated yet
 */
import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet, Dimensions, ScrollView } from "react-native";
import { db } from "../firebaseConfig";
import {Card} from 'react-native-elements';
import TMenu from "../static/Tmenu";
import { Image } from "react-native-elements";
import { useNavigation} from '@react-navigation/core'
import { useFocusEffect } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

const NoRatingScreen = () => {
    const [cat, setCat] = useState()
    const [images, setImages] = useState()
    const [loading, isLoading] = useState(true)
    const [first, setFirst] = useState(false)

    const navigation = useNavigation()

    const isFocused = useIsFocused()
    let unsubscribe;

    //get category from firestore
    const Data = () => {
        try {
            let category = null;
            setCat(null)
            unsubscribe = db.collection("category").onSnapshot((querySnapshot) => {
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

    //get images from firestore
    const Exercise = (category) => {
        setImages(null)
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
            return () => {
                unsubscribe()
                isLoading(true)
            }
        }, [])
    );

    useEffect(() => {
        setCat(null)
        setImages(null)
        Data();
        return () => {
            //unsubscribe()
            isLoading(true)
        }
    }, []);

    if(first){
        return (
            <ImageBackground source={require('../static/images/background.jpg')}  style={{flex:1}} imageStyle={{ opacity: 0.3 }}>
                <View style={{flex: 1}}>
                    <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 40, textAlign: 'center'}}>Žiadne foto na hodnotenie</Text>
                    </View>
                    <View style={{flex:1, position: 'absolute', bottom: 0, width: '100%'}}>
                        <TMenu showing={true} indexing={0}/>
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
                isFocused ?
                <ImageBackground source={require('../static/images/background.jpg')}  style={{flex:1}} imageStyle={{ opacity: 0.3 }}>
                    <View style={{flex: 1}}>
                        <ScrollView style={{flex: 1}}>
                            {
                                (cat != null) && cat.map((element) => (
                                    <Card key={element} style={{flex: 1}}>
                                        <Card.Title style={{alignSelf: 'flex-start'}}>{element}</Card.Title>
                                        {images[element].length != 0 && <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{flex: 1}}>
                                        {
                                            (images != null && images[element].length != 0) && images[element].map((el, index) => (<Image /*resizeMode='contain'*/ key={el['name']} source={{uri: el['image']}} style={styles.image} 
                                                onPress={() => { navigation.navigate('SetRate', { name: element, data: JSON.stringify(images[element]), index: index }) }}
                                            />)).reverse()
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
                :
                <View>
                </View>
            )
        }
    }
}
export default NoRatingScreen

const styles = StyleSheet.create({
    image: {
        width: Dimensions.get('window').width/3-20, 
        height: Dimensions.get('window').width/3-20, 
        marginHorizontal: 2
    }
})