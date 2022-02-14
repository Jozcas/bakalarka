
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useNavigation} from '@react-navigation/core'
import Icon from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';

const CameraScreen = ({route}) => {
    const [type, setType] = useState(RNCamera.Constants.Type.back);
	const [flash, setFlash] = useState("off");

	const navigation = useNavigation();
    let camera = RNCamera
	const isFocused = useIsFocused();

    const pictureUri = [];

    const settingTimer = () => {
		if(route.params == null)
		console.log('null')
		console.log(route.params)
	}

	//when timer is active
	const timerTakePicture = async () => {
		for (let index = 0; index < route.params.photoCount; index++) {
			if(camera){
				const data = await camera.takePictureAsync();
				console.log(data.uri);
				pictureUri.push({id: index + 1, picture: data.uri})
				//await savePicture(data.uri);
			}
		}
	}

	const setAsyncTimeout = (cb, timeout = 0) => new Promise(resolve => {
		setTimeout(() => {
			cb();
			resolve();
		}, timeout);
	});

	const takePicture = async () => {
		//const options = { quality: 0.5, base64: true, skipProcessing: true };
		if(route.params == null){
			if(camera){
				const data = await camera.takePictureAsync();
				console.log(data.uri);
				pictureUri.push({id: '1', picture: data.uri})
			}
			//await savePicture(data.uri);
		}
		else {
			if(route.params.timer != '0'){
				await setAsyncTimeout(() => {
					console.log('timer end');
				}, route.params.timer*1000);
				if(camera) {
					await timerTakePicture();
				}
			}
			else {
				await timerTakePicture();
			}
		}
		await picture();
		//console.log(FileSystem.documentDirectory)
		/*
		FileSystem.moveAsync({
			from: data.uri,
			to: `${FileSystem.documentDirectory}photos/Photo_${
				count
			}.jpg`
		});*/
	};

	const savePicture = async (photo) => {
		/*const assert = await MediaLibrary.createAssetAsync(photo);
		console.log(assert)*/
		//await MediaLibrary.createAlbumAsync("BPGallery", assert);
		//MediaLibrary.deleteAssetsAsync(assert)		
	};

	const picture = async () => {
		console.log(pictureUri)
		navigation.navigate('Picture', {
			pictureUri: pictureUri,
		})
	} 

    return (
		isFocused ?
        <View style={styles.container}>
            <RNCamera 
            ref={(ref) => {
                camera = ref;
            }}
            captureAudio={false}
            style={styles.camera}
            flashMode={flash}
            type={type}
            androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
            }} >
                <View style={styles.buttonContainer}>
					
					<TouchableOpacity
						style={styles.flash}
						onPress={() => {
							settingTimer()
							//setFlash(flash === "off" ? "on" : "off");
						}}
					>
						{ flash === "off" ? 
							<Icon name="flash-off-outline" size={40} color="white" /> 
							: 
							<Icon name="flash-outline" size={40} color="white" /> 
						}					
					</TouchableOpacity>
					
					<TouchableOpacity
						style={styles.timer}
						onPress={() => {
							navigation.navigate("Timer", {
								paramKey: 'timer 5',
							  })
							console.log("Timer pressed")
						}}
					>
						<Icon name="timer-outline" size={40} color="white" />
					</TouchableOpacity>
					
					<View style={styles.takeButton}>
						<TouchableOpacity onPress={takePicture} style={styles.takeBStyle} />
					</View>
					
					<View style={styles.flip}>
						<TouchableOpacity
						style={styles.flip}
						onPress={() => {
							setType(
								type === RNCamera.Constants.Type.back
									? RNCamera.Constants.Type.front
									: RNCamera.Constants.Type.back
							);
						}}
						>
							<Icon name="md-camera-reverse-outline" size={40} color="white" />
						</TouchableOpacity>
					</View>
					
					<View style={styles.gallery}>
						<TouchableOpacity
						style={styles.gallery}
						onPress={() => {
							navigation.navigate('HistoryExercise')
						}}
						>
							<Icon name="images-outline" size={40} color="white" />
						</TouchableOpacity>
					</View>
				</View>
            </RNCamera>
        </View> :
		<View></View>
    );
}
export default CameraScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		flex: 1,
		backgroundColor: "transparent",
		flexDirection: "column",
		margin: 20,
	},
	flash: {
		position: "absolute",
		top: 0,
		left: 0,
		marginTop: 20,
	},
	timer: {
		position: "absolute",
		top: 0,
		right: 0,
		marginTop: 20,
	},
	takeButton: {
		position: "absolute",
		bottom: 0,
		alignSelf: "center",
	},
	takeBStyle: {
		width: 70,
		height: 70,
		bottom: 0,
		borderRadius: 50,
		backgroundColor: "#fff",
	},
	text: {
		fontSize: 18,
		color: "white",
	},
	flip: {
		position: "absolute",
		bottom: 5,
		right: 0,
	},
	gallery: {
		position: "absolute",
		bottom: 5,
		left: 0,
	},
});