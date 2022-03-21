import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/core'
import {Tab, ThemeProvider} from 'react-native-elements'


const TMenu = ({showing, indexing}) => {
    const [index, setIndex] = useState(indexing);
    const [show, setShow] = useState(showing);
    const navigation = useNavigation()

    //changing backgroun color
    const theme = {
        colors: {
          primary: '#ff9999',
        },
    };    

    //show indicator
    if(show){
        return (
            <View>
                <ThemeProvider theme={theme}>
                <Tab
                    value={index}
                    onChange={(e) => {setIndex(e); if(e == 0){navigation.navigate('NoRating')}; if(e == 1){navigation.navigate('Rating')}}}
                    indicatorStyle={{
                    backgroundColor: 'black',
                    height: 3,
                    }}
                    variant="primary"
                >
                    <Tab.Item
                    title={"Nehodnotené cviky"} titleStyle={{fontSize: 9}}
                    icon={{ name: 'images-outline', type: 'ionicon', color: 'white', size: 35, onPress: () => navigation.navigate('NoRating') }}
                    />
                    <Tab.Item
                    title={"Hodnotené cviky"} titleStyle={{fontSize: 9}}
                    icon={{ name: 'comment-check', type: 'material-community', color: 'white', size: 35, onPress: () => navigation.navigate('Rating') }}
                    />
                </Tab>
                </ThemeProvider>
            </View>
        )
    }
    else{
        return (
            <View>
                <ThemeProvider theme={theme}>
                <Tab
                    //value={index}
                    onChange={(e) => {setIndex(e); if(e == 0){navigation.navigate('NoRating')}; if(e == 1){navigation.navigate('Rating')}}}
                    disableIndicator={true}                  
                    variant="primary"
                >
                    <Tab.Item
                    title={"Nehodnotené cviky"} titleStyle={{fontSize: 9}}
                    icon={{ name: 'images-outline', type: 'ionicon', color: 'white', size: 35, onPress: () => navigation.navigate('NoRating') }}
                    />
                    <Tab.Item
                    title={"Hodnotené cviky"} titleStyle={{fontSize: 9}}
                    icon={{ name: 'comment-check', type: 'material-community', color: 'white', size: 35, onPress: () => navigation.navigate('Rating') }}
                    />
                </Tab>
                </ThemeProvider>
            </View>
        )
    }
    
};
export default TMenu;
