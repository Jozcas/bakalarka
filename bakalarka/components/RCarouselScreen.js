import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet, Dimensions } from "react-native";
import { Image } from "react-native-elements";
import Menu from "../static/menu";
import Carousel from 'react-native-snap-carousel';
import { useNavigation } from '@react-navigation/core'
import Icon from 'react-native-vector-icons/Ionicons';

const RCarouselScreen = ({route}) => {
    const [slideIndex, setSlideIndex] = useState(route.params.index);

    const { width: screenWidth } = Dimensions.get('window');

    const navigation = useNavigation()

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
                    <View>
                        {(item.state == true) && <Icon name='trophy-outline' size={20} style={{position: 'absolute', top: 5, right: 20, zIndex: 1}}/>}
                        <Image key={index} resizeMode={'contain'} style={{width: Dimensions.get('window').height/2-100, height: Dimensions.get('window').height/2-40}} source={{uri: (item.state == true && item['drawImage']) ? item['drawImage'] : item['image']}}
                            onPress={() => {navigation.navigate('RCarouselClick', { name: route.params.name, item: item})}}
                        />
                        {getDate(item.name)}
                        <Text style={{fontSize: 30, color: 'black'}}>Hodnotenie:</Text>
                        {item.state == false ? <Text style={{color: 'black'}}>Hodnotenie zatiaľ nebolo zadané</Text> : <Text style={{color: 'black'}}>{item.comment}</Text>}
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