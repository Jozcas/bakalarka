import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"
import Dialog from "react-native-dialog"
import AsyncStorage from '@react-native-async-storage/async-storage';

const CategorieScreen = () => {
    const [visible, setVisible] = useState(false)
    const [categorie, setCategories] = useState()
    const [name, setName] = useState()
    const layout = []
    
    const getCategories = async () => {
        try {
            const categories = JSON.parse(await AsyncStorage.getItem('categorie'));
            setCategories(categories);
            console.log(categories)
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(
        () => {    
            getCategories();
        }, []
    );
    
    const newCategorie = async () => {
        setVisible(false)
        const categorie = JSON.parse(await AsyncStorage.getItem('categorie'))
        console.log(name)
        categorie.push(name)
        setName(null);
        console.log(categorie)
        await AsyncStorage.setItem('categorie', JSON.stringify(categorie))        
    }

    const displayCategorieBox = () => {
        for (let index = 0; index < categorie.length; index++) {
            if(index % 2 == 0){
                layout.push("<View style={{flex: 1, flexDirection: 'row', alignSelf: 'center'}}>")
            }
            layout.push("<TouchableOpacity style={styles.categorieBox}>")
            layout.push("<Text style={styles.name}>" + categorie.index + "</Text>")
            layout.push("</TouchableOpacity>")
            if(index % 2 != 0){
                layout.push("</View>")
            }
            if(index % 2 == 0 && ((index+1) == categorie.length)){
                layout.push("</View>")
            }
            
        }
        return(layout)
    }

    let i = 0;
    return (
        <View style={{flex: 1}}>
            <Dialog.Container visible={visible} onBackdropPress={() => {setVisible(false)}} contentStyle={{borderRadius: 10}}>
                <Dialog.Description children="Zadaj názov kategórie cviku"/>
                <Dialog.Input onChangeText={name => setName(name)} value={name} />
                <Dialog.Button label="Zrušiť" onPress={() => {setVisible(false), setName(null)}} />
                <Dialog.Button label="Pridať" onPress={() => {newCategorie()}} />
            </Dialog.Container>
            <ScrollView>
                <Text style={{fontSize: 30, color: 'black'}}>
                    Kategórie
                </Text>
                <Text style={{fontSize: 20}}>
                    Vyber kam sa má cvik uložiť
                </Text>
                {/*categorie.map((element) => (
                    i % 2 == 0 ? <View style={{flex: 1, flexDirection: 'row', alignSelf: 'center'}}> : null
                    <TouchableOpacity style={styles.categorieBox}>
                        <Text style={styles.name}>{element}</Text>
                    </TouchableOpacity>
                    i % 2 == 1 ? </View> : null
                ))*/}
                {/*categorie.map((element) => (
                    <TouchableOpacity style={styles.categorieBox}>
                        <Text style={styles.name}>{element}</Text>
                    </TouchableOpacity>
                ))}
                {/*<View style={{flex: 1, flexDirection: 'row', alignSelf: 'center'}}>
                    <TouchableOpacity style={styles.categorieBox}>
                        <Text style={styles.name}>Drep</Text>
                    </TouchableOpacity>
                    <View style={styles.categorieBox}>
                        <Text style={styles.name}>Strecha</Text>
                    </View>
                </View>*/}
            </ScrollView>
            <TouchableOpacity style={{flex: 1, position: 'absolute', bottom: 20, right: 20}}>
                <Icon name='add-circle' size={60} color='#ff9999' onPress={() => {setVisible(true)}}/>
            </TouchableOpacity>
        </View>
    )
}
export default CategorieScreen

const styles = StyleSheet.create({
    categorieBox: {
        borderRadius: 10, 
        borderColor: 'black', 
        borderWidth: 2, 
        alignSelf: 'center', 
        width: Dimensions.get('window').width/2 - 60,
        height: Dimensions.get('window').width/2 - 60,
        padding: 10,
        margin: 20
    },
    name: {
        flex: 1,
        textAlignVertical: 'center',
        textAlign: 'center'
    }
})