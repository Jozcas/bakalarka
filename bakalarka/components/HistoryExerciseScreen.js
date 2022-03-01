import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Dimensions, ScrollView } from "react-native";
import Menu from "../static/menu";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Entypo';
import { useFocusEffect } from '@react-navigation/native';
import Dialog from "react-native-dialog"

const HistoryExerciseScreen = () => {
    //const [image, setImage] = useState([])
    const [categorie, setCategorie] = useState()
    const [pictures, setPictures] = useState({})
    const [loading, isLoading] = useState(true)
    const [name, setName] = useState()
    const [oldname, setOldName] = useState()
    const [visible, setVisible] = useState(false)

    const getWidth = () => {
        Image.getSize("file:///data/user/0/com.bakalarka/files/MyTes.jpg", (width, height) => {console.log(width + "a" + height)})
    }

    let tempPic = {}
    console.log('useEffect', pictures)
    console.log('temp', tempPic)

    useFocusEffect(
        React.useCallback(async () => { 
            try {   
                const categories = await JSON.parse(await AsyncStorage.getItem('categorie'));
                setCategorie(categories);
                await categories.map(async element => {
                    const cat = await JSON.parse(await AsyncStorage.getItem(element));
                    console.log('cat', cat)
                    //console.log(element)
                    tempPic[element] = cat;
                                    
                });
                setPictures(tempPic)
                isLoading(false)
            }
            catch (err) {
                console.log(err);
            }
        }, [])
    );

    useEffect(
        async () => { 
            try {   
                const categories = await JSON.parse(await AsyncStorage.getItem('categorie'));
                setCategorie(categories);
                await categories.map(async element => {
                    const cat = await JSON.parse(await AsyncStorage.getItem(element));
                    console.log('cat', cat)
                    //console.log(element)
                    tempPic[element] = cat;
                                    
                });
                setPictures(tempPic)
                isLoading(false)
            }
            catch (err) {
                console.log(err);
            }
        }, []
    );

    const getName = () => {
        try {
            AsyncStorage.getItem('categorie').then((res) => {
                //console.log(res);
                setCategorie(JSON.parse(res))
            });
        } catch (error) {
            console.log(error);
        }
    }

    const renameCategorie = async () => {
        setVisible(false)
        let category = JSON.parse(await AsyncStorage.getItem('categorie'))
        console.log(category)        
    }

    if(loading){
        return (
            <View>
                <Text>Loading</Text>
                <View>{getName()}</View>
            </View>
        )
    }
    else{
        //getName()
        console.log('return', pictures)
    return (
        <View style={{flex: 1}}>
            <Dialog.Container visible={visible} onBackdropPress={() => {setVisible(false)}} contentStyle={{borderRadius: 10}}>
                <Dialog.Description children="Zmeň názov kategórie cviku"/>
                <Dialog.Input onChangeText={name => setName(name)} value={name} />
                <Dialog.Button label="Zrušiť" onPress={() => {setVisible(false)}} />
                <Dialog.Button label="Premenovať" onPress={() => {renameCategorie()}} />
            </Dialog.Container>
            <ScrollView style={{flex: 1}}>
                {categorie.map((element) => (
                    <Card key={element} style={{flex: 1}}>
                        <Card.Title style={{alignSelf: 'flex-start'}}>{element}</Card.Title>
                        <Icon name="dots-three-vertical" size={20} color="black" style={{position: 'absolute', top: 0, right: 0 }} onPress={() => {setOldName(element); setName(element); setVisible(true)}} />
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{flex: 1}}>
                        {
                            pictures[element] && pictures[element].map((el) => (<Image key={el} source={{uri: "file:///data/user/0/com.bakalarka/files" + el}} style={styles.image}/>))
                        }
                        </ScrollView>
                    </Card>
                ))}
                
                            
                <View style={{marginTop:90}}></View>
            </ScrollView>
            <Menu/>
        </View>
    );
    }
};
export default HistoryExerciseScreen

const styles = StyleSheet.create({
    image: {
        width: Dimensions.get('window').width/3-20, 
        height: ((Dimensions.get('window').width/3-20)/1500)*2000,
        marginHorizontal: 10
    }
})