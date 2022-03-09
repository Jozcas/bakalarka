import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet, Dimensions } from "react-native";
import { Image } from "react-native-elements";
import Menu from "../static/menu";
import Carousel from 'react-native-snap-carousel';

const RCarouselScreen = ({route}) => {
    const [slideIndex, setSlideIndex] = useState(route.params.index);

    const { width: screenWidth } = Dimensions.get('window');

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
                <Text>Dátum: {array[2] + '.' + array[1] + '.' + array[0]}</Text>
                <Text>Čas: {time[0] + ':' + time[1] + ':' + time[2]}</Text>
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
                    <View>
                    <Image key={index} style={{width: Dimensions.get('window').height/2-100, height: Dimensions.get('window').height/2-100}} source={{uri: "file:///data/user/0/com.bakalarka/files" + item.name}}/>
                    {getDate(item.name)}
                    <Text style={{fontSize: 30}}>Hodnotenie:</Text>
                    {item.comment == "" ? <Text>Hodnotenie zatiaľ nebolo zadané</Text> : <Text>{item.comment}</Text>}
                    </View>
                )}
                onSnapToItem={index => onSlide(index)}
                firstItem={route.params.index}
                //loop={true}
            />
        </View>
        <Menu showing={false} indexing={0}/>
        </ImageBackground>
    )
}
export default RCarouselScreen

const styles = StyleSheet.create({
    image: {
        aspectRatio: 1,
        width: Dimensions.get('window').height/2-100, 
        height: Dimensions.get('window').height/2-100,
        marginHorizontal: 10,
    }
})