import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
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

    const generateColor = () => {
        const randomColor = Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, '0');
        return `#${randomColor}`;
    };
    
    const newCategorie = async () => {
        setVisible(false)
        let category = JSON.parse(await AsyncStorage.getItem('categorie'))
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
                    Kategórie
                </Text>
                <Text style={{fontSize: 20, paddingLeft: 20}}>
                    Vyber kam sa má cvik uložiť
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
                    Kategórie
                </Text>
                <Text style={{fontSize: 20, paddingLeft: 20}}>
                    Vyber kam sa má cvik uložiť
                </Text>
                <View style={{flex: 1, flexDirection: 'row', alignSelf: 'center', flexWrap: 'wrap'}}>
                    {
                        categorie.map((element) => (
                            <TouchableOpacity style={[styles.categorieBox, {backgroundColor: generateColor()}]} key={element} 
                                onPress={async () => {
                                    var array = JSON.parse(await AsyncStorage.getItem(element));
                                    //array.push(route.params.path)
                                    array.unshift(route.params.path)
                                    await AsyncStorage.setItem(element , JSON.stringify(array))
                                    navigation.navigate('HistoryExercise')}
                                }
                            >
                                <Text style={styles.name}>{element}</Text>
                            </TouchableOpacity>
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