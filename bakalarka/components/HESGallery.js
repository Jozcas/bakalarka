import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Alert } from "react-native";
import { Image, CheckBox } from "react-native-elements";
import { useNavigation } from '@react-navigation/core'
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Menu from "../static/menu";
import RNFS from 'react-native-fs';
import { storage, db } from "../firebaseConfig";
import firebase from "firebase";
import { useFocusEffect } from '@react-navigation/native';
import AntIcon from 'react-native-vector-icons/AntDesign'

const HESGallery = ({ route }) => {
    const [data, setData] = useState()
    const [reference, setReference] = useState()
    const [action, setAction] = useState(false)
    const navigation = useNavigation()

    //for remembering number of selected pictures
    const [count, setCount] = useState(0)
    //const [check, setCheck] = useState(new Array(JSON.parse(route.params.data).length).fill(false));
    const [check, setCheck] = useState();
    const [imageUrl, setImageUrl] = useState()
    const [loading, isLoading] = useState(true)

    const [layout, setLayout] = useState(false)

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
                isLoading(false)
            })
            setData(JSON.parse(route.params.data))
            return () => {
                isLoading(true)
            }
        }, [reference])
    );

    useEffect(
        () => {
            AsyncStorage.getItem('reference').then((res) => {
                setReference(JSON.parse(res)[route.params.name])
                isLoading(false)
            })
            setData(JSON.parse(route.params.data))
            return () => {
                isLoading(true)
            }
        }, [reference]
    );

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
                            console.log(count)
                            if(count == 1){
                                Alert.alert('Oznam', 'Fotografia bola odstránená')
                            }
                            if(count > 1){
                                Alert.alert('Oznam', 'Fotografie boli odstránené')
                            }
                        })
                    })
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const sendPictures = async () => {
        try {
            let ids = []
            //get document id for controlling if collection already have this picture of exercise
            await db.collection("cviky").doc('category').collection(route.params.name).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    ids.push('/' + doc.id)
                });
            });

            let insert = false;
            let cat;
            await db.collection("category").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    //ids.push('/' + doc.id)
                    cat = doc.data()['name']
                    insert = true;
                    console.log('datat', doc.data()['name'])
                });
            });
            console.log(ids)

            let pictures = data;
            pictures.map((el, index) => {
                //upload picked images
                if (check[index]) {
                    if(insert){
                        //console.log('cate', cat.indexOf(route.params.name))
                        if(cat.indexOf(route.params.name) == -1){
                            db.collection("category").doc("9iNgWPVq54tw7SFebSfw").update({name: firebase.firestore.FieldValue.arrayUnion(route.params.name)})
                        }
                    }
                    //console.log(el)    
                    //denied duplicity uploading images to database                
                    if(ids.indexOf(el) == -1){
                        uploadImageToStorage(el, el)
                    }
                }

                if (index == (data.length - 1)) {
                    setAction(false)
                    if(count == 1){
                        Alert.alert('Oznam', 'Fotografia bola odoslaná trénerovi')
                    }
                    if(count > 1){
                        Alert.alert('Oznam', 'Fotografie boli odoslané trénerovi')
                    }
                }
            })
            
            //db.collection("cviky").doc('category').collection(route.params.name).get().then(snapshot => console.log(snapshot))
        } catch (error) {
            console.log(error)
        }
    }

    const uploadImageToStorage = async (path, name) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', "file:///data/user/0/com.bakalarka/files"+path, true);
            xhr.send(null);
        });

        let reference = storage.ref().child(name);
        const snapshot = await reference.put(blob);
        const imageurl = await snapshot.ref.getDownloadURL();
        //console.log(imageurl)
        
        db.collection("cviky").doc('category').collection(route.params.name).doc(name).set({
            comment: "",
            image: imageurl,
            name: name,
            state: false,
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
        setImageUrl(imageurl)
        blob.close();
    }

    if(loading){
        return (
            <View>
                <Text>Loading</Text>
            </View>
        )
    }
    else{
    return (
        <ImageBackground source={require('../static/images/background.jpg')} style={{ flex: 1 }} imageStyle={{ opacity: 0.3 }}>
            <View style={{ flex: 1 }}>
                {
                    (action && (data != null)) &&
                    <View style={{ marginTop: 43 }}>
                        <View style={styles.line}>
                            <Icon name="close-outline" size={40} color="black" onPress={() => { setCheck(new Array(data.length).fill(false)); setAction(false) }} />
                            <Text style={{color: 'black', fontSize: 20, textAlignVertical: 'center'}}>{'Vybrané fotky: ' + count}</Text>
                            <Icon name="share-outline" size={40} color="black" onPress={() => {sendPictures()}}/> 
                            <Icon name="trash-bin-outline" size={40} color="black" onPress={() => {deletePictures()}} />                           
                        </View>
                    </View>
                }
                <ScrollView>
                    <View style={styling()}>
                        {(data != null) && data.map((el, index) => {
                            const tmpDate = el.substring(1, el.indexOf('-'))
                            const tmpTime = el.split('-')
                            const time = tmpTime[1].split('_')
                            const array = tmpDate.split("_")
                            return (
                                <View key={el}>
                                    {action && (reference != el) ?
                                        <CheckBox containerStyle={styles.checkbox} checked={check[index]} onPress={() => {setCheck(check => ({ ...check, [index]: !check[index] })); if(check[index] == false){setCount(count+1)} if(check[index] == true){setCount(count-1)}}} />
                                        :
                                        <View style={{zIndex: 1}}>
                                            {reference == el && 
                                                <View style={{position: 'absolute', zIndex: 1, right: 0, marginRight: 15,  marginTop: 5, width: 30, height: 30, borderRadius: 30/2, borderWidth: 2, justifyContent: 'center', borderColor: '#3366ff'}} >
                                                    <Text style={{color: '#3366ff'}}>REF</Text>
                                                </View>
                                            }
                                        </View>
                                    }
                                    {layout ? 
                                        <View>
                                        <Image key={el} source={{ uri: "file:///data/user/0/com.bakalarka/files" + el }} style={styles.image3} 
                                            onPress={() => { navigation.navigate('Compare', { name: route.params.name, data: JSON.stringify(data), picture: el, ref: reference, index: index }) }}
                                            onLongPress={() => { setCheck(new Array(data.length).fill(false)); setCount(0); setAction(true) }}
                                        />
                                        <Text style={{ fontSize: 10, color: 'black', alignSelf: 'center' }}>{array[2] + '.' + array[1] + '.' + array[0] + '    ' + time[0] + ':' + time[1] + ':' + time[2]}</Text>
                                        </View>
                                        :
                                        <View>
                                        <Image key={el} source={{ uri: "file:///data/user/0/com.bakalarka/files" + el }} style={styles.image} 
                                            onPress={() => { navigation.navigate('Compare', { name: route.params.name, data: JSON.stringify(data), picture: el, ref: reference, index: index }) }}
                                            onLongPress={() => { setCheck(new Array(data.length).fill(false)); setCount(0); setAction(true) }}
                                        />
                                        <Text style={{ fontSize: 15, color: 'black', alignSelf: 'center' }}>{array[2] + '.' + array[1] + '.' + array[0] + '    ' + time[0] + ':' + time[1] + ':' + time[2]}</Text>
                                        </View>
                                    }
                                    
                                </View>
                            )
                        })}

                    </View>
                </ScrollView>
                <View style={{ marginTop: 70 }}></View>
                <View style={{ flex: 1, position: 'absolute', bottom: 0, width: '100%' }}>
                    <Menu showing={false} indexing={0} />
                </View>
            </View>
        </ImageBackground>
    );
    }
}
export default HESGallery

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
        backgroundColor: 'grey',
    },
    checkbox: {
        position: 'absolute',
        top: 0,
        zIndex: 1000,
        right: 0
    }
})