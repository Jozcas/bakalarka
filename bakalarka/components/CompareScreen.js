/**
 * Author: Jozef Čásar (xcasar)
 * This is component where user can compare image with reference image
 */
import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Image } from "react-native-elements";
import Menu from "../static/menu";
import Carousel from 'react-native-snap-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core'
import { useFocusEffect } from '@react-navigation/native';
import AntIcon from 'react-native-vector-icons/AntDesign'

const CompareScreen = ({route}) => {
    const [slideIndex, setSlideIndex] = useState(route.params.index);
    const [reference, setReference] = useState()

    const navigation = useNavigation()
    const [layout, setLayout] = useState(false)

    //changing layout
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <AntIcon name='layout' size={30} color='black' onPress={() => {setLayout(value => !value)}}/>
            ),
        });
    }, [navigation]);

    useFocusEffect(
        React.useCallback(() => { 
            AsyncStorage.getItem('reference').then((res) => {
                setReference(JSON.parse(res)[route.params.name])
            })
        }, [reference])
    );

    useEffect(
        () => {
            AsyncStorage.getItem('reference').then((res) => {
                setReference(JSON.parse(res)[route.params.name])
            })
        }, [reference]
    );

    const { width: screenWidth } = Dimensions.get('window');

    //used for Carousel
    const onSlide = slideIndex => {
        setSlideIndex(slideIndex);
    };

    //changing reference picture path in AsyncStorage
    /*const referencePicture = async (path) => {
        if (path != reference) {
            AsyncStorage.getItem('reference').then((res) => {
                let ref = JSON.parse(res);
                ref[route.params.name] = path;
                AsyncStorage.setItem('reference', JSON.stringify(ref)).then((tmp) => {
                    setReference(null)
                })
            })
        }
    }*/

    if(layout == false){
        return (
            <ImageBackground source={require('../static/images/background.jpg')} style={{ flex: 1 }} imageStyle={{ opacity: 0.3 }}>
            <View style={{flex: 1}}>
                <Text style={{fontSize: 25, color: 'black', paddingLeft: 10}}>Referenčná fotografia cviku</Text>
                <View style={{position: 'absolute', top: 40, right: 20, width: 30, height: 30, borderRadius: 30/2, borderWidth: 2, justifyContent: 'center', alignSelf: 'center', borderColor: '#3366ff'}}>
                    <Text style={{color: '#3366ff'}}>REF</Text>
                </View>
                <View style={{alignSelf: 'center'}}>
                <Image source={{ uri: "file:///data/user/0/com.bakalarka/files" + reference }} style={styles.image} resizeMode={'contain'}/>
                </View>
                <Text style={{fontSize: 25, color: 'black', paddingLeft: 10}}>Odfotená fotografia cviku</Text>
                <Carousel                  
                    layout={'default'}
                    sliderWidth={screenWidth}
                    itemWidth={Dimensions.get('window').height/2-110}
                    data={JSON.parse(route.params.data)}
                    renderItem={({ item, index }) => (
                        <View>
                            {/*item == reference ? 
                                <TouchableOpacity style={{position: 'absolute', zIndex: 1, marginLeft: 40,  marginTop: 40, width: 30, height: 30, borderRadius: 30/2, borderWidth: 2, justifyContent: 'center', backgroundColor: 'yellow'}}>
                                    <Text style={{color: 'black'}}>REF</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => {referencePicture(item)}} style={{position: 'absolute', zIndex: 1, marginLeft: 40,  marginTop: 40, width: 30, height: 30, borderRadius: 30/2, borderWidth: 2, justifyContent: 'center'}}>
                                    <Text style={{color: 'black'}}>REF</Text>
                                </TouchableOpacity>*/
                            }
                        <Image key={index} resizeMode={'contain'} style={{width: Dimensions.get('window').height/2-110, height: Dimensions.get('window').height/2-110}} source={{uri: "file:///data/user/0/com.bakalarka/files" + item}}
                            onPress={() => { navigation.navigate('CompareClick', { name: route.params.name, image: item}) }}
                        />
                        </View>
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
    if(layout == true){
        return (
            <ImageBackground source={require('../static/images/background.jpg')} style={{ flex: 1 }} imageStyle={{ opacity: 0.3 }}>
            <View style={{flex: 1}}>
                <View style={{position: 'absolute', top: 40, right: 20, width: 30, height: 30, borderRadius: 30/2, borderWidth: 2, justifyContent: 'center', alignSelf: 'center', borderColor: '#3366ff'}}>
                    <Text style={{color: '#3366ff'}}>REF</Text>
                </View>
                <View style={{alignSelf: 'center'}}>
                    <Image source={{ uri: "file:///data/user/0/com.bakalarka/files" + reference }} style={styles.image2} resizeMode={'contain'}/>
                </View>
                <Carousel                  
                    layout={'default'}
                    sliderWidth={screenWidth}
                    itemWidth={Dimensions.get('window').height/2 - 70}
                    data={JSON.parse(route.params.data)}
                    renderItem={({ item, index }) => (
                        <View>
                        <Image key={index} resizeMode={'contain'} style={{width: Dimensions.get('window').height/2-70, height: Dimensions.get('window').height/2-70}} source={{uri: "file:///data/user/0/com.bakalarka/files" + item}}
                            onPress={() => { navigation.navigate('CompareClick', { name: route.params.name, image: item}) }}
                        />
                        </View>
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
}
export default CompareScreen

const styles = StyleSheet.create({
    image: {
        width: Dimensions.get('window').height/2-110, 
        height: Dimensions.get('window').height/2-110,
    },
    image2: {
        width: Dimensions.get('window').height/2-70, 
        height: Dimensions.get('window').height/2-70,
        marginBottom: 6
    }
})