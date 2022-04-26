/**
 * Author: Jozef Čásar (xcasar)
 * This is component that display images in selected category and user can see which images are rated and can delete images from firebase
 */
import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, ImageBackground, StyleSheet, Dimensions, Alert } from "react-native";
import { db, storage } from "../firebaseConfig";
import { Image, CheckBox } from "react-native-elements";
import Menu from "../static/menu";
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/core'
import firebase from "firebase";
import AntIcon from 'react-native-vector-icons/AntDesign'

const RGallery = ({route}) => {
    const [images, setImages] = useState()
    const [loading, isLoading] = useState(true)
    const [action, setAction] = useState(false)
    const [check, setCheck] = useState();
    //for remembering number of selected pictures
    const [count, setCount] = useState(0)

    const [layout, setLayout] = useState(false)

    const navigation = useNavigation()

    let unsubscribe;

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
                unsubscribe = db.collection("cviky").doc("category").collection(route.params.name).onSnapshot((querySnapshot) => {
                    let arr = []
                    querySnapshot.forEach((doc) => {
                        arr.unshift(doc.data())
                    });
                    setImages(arr)
                    isLoading(false)
                })
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
        /*if(images != null){
            isLoading(false)
        }*/
        return () => {
            unsubscribe()
        }

    }, []);
    
    const styling = () => {
        if (images.length != 1) {
            return { flex: 1, flexDirection: 'row', alignSelf: 'center', flexWrap: 'wrap' }
        }
        if (images.length == 1) {
            return { flex: 1, flexDirection: 'row', alignSelf: 'flex-start', flexWrap: 'wrap' }
        }
    }

    //delete images from firebase
    const deletePictures = () => {
        try {
            let pictures = images;
            let tmp = []
            let delCat = true 
            pictures.map((el, index) => {
                if(check[index]){
                    //console.log(index + el.name)
                    if(el.drawImage != null){
                        let draw = el.name.substring(0, el.name.indexOf('.'))
                        draw = draw + 'd.jpg'
                        storage.ref().child(draw).delete().then(() => {
                            console.log('drawImage deleted')
                        }).catch((error) => {
                            console.log('Error while deleting drawImage', error)
                        })
                    }
                    storage.ref().child(el.name).delete().then(() => {
                        console.log('Image deleted successfully')
                        db.collection("cviky").doc('category').collection(route.params.name).doc(el.name).delete()
                    }).catch((error) => {
                        console.log('Error while deleting image', error)
                    });
                }
                if (!check[index]) {
                    delCat = false
                }
                if (index == (images.length - 1)) {
                    if(delCat){
                        console.log('zmaz category')
                        db.collection("category").doc("9iNgWPVq54tw7SFebSfw").update({name: firebase.firestore.FieldValue.arrayRemove(route.params.name)})
                        Alert.alert('Oznam', 'Kategória bola odstránená')
                        navigation.navigate('RatingGallery')
                    }
                    else {
                        setAction(false)
                        if(count == 1){
                            Alert.alert('Oznam', 'Fotografia bola odstránená')
                        }
                        if(count > 1){
                            Alert.alert('Oznam', 'Fotografie boli odstránené')
                        }
                    }
                }
            })
        } catch (error) {
            console.log(error)
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
                {
                    action &&
                    <View style={{ marginTop: 45 }}>
                        <View style={styles.line}>
                            <Icon name="close" size={40} color="black" onPress={() => { setCheck(new Array(images.length).fill(false)); setAction(false) }} />
                            <Text style={{color: 'black', fontSize: 20, textAlignVertical: 'center'}}>{'Vybrané fotky: ' + count}</Text>
                            <Icon name="trash-bin" size={40} color="black" onPress={() => {deletePictures()}} />
                        </View>
                    </View>
                }
                <ScrollView>
                    <View style={styling()}>
                        {(images.length != 0) && images.map((el, index) => {
                            const tmpDate = el.name.substring(1, el.name.indexOf('-'))
                            const tmpTime = el.name.split('-')
                            const time = tmpTime[1].split('_')
                            const array = tmpDate.split("_")
                            return (
                                <View key={el.name}>
                                    {action &&
                                        <CheckBox containerStyle={styles.checkbox} checked={check[index]} onPress={() => {setCheck(check => ({ ...check, [index]: !check[index] })); if(check[index] == false){setCount(count+1)} if(check[index] == true){setCount(count-1)}}} />
                                    }
                                    {((action == false) && (el.state == true)) && <Icon name='trophy-outline' size={20} color='#a6a6a6' style={{position: 'absolute', top: 5, right: 15, zIndex: 1}}/>}
                                    { layout ?
                                        <View>
                                            <Image key={el.name} source={{ uri: (el['drawImage'] && el.state == true) ? el['drawImage'] : el['image'] }} style={styles.image3} /*resizeMode={'contain'}*/
                                                onPress={() => { navigation.navigate('RCarousel', { name: route.params.name, data: JSON.stringify(images), index: index }) }}
                                                onLongPress={() => { setCheck(new Array(images.length).fill(false)); setCount(0); setAction(true) }}
                                            />
                                            <Text style={{ fontSize: 10, color: 'black', alignSelf: 'center' }}>{array[2] + '.' + array[1] + '.' + array[0] + '    ' + time[0] + ':' + time[1] + ':' + time[2]}</Text>
                                        </View>
                                        :
                                        <View>
                                            <Image key={el.name} source={{ uri: (el['drawImage'] && el.state == true) ? el['drawImage'] : el['image'] }} style={styles.image} /*resizeMode={'contain'}*/
                                                onPress={() => { navigation.navigate('RCarousel', { name: route.params.name, data: JSON.stringify(images), index: index }) }}
                                                onLongPress={() => { setCheck(new Array(images.length).fill(false)); setCount(0); setAction(true) }}
                                            />
                                            <Text style={{ fontSize: 15, color: 'black', alignSelf: 'center' }}>{array[2] + '.' + array[1] + '.' + array[0] + '    ' + time[0] + ':' + time[1] + ':' + time[2]}</Text>
                                        </View>
                                    }
                                </View>
                            )
                        })}

                    </View>
                </ScrollView>
                <Menu showing={false} indexing={2}/>
            </View>
            </ImageBackground>
        )
    }

}
export default RGallery

const styles = StyleSheet.create({
    image: {
        //aspectRatio: 1,
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