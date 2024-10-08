/**
 * Author: Jozef Čásar (xcasar)
 * This is component where trainer can draw into image
 */
import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, Alert } from 'react-native';
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import { storage, db } from "../firebaseConfig";
import RNFS from 'react-native-fs';
import { BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/core'
import Icon from 'react-native-vector-icons/Ionicons';

const DrawingScreen = ({sketch, imageUrl, name, exercise}) => {
    const [file, setFile] = useState()

	//download image from storage
    const download = () => {
        console.log(name)
        let tmp = name.substring(0, name.indexOf('.'))
        tmp = tmp + 'd.jpg'
        console.log(tmp)
        RNFS.downloadFile({
            fromUrl: imageUrl,
            toFile: RNFS.DocumentDirectoryPath + tmp
        }).promise.then(() => {
            console.log('Downloaded')
            setFile(tmp)
        })
    }

    const handleBackButton = () => {
      close()
      return true
    }

    useEffect(() => {
        download()
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);

        return () => {
          	BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, [])

	//delete image from file system
    const close = () => {
      RNFS.exists(RNFS.DocumentDirectoryPath + file).then((exist) => {
        if (exist) {
            RNFS.unlink(RNFS.DocumentDirectoryPath + file).then(() => {
                console.log('deleted file')
            })
        }
      })
      sketch(false)
    }

	//delete image stored with rn-sketch-canvas and image from filesystem
    const leave = (filePath) => {
        console.log(filePath)
        RNFS.exists(filePath).then((exist) => {
            if (exist) {
                RNFS.unlink(filePath).then(() => {
                    console.log('deleted')
                })
            }
        })
        RNFS.exists(RNFS.DocumentDirectoryPath + file).then((exist) => {
            if (exist) {
                RNFS.unlink(RNFS.DocumentDirectoryPath + file).then(() => {
                    console.log('deleted file')
                })
            }
        })
        Alert.alert('Oznam', 'Upravená (editovaná) fotografia cviku uložená')
        sketch(false)        
    }

	//upload image with drawing to storage
    const uploadImageToStorage = async (filePath) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', "file://"+filePath, true);
            xhr.send(null);
        });

        let reference = storage.ref().child(file);
        const snapshot = await reference.put(blob);
        const imageurl = await snapshot.ref.getDownloadURL();
        console.log(imageurl)
        
        db.collection("cviky").doc('category').collection(exercise).doc(name).update({
            drawImage: imageurl,
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
        blob.close();
        leave(filePath)
    }

    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row',backgroundColor: 'white', height: 50, borderBottomWidth: 1.5, borderColor: '#e6e6e6'}}>
          <Icon name="arrow-back" color={'black'} size={25} style={{alignSelf: 'center', paddingLeft: 15}} onPress={() => {close()}}/>
          <Text style={{alignSelf: 'center', paddingLeft: 35, fontSize: 20, color: 'black', fontWeight: '600'}}>{exercise}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <RNSketchCanvas
            localSourceImage={{ filename: '/data/user/0/com.bakalarka/files' + file, mode: 'AspectFit' }}
            containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
            canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
            defaultStrokeIndex={0}
            defaultStrokeWidth={5}
            closeComponent={<View style={styles.functionButton}><Text style={{color: 'white'}} onPress={() => {close()}}>Zavrieť</Text></View>}
            undoComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Späť</Text></View>}
            clearComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Vyčistiť</Text></View>}
            eraseComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Guma</Text></View>}
            strokeComponent={color => (
              <View style={[{ backgroundColor: color }, styles.strokeColorButton]} />
            )}
            strokeSelectedComponent={(color, index, changed) => {
              return (
                <View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />
              )
            }}
            strokeWidthComponent={(w) => {
              return (<View style={styles.strokeWidthButton}>
                <View  style={{
                  backgroundColor: 'white', marginHorizontal: 2.5,
                  width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2
                }} />
              </View>
            )}}
            saveComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Uložiť</Text></View>}
            savePreference={() => {
                console.log(file)
              return {
                folder: '/data/user/0/com.bakalarka/files',
                filename: file,
                transparent: false,
                imageType: 'jpg',
                cropToImageSize: true
              }
            }}
            onSketchSaved={(success, filePath) => { uploadImageToStorage(filePath)}}
          />
        </View>
      </View>
    );
}
export default DrawingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',

  },
  headerText: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    fontWeight: "bold"
  },
  strokeColorButton: {
    marginHorizontal: 2.5, marginVertical: 8, width: 30, height: 30, borderRadius: 15,
  },
  strokeWidthButton: {
    marginHorizontal: 2.5, marginVertical: 8, width: 30, height: 30, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center', backgroundColor: '#39579A'
  },
  functionButton: {
    marginHorizontal: 2.5, marginVertical: 8, height: 30, width: 60,
    backgroundColor: '#39579A', justifyContent: 'center', alignItems: 'center', borderRadius: 5,
  }
});