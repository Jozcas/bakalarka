/**
 * Author: Jozef Čásar (xcasar)
 * This is component that shows rated images from selected category 
 */

import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, ImageBackground, StyleSheet, Dimensions } from "react-native";
import { db, storage } from "../firebaseConfig";
import { Image, CheckBox } from "react-native-elements";
import TMenu from "../static/Tmenu";
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/core'
import AntIcon from 'react-native-vector-icons/AntDesign'

const RatingExerciseGallery = ({route}) => {
    const [images, setImages] = useState()
    const [loading, isLoading] = useState(true)
    const [action, setAction] = useState(false)
    const [check, setCheck] = useState();
    const [layout, setLayout] = useState(false)

    const navigation = useNavigation()

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <AntIcon name='layout' size={30} color='black' onPress={() => {setLayout(value => !value)}}/>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                db.collection("cviky").doc("category").collection(route.params.name).onSnapshot((querySnapshot) => {
                    let arr = []
                    querySnapshot.forEach((doc) => {
                        if(doc.data().state == true){
                            arr.push(doc.data())
                        }
                    });
                    setImages(arr)
                    isLoading(false)
                })
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);
    
    const styling = () => {
        if (images.length != 1) {
            return { flex: 1, flexDirection: 'row', alignSelf: 'center', flexWrap: 'wrap' }
        }
        if (images.length == 1) {
            return { flex: 1, flexDirection: 'row', alignSelf: 'flex-start', flexWrap: 'wrap' }
        }
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
        return (
            <ImageBackground source={require('../static/images/background.jpg')} style={{ flex: 1 }} imageStyle={{ opacity: 0.3 }}>
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <View style={styling()}>
                        {images.map((el, index) => {
                            const tmpDate = el.name.substring(1, el.name.indexOf('-'))
                            const tmpTime = el.name.split('-')
                            const time = tmpTime[1].split('_')
                            const array = tmpDate.split("_")
                            return (
                                <View key={el.name}>
                                    {//action &&
                                        //<CheckBox containerStyle={styles.checkbox} checked={check[index]} onPress={() => setCheck(check => ({ ...check, [index]: !check[index] }))} />
                                    }
                                    {layout ?
                                        <View>
                                            <Image key={el.name} source={{ uri: el['drawImage'] ? el['drawImage'] : el['image'] }} style={styles.image3}
                                                onPress={() => { navigation.navigate('TRateCarousel', { name: route.params.name, data: JSON.stringify(images), index: index }) }}
                                                /*onLongPress={() => { setCheck(new Array(images.length).fill(false)); setAction(true) }}*/
                                            />
                                            <Text style={{ fontSize: 10, color: 'black', alignSelf: 'center' }}>{array[2] + '.' + array[1] + '.' + array[0] + '    ' + time[0] + ':' + time[1] + ':' + time[2]}</Text>
                                        </View>
                                        :
                                        <View>
                                            <Image key={el.name} source={{ uri: el['drawImage'] ? el['drawImage'] : el['image'] }} style={styles.image}
                                                onPress={() => { navigation.navigate('TRateCarousel', { name: route.params.name, data: JSON.stringify(images), index: index }) }}
                                                /*onLongPress={() => { setCheck(new Array(images.length).fill(false)); setAction(true) }}*/
                                            />
                                            <Text style={{ fontSize: 15, color: 'black', alignSelf: 'center' }}>{array[2] + '.' + array[1] + '.' + array[0] + '    ' + time[0] + ':' + time[1] + ':' + time[2]}</Text>
                                        </View>
                                    }
                                    
                                </View>
                            )
                        })}

                    </View>
                </ScrollView>
                {
                    /*action &&
                    <View style={{ marginTop: 35 }}>
                        <View style={styles.line}>
                            <Icon name="trash-bin" size={40} color="black" onPress={() => {deletePictures()}} />
                            <Icon name="close" size={40} color="black" onPress={() => { setCheck(new Array(images.length).fill(false)); setAction(false) }} />
                        </View>
                    </View>*/
                }
                <TMenu showing={false} indexing={1}/>
            </View>
            </ImageBackground>
        )
    }

}
export default RatingExerciseGallery

const styles = StyleSheet.create({
    image: {
        width: Dimensions.get('window').width / 2 - 20,
        height: Dimensions.get('window').width / 2 - 20,
        marginHorizontal: 10
    },
    image3: {
        width: Dimensions.get('window').width / 3 - 4,
        height: Dimensions.get('window').width / 3 - 4,
        marginHorizontal: 2
    },
    line: {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        paddingBottom: 0,
        justifyContent: 'space-around',
        width: '100%',
        backgroundColor: 'white',
    },
    checkbox: {
        position: 'absolute',
        top: 0,
        zIndex: 1000,
        right: 0
    }
})