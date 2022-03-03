import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Dimensions, ScrollView } from "react-native";
import Menu from "../static/menu";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card} from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import Dialog from "react-native-dialog";
import Icon from 'react-native-vector-icons/Entypo';
import RNFS from 'react-native-fs';

const HisScreen = () => {
    const [loading, isLoading] = useState(true)
    const [categorie, setCategorie] = useState()
    const [pictures, setPictures] = useState({})
    const [set, isSet] = useState(false)

    const [name, setName] = useState()
    const [oldname, setOldName] = useState()
    const [visible, setVisible] = useState(false)

    const getCategories = () => {
        try {
            AsyncStorage.getItem('categorie').then((res) => {
                console.log(res);
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
        //setVisible(false)
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
    if(loading){
        return (
            <View>
                <Text>Loading</Text>
            </View>
        )
    }
    else{
    return (
        <View style={{flex: 1}}>
            <Dialog.Container visible={visible} onBackdropPress={() => {setVisible(false)}} contentStyle={{borderRadius: 10}}>
                <Dialog.Description children="Zmeň názov kategórie cviku"/>
                <Dialog.Input onChangeText={name => setName(name)} value={name} />
                <Dialog.Button label="Zrušiť" onPress={() => {setVisible(false)}} />
                <Dialog.Button label="Vymazať" onPress={() => {removeCategorie(name)}} />
                <Dialog.Button label="Premenovať" onPress={() => {renameCategorie(name)}} />
            </Dialog.Container>
            <ScrollView style={{flex: 1}}>
                {pictures.map((element) => (    
                    <Card key={element[0]} style={{flex: 1}}>
                        <Card.Title style={{alignSelf: 'flex-start'}}>{element[0]}</Card.Title>
                        <Icon name="dots-three-vertical" size={20} color="black" style={{position: 'absolute', top: 0, right: 0 }} onPress={() => {setOldName(element[0]); setName(element[0]); setVisible(true)}} />
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{flex: 1}}>
                        {
                            element[1] && JSON.parse(element[1]).map((el) => (<Image key={el} source={{uri: "file:///data/user/0/com.bakalarka/files" + el}} style={styles.image}/>))
                        }
                        </ScrollView>
                    </Card>
                ))}
                <View style={{marginTop:90}}></View>
            </ScrollView>
            <Menu showing={true} indexing={0}/>
        </View>
    );
    }
}
export default HisScreen

const styles = StyleSheet.create({
    image: {
        width: Dimensions.get('window').width/3-20, 
        height: ((Dimensions.get('window').width/3-20)/1500)*2000,
        marginHorizontal: 10
    }
})