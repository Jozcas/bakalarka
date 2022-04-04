/**
 * Author: Jozef Čásar (xcasar)
 * This is component that shows image in full size
 */
import React from "react";
import { View, Text, ImageBackground, Dimensions } from "react-native";
import { Image } from "react-native-elements";
import TMenu from "../static/Tmenu";

const SetRateClick = ({route}) => {     

    return (
        <ImageBackground source={require('../static/images/background.jpg')} style={{ flex: 1 }} imageStyle={{ opacity: 0.3 }}>
        <View style={{flex: 1}}>
            <Text style={{marginBottom: -70}}></Text>  
            <View style={{justifyContent: 'center',}}>
                <Image resizeMode={'contain'} style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}} source={{uri: route.params.item['drawImage'] ? route.params.item['drawImage'] : route.params.item['image']}}/>
            </View>
            <View style={{flex: 1, position: 'absolute', bottom: 0, zIndex: 1000, left: 0, width: '100%'}}>
                <TMenu showing={false} indexing={0}/> 
            </View>
        </View>
        </ImageBackground>
    )
}
export default SetRateClick