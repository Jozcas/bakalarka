import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions, Image } from "react-native";
import { useNavigation } from '@react-navigation/core'
import Icon from "react-native-vector-icons/Ionicons"
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Menu from "../static/menu";

const PictureScreen = ({route}) => {
    const [ pictureUri, setPictureUri] = useState(route.params.pictureUri);

    const [slideIndex, setSlideIndex] = useState(0);
    const { width: screenWidth } = Dimensions.get('window');

    const onSlide = slideIndex => {
        setSlideIndex(slideIndex);
    };

    return (
        <View style={styles.container}>
            <View style={{paddingBottom: 130}}>
                <Carousel                  
                    layout={'default'}
                    sliderWidth={screenWidth}
                    itemWidth={screenWidth}
                    data={pictureUri}
                    renderItem={({ item, index }) => (
                        <Image key={index} style={{ width: '100%', height: '100%' }} resizeMode='contain' source={{uri: item.picture}}/>
                    )}
                    onSnapToItem={index => onSlide(index)}
                />
            </View>
            <View style={{position: 'absolute', bottom: 110, alignSelf: 'center'}}>
                <Pagination dotsLength={pictureUri.length} activeDotIndex={slideIndex} dotColor={'#ff9999'} inactiveDotColor='#737270'/>
            </View>                
            <View style={ styles.line}>
                <Icon name="pencil-outline" size={40} color="black" style={{paddingHorizontal: 20}}/>
                <Icon name="mail-outline" size={40} color="black" style={{paddingHorizontal: 20}}/>
                <Icon name="md-arrow-redo-outline" size={40} color="black" style={{paddingHorizontal: 20}}/>
                <Icon name="trash-bin-outline" size={40} color="black" style={{paddingHorizontal: 20}}/>
            </View>
            <Menu/>
        </View>
    );
}
export default PictureScreen

const styles = StyleSheet.create({
    container: {
		flex: 1,
	},
    line: {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        paddingBottom: 90
    }
})