import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Dimensions, ScrollView } from "react-native";
import Menu from "../static/menu";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card} from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';

const HisScreen = () => {
    const [loading, isLoading] = useState(true)
    const [categorie, setCategorie] = useState()
    const [pictures, setPictures] = useState({})
    const [set, isSet] = useState(false)

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
        }, [set]
    );

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
            <ScrollView style={{flex: 1}}>
                {pictures.map((element) => (    
                    <Card key={element[0]} style={{flex: 1}}>
                        <Card.Title style={{alignSelf: 'flex-start'}}>{element[0]}</Card.Title>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{flex: 1}}>
                        {
                            element[1] && JSON.parse(element[1]).map((el) => (<Image key={el} source={{uri: "file:///data/user/0/com.bakalarka/files" + el}} style={styles.image}/>))
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
}
export default HisScreen

const styles = StyleSheet.create({
    image: {
        width: Dimensions.get('window').width/3-20, 
        height: ((Dimensions.get('window').width/3-20)/1500)*2000,
        marginHorizontal: 10
    }
})