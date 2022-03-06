import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/core'
import {Tab, ThemeProvider} from 'react-native-elements'


const Menu = ({showing, indexing}) => {
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
                    onChange={(e) => {setIndex(e); console.log(e)}}
                    indicatorStyle={{
                    backgroundColor: 'white',
                    height: 3,
                    }}
                    variant="primary"
                >
                    <Tab.Item
                    icon={{ name: 'images-outline', type: 'ionicon', color: 'white', size: 45, onPress: () => navigation.navigate('HistoryExercise') }}
                    />
                    <Tab.Item
                    icon={{ name: 'camera', type: 'ionicon', color: 'white', size: 45, onPress: () => navigation.navigate('Camera') }}
                    />
                    <Tab.Item
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
                    //onChange={(e) => {setIndex(e); console.log(e)}}                    
                    variant="primary"
                >
                    <Tab.Item
                    //title="Recent"
                    //titleStyle={{ fontSize: 12 }}
                    icon={{ name: 'images-outline', type: 'ionicon', color: 'white', size: 45, onPress: () => navigation.navigate('HistoryExercise') }}
                    />
                    <Tab.Item
                    icon={{ name: 'camera', type: 'ionicon', color: 'white', size: 45, onPress: () => navigation.navigate('Camera') }}
                    />
                    <Tab.Item
                    />
                </Tab>
                </ThemeProvider>
            </View>
        )
    }
    
};

/*const Menu = () => {
    const navigation = useNavigation()
  return (
    <View>
    <View style={styles.menu}>
        <TouchableOpacity onPress={() => navigation.navigate('Camera')}>
            <Icon name='camera' size={45} color="black"/>
        </TouchableOpacity>
    </View>
    </View>
  )  
};*/
export default Menu;

/*const styles = StyleSheet.create({
    menu: {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: "100%",        
        backgroundColor: '#ff9999',
        height: 70,
        paddingLeft:10,
        paddingRight:10,
        paddingBottom: 10, 
        paddingTop:10,        
        justifyContent: 'space-between',        
    }
})*/
