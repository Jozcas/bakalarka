import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Dimensions, ScrollView, ImageBackground, Alert } from "react-native";
import Menu from "../static/menu";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card} from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import Dialog from "react-native-dialog";
import Icon from 'react-native-vector-icons/Entypo';
import RNFS from 'react-native-fs';
import { useNavigation} from '@react-navigation/core'

const HisScreen = () => {
    const [loading, isLoading] = useState(true)
    const [categorie, setCategorie] = useState()
    const [pictures, setPictures] = useState({})
    const [set, isSet] = useState(false)

    const [name, setName] = useState()
    const [oldname, setOldName] = useState()
    const [visible, setVisible] = useState(false)

    const [first, setFirst] = useState(false)
    const navigation = useNavigation();
    
    const getCategories = () => {
        try {
            AsyncStorage.getItem('categorie').then((res) => {
                console.log('categorie his', res);
                if(res == null){
                    setFirst(true)
                    return
                }
                else{
                    setFirst(false)
                }
                setCategorie(JSON.parse(res))
                //isLoading(false)
                isSet(true)
            });
        } catch (error) {
            console.log(error);
        }
    }

    const getPath = () => {
        try {
            AsyncStorage.multiGet(categorie, (err, items) => {console.log(items); setPictures(items); isLoading(false)})
        } catch (error) {
            console.log(error);
        }
    }

    useFocusEffect(
        React.useCallback(() => { 
            try {   
                isSet(false)
                //isLoading(false)
                getCategories()
                if(set)
                    getPath()
            }
            catch (err) {
                console.log(err);
            }
        }, [])
    );

    useEffect(
        () => { 
            getCategories()
            if(set)
                getPath()

            return () => {
                console.log('destroy')
                isLoading(true)
            }
        }, [set]
    );

    const renameCategorie = async (newName) => {
        try {
            if(oldname == newName){
                return( setVisible(false))
            }
            const ren = categorie;
            console.log('oldname', oldname)
            ren[ren.indexOf(oldname)] = newName; 
            console.log(ren)
            AsyncStorage.getItem(oldname).then((res) => {
                console.log(res)
                AsyncStorage.setItem(newName, res).then(() => {
                    AsyncStorage.removeItem(oldname).then(() => {
                        AsyncStorage.setItem('categorie', JSON.stringify(ren)).then(() => {
                            console.log('renamed')
                            setVisible(false)
                            isSet(false)
                        })
                    })
                })
            })
        } catch (error) {
            console.log(error);
        }
        
    }

    const removeCategorie = async (catName) => {
        try {
            console.log(catName);
            AsyncStorage.getItem(catName).then((res) => {
                console.log(res);
                const paths = JSON.parse(res)
                let count = 0;
                paths.map((element) => {
                    let filePath = RNFS.DocumentDirectoryPath + element
                    console.log(filePath)
                    RNFS.exists(filePath).then((exist) => {
                        if(exist){
                            // exists call delete
                            console.log('file exist')
                            RNFS.unlink(filePath).then(() => {
                                console.log("File Deleted");
                                count++;
                                if(paths.length == count){
                                    AsyncStorage.removeItem(catName).then(() => {
                                        const rem = categorie;
                                        rem.splice(rem.indexOf(catName), 1)
                                        AsyncStorage.setItem('categorie', JSON.stringify(rem)).then(() => {
                                            console.log('now remove cat and path from async')
                                            setVisible(false)
                                            isSet(false)                                            
                                        })
                                    })
                                }
                            });                        
                        }else{
                            console.log("File Not Available")
                        }
                    });
                                        
                })
            });
        } catch (error) {
            console.log(error);
        }
    }
    if(first){
        return (
            <ImageBackground source={require('../static/images/background.jpg')}  style={{flex:1}} imageStyle={{ opacity: 0.3 }}>
                <View style={{flex: 1}}>
                    <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 40}}>Najskôr si urob foto</Text>
                    </View>
                    <View style={{flex:1, position: 'absolute', bottom: 0, width: '100%'}}>
                        <Menu showing={true} indexing={0}/>
                    </View>
                </View>
            </ImageBackground>
        )
    }
    else{
    if(loading){
        return (
            <View>
                <Text>Loading</Text>
            </View>
        )
    }
    else{
    return (
        <ImageBackground source={require('../static/images/background.jpg')}  style={{flex:1}} imageStyle={{ opacity: 0.3 }}>
        <View style={{flex: 1}}>
            <Dialog.Container visible={visible} onBackdropPress={() => {setVisible(false)}} contentStyle={{borderRadius: 10}}>
                <Dialog.Description children="Zmeň názov kategórie cviku"/>
                <Dialog.Input onChangeText={name => setName(name)} value={name} />
                <Dialog.Button label="Zrušiť" onPress={() => {setVisible(false)}} />
                <Dialog.Button label="Vymazať" onPress={() => {Alert.alert("POZOR!", "Naozaj chceš vymazať celú kategóriu " + name,
                    [
                        {
                            text: "Zrušiť",
                            onPress: () => {setVisible(false)},
                            style: "cancel",
                        },
                        {
                            text: "Vymazať",
                            onPress: () => {removeCategorie(name)},
                            style: "default",
                        },
                    ],
                    {
                        cancelable: true,
                        //onDismiss: () => {setVisible(false)}
                    }
                )}} />
                <Dialog.Button label="Premenovať" onPress={() => {renameCategorie(name)}} />
            </Dialog.Container>
            <ScrollView style={{flex: 1}}>
                {pictures.map((element) => (    
                    <Card key={element[0]} style={{flex: 1}}>
                        <Card.Title style={{alignSelf: 'flex-start'}}>{element[0]}</Card.Title>
                        <Icon name="dots-three-vertical" size={20} color="black" style={{position: 'absolute', top: 0, right: 0 }} onPress={() => {setOldName(element[0]); setName(element[0]); setVisible(true)}} />
                        
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{flex: 1}}>
                        {
                            element[1] && JSON.parse(element[1]).map((el) => (
                                <TouchableOpacity key={el} onPress={() => {navigation.navigate('HESGallery', {name: element[0], data: element[1]})}}>
                                    <Image key={el} source={{uri: "file:///data/user/0/com.bakalarka/files" + el}} style={styles.image} resizeMode={'contain'}/>
                                </TouchableOpacity>        
                            ))
                        }
                        </ScrollView>
                        
                    </Card>
                ))}
                <View style={{marginTop:90}}></View>
            </ScrollView>
            <Menu showing={true} indexing={0}/>
        </View>
        </ImageBackground>
    );
    }
    }
}
export default HisScreen

const styles = StyleSheet.create({
    image: {
        //aspectRatio: 1,
        //width: 150,
        height: Dimensions.get('window').width/3-10,
        width: Dimensions.get('window').width/3-10, 
        //height: ((Dimensions.get('window').width/3-20)/1500)*2000,
        //marginHorizontal: 5
    }
})