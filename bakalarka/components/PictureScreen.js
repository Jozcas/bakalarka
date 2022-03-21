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

    //savePicture
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
                {/*<Icon name="pencil-outline" size={40} color="black" style={{paddingHorizontal: 20}}/>
                <Icon name="md-arrow-redo-outline" size={40} color="black" style={{paddingHorizontal: 30}} onPress={() => {setTransform(!transform)}} />}
                <TouchableOpacity style={styles.buttonSave} onPress={() => {saveImage(pictureUri[slideIndex])}}>
                    <Text style={{paddingHorizontal: 40, paddingVertical: 7, color: 'black'}}>Uložiť</Text>
                </TouchableOpacity>
                {/*<Icon name="mail-outline" size={40} color="black" style={{paddingHorizontal: 30}}/>
                <Icon name="trash-bin-outline" size={40} color="black" style={{paddingHorizontal: 20}}/>*/}
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
        //flexDirection: 'row',
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