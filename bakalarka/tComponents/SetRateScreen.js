import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet, Dimensions, TextInput, ScrollView, Keyboard } from "react-native";
import { Image } from "react-native-elements";
import TMenu from "../static/Tmenu";
import Carousel from 'react-native-snap-carousel';

const SetRateScreen = ({route}) => {
    const [slideIndex, setSlideIndex] = useState(route.params.index);
    const [show, setShow] = useState(true)

    const { width: screenWidth } = Dimensions.get('window');

    useEffect(() => {
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
    return (
        <ImageBackground source={require('../static/images/background.jpg')} style={{ flex: 1 }} imageStyle={{ opacity: 0.3 }}>
        <View style={{flex: 1}}>
            <Carousel                  
                layout={'default'}
                sliderWidth={screenWidth}
                itemWidth={Dimensions.get('window').height/2-100}
                data={JSON.parse(route.params.data)}
                renderItem={({ item, index }) => (
                    <ScrollView>
                    <View style={{flex: 1}}>
                    <Image key={index} /*resizeMode='contain'*/ style={{width: Dimensions.get('window').height/2-100, height: Dimensions.get('window').height/2-100}} source={{uri: "file:///data/user/0/com.bakalarka/files" + item.name}}/>
                    {getDate(item.name)}
                    <Text style={{fontSize: 30, color: 'black'}}>Hodnotenie:</Text>
                    <TextInput multiline={true} style={{textAlign: 'left', textAlignVertical: 'top' ,backgroundColor: 'white', borderColor: 'grey', borderWidth: 1,  borderRadius: 10, height: Dimensions.get('window').height/2-150}}/>                    
                    </View>
                    </ScrollView>
                )}
                onSnapToItem={index => onSlide(index)}
                firstItem={route.params.index}
                //loop={true}
            />
        </View>
        {show && <TMenu showing={false} indexing={0}/>}
        </ImageBackground>
    )
}
export default SetRateScreen

const styles = StyleSheet.create({
    image: {
        aspectRatio: 1,
        width: Dimensions.get('window').height/2-100, 
        height: Dimensions.get('window').height/2-100,
        marginHorizontal: 10,
    }
})