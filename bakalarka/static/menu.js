import React from "react";
import { View, StyleSheet, TouchableOpacity} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/core'

const Menu = () => {
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
};
export default Menu;

const styles = StyleSheet.create({
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
})
