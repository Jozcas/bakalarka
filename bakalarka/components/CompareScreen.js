import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet, Dimensions } from "react-native";
import { Image } from "react-native-elements";
import Menu from "../static/menu";
import Carousel from 'react-native-snap-carousel';

const CompareScreen = ({route}) => {
    const [slideIndex, setSlideIndex] = useState(route.params.index);

    const { width: screenWidth } = Dimensions.get('window');

    //used for Carousel
    const onSlide = slideIndex => {
        setSlideIndex(slideIndex);
    };

    return (
        <ImageBackground source={require('../static/images/background.jpg')} style={{ flex: 1 }} imageStyle={{ opacity: 0.3 }}>
        <View style={{flex: 1}}>
            <Text style={{fontSize: 25, color: 'black', paddingLeft: 10}}>Referenčná fotografia cviku</Text>
            <View style={{alignSelf: 'center'}}>
            <Image source={{ uri: "file:///data/user/0/com.bakalarka/files" + route.params.ref }} style={styles.image}/>
            </View>
            <Text style={{fontSize: 25, color: 'black', paddingLeft: 10}}>Odfotená fotografia cviku</Text>
            <Carousel                  
                layout={'default'}
                sliderWidth={screenWidth}
                itemWidth={Dimensions.get('window').height/2-100}
                data={JSON.parse(route.params.data)}
                renderItem={({ item, index }) => (
                    <Image key={index} style={{width: Dimensions.get('window').height/2-100, height: Dimensions.get('window').height/2-100}} source={{uri: "file:///data/user/0/com.bakalarka/files" + item}}/>
                )}
                onSnapToItem={index => onSlide(index)}
                firstItem={route.params.index}
                loop={true}
            />
        </View>
        <Menu showing={false} indexing={0}/>
        </ImageBackground>
    )
}
export default CompareScreen

const styles = StyleSheet.create({
    image: {
        aspectRatio: 1,
        width: Dimensions.get('window').height/2-100, 
        height: Dimensions.get('window').height/2-100,
        marginHorizontal: 10,
    }
})