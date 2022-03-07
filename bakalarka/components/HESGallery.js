import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Image, CheckBox } from "react-native-elements";
import { useNavigation } from '@react-navigation/core'
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Menu from "../static/menu";
import RNFS from 'react-native-fs';

const HESGallery = ({ route }) => {
    const [data, setData] = useState(JSON.parse(route.params.data))
    const [reference, setReference] = useState()
    const [action, setAction] = useState(false)
    const navigation = useNavigation()

    const [check, setCheck] = useState(new Array(JSON.parse(route.params.data).length).fill(false));

    useEffect(
        () => {
            AsyncStorage.getItem('reference').then((res) => {
                setReference(JSON.parse(res)[route.params.name])
            })
        }, [reference]
    );

    const referencePicture = async (path) => {
        if (path != reference) {
            AsyncStorage.getItem('reference').then((res) => {
                let ref = JSON.parse(res);
                ref[route.params.name] = path;
                AsyncStorage.setItem('reference', JSON.stringify(ref)).then((tmp) => {
                    setReference(null)
                })
            })
        }
    }

    const styling = () => {
        if (data.length != 1) {
            return { flex: 1, flexDirection: 'row', alignSelf: 'center', flexWrap: 'wrap' }
        }
        if (data.length == 1) {
            return { flex: 1, flexDirection: 'row', alignSelf: 'flex-start', flexWrap: 'wrap' }
        }
    }

    /*const deletePictures = async () => {
        try {
            let pictures = data;
            data.map((el, index) => {
                console.log(check)
                if(check[index]){
                    let filePath = RNFS.DocumentDirectoryPath + el
                    RNFS.exists(filePath).then((exist) => {
                        if(exist){
                            RNFS.unlink(filePath).then(async () => {
                                pictures.splice(index, 1)
                                if(index == data.length){
                                    await AsyncStorage.setItem(route.params.name, JSON.stringify(pictures))
                                    AsyncStorage.getItem(route.params.name).then((res) => {
                                        setData(JSON.parse(res))
                                    })
                                }
                                /*if(pictures.length == 0){
                                    AsyncStorage.getItem('categorie').then(async (res) => {
                                        let cat = JSON.parse(res);
                                        cat.splice(cat.indexOf(route.params.name), 1)
                                        console.log('categoria', cat)
                                        if(cat.length != 0){
                                            console.log('som tu')
                                            await AsyncStorage.setItem('categorie', JSON.stringify(cat))
                                        }
                                        if(cat.length == 0){
                                            console.log('je prazdne')
                                            await AsyncStorage.removeItem('categorie')                                            
                                        }
                                        AsyncStorage.removeItem(route.params.name).then(() => {
                                            setData([])
                                            navigation.navigate('HistoryExercise')
                                        })                                        
                                    })
                                }*/
                            /* })
                            }
                        })
                    }
                setAction(false)
                })            
            } catch (error) {
            console.log(error)
        }
    }*/

    const deletePictures = () => {
        try {
            let pictures = data;
            let tmp = []
            pictures.map((el, index) => {
                console.log(index + el)
                if (!check[index]) {
                    tmp.push(el)
                }
                if (check[index]) {
                    let filePath = RNFS.DocumentDirectoryPath + el
                    RNFS.exists(filePath).then((exist) => {
                        if (exist) {
                            RNFS.unlink(filePath)
                        }
                    })
                }
                if (index == (data.length - 1)) {
                    AsyncStorage.setItem(route.params.name, JSON.stringify(tmp)).then(() => {
                        AsyncStorage.getItem(route.params.name).then((res) => {
                            setData(JSON.parse(res))
                            setCheck(new Array(data.length).fill(false))
                            setAction(false)
                        })
                    })
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <ImageBackground source={require('../static/images/background.jpg')} style={{ flex: 1 }} imageStyle={{ opacity: 0.3 }}>
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <View style={styling()}>
                        {data.map((el, index) => {
                            const tmpDate = el.substring(1, el.indexOf('-'))
                            const tmpTime = el.split('-')
                            const time = tmpTime[1].split('_')
                            const array = tmpDate.split("_")
                            return (
                                <View key={el}>
                                    {action && (reference != el) ?
                                        <CheckBox containerStyle={styles.checkbox} checked={check[index]} onPress={() => setCheck(check => ({ ...check, [index]: !check[index] }))} />
                                        :
                                        <TouchableOpacity style={{ position: 'absolute', top: 5, zIndex: 1000, right: 15 }} onPress={() => { referencePicture(el) }}>
                                            {reference != el ? <Icon name="star-outline" size={30} color="yellow" /> : <Icon name="star" size={30} color="yellow" />}
                                        </TouchableOpacity>
                                    }
                                    <Image key={el} source={{ uri: "file:///data/user/0/com.bakalarka/files" + el }} style={styles.image}
                                        onPress={() => { navigation.navigate('Compare', { name: route.params.name, data: JSON.stringify(data), picture: el, ref: reference, index: index }) }}
                                        onLongPress={() => { setCheck(new Array(data.length).fill(false)); setAction(true) }}
                                    />
                                    <Text style={{ fontSize: 20, color: 'black', alignSelf: 'center' }}>{array[2] + '.' + array[1] + '.' + array[0]}</Text>
                                    <Text style={{ fontSize: 15, color: 'black', paddingBottom: 10, alignSelf: 'center' }}>{time[0] + ':' + time[1] + ':' + time[2]}</Text>
                                </View>
                            )
                        })}

                    </View>
                </ScrollView>
                {
                    action &&
                    <View style={{ marginTop: 35 }}>
                        <View style={styles.line}>
                            <Icon name="trash-bin" size={40} color="black" onPress={() => { deletePictures() }} />
                            <Icon name="send" size={40} color="black" />
                            <Icon name="close" size={40} color="black" onPress={() => { setCheck(new Array(data.length).fill(false)); setAction(false) }} />
                        </View>
                    </View>
                }
                <View style={{ marginTop: 65 }}></View>
                <View style={{ flex: 1, position: 'absolute', bottom: 0, width: '100%' }}>
                    <Menu showing={false} indexing={0} />
                </View>
            </View>
        </ImageBackground>
    );
}
export default HESGallery

const styles = StyleSheet.create({
    image: {
        aspectRatio: 1,
        width: Dimensions.get('window').width / 2 - 20,
        height: Dimensions.get('window').width / 2 - 20,
        marginHorizontal: 10
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