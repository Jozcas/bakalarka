/**
 * Author: Jozef Čásar (xcasar)
 * This is component where trainer can see rate of image and can change rate
 */
import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet, Dimensions, TextInput, ScrollView, Keyboard, TouchableOpacity, Alert } from "react-native";
import { Image, Button } from "react-native-elements";
import TMenu from "../static/Tmenu";
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/Ionicons';
import { storage, db } from "../firebaseConfig";
import { useNavigation } from '@react-navigation/core'
import DrawingScreen from "./DrawingScreen";

const TRateCarouselScreen = ({route}) => {
    const [slideIndex, setSlideIndex] = useState(route.params.index);
    const [show, setShow] = useState(true)
    const [comment, updateComment] = useState(new Array(JSON.parse(route.params.data).length).fill(''))
    const [loading, isLoading] = useState(true)
    const [images, setImages] = useState()

    const [sketch, setSketch] = useState(false)
    const [imageUrl, setImageUrl] = useState()
    const [name, setName] = useState()

    const { width: screenWidth } = Dimensions.get('window');

    const navigation = useNavigation()

    //get images from firestore
    const Data = () => {
        db.collection("cviky").doc("category").collection(route.params.name).onSnapshot((querySnapshot) => {
            let arr = [];
            let i = 0;
            querySnapshot.forEach((doc) => {
                if(doc.data().state == true){
                    arr.push(doc.data())
                    updateComment(comment => ({ ...comment, [i]: doc.data().comment }))
                    i++
                }
            });
            /*if(arr.length == 0){
                navigation.navigate('Rating')
            }*/
            setImages(arr)
            isLoading(false)
        })
    }

    useEffect(() => {
        Data()
        Keyboard.addListener('keyboardDidShow', () => {setShow(false)})
        Keyboard.addListener('keyboardDidHide', () => {setShow(true)})

        return () => {
            Keyboard.removeAllListeners('keyboardDidShow', 'keyboardDidHide')
        }
    }, [])

    //used for Carousel
    const onSlide = slideIndex => {
        setSlideIndex(slideIndex);
    };

    const getDate = (el) => {
        const tmpDate = el.substring(1, el.indexOf('-'))
        const tmpTime = el.split('-')
        const time = tmpTime[1].split('_')
        const array = tmpDate.split("_")

        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{color: 'black'}}>Dátum: {array[2] + '.' + array[1] + '.' + array[0]}</Text>
                <Text style={{color: 'black'}}>Čas: {time[0] + ':' + time[1] + ':' + time[2]}</Text>
            </View>
        )
    } 

    //update rate
    const setRate = (exercise, tmpComment) => {
        console.log(exercise)
        db.collection("cviky").doc("category").collection(route.params.name).doc(exercise).update({comment: tmpComment})
        Alert.alert('Oznam', 'Hodnotenie upravené')
    }

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
        if(sketch == false){
            return (
                <ImageBackground source={require('../static/images/background.jpg')} style={{ flex: 1 }} imageStyle={{ opacity: 0.3 }}>
                <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row',backgroundColor: 'white', height: 60, borderBottomWidth: 1.5, borderColor: '#e6e6e6'}}>
                        <Icon name="arrow-back" color={'black'} size={25} style={{alignSelf: 'center', paddingLeft: 15}} onPress={() => {navigation.navigate('RatingExercise', {name: route.params.name})}}/>
                        <Text style={{alignSelf: 'center', paddingLeft: 35, fontSize: 20, color: 'black', fontWeight: '600'}}>{route.params.name}</Text>
                    </View>
                    <Carousel                  
                        layout={'default'}
                        sliderWidth={screenWidth}
                        itemWidth={Dimensions.get('window').height/2-100}
                        data={images}
                        renderItem={({ item, index }) => (
                            <ScrollView>
                            <View style={{flex: 1}}>
                            <Image key={index} resizeMode='contain' style={{width: Dimensions.get('window').height/2-100, height: Dimensions.get('window').height/2-100}} source={{uri: item['drawImage'] ? item['drawImage'] : item['image']}}
                                onPress={() => {navigation.navigate('SetRateClick', {name: route.params.name, item: item})}}
                            />
                            {getDate(item.name)}
                            <TouchableOpacity style={{width: '90%', alignSelf: 'center', alignItems: 'center', backgroundColor: 'grey', borderRadius: 5}} onPress={() => {setSketch(true), setImageUrl(item['image']), setName(item.name) }} >
                                <Icon name="pencil" size={35} color='black'/>
                            </TouchableOpacity>
                            <Text style={{fontSize: 30, color: 'black'}}>Hodnotenie:</Text>
                            <TextInput placeholder="Zadaj hodnotenie" multiline={true} style={styles.input} 
                                value={comment[index]}
                                onChangeText={(val) => updateComment(comment => ({ ...comment, [index]: val }))}
                            />
                            <Button title={"Odoslať upravené hodnotenie"} containerStyle={{borderRadius: 5}} onPress={() => {setRate(item.name, comment[index])}} />      
                            </View>
                            </ScrollView>
                        )}
                        onSnapToItem={index => onSlide(index)}
                        firstItem={slideIndex}
                        //loop={true}
                    />
                </View>
                {show && <TMenu showing={false} indexing={0}/>}
                </ImageBackground>
            )
        }
        if(sketch == true){
            return (
                <DrawingScreen sketch={setSketch} imageUrl={imageUrl} name={name} exercise={route.params.name} />
            )
        }
    }
}
export default TRateCarouselScreen

const styles = StyleSheet.create({
    image: {
        aspectRatio: 1,
        width: Dimensions.get('window').height/2-100, 
        height: Dimensions.get('window').height/2-100,
        marginHorizontal: 10,
    },
    input: {
        textAlign: 'left',
        textAlignVertical: 'top',
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 10,
        height: Dimensions.get('window').height/2-200,
        marginBottom: 10
    }
})