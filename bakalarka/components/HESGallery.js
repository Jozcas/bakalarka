import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Image  } from "react-native-elements";
import { useNavigation} from '@react-navigation/core'
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HESGallery = ({route}) => {
    let date = null;
    const [reference, setReference] = useState()
    const navigation = useNavigation()

    useEffect(
        () => { 
            AsyncStorage.getItem('reference').then((res) => {
                setReference(JSON.parse(res)[route.params.name])
            })
        }, [reference]
    );

    const referencePicture = async (path) => {
        if(path != reference){
            AsyncStorage.getItem('reference').then((res) => {
                let ref = JSON.parse(res);
                ref[route.params.name] = path;
                AsyncStorage.setItem('reference', JSON.stringify(ref)).then((tmp) => {
                    setReference(null)
                })
            })
        }        
    }

    if (JSON.parse(route.params.data).length != 1) {
        return (
            <ImageBackground source={require('../static/images/background.jpg')} style={{ flex: 1 }} imageStyle={{ opacity: 0.3 }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <ScrollView>
                        <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center', flexWrap: 'wrap' }}>
                            {JSON.parse(route.params.data).map((el, index) => {
                                const tmpDate = el.substring(1, el.indexOf('-'))
                                const tmpTime = el.split('-')
                                const time = tmpTime[1].split('_')
                                const array = tmpDate.split("_")
                                if (date != tmpDate) {
                                    date = tmpDate
                                    return (
                                        <View key={el}>
                                            <TouchableOpacity style={{position: 'absolute', top: 5, zIndex: 1000, right: 15}} onPress={() => {referencePicture(el)}}>
                                                {reference != el ? <Icon name="star-outline" size={30} color="yellow" /> : <Icon name="star" size={30} color="yellow" />}
                                            </TouchableOpacity>
                                            <Image key={el} source={{ uri: "file:///data/user/0/com.bakalarka/files" + el }} style={styles.image} onPress={() => {navigation.navigate('Compare', {name: route.params.name, data: route.params.data, picture: el, ref: reference, index: index})}}/>
                                            <Text style={{ fontSize: 20, color: 'black', alignSelf: 'center' }}>{array[2] + '.' + array[1] + '.' + array[0]}</Text>
                                            <Text style={{ fontSize: 15, color: 'black', paddingBottom: 10, alignSelf: 'center' }}>{time[0] + ':' + time[1] + ':' + time[2]}</Text>
                                        </View>

                                    )
                                }
                                else {
                                    return (
                                        <View key={el}>
                                            <TouchableOpacity style={{position: 'absolute', top: 5, zIndex: 1000, right: 15}} onPress={() => {referencePicture(el)}}>
                                                {reference != el ? <Icon name="star-outline" size={30} color="yellow" /> : <Icon name="star" size={30} color="yellow" />}
                                            </TouchableOpacity>
                                            <Image key={el} source={{ uri: "file:///data/user/0/com.bakalarka/files" + el }} style={styles.image} onPress={() => {navigation.navigate('Compare', {name: route.params.name, data: route.params.data, picture: el, ref: reference, index: index})}}/>
                                            <Text style={{ fontSize: 20, color: 'black', alignSelf: 'center' }}>{array[2] + '.' + array[1] + '.' + array[0]}</Text>
                                            <Text style={{ fontSize: 15, color: 'black', paddingBottom: 10, alignSelf: 'center' }}>{time[0] + ':' + time[1] + ':' + time[2]}</Text>
                                        </View>

                                    )
                                }
                            })}

                        </View>
                    </ScrollView>
                </View>
            </ImageBackground>
        );
    }
    else if (JSON.parse(route.params.data).length == 1) {
        return (
            <ImageBackground source={require('../static/images/background.jpg')} style={{ flex: 1 }} imageStyle={{ opacity: 0.3 }}>
                <View style={{ flex: 1 }}>
                    <ScrollView>
                        <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-start', flexWrap: 'wrap' }}>
                            {JSON.parse(route.params.data).map((el, index) => {
                                const tmpDate = el.substring(1, el.indexOf('-'))
                                const tmpTime = el.split('-')
                                const time = tmpTime[1].split('_')
                                const array = tmpDate.split("_")                                
                                return (
                                    <View key={el}>
                                        <TouchableOpacity style={{position: 'absolute', top: 5, zIndex: 1000, right: 15}} onPress={() => {referencePicture(el)}}>
                                            {reference != el ? <Icon name="star-outline" size={30} color="yellow" /> : <Icon name="star" size={30} color="yellow" />}
                                        </TouchableOpacity>
                                        <Image key={el} source={{ uri: "file:///data/user/0/com.bakalarka/files" + el }} style={styles.image} onPress={() => {navigation.navigate('Compare', {name: route.params.name, data: route.params.data, picture: el, ref: reference, index: index})}}/>
                                        <Text style={{ fontSize: 20, color: 'black', alignSelf: 'center' }}>{array[2] + '.' + array[1] + '.' + array[0]}</Text>
                                        <Text style={{ fontSize: 15, color: 'black', paddingBottom: 10, alignSelf: 'center' }}>{time[0] + ':' + time[1] + ':' + time[2]}</Text>
                                    </View>
                                )
                            })}

                        </View>
                    </ScrollView>
                </View>
            </ImageBackground>
        );
    }
}
export default HESGallery

const styles = StyleSheet.create({
    image: {
        aspectRatio: 1,
        width: Dimensions.get('window').width/2-20, 
        height: Dimensions.get('window').width/2-20,
        marginHorizontal: 10
    }
})