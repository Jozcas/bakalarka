
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useNavigation} from '@react-navigation/core'
import Icon from 'react-native-vector-icons/Ionicons';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CameraScreen = () => {
    const [type, setType] = useState(RNCamera.Constants.Type.back);
	const [flash, setFlash] = useState("off");
	const [photoCount, setPhotoCount] = useState('1')
    const [timerValue, setTimerValue] = useState('0')

	const navigation = useNavigation();
    let camera = RNCamera
	const isFocused = useIsFocused();

    const pictureUri = [];

	//to set timerValue and photoCount when return from TimerScreen 
	useFocusEffect(
		React.useCallback(() => {
			const firstLoad = async () => {
				try {
					const timer = await AsyncStorage.getItem('timerValue');
					setTimerValue(timer);
					const photo = await AsyncStorage.getItem('photoCount');
					setPhotoCount(photo);
				} catch (err) {
					console.log(err);
				}
			};

			firstLoad();
		}, [])
	);

	//to set timerValue and photoCount when first time is screen render
	useEffect(() => {
        const firstLoad = async () => {
            try {
                const timer = await AsyncStorage.getItem('timerValue');
                setTimerValue(timer);
                const photo = await AsyncStorage.getItem('photoCount');
                setPhotoCount(photo);
            } catch (err) {
                console.log(err);
            }
        };

        firstLoad();
    }, []);

    const settingTimer = async() => {
		console.log(photoCount + 'a' + timerValue)
	}

	//when timer is active or need to take more photos than one
	const timerTakePicture = async () => {
		for (let index = 0; index < photoCount; index++) {
			if(camera){
				const data = await camera.takePictureAsync();
				console.log(data.uri);
				pictureUri.push({id: index + 1, picture: data.uri})
				//await savePicture(data.uri);
			}
		}
	}

	//wait for timer end
	const setAsyncTimeout = (cb, timeout = 0) => new Promise(resolve => {
		setTimeout(() => {
			cb();
			resolve();
		}, timeout);
	});

	//take picture function, 
	const takePicture = async () => {
		//const options = { quality: 0.5, base64: true, skipProcessing: true };
		if(photoCount == '1' && timerValue == '0'){
			if(camera){
				const data = await camera.takePictureAsync();
				console.log(data.uri);
				pictureUri.push({id: '1', picture: data.uri})
			}
		}
		else {
			if(timerValue != '0'){
				await setAsyncTimeout(() => {
					console.log('timer end');
				}, timerValue*1000);
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

	//go to PictureScreen when photos are taken
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