/**
 * Author: Jozef Čásar (xcasar)
 * This is component that show taken images and user can choose which one will be saved in file system 
 */
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions, Image, Text, TouchableOpacity, Button } from "react-native";
import { useNavigation } from '@react-navigation/core'
import Icon from "react-native-vector-icons/Ionicons"
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Menu from "../static/menu";
import RNFS from 'react-native-fs';

const PictureScreen = ({route}) => {
    const [ pictureUri, setPictureUri] = useState(route.params.pictureUri);
    const [transform, setTransform] = useState(false)

    const [slideIndex, setSlideIndex] = useState(0);
    const { width: screenWidth } = Dimensions.get('window');

    const navigation = useNavigation();

    //used for Carousel and Pagination
    const onSlide = slideIndex => {
        setSlideIndex(slideIndex);
    };

    //save picture to file system
    const saveImage = async (filePath) => {
        console.log(RNFS.DocumentDirectoryPath)
        let newFilePath = null; 
        try {
            //filePath = filePath.replace('file://')
            console.log(filePath.picture);
            //const newFilePath = RNFS.DocumentDirectoryPath + '/MyTes.jpg';
            newFilePath = RNFS.DocumentDirectoryPath + route.params.pname;
            console.log(newFilePath)
            RNFS.moveFile(filePath.picture, newFilePath)
                .then(() => {
                    console.log('IMAGE MOVED', filePath, '-- to --', newFilePath);
                })
                .catch(error => {
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
        }
        navigation.navigate('Category', {
			path: route.params.pname
		})
    };

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 30, color: 'black', paddingLeft: 10}}>
                Krok 1: Fotografie
            </Text>
            <Text style={{color: 'black', paddingLeft: 10}}>Vyber fotografiu, ktorá bude uložená medzi ostatné fotky cvikov</Text>
            <View style={{flex: 1, paddingVertical: 30, alignContent: 'center', justifyContent: 'center'}}>            
                <Carousel                  
                    layout={'default'}
                    sliderWidth={screenWidth}
                    itemWidth={screenWidth}
                    data={pictureUri}
                    renderItem={({ item, index }) => (
                        transform == true ?
                        <Image key={index} style={{ width: '100%', height: '100%', transform: [{scaleX: -1}]}} resizeMode='contain' source={{uri: item.picture}}/>
                        :
                        <Image key={index} style={{alignSelf: 'center', width: screenWidth+100,  height: screenWidth+100}} resizeMode='contain' source={{uri: item.picture}}/>
                    )}
                    onSnapToItem={index => onSlide(index)}
                />
            </View>
            <View style={{position: 'absolute', bottom: 120, alignSelf: 'center'}}>
                <Pagination dotsLength={pictureUri.length} activeDotIndex={slideIndex} dotColor={'#ff9999'} inactiveDotColor='#737270'/>
            </View>               
            <View style={ styles.line} >
                <Button title="Uložiť" onPress={() => {saveImage(pictureUri[slideIndex])}}/> 
            </View>
            <View style={{flex:1, position: 'absolute', bottom: 0, width: '100%'}}>
                <Menu showing={false} indexing={0}/>
            </View>
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
        width: '90%',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        paddingBottom: 90
    },
    buttonSave: {
        borderRadius: 10, 
        borderColor: 'black', 
        borderWidth: 2, 
        alignSelf: 'center', 
        marginHorizontal: 20
    }
})