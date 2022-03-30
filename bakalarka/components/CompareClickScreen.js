import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, Alert } from "react-native";
import { Image } from "react-native-elements";
import Menu from "../static/menu";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/core'
import { storage, db } from "../firebaseConfig";
import firebase from "firebase";

const CompareClickScreen = ({route}) => {
    const [reference, setReference] = useState()

    const navigation = useNavigation()

    //getting actual reference picture for category
    useEffect(
        () => {
            AsyncStorage.getItem('reference').then((res) => {
                setReference(JSON.parse(res)[route.params.name])
            })
        }, [reference]
    );

    //changing reference picture path in AsyncStorage
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

    const deletePictures = () => {
        try {
            let filePath = RNFS.DocumentDirectoryPath + route.params.image
            RNFS.exists(filePath).then((exist) => {
                if (exist) {
                    RNFS.unlink(filePath)
                }
            })
            AsyncStorage.getItem(route.params.name).then((res) => {
                let arr = JSON.parse(res)
                const index = arr.indexOf(route.params.image)
                arr.splice(index, 1)
                AsyncStorage.setItem(route.params.name, JSON.stringify(arr)).then(() => {
                    Alert.alert('Oznam', 'Fotografia bola odstránená')
                    navigation.navigate('HistoryExercise')
                })
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
                    cat = doc.data()['name']
                    insert = true;
                });
            });

            //upload picked images
            if (insert) {
                if (cat.indexOf(route.params.name) == -1) {
                    db.collection("category").doc("9iNgWPVq54tw7SFebSfw").update({ name: firebase.firestore.FieldValue.arrayUnion(route.params.name) })
                }
            }

            //denied duplicity uploading images to database                
            if (ids.indexOf(route.params.image,) == -1) {
                uploadImageToStorage(route.params.image, route.params.image)
            }            
            Alert.alert('Oznam', 'Fotografia bola odoslaná trénerovi')
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
        console.log(imageurl)
        
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
        blob.close();
    }


    return (
        <ImageBackground source={require('../static/images/background.jpg')} style={{ flex: 1 }} imageStyle={{ opacity: 0.3 }}>
        <View style={{flex: 1}}>
            {(reference != route.params.image) ? 
                <View style={styles.line}>
                    <TouchableOpacity onPress={() => {referencePicture(route.params.image)}} style={{width: 30, height: 30, borderRadius: 30/2, borderWidth: 2, justifyContent: 'center', alignSelf: 'center'}}>
                        <Text style={{color: 'black'}}>REF</Text>
                    </TouchableOpacity>
                    <Icon name="share-outline" size={40} color="black" onPress={() => {sendPictures()}}/> 
                    <Icon name="trash-bin-outline" size={40} color="black" onPress={() => {deletePictures()}} />                           
                </View>
                :
                <Text style={{color: 'black', fontSize: 25, marginBottom: -36}}>REFERENČNÁ FOTOGRAFIA CVIKU</Text>
            }
            <Image resizeMode={'contain'} style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height-120}} source={{uri: "file:///data/user/0/com.bakalarka/files" + route.params.image}}/>
            <Menu showing={false} indexing={0}/>
        </View>
        </ImageBackground>
    )
}
export default CompareClickScreen

const styles = StyleSheet.create({
    line: {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        alignSelf: 'center',
        paddingBottom: 0,
        justifyContent: 'space-around',
        width: '100%',
        backgroundColor: 'grey',
        zIndex: 1
    },
})