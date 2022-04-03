/**
 * Author: Jozef Čásar (xcasar)
 * This is component that shows user categories and user can save image to one of the categories or create new
 */
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Button, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"
import Dialog from "react-native-dialog"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Menu from "../static/menu";
import { useNavigation} from '@react-navigation/core'

const CategoryScreen = ({route}) => {
    const [visible, setVisible] = useState(false)
    const [categorie, setCategories] = useState()
    const [name, setName] = useState()

    const navigation = useNavigation()
    
    //get categories from AsyncStorage
    const getCategories = async () => {
        try {
            const categories = JSON.parse(await AsyncStorage.getItem('categorie'));
            setCategories(categories);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(
        () => {    
            getCategories();
        }, []
    );
    
    //set new category to AsyncStorage
    const newCategorie = async () => {
        setVisible(false)
        let category = JSON.parse(await AsyncStorage.getItem('categorie'))
        //console.log('thishihs', category)
        if(category != null){
            const indexOfName = category.indexOf(name)
            if(indexOfName != -1){
                Alert.alert('POZOR!', 'Táto kategória už existuje')
                setName(null);
                return
            }
        }
        let reference = JSON.parse(await AsyncStorage.getItem('reference'))
        if(category == null)
        {
            reference = {};
            category = [];
        }
        reference[name] = route.params.path
        await AsyncStorage.setItem('reference', JSON.stringify(reference))
        console.log(name)
        category.push(name)
        setName(null);
        console.log(category)
        await AsyncStorage.setItem('categorie', JSON.stringify(category))
        console.log(route.params.path)
        var array = [];
        array.push(route.params.path)
        await AsyncStorage.setItem(name, JSON.stringify(array))
        //getCategories();
        Alert.alert('Oznam', 'Fotografia cviku uložená do kategórie ' + name)
        navigation.navigate('HistoryExercise')        
    }

    return (
        categorie == null ? 
        <View style={{flex: 1}}>
            <Dialog.Container visible={visible} onBackdropPress={() => {setVisible(false)}} contentStyle={{borderRadius: 10}}>
                <Dialog.Description children="Zadaj názov kategórie cviku"/>
                <Dialog.Input onChangeText={name => setName(name)} value={name} />
                <Dialog.Button label="Zrušiť" onPress={() => {setVisible(false), setName(null)}} />
                <Dialog.Button label="Pridať" onPress={() => {newCategorie()}} />
            </Dialog.Container>
            <ScrollView>
                <Text style={{fontSize: 30, color: 'black', paddingLeft: 20}}>
                    Krok 2: Kategórie
                </Text>
                <Text style={{color: 'black', paddingLeft: 20}}>
                    Vyber, do ktorej kategórie sa má cvik uložiť
                </Text>
            </ScrollView>
            <TouchableOpacity style={{flex: 1, position: 'absolute', bottom: 20, right: 20}}>
                <Icon name='add-circle' size={60} color='#ff9999' onPress={() => {setVisible(true)}}/>
            </TouchableOpacity>
        </View>
        :
        <View style={{flex: 1}}>
            <Dialog.Container visible={visible} onBackdropPress={() => {setVisible(false)}} contentStyle={{borderRadius: 10}}>
                <Dialog.Description children="Zadaj názov kategórie cviku"/>
                <Dialog.Input onChangeText={name => setName(name)} value={name} />
                <Dialog.Button label="Zrušiť" onPress={() => {setVisible(false), setName(null)}} />
                <Dialog.Button label="Pridať" onPress={() => {newCategorie()}} />
            </Dialog.Container>
            <ScrollView>
                <Text style={{fontSize: 30, color: 'black', paddingLeft: 20}}>
                    Krok 2: Kategórie
                </Text>
                <Text style={{color: 'black', paddingLeft: 20}}>
                    Vyber, do ktorej kategórie sa má cvik uložiť
                </Text>
                <View style={{flex: 1, paddingVertical: 10, alignItems: 'center'}}>
                    {
                        categorie.map((element) => (
                            <View key={element} style={{marginBottom: 8, width: '90%'}}>
                            <Button title={element} 
                                onPress={async () => {
                                    var array = JSON.parse(await AsyncStorage.getItem(element));
                                    //array.push(route.params.path)
                                    array.unshift(route.params.path)
                                    await AsyncStorage.setItem(element , JSON.stringify(array))
                                    Alert.alert('Oznam', 'Fotografia cviku uložená do kategórie ' + element)
                                    navigation.navigate('HistoryExercise')}
                                }
                            />
                            </View>
                        ))
                    }
                </View>
            </ScrollView>
            <TouchableOpacity style={{flex: 1, position: 'absolute', bottom: 80, right: 20}}>
                <Icon name='add-circle' size={60} color='#ff9999' onPress={() => {setVisible(true)}}/>
            </TouchableOpacity>
            <View style={{marginTop:90}}></View>
            <Menu showing={false} indexing={0}/>
        </View>
    )
}
export default CategoryScreen

const styles = StyleSheet.create({
    categorieBox: {
        borderRadius: 10, 
        borderColor: 'black', 
        borderWidth: 2, 
        alignSelf: 'center', 
        width: Dimensions.get('window').width/2 - 60,
        height: Dimensions.get('window').width/2 - 60,
        padding: 10,
        marginVertical: 20,
        marginHorizontal: 30
    },
    name: {
        flex: 1,
        textAlignVertical: 'center',
        textAlign: 'center'
    }
})