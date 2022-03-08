import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet, Dimensions, ScrollView, Image } from "react-native";
import { db } from "../firebaseConfig";
import {Card} from 'react-native-elements';
import Menu from "../static/menu";

const RatingGalleryScreen = () => {
    const [cat, setCat] = useState()
    const [images, setImages] = useState()
    const [loading, isLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                let category;
                await db.collection("category").get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        //ids.push('/' + doc.id)
                        category = doc.data()['name']
                        setCat(category)
                        console.log('datat', doc.data()['name'])
                    });
                });
                let pictures = {}
                category.map(async (el, index) => {
                    let arr = [];

                    console.log(el)
                    await db.collection("cviky").doc("category").collection(el).get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            arr.push(doc.data())
                        });
                    })
                    pictures[el] = arr
                    if(index == category.length - 1){
                        console.log(index, pictures)
                        setImages(pictures)
                        isLoading(false)
                    }
                    console.log(index);
                })
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
        if(images != null){
            isLoading(false)
        }

    }, []);

    if(loading){
        return (            
            <View>
                <Text>
                    Loading
                </Text>
            </View>
        )
    }
    else{
        return (
            <ImageBackground source={require('../static/images/background.jpg')}  style={{flex:1}} imageStyle={{ opacity: 0.3 }}>
                <View style={{flex: 1}}>
                    <ScrollView style={{flex: 1}}>
                        {
                            cat.map((element) => (
                                <Card key={element} style={{flex: 1}}>
                                    <Card.Title style={{alignSelf: 'flex-start'}}>{element}</Card.Title>
                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{flex: 1}}>
                                    {
                                        images[element].map((el) => (<Image key={el['name']} source={{uri: el['image']}} style={styles.image}/>))
                                    }
                                    </ScrollView>
                                </Card>
                            ))
                        }
                    </ScrollView>
                    <Menu showing={true} indexing={2}/>
                </View>
            </ImageBackground>
        )
    }
}
export default RatingGalleryScreen

const styles = StyleSheet.create({
    image: {
        aspectRatio: 1,
        width: 150,
        height: 150,
        //width: Dimensions.get('window').width/3-20, 
        //height: ((Dimensions.get('window').width/3-20)/1500)*2000,
        marginHorizontal: 10
    }
})